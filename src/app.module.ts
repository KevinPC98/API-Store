import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { ProductModule } from './products/product.module';
import { CartModule } from './carts/cart.module';

@Module({
  imports: [AuthModule, UserModule, ProductModule, CartModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
