import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../common/enum';
import { ProductDto } from '../products/dto/response/product.dto';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/response/cart-item.dto';
import { CartDto } from './dto/response/cart.dto';
import { OrderDto } from './dto/response/order.dto';

@ApiTags('cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiResponse({
    status: 201,
    description: 'Show details about my cart',
    type: CartDto,
  })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.client)
  @Get('/my-cart')
  async getCart(@GetUser() user: User): Promise<CartDto> {
    return await this.cartService.getCart({ uuid: user.uuid });
  }

  @ApiResponse({
    status: 201,
    description: 'Add item in the cart',
    type: CartDto,
  })
  @ApiParam({
    name: 'uuid',
    description: 'Product',
    required: true,
  })
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

  @ApiResponse({
    status: 201,
    description: 'Remove item in the cart',
    type: CartDto,
  })
  @ApiParam({
    name: 'uuid',
    description: 'Product',
    required: true,
  })
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

  @ApiResponse({
    status: 201,
    description: 'Add item in order',
    type: OrderDto,
  })
  @ApiParam({
    name: 'uuid',
    description: 'Product',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.client)
  @Post('/my-cart/:uuid')
  @ApiUnauthorizedResponse({
    description:
      'Item does not exist in the cart, Please put the product in the cart',
  })
  async makeOrder(
    @Param() product: ProductDto,
    @GetUser() user: User,
  ): Promise<OrderDto> {
    return await this.cartService.addInOrder(user.uuid, product.uuid);
  }

  @ApiResponse({
    status: 201,
    description: 'Show details about my order',
    type: OrderDto,
  })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.client)
  @Get('/my-order')
  async showOrder(@GetUser() user: User): Promise<OrderDto> {
    return await this.cartService.getOrder(user.uuid);
  }

  @ApiResponse({
    status: 201,
    description: 'Buy my Order',
    type: Boolean,
  })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.client)
  @Patch('/my-order/buy')
  async buyOrder(@GetUser() user: User): Promise<boolean> {
    return await this.cartService.deleteOrder(user.uuid);
  }

  @ApiResponse({
    status: 201,
    description: 'Remove item in my order',
    type: OrderDto,
  })
  @ApiParam({
    name: 'uuid',
    description: 'Product',
    required: true,
  })
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
