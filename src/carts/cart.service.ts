import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart, Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/products/product.service';
import { UserDto } from 'src/users/dto/response/user.dto';
import { UsersService } from 'src/users/users.service';
import { PickedProductDto } from './dto/request/picked-product.dto';
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
        totalPrice: true,
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
      totalPrice: cart.totalPrice,
      user: plainToInstance(UserDto, user),
      products: cart.cartItem,
    });
  }

  async addItemInCart(
    user: Prisma.UserWhereUniqueInput,
    pickedProductDto: PickedProductDto,
  ): Promise<CartDto> {
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

    const totalPrice =
      pickedProductDto.quantity * productFound.unitPrice + cartFound.totalPrice;
    let quantity = pickedProductDto.quantity;
    let cartItemUuid = '';

    if (cartFound?.cartItem.length) {
      quantity = quantity + cartFound.cartItem[0].quantity;
      cartItemUuid = cartFound.cartItem[0].uuid;
    }

    await this.prismaService.cart.update({
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

    return await this.getCart({ uuid: user.uuid });
  }
}
