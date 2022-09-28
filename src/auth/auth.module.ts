import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from '../users/users.service';
import { CartService } from '../carts/cart.service';
import { ProductService } from '../products/product.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY as string,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME as string },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
    UsersService,
    CartService,
    ProductService,
  ],
})
export class AuthModule {}
