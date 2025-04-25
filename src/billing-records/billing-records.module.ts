import { Module } from '@nestjs/common';
import { BillingController } from './billing-records.controller';
import { BillingService } from './billing-records.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingRecord } from '../entity/billing-record.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([BillingRecord]),
    CacheModule.register({
      ttl: 30000,
      max: 100,
    }),
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
