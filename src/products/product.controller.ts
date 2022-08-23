import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/common/enum';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { ProductDto } from './dto/response/product.dto';
import { ProductWithPaginationDto } from './dto/response/products-with-pagination.dto';
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
    return await this.productService.createProduct(createProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.manager)
  @Patch('/update/:uuid')
  async updateProduct(
    @Body() input: UpdateProductDto,
    @Param() product: ProductDto,
  ): Promise<ProductDto> {
    return await this.productService.updateProduct(
      { uuid: product.uuid },
      input,
    );
  }

  @Get('/all')
  async getAll(
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('category', new DefaultValuePipe(null)) category: string,
  ): Promise<ProductWithPaginationDto> {
    return await this.productService.getAll({ take, page }, category);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:uuid')
  async findOne(@Param() product: ProductDto): Promise<ProductDto> {
    return await this.productService.findOne({ uuid: product.uuid });
  }
}
