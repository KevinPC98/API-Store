import { Prisma, Product } from '@prisma/client';
import { commerce, datatype, lorem } from 'faker';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractFactory } from './abstract.factory';

type ProductInput = Partial<Prisma.ProductCreateInput>;

export class ProductFactory extends AbstractFactory<Product> {
  constructor(protected readonly prismaClient: PrismaService) {
    super();
  }

  async make(input: ProductInput = {}): Promise<Product> {
    return await this.prismaClient.product.create({
      data: {
        uuid: input.uuid,
        description: input.description ?? commerce.productDescription(),
        name: input.name ?? commerce.productName(),
        stock: input.stock ?? datatype.number(),
        unitPrice: input.unitPrice ?? datatype.float(),
        category: input.category ?? {},
      },
    });
  }
  makeMany(factorial: number, input: ProductInput = {}): Promise<Product[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
