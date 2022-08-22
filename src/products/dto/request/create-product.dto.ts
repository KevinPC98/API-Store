import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Exclude()
export class CreateProductDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  categoryUuid: string;
}
