import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PaginationArgs } from '../common/dto/request/pagination-options.dto';
import { PaginationDto } from '../common/dto/response/pagination.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { ProductDto } from './dto/response/product.dto';
import { ProductWithPaginationDto } from './dto/response/products-with-pagination.dto';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async createProduct(input: CreateProductDto): Promise<ProductDto> {
    const { categoryUuid, ...data } = input;
    const product = await this.prismaService.product.create({
      data: {
        ...data,
        category: {
          connect: {
            uuid: categoryUuid,
          },
        },
      },
    });

    return plainToInstance(ProductDto, product);
  }

  async updateProduct(
    where: Prisma.ProductWhereUniqueInput,
    data: Prisma.ProductUpdateInput,
  ): Promise<ProductDto> {
    await this.findOne(where);

    const product = await this.prismaService.product.update({
      where,
      data,
    });

    return plainToInstance(ProductDto, product);
  }

  async findOne(where: Prisma.ProductWhereUniqueInput): Promise<ProductDto> {
    const product = await this.prismaService.product.findFirst({ where });

    if (!product) {
      throw new NotFoundException('Product does not exist');
    }

    return plainToInstance(ProductDto, product);
  }

  async getAll(
    paginationArgs: PaginationArgs,
    category: string,
  ): Promise<ProductWithPaginationDto> {
    const { page, take } = paginationArgs;
    let where = {};
    let nextPage: number | null = null;
    let previousPage: number | null = null;

    if (category) {
      where = {
        category: {
          name: category,
        },
      };
    }

    const totalItems = await this.prismaService.product.count({ where });
    const totalPages = Math.ceil(totalItems / take);

    const products = await this.prismaService.product.findMany({
      skip: take * (page - 1),
      take,
      where,
    });

    if (totalPages) {
      nextPage = page === totalPages ? null : page + 1;
      previousPage = page === 1 ? null : page - 1;
    }

    const pagination: PaginationDto = {
      currentPage: page,
      itemsPerPage: take,
      nextPage,
      previousPage,
      totalItems,
      totalPages,
    };

    return plainToInstance(ProductWithPaginationDto, { products, pagination });
  }
}
