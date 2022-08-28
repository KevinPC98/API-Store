import { ApiProperty } from '@nestjs/swagger';
import { CartItem } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderItemDto {
  @ApiProperty()
  @Expose()
  uuid: string;

  @ApiProperty()
  @Expose()
  cartItem: CartItem;
}
