import { IsString, IsOptional } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination-dto';

export class QueryBillingDto extends PaginationDto {
  @IsString()
  @IsOptional()
  product_code?: string;

  @IsString()
  @IsOptional()
  location?: string;
}
