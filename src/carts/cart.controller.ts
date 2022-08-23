import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/common/enum';
import { CartService } from './cart.service';
import { CartDto } from './dto/response/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.client)
  @Get('/my-cart')
  async getCart(@GetUser() user: User): Promise<CartDto> {
    return await this.cartService.getCart({ uuid: user.uuid });
  }
}
