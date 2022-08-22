import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProductDto {
  @Expose()
  uuid: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  unitPrice: number;

  @Expose()
  stock: number;

  @Expose()
  categoryUuid: number;
}
