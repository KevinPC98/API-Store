import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart, Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from 'src/products/dto/response/product.dto';
import { ProductService } from 'src/products/product.service';
import { UserDto } from 'src/users/dto/response/user.dto';
import { UsersService } from 'src/users/users.service';
import { PickedProductDto } from './dto/request/picked-product.dto';
import { CartItemDto } from './dto/response/cart-item.dto';
import { CartDto } from './dto/response/cart.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly prismaService: PrismaService,
    private userService: UsersService,
    private productService: ProductService,
  ) {}

  async createCart(data: Prisma.CartCreateInput): Promise<Cart> {
    return await this.prismaService.cart.create({ data });
  }

  async getCart(userInput: Prisma.UserWhereUniqueInput): Promise<CartDto> {
    const { uuid } = userInput;
    const user = await this.userService.findOne({ uuid });

    const cart = await this.prismaService.cart.findFirst({
      where: {
        userUuid: uuid,
      },
      select: {
        uuid: true,
        cartItem: {
          select: {
            product: true,
            quantity: true,
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart does not exist');
    }
    return plainToInstance(CartDto, {
      uuid: cart.uuid,
      user: plainToInstance(UserDto, user),
      products: plainToInstance(CartItemDto, cart.cartItem),
    });
  }

  async addItemInCart(
    user: Prisma.UserWhereUniqueInput,
    pickedProductDto: PickedProductDto,
  ) {
    const productFound = await this.productService.findOne({
      uuid: pickedProductDto.productUuid,
    });

    if (productFound.stock <= 0) {
      throw new NotFoundException('No stock for this product :C');
    }

    const cartFound = await this.prismaService.cart.findFirst({
      where: {
        userUuid: user.uuid,
      },
      select: {
        uuid: true,
        totalPrice: true,
        cartItem: {
          where: {
            productUuid: pickedProductDto.productUuid,
          },
        },
      },
    });

    if (!cartFound) {
      throw new NotFoundException('Cart does not exist');
    }
    console.log(cartFound);

    const totalPrice =
      pickedProductDto.quantity * productFound.unitPrice + cartFound.totalPrice;
    let quantity = pickedProductDto.quantity;
    let cartItemUuid = '';
    console.log(totalPrice);

    if (cartFound?.cartItem.length) {
      console.log('entro');
      quantity = quantity + cartFound.cartItem[0].quantity;
      cartItemUuid = cartFound.cartItem[0].uuid;
    }
    console.log(totalPrice);

    const cart = await this.prismaService.cart.update({
      data: {
        cartItem: {
          upsert: {
            where: {
              uuid: cartItemUuid,
            },
            create: {
              quantity,
              unitPrice: productFound.unitPrice,
              productUuid: pickedProductDto.productUuid,
            },
            update: {
              quantity,
            },
          },
        },
        totalPrice,
      },
      where: {
        uuid: cartFound.uuid,
      },
    });

    const cartFoundView = await this.prismaService.cart.findFirst({
      where: {
        userUuid: user.uuid,
      },
      select: {
        uuid: true,
        totalPrice: true,
        cartItem: true,
      },
    });

    console.log('___________________ FINAL ________________________');
    console.log(cartFoundView);
    console.log('___________________________________________');
  }
}
