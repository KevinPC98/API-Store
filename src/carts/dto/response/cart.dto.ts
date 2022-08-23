import { Exclude, Expose } from 'class-transformer';
import { ProductDto } from 'src/products/dto/response/product.dto';
import { UserDto } from 'src/users/dto/response/user.dto';

@Exclude()
export class CartDto {
  @Expose()
  user: UserDto;

  @Expose()
  products: ProductDto[];
}
