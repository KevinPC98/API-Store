import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './user.controller';
import { UsersService } from './users.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UsersService, PrismaService],
})
export class UserModule {}
