import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/common/enum';
import { CreateProductDto } from './dto/request/create-product.dto';
import { ProductDto } from './dto/response/product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.manager)
  @Post('/create')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDto> {
    return this.productService.createProduct(createProductDto);
  }
}
