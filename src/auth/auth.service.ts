import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { hashSync } from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './dto/response/user.dto';

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
}
