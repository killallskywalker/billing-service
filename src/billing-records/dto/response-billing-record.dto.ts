import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseBillingRecordDto {
  @ApiProperty({ example: 'uuid-123-abc' })
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  last_name: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  photo_url?: string;

  @ApiProperty({ example: '4000' })
  product_code: string;

  @ApiProperty({ example: 'New York' })
  location: string;

  @ApiProperty({ example: true })
  premium_paid: number;

  @ApiProperty({ example: '2025-04-19T12:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2025-04-19T12:00:00.000Z' })
  updated_at: Date;
}
