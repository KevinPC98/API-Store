import { Test, TestingModule } from '@nestjs/testing';
import { Role, User } from '@prisma/client';
import { Role as roleEnum } from '../common/enum';
import { RoleFactory } from '../common/factories/role.factory';
import { UserFactory } from '../common/factories/users.factory';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;
  let userFactory: UserFactory;
  let roleFactory: RoleFactory;
  let user: User;
  let role: Role;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    userFactory = new UserFactory(prismaService);
    role = await roleFactory.make({ name: roleEnum.client });
    user = await userFactory.make({
      role: {
        connect: {
          uuid: role.uuid,
        },
      },
    });
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });
});
