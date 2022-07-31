import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@Exclude()
export class CreateUserDto {
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

  /*   @Expose()
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role; */
}
