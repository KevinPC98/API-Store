import { Exclude, Expose } from 'class-transformer';
import { TokenDto } from './token.dto';
import { UserDto } from '../../../users/dto/response/user.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UserWithTokenDto {
  @ApiProperty()
  @Expose()
  user: UserDto;

  @ApiProperty()
  @Expose()
  token: TokenDto;
}
