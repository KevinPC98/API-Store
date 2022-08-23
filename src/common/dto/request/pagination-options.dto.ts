import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class PaginationArgs {
  @IsNumber()
  @IsInt()
  @IsPositive()
  readonly take: number = 10;

  @IsNumber()
  @IsInt()
  @IsPositive()
  readonly page: number = 1;
}
