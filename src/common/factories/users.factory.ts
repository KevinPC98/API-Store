import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractFactory } from './abstract.factory';
import { datatype, internet, name } from 'faker';
import { RoleFactory } from './role.factory';

type UserInput = Partial<Prisma.UserCreateInput>;

export class UserFactory extends AbstractFactory<User> {
  constructor(
    protected readonly prismaClient: PrismaService,
    protected readonly roleFactory: RoleFactory,
  ) {
    super();
  }

  async make(input: UserInput = {}): Promise<User> {
    return await this.prismaClient.user.create({
      data: {
        uuid: datatype.uuid(),
        userName: internet.userName(),
        firstName: name.firstName(),
        lastName: name.lastName(),
        email: internet.email(),
        password: internet.password(),
        role: input.role ?? {},
      },
    });
  }
  async makeMany(factorial: number, input: UserInput = {}): Promise<User[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
