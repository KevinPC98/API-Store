import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  previousPage: number | null;

  @ApiProperty()
  nextPage: number | null;
}
