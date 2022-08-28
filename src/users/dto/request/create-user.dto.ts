import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@Exclude()
export class CreateUserDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @Expose()
  @IsString()
  lastName: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
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
