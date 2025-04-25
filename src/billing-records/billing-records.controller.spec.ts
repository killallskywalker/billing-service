import { Test, TestingModule } from '@nestjs/testing';
import { BillingController } from './billing-records.controller';
import { BillingService } from './billing-records.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateBillingRecordDto } from './dto/create-billing-record.dto';
import { UpdateBillingRecordDto } from './dto/update-billing-record.dto';
import { QueryBillingDto } from './dto/query-billing-record.dto';
import { ResponseBillingRecordDto } from './dto/response-billing-record.dto';
import { CacheModule } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('BillingController', () => {
  let controller: BillingController;

  const mockBillingService = {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findOne: jest.fn(),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockCacheManager = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  const billingResponse: ResponseBillingRecordDto = {
    id: 1,
    email: 'luke@flyboy.com',
    first_name: 'Luke',
    last_name: 'Skywalker',
    photo_url: 'https://reqres.in/img/faces/1-image.jpg',
    product_code: '4000',
    location: 'Tatooine',
    premium_paid: 12.2,
    created_at: new Date('2025-04-19T12:00:00.000Z'),
    updated_at: new Date('2025-04-19T12:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [BillingController],
      providers: [
        {
          provide: BillingService,
          useValue: mockBillingService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<BillingController>(BillingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of billing records', async () => {
      const query: QueryBillingDto = {
        product_code: 'prod_abc123',
        location: 'New York',
      };

      mockBillingService.findMany.mockResolvedValue([billingResponse]);

      const result = await controller.findAll(query);

      expect(result).toEqual([billingResponse]);
      expect(mockBillingService.findMany).toHaveBeenCalledWith(query);
    });
  });

  describe('show', () => {
    it('should return a billing record by id', async () => {
      const id = 1;

      mockBillingService.findOne.mockResolvedValue(billingResponse);

      const result = await controller.show(id);

      expect(result).toEqual(billingResponse);
      expect(mockBillingService.findOne).toHaveBeenCalledWith(id);
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

      mockBillingService.create.mockResolvedValue(billingResponse);

      const result = await controller.create(dto);

      expect(result).toEqual(billingResponse);
      expect(mockBillingService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update and return a billing record', async () => {
      const updateDto: UpdateBillingRecordDto = {
        email: 'luke@jedi.com',
        first_name: 'Luke',
        last_name: 'Skywalker',
        location: 'Endor',
        premium_paid: 20.5,
      };

      const updatedResponse = {
        ...billingResponse,
        ...updateDto,
        updatedAt: new Date('2025-04-20T12:00:00.000Z'),
      };

      mockBillingService.update.mockResolvedValue(updatedResponse);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(updatedResponse);
      expect(mockBillingService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should call the remove method with the given id', async () => {
      mockBillingService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(result).toBeUndefined();
      expect(mockBillingService.remove).toHaveBeenCalledWith(1);
    });
  });
});
