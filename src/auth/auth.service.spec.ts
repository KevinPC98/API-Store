import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthFactory } from '../common/factories/auth.factory';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { CartService } from '../carts/cart.service';
import { ProductService } from '../products/product.service';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { internet, name } from 'faker';
import { Role as roleEnum } from '../common/enum';
import { UserFactory } from '../common/factories/users.factory';
import { RoleFactory } from '../common/factories/role.factory';
import { Role, Token, User } from '@prisma/client';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/request/login.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let authFactory: AuthFactory;
  let userFactory: UserFactory;
  let roleFactory: RoleFactory;
  let user: User;
  let role: Role;
  let token: Token;
  const password = internet.password();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        JwtService,
        UsersService,
        CartService,
        ProductService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    authFactory = new AuthFactory(prismaService);
    userFactory = new UserFactory(prismaService);
    roleFactory = new RoleFactory(prismaService);
    role = await roleFactory.make({ name: roleEnum.client });
    user = await userFactory.make({
      password,
      role: {
        connect: {
          uuid: role.uuid,
        },
      },
    });
    token = await authFactory.make({
      user: {
        connect: {
          uuid: user.uuid,
        },
      },
    });
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  afterAll(async () => {
    await prismaService.clearDatabase();
  });

  describe('CreateUser', () => {
    it('Should return a created user with Token', async () => {
      const params: CreateUserDto = {
        userName: internet.userName(),
        firstName: name.firstName(),
        lastName: name.lastName(),
        email: internet.email(),
        password: internet.password(),
      };

      const result = await authService.createUser(params);

      expect(result).toBeDefined();
      expect(result.user).toHaveProperty('uuid', result.user.uuid);
      expect(result.user).toHaveProperty('firstName', params.firstName);
      expect(result.user).toHaveProperty('lastName', params.lastName);
      expect(result.user).toHaveProperty('email', params.email);
      expect(result.user).toHaveProperty('userName', params.userName);
      expect(result.user).toHaveProperty('role', result.user.role);
      expect(result.token).toHaveProperty(
        'accessToken',
        result.token.accessToken,
      );
      expect(result.token).toHaveProperty(
        'expirationToken',
        result.token.expirationToken,
      );
    });

    it('Should throw an error when the user was already created', async () => {
      const params: CreateUserDto = {
        userName: internet.userName(),
        firstName: name.firstName(),
        lastName: name.lastName(),
        email: user.email,
        password: internet.password(),
      };

      expect(authService.createUser(params)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('Should return an access token when access was successfully', async () => {
      const params: LoginDto = {
        email: user.email,
        password,
      };

      const result = await authService.login(params);

      //expect(authService.generateAccessToken).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('accessToken', result.accessToken);
      expect(result).toHaveProperty('expirationToken', result.expirationToken);
    });
  });

  describe('logout', () => {
    it('Should delete the token from database and return true', async () => {
      const { accessToken } = await authService.generateAccessToken(token.jti);
      const result = await authService.logout(accessToken);
      expect(result).toBeTruthy();
    });

    it('Should return false when the accessToken is not valid', async () => {
      expect(authService.logout('randomText')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
