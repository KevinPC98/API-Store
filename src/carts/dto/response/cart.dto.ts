import { CartItem } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { UserDto } from 'src/users/dto/response/user.dto';

@Exclude()
export class CartDto {
  @Expose()
  uuid: string;

  @Expose()
  user: UserDto;

  @Expose()
  products: CartItem[];
}
