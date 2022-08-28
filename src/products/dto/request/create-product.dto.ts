import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Exclude()
export class CreateProductDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  categoryUuid: string;
}
