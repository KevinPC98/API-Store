import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PickedProductDto {
  @Expose()
  productUuid: string;

  @Expose()
  quantity: number;
}
