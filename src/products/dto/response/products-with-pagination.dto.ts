import { Exclude, Expose } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/response/pagination.dto';
import { ProductDto } from './product.dto';

@Exclude()
export class ProductWithPaginationDto {
  @Expose()
  products: ProductDto[];

  @Expose()
  pagination: PaginationDto;
}
