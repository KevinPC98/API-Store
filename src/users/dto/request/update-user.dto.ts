import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class UpdateUserDto {
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

  /*   @Expose()
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string; */
}
