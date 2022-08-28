import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PickedProductDto {
  @ApiProperty()
  @Expose()
  productUuid: string;

  @ApiProperty()
  @Expose()
  quantity: number;
}
