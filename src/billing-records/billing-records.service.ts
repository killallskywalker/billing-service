import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillingRecord } from '../entity/billing-record.entity';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ResponseBillingRecordDto } from './dto/response-billing-record.dto';
import { CreateBillingRecordDto } from './dto/create-billing-record.dto';
import { UpdateBillingRecordDto } from './dto/update-billing-record.dto';
import { QueryBillingDto } from './dto/query-billing-record.dto';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from '../common/dto/api-response.dto';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(BillingRecord)
    private billingRepository: Repository<BillingRecord>,
  ) {}

  async findMany(
    query: QueryBillingDto,
  ): Promise<PaginatedResponseDto<ResponseBillingRecordDto>> {
    const { product_code, location, page = 1, limit = 10 } = query;

    const where: Partial<BillingRecord> = {};

    if (product_code) {
      where.product_code = product_code;
    }

    if (location) {
      where.location = location;
    }

    const [data, total] = await this.billingRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    const items = data.map((item) =>
      plainToInstance(ResponseBillingRecordDto, item),
    );

    const meta: PaginationMetaDto = {
      currentPage: page,
      perPage: limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    };

    return { items, meta };
  }

  async findOne(id: number): Promise<ResponseBillingRecordDto> {
    const billing = await this.billingRepository.findOneBy({ id });

    if (!billing) {
      throw new NotFoundException(`Billing with ID ${id} not found`);
    }

    return plainToClass(ResponseBillingRecordDto, billing);
  }

  async create(
    data: CreateBillingRecordDto,
  ): Promise<ResponseBillingRecordDto> {
    return this.billingRepository.save(data);
  }

  async remove(id: number): Promise<void> {
    const billing = await this.billingRepository.findOneById(id);
    if (!billing) {
      throw new NotFoundException(`billing with ID ${id} not found`);
    }
    await this.billingRepository.delete(id);
  }

  async update(
    id: number,
    data: UpdateBillingRecordDto,
  ): Promise<ResponseBillingRecordDto> {
    const billing = await this.billingRepository.findOneById(id);

    if (!billing) {
      throw new NotFoundException(`Billing record with id ${id} not found`);
    }

    await this.billingRepository.update(id, data);

    const updatedBilling = await this.billingRepository.findOneById(id);

    return plainToClass(ResponseBillingRecordDto, updatedBilling);
  }
}
