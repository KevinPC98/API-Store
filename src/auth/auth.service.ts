import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { compareSync, hashSync } from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './dto/response/user.dto';
import { LoginDto } from './dto/request/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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

  async login(input: LoginDto) {
    const { email, password } = input;
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        password: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = compareSync(password, user.password);

    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    console.log(user);
  }
}
