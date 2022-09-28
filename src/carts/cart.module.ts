import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductService } from '../products/product.service';
import { UsersService } from '../users/users.service';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [],
  controllers: [CartController],
  providers: [CartService, PrismaService, UsersService, ProductService],
})
export class CartModule {}
