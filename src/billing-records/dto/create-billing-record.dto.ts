import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBillingRecordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  @IsString()
  @IsOptional()
  photo_url?: string;

  @ApiProperty({ example: '4000' })
  @IsString()
  @IsNotEmpty()
  product_code: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: '12.20' })
  @IsNumber()
  @IsNotEmpty()
  premium_paid: number;
}
