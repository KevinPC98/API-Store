import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { Role } from '../../../common/enum';

@Exclude()
export class SignUpDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Expose()
  @IsString()
  lastName: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  userName: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;

  @Expose()
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
