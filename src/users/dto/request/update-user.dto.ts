import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class UpdateUserDto {
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

  /*   @Expose()
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string; */
}
