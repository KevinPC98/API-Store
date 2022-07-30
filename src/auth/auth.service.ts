import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto } from './dto/request/sign-up.dto';
import { hashSync } from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './dto/response/user.dto';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async createUser(signUpDto: SignUpDto) {
    const role = await this.prisma.role.findFirst({
      where: {
        name: 'CLIENT',
      },
      select: {
        uuid: true,
        name: true,
      },
    });

    const { password } = signUpDto;
    signUpDto.password = hashSync(password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...signUpDto,
      },
      role: {
        connect: {
          uuid: role.uuid,
        },
      },
    });

    const userDto: UserDto = signUpDto;
    console.log(userDto);

    //return plainToInstance(UserDto, {});
  }
}
