import { IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Min(1)
  page?: number;

  @IsOptional()
  @Min(1)
  limit?: number;
}
