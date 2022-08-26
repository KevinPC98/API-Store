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
        cartItem: {
          select: {
            uuid: true,
            product: {
              select: {
                uuid: true,
                name: true,
                description: true,
                stock: true,
                unitPrice: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
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
      products: cart.cartItem,
    });
  }

  async createOrder(data: Prisma.OrderCreateInput): Promise<void> {
    await this.prismaService.order.create({
      data,
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
        cartItem: {
          where: {
            productUuid: pickedProductDto.productUuid,
          },
          select: {
            uuid: true,
            quantity: true,
          },
        },
      },
    });

    if (!cartFound) {
      throw new NotFoundException('Cart does not exist');
    }

    let quantity = pickedProductDto.quantity;
    let cartItemUuid = '';

    if (cartFound?.cartItem.length) {
      quantity = quantity + cartFound.cartItem[0].quantity;
      cartItemUuid = cartFound.cartItem[0].uuid;
    }

    await this.prismaService.cartItem.upsert({
      where: {
        uuid: cartItemUuid,
      },
      create: {
        quantity,
        productUuid: pickedProductDto.productUuid,
        cartUuid: cartFound.uuid,
      },
      update: {
        quantity,
      },
    });

    return await this.getCart({ uuid: user.uuid });
  }

  async removeItemInCart(
    userInput: Prisma.UserWhereUniqueInput,
    productUuid: string,
  ): Promise<CartDto> {
    const cartItem = await this.prismaService.cartItem.findFirst({
      where: {
        product: {
          uuid: productUuid,
        },
        cart: {
          user: {
            uuid: userInput.uuid,
          },
        },
      },
      select: {
        cart: true,
        product: true,
        uuid: true,
        quantity: true,
        productUuid: true,
        cartUuid: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item does not exist in the cart');
    }

    await this.prismaService.cartItem.delete({
      where: {
        uuid: cartItem.uuid,
      },
    });

    return await this.getCart({ uuid: userInput.uuid });
  }

  /*   async updateOrder(
    userInput: Prisma.UserWhereUniqueInput,
    pickedProductDto: PickedProductDto,
  ): Promise<void> {
    const { productUuid, quantity } = pickedProductDto;

    const cartItemFound = await this.prismaService.cartItem.findFirst({
      where: {
        product: {
          uuid: pickedProductDto.productUuid,
        },
        cart: {
          user: {
            uuid: userInput.uuid,
          },
        },
      },
      select: {
        uuid: true,
        quantity: true,
        cart: true,
        product: true,
      },
    });

    if (!cartItemFound) {
      await this.addItemInCart(userInput, {
        productUuid,
        quantity,
      });

    }

    let order: Order;

    if (!cartItemFound?.orderItem.length) {
      order = await this.prismaService.order.create({
        data: {
          user: {
            connect: {
              uuid: userInput.uuid,
            },
          },
        },
      });
    } else {
      order = cartItemFound.orderItem[0].order;
    }

    const productFound = await this.productService.findOne({
      uuid: productUuid,
    });

    //Crear el itemOrder y colocarlo en el order admeas de actualizar el stock del producto
    const orderItem = await this.prismaService.orderItem.create({
      data: {
        quantity,
        unitPrice: productFound.unitPrice,
        order: {
          connect: {
            uuid: order.uuid,
          },
        },
        CartItem: {
          connect: {
            uuid: cartItemFound?.uuid,
          },
        },
      },
    });

    console.log(orderItem);
  } */
}
