import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/common/enum';
import { ProductDto } from 'src/products/dto/response/product.dto';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/response/cart-item.dto';
import { CartDto } from './dto/response/cart.dto';
import { OrderDto } from './dto/response/order.dto';

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
  @Post('/pick-item/:uuid')
  async addProductInCart(
    @Param() product: ProductDto,
    @GetUser() user: User,
    @Body() cartItem: CartItemDto,
  ): Promise<CartDto> {
    return await this.cartService.addItemInCart(
      { uuid: user.uuid },
      { productUuid: product.uuid, quantity: cartItem.quantity },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.client)
  @Patch('/remove-item/:uuid')
  async removeProduct(
    @Param() product: ProductDto,
    @GetUser() user: User,
  ): Promise<CartDto> {
    return await this.cartService.removeItemInCart(
      { uuid: user.uuid },
      product.uuid,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.client)
  @Post('/my-cart/:uuid')
  async makeOrder(
    @Param() product: ProductDto,
    @GetUser() user: User,
  ): Promise<OrderDto> {
    return await this.cartService.addInOrder(user.uuid, product.uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.client)
  @Get('/my-order')
  async showOrder(@GetUser() user: User): Promise<OrderDto> {
    return await this.cartService.getOrder(user.uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.client)
  @Patch('/my-order/buy')
  async buyOrder(@GetUser() user: User): Promise<boolean> {
    return await this.cartService.deleteOrder(user.uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.client)
  @Patch('/my-order/:uuid')
  async updateOrder(
    @Param() product: ProductDto,
    @GetUser() user: User,
  ): Promise<OrderDto> {
    return await this.cartService.removeInOrder(user.uuid, product.uuid);
  }
}
