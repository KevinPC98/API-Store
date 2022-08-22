import { Injectable } from '@nestjs/common';
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
}
