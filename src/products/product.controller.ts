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
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/common/enum';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { ProductDto } from './dto/response/product.dto';
import { ProductWithPaginationDto } from './dto/response/products-with-pagination.dto';
import { ProductService } from './product.service';

@ApiTags('product')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiResponse({
    status: 201,
    description: 'Create a new product',
    type: ProductDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.manager)
  @Post('/create')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDto> {
    return await this.productService.createProduct(createProductDto);
  }

  @ApiResponse({
    status: 201,
    description: 'Update a product',
    type: ProductDto,
  })
  @ApiUnauthorizedResponse({ description: 'Product does not exist' })
  @ApiParam({
    name: 'uuid',
    description: 'Product details',
    required: false,
  })
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

  @ApiResponse({
    status: 200,
    description: 'Show a list of product according the category',
    type: ProductWithPaginationDto,
  })
  @ApiQuery({
    name: 'Take',
    description: 'Items quantity',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'Page',
    description: 'page number',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'Category',
    description: 'Products Category',
    required: false,
    example: 'tech',
  })
  @Get('/all')
  async getAll(
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('category', new DefaultValuePipe(null)) category: string,
  ): Promise<ProductWithPaginationDto> {
    return await this.productService.getAll({ take, page }, category);
  }

  @ApiResponse({
    status: 200,
    description: 'Get a product',
    type: ProductDto,
  })
  @ApiParam({
    name: 'uuid',
    description: 'Product details',
    required: true,
  })
  @ApiUnauthorizedResponse({ description: 'Product does not exist' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:uuid')
  async findOne(@Param() product: ProductDto): Promise<ProductDto> {
    return await this.productService.findOne({ uuid: product.uuid });
  }
}
