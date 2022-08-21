import { Exclude, Expose } from 'class-transformer';
import { TokenDto } from './token.dto';
import { UserDto } from '../../../users/dto/response/user.dto';

@Exclude()
export class UserWithTokenDto {
  @Expose()
  user: UserDto;

  @Expose()
  token: TokenDto;
}
