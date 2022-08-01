import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { compareSync, hashSync } from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './dto/response/user.dto';
import { LoginDto } from './dto/request/login.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/response/token.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async createUser(input: CreateUserDto): Promise<UserDto> {
    const role = await this.prisma.role.findFirst({
      where: {
        name: 'CLIENT',
      },
      select: {
        uuid: true,
        name: true,
      },
    });

    const { password, ...data } = input;
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashSync(password, 10),
        role: {
          connect: {
            uuid: role?.uuid,
          },
        },
      },
    });

    return plainToInstance(UserDto, user);
  }

  async login(input: LoginDto): Promise<TokenDto> {
    const { email, password } = input;
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); //should be 403
    }

    const isValid = compareSync(password, user.password);

    if (!isValid) throw new UnauthorizedException('Invalid credentials'); //should be 403

    const token = await this.prisma.token.create({
      data: {
        userId: user.uuid,
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
}
