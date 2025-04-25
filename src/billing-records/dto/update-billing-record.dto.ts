import { PartialType } from '@nestjs/mapped-types';
import { CreateBillingRecordDto } from './create-billing-record.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBillingRecordDto extends PartialType(
  CreateBillingRecordDto,
) {
  @ApiPropertyOptional({ example: 'newemail@example.com' })
  email?: string;

  @ApiPropertyOptional({ example: 'Jane' })
  first_name?: string;

  @ApiPropertyOptional({ example: 'Smith' })
  last_name?: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  photo_url?: string;

  @ApiPropertyOptional({ example: 'prod_xyz456' })
  product_code?: string;

  @ApiPropertyOptional({ example: 'San Francisco' })
  location?: string;

  @ApiPropertyOptional({ example: false })
  premium_paid?: number;
}
