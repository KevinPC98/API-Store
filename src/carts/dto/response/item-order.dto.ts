import { CartItem } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderItemDto {
  @Expose()
  uuid: string;

  @Expose()
  cartItem: CartItem;
}
