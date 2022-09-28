import { ApiProperty } from '@nestjs/swagger';
import { CartItem } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { UserDto } from '../../../users/dto/response/user.dto';

@Exclude()
export class CartDto {
  @ApiProperty()
  @Expose()
  uuid: string;

  @ApiProperty()
  @Expose()
  user: UserDto;

  @ApiProperty()
  @Expose()
  products: CartItem[];
}
