import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ItemOrderDto {
  @Expose()
  uuid: string;

  @Expose()
  cartItemUuid: string;

  @Expose()
  orderUuid: string;
}
