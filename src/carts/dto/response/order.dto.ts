import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { OrderItemDto } from './item-order.dto';

@Exclude()
export class OrderDto {
  @ApiProperty()
  @Expose()
  uuid: string;

  @ApiProperty()
  @Expose()
  userUuid: string;

  @ApiProperty()
  @Expose()
  orderItem: OrderItemDto[];
}
