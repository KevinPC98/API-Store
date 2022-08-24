import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/products/product.service';
import { UsersService } from 'src/users/users.service';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [],
  controllers: [CartController],
  providers: [CartService, PrismaService, UsersService, ProductService],
})
export class CartModule {}
