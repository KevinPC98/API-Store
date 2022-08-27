import { Exclude, Expose } from 'class-transformer';
import { OrderItemDto } from './item-order.dto';

@Exclude()
export class OrderDto {
  @Expose()
  uuid: string;

  @Expose()
  userUuid: string;

  @Expose()
  orderItem: OrderItemDto[];
}
