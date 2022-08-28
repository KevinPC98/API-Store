import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class PaginationArgs {
  @ApiProperty()
  @IsNumber()
  @IsInt()
  @IsPositive()
  readonly take: number = 10;

  @ApiProperty()
  @IsNumber()
  @IsInt()
  @IsPositive()
  readonly page: number = 1;
}
