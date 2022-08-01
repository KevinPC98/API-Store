import { Exclude } from 'class-transformer';

@Exclude()
export class UserDto {
  firstName: string;

  lastName: string;

  userName: string;

  email: string;

  role: string;
}
