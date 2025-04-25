import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Any message from the response' })
  message: string;

  @ApiProperty()
  error: any;
}

export class SuccessResponseDto<TData> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Any message from the response' })
  message: string;

  @ApiProperty()
  data: TData;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 10 })
  perPage: number;

  @ApiProperty({ example: 50 })
  totalItems: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ isArray: true })
  items: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
