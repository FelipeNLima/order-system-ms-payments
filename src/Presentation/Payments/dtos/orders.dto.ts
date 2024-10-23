import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class itemsDto {
  @ApiProperty()
  @IsString()
  sku_number: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  unit_price: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsString()
  unit_measure: string;

  @ApiProperty()
  @IsNumber()
  total_amount: number;
}

export class OrdersPaymentDto {
  @ApiProperty()
  @IsString()
  salesOrderID: string;

  @ApiProperty()
  @IsString()
  customerID: string;

  @ApiProperty()
  @IsNumber()
  orderID: number;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsArray()
  items: itemsDto[];
}
