export class PaginationDto {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  previousPage: number | null;
  nextPage: number | null;
}
