import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaymentsDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  salesOrderID: string;

  @ApiProperty()
  @IsString()
  inStoreOrderID: string;

  @ApiProperty()
  @IsString()
  qrCode: string;

  @ApiProperty()
  @IsNumber()
  orderID: number;

  @ApiProperty()
  @IsString()
  status: string;
}
