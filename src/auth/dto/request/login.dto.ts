import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@Exclude()
export class LoginDto {
  @ApiProperty()
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}
