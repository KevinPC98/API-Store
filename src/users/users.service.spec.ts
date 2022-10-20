import { Test, TestingModule } from '@nestjs/testing';
import { Role, User } from '@prisma/client';
import { internet, name } from 'faker';
import { Role as roleEnum } from '../common/enum';
import { RoleFactory } from '../common/factories/role.factory';
import { UserFactory } from '../common/factories/users.factory';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
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
    roleFactory = new RoleFactory(prismaService);
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

  afterAll(async () => {
    await prismaService.clearDatabase();
    await prismaService.$disconnect();
  });

  describe('findOne', () => {
    it('Should return a user', async () => {
      const userFound = await usersService.findOne({
        uuid: user.uuid,
      });

      expect(userFound).toBeDefined();
      expect(userFound).toHaveProperty('uuid', user.uuid);
      expect(userFound).toHaveProperty('firstName', user.firstName);
      expect(userFound).toHaveProperty('lastName', user.lastName);
      expect(userFound).toHaveProperty('email', user.email);
      expect(userFound).toHaveProperty('createdAt', user.createdAt);
      expect(userFound).toHaveProperty('userName', user.userName);
      expect(userFound).toHaveProperty('password', user.password);
    });
  });

  describe('createUser', () => {
    it('Should create a user and return it', async () => {
      const params: CreateUserDto = {
        userName: internet.userName(),
        firstName: name.firstName(),
        lastName: name.lastName(),
        email: internet.email(),
        password: internet.password(),
      };

      const result = await usersService.createUser(params, role.uuid);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('uuid', result.uuid);
      expect(result).toHaveProperty('firstName', params.firstName);
      expect(result).toHaveProperty('lastName', params.lastName);
      expect(result).toHaveProperty('email', params.email);
      expect(result).toHaveProperty('userName', params.userName);
    });
  });

  describe('updateUser', () => {
    it('Should update a user and return it', async () => {
      const params: UpdateUserDto = {
        userName: internet.userName(),
        firstName: name.firstName(),
        lastName: name.lastName(),
      };

      const result = await usersService.updateUser({ uuid: user.uuid }, params);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('uuid', user.uuid);
      expect(result).toHaveProperty('firstName', params.firstName);
      expect(result).toHaveProperty('lastName', params.lastName);
      expect(result).toHaveProperty('email', user.email);
      expect(result).toHaveProperty('userName', params.userName);
    });
  });
});
