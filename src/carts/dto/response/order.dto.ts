import { Exclude, Expose } from 'class-transformer';
import { ItemOrderDto } from './item-order.dto';

@Exclude()
export class OrderDto {
  @Expose()
  uuid: string;

  @Expose()
  items: ItemOrderDto[];
}
