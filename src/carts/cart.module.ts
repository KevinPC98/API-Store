import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [],
  controllers: [CartController],
  providers: [CartService, PrismaService, UsersService],
})
export class CartModule {}
