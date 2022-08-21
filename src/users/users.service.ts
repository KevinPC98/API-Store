import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { UserDto } from 'src/users/dto/response/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(input: CreateUserDto, roleUuid: string): Promise<UserDto> {
    const { password, ...data } = input;

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashSync(password, 10),
        role: {
          connect: {
            uuid: roleUuid,
          },
        },
      },
    });

    return plainToInstance(UserDto, user);
  }

  async findOne(where: Prisma.UserWhereInput): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where,
    });

    return user;
  }
}
