import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { ProductDto } from './dto/response/product.dto';

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
}
