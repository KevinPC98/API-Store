import { Exclude, Expose } from 'class-transformer';
import { ProductDto } from 'src/products/dto/response/product.dto';

@Exclude()
export class CartItemDto {
  @Expose()
  uuid: string;

  @Expose()
  products: ProductDto[];

  @Expose()
  quantity: number;
}
