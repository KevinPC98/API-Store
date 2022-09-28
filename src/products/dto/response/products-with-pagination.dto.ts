import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/response/pagination.dto';
import { ProductDto } from './product.dto';

@Exclude()
export class ProductWithPaginationDto {
  @ApiProperty()
  @Expose()
  products: ProductDto[];

  @ApiProperty()
  @Expose()
  pagination: PaginationDto;
}
