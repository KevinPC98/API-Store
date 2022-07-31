import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@Exclude()
export class LoginDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}
