import { Test, TestingModule } from '@nestjs/testing';
import { BillingService } from './billing-records.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BillingRecord } from '../entity/billing-record.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateBillingRecordDto } from './dto/create-billing-record.dto';
import { UpdateBillingRecordDto } from './dto/update-billing-record.dto';
import { QueryBillingDto } from './dto/query-billing-record.dto';

const mockBillingRecord = {
  id: 1,
  email: 'anakin@sith.com',
  first_name: 'Anakin',
  last_name: 'Skywalker',
  photo_url: 'https://reqres.in/img/faces/1-image.jpg',
  product_code: '4300',
  location: 'Mustafar',
  premium_paid: 12.2,
  created_at: new Date(),
  updated_at: new Date(),
};

describe('BillingService', () => {
  let service: BillingService;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOneById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: getRepositoryToken(BillingRecord),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findMany', () => {
    it('should return paginated billing records with filters', async () => {
      const query: QueryBillingDto = {
        product_code: '4000',
        location: 'Naboo',
        page: 1,
        limit: 10,
      };

      const mockFindAndCount = [[mockBillingRecord], 1];
      mockRepository.findAndCount.mockResolvedValue(mockFindAndCount);

      const result = await service.findMany(query);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          product_code: '4000',
          location: 'Naboo',
        },
        skip: 0,
        take: 10,
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].product_code).toBe('4300');
      expect(result.meta).toEqual({
        currentPage: 1,
        perPage: 10,
        totalItems: 1,
        totalPages: 1,
      });
    });

    it('should return paginated billing records without filters', async () => {
      const query: QueryBillingDto = {
        product_code: '4300',
        location: 'Endor',
      };

      const mockFindAndCount = [[mockBillingRecord], 1];
      mockRepository.findAndCount.mockResolvedValue(mockFindAndCount);

      const result = await service.findMany(query);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          product_code: '4300',
          location: 'Endor',
        },
        skip: 0,
        take: 10,
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].product_code).toBe('4300');
      expect(result.meta).toEqual({
        currentPage: 1,
        perPage: 10,
        totalItems: 1,
        totalPages: 1,
      });
    });

    it('should return empty array and correct meta when no records found', async () => {
      const query: QueryBillingDto = {
        product_code: 'not_exist',
        location: 'Alderaan',
        page: 2,
        limit: 5,
      };

      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.findMany(query);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          product_code: 'not_exist',
          location: 'Alderaan',
        },
        skip: 5,
        take: 5,
      });

      expect(result.items).toEqual([]);
      expect(result.meta).toEqual({
        currentPage: 2,
        perPage: 5,
        totalItems: 0,
        totalPages: 0,
      });
    });
  });

  describe('create', () => {
    it('should create and return a billing record', async () => {
      const dto: CreateBillingRecordDto = {
        email: 'anakin@flyboy.com',
        first_name: 'Anakin',
        last_name: 'Skywalker',
        photo_url: 'https://reqres.in/img/faces/1-image.jpg',
        product_code: '4001',
        location: 'Tatooine',
        premium_paid: 12.2,
      };

      mockRepository.save.mockResolvedValue(mockBillingRecord);

      const result = await service.create(dto);

      expect(mockRepository.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockBillingRecord);
    });
  });

  describe('findOne', () => {
    it('should return a billing record by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockBillingRecord);

      const result = await service.findOne(1);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException if billing record not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update billing and return updated dto', async () => {
      const dto: UpdateBillingRecordDto = {
        first_name: 'Han',
        email: 'han@solo.com',
      };

      mockRepository.findOneById.mockResolvedValue({ affected: 1 });

      const result = await service.update(4300, dto);

      expect(mockRepository.update).toHaveBeenCalledWith(4300, dto);
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if billing record not found', async () => {
      const dto: UpdateBillingRecordDto = {
        first_name: 'Han',
        email: 'han@solo.com',
      };

      mockRepository.findOneById.mockResolvedValue(null);

      await expect(service.update(1, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a billing record', async () => {
      mockRepository.findOneById.mockResolvedValue(mockBillingRecord);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockRepository.findOneById).toHaveBeenCalledWith(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if billing does not exist', async () => {
      mockRepository.findOneById.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
