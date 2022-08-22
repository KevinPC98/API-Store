import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/common/enum';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
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

  @UseGuards(JwtAuthGuard)
  @Get('/:uuid')
  async findOne(@Param() product: ProductDto): Promise<ProductDto> {
    return await this.productService.findOne({ uuid: product.uuid });
  }
}
