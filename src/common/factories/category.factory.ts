import { Prisma, Category } from '@prisma/client';
import { commerce, datatype, lorem } from 'faker';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractFactory } from './abstract.factory';

type CategoryInput = Partial<Prisma.CategoryCreateInput>;

export class CategoryFactory extends AbstractFactory<Category> {
  constructor(protected readonly prismaClient: PrismaService) {
    super();
  }

  async make(input: CategoryInput = {}): Promise<Category> {
    return await this.prismaClient.category.create({
      data: {
        uuid: input.uuid,
        name: input.name ?? lorem.word(),
      },
    });
  }
  makeMany(factorial: number, input: CategoryInput = {}): Promise<Category[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
