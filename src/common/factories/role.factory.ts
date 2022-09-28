import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractFactory } from './abstract.factory';
import { datatype, internet, name } from 'faker';

type RoleInput = Partial<Prisma.RoleCreateInput>;

export class RoleFactory extends AbstractFactory<Role> {
  constructor(protected readonly prismaClient: PrismaService) {
    super();
  }

  async make(input: RoleInput = {}): Promise<Role> {
    return await this.prismaClient.role.create({
      data: {
        uuid: datatype.uuid(),
        name: input.name ?? 'admin',
      },
    });
  }

  makeMany(factorial: number, input: RoleInput = {}): Promise<Role[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
