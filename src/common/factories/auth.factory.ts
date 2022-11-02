import { Token, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AbstractFactory } from './abstract.factory';

type TokenInput = Partial<Prisma.TokenCreateInput>;

export class AuthFactory extends AbstractFactory<Token> {
  constructor(protected readonly prismaClient: PrismaService) {
    super();
  }

  async make(input: TokenInput): Promise<Token> {
    return this.prismaClient.token.create({
      data: {
        user: input.user ?? {},
      },
    });
  }

  async makeMany(factorial: number, input: TokenInput = {}): Promise<Token[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
