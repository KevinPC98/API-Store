import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/common/enum';
import { ProductDto } from 'src/products/dto/response/product.dto';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/response/cart-item.dto';
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

  @UseGuards(JwtAuthGuard)
  @Roles(Role.client)
  @Post('/save-cart/:uuid')
  async addProductInCart(
    @Param() product: ProductDto,
    @GetUser() user: User,
    @Body() cartItem: CartItemDto,
  ): Promise<void> {
    return await this.cartService.addItemInCart(
      { uuid: user.uuid },
      { productUuid: product.uuid, quantity: cartItem.quantity },
    );
  }
}
