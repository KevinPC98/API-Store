import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ProductDto } from '../../../products/dto/response/product.dto';

@Exclude()
export class CartItemDto {
  @ApiProperty()
  @Expose()
  uuid: string;

  @ApiProperty()
  @Expose()
  products: ProductDto;

  @ApiProperty()
  @Expose()
  quantity: number;
}
