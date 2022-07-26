import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { compareSync } from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from './dto/request/login.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/response/token.dto';
import { UserWithTokenDto } from './dto/response/user-with-token.dto';
import { UsersService } from '../users/users.service';
import { Role } from '../common/enum';
import { CartService } from '../carts/cart.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UsersService,
    private cartService: CartService,
  ) {}

  async createUser(input: CreateUserDto): Promise<UserWithTokenDto> {
    const role = await this.prisma.role.findFirst({
      where: {
        name: Role.client,
      },
      select: {
        uuid: true,
        name: true,
      },
    });

    if (!role) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userByEmail = await this.userService.findOne({ email: input.email });

    if (userByEmail) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.userService.createUser(input, role.uuid);

    const { jti } = await this.prisma.token.create({
      data: {
        userUuid: user.uuid,
      },
    });

    user.role = role.name;

    await this.cartService.createCart({
      user: {
        connect: {
          uuid: user.uuid,
        },
      },
    });

    await this.cartService.createOrder({
      user: {
        connect: {
          uuid: user.uuid,
        },
      },
      wasBought: false,
    });

    const token = await this.generateAccessToken(jti);

    return plainToInstance(UserWithTokenDto, {
      user,
      token,
    });
  }

  async login(input: LoginDto): Promise<TokenDto> {
    const { email, password } = input;
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = compareSync(password, user.password);

    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const token = await this.prisma.token.create({
      data: {
        userUuid: user.uuid,
      },
    });

    return this.generateAccessToken(token.jti);
  }

  async generateAccessToken(sub: string): Promise<TokenDto> {
    const now = new Date().getTime();
    const expirationToken = Math.floor(
      new Date(now).setSeconds(
        parseInt(process.env.JWT_EXPIRATION_TIME as string, 10),
      ) / 1000,
    );
    const iat = Math.floor(now / 1000);

    const accessToken = this.jwtService.sign(
      {
        sub,
        iat,
        expirationToken,
      },
      {
        secret: process.env.JWT_SECRET_KEY as string,
      },
    );

    return {
      accessToken,
      expirationToken,
    };
  }

  async logout(token?: string): Promise<boolean> {
    if (!token) return false;

    try {
      const { sub } = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY as string,
      });

      await this.prisma.token.delete({
        where: {
          jti: sub,
        },
      });

      return true;
    } catch (e) {
      throw new BadRequestException('Token is invalid');
    }
  }
}
