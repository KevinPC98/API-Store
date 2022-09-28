import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart, Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { ProductService } from '../products/product.service';
import { UserDto } from '../users/dto/response/user.dto';
import { UsersService } from '../users/users.service';
import { PickedProductDto } from './dto/request/picked-product.dto';
import { CartDto } from './dto/response/cart.dto';
import { OrderDto } from './dto/response/order.dto';

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

  async addInOrder(userUuid: string, productUuid: string): Promise<OrderDto> {
    const cartItemFound = await this.prismaService.cartItem.findFirst({
      where: {
        product: {
          uuid: productUuid,
        },
        cart: {
          user: {
            uuid: userUuid,
          },
        },
      },
      select: {
        uuid: true,
        quantity: true,
        cart: {
          select: {
            user: {
              select: {
                order: {
                  select: {
                    uuid: true,
                  },
                },
              },
            },
          },
        },
        product: true,
        orderItem: true,
      },
    });

    if (!cartItemFound) {
      throw new NotFoundException(
        'Item does not exist in the cart, Please put the product in the cart',
      );
    }

    if (cartItemFound.orderItem.length) {
      throw new NotFoundException('Item already has been added before');
    }
    await this.prismaService.orderItem.create({
      data: {
        cartItemUuid: cartItemFound.uuid,
        orderUuid: cartItemFound.cart.user.order[0].uuid,
      },
    });

    return await this.getOrder(userUuid);
  }

  async getOrder(userUuid: string): Promise<OrderDto> {
    const order = await this.prismaService.order.findFirst({
      where: {
        userUuid,
        wasBought: false,
      },
      select: {
        uuid: true,
        wasBought: true,
        userUuid: true,
        OrderItem: {
          select: {
            uuid: true,
            CartItem: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(
        'Order cannot find, there is a problem with it',
      );
    }

    return plainToInstance(OrderDto, {
      uuid: order.uuid,
      userUuid: order.userUuid,
      orderItem: order.OrderItem,
    });
  }

  async removeInOrder(
    userUuid: string,
    productUuid: string,
  ): Promise<OrderDto> {
    const orderItemFound = await this.prismaService.orderItem.findFirst({
      where: {
        order: {
          userUuid,
          wasBought: false,
        },
        CartItem: {
          productUuid,
        },
      },
      select: {
        uuid: true,
        order: {
          select: {
            uuid: true,
          },
        },
      },
    });

    if (!orderItemFound) {
      throw new NotFoundException('Product is not in the order');
    }

    await this.prismaService.orderItem.delete({
      where: {
        uuid: orderItemFound.uuid,
      },
    });

    return this.getOrder(userUuid);
  }

  async deleteOrder(userUuid: string): Promise<boolean> {
    const orderFound = await this.prismaService.order.findFirst({
      where: {
        userUuid,
        wasBought: false,
      },
      select: {
        uuid: true,
        userUuid: true,
        wasBought: true,
        OrderItem: {
          select: {
            CartItem: {
              select: {
                uuid: true,
                quantity: true,
                product: {
                  select: {
                    uuid: true,
                    stock: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!orderFound) {
      throw new NotFoundException(
        'Order cannot find, there is a problem with it',
      );
    }

    await this.prismaService.$transaction([
      this.prismaService.cartItem.deleteMany({
        where: {
          orderItem: {
            some: {
              orderUuid: orderFound.uuid,
            },
          },
        },
      }),

      this.prismaService.orderItem.deleteMany({
        where: {
          orderUuid: orderFound.uuid,
        },
      }),

      this.prismaService.order.delete({
        where: {
          uuid: orderFound.uuid,
        },
      }),

      this.prismaService.order.create({
        data: {
          user: {
            connect: {
              uuid: userUuid,
            },
          },
          wasBought: false,
        },
      }),
    ]);

    orderFound.OrderItem.forEach(async (element) => {
      console.log(element.CartItem?.product.stock);
      if (!element.CartItem) {
        throw new NotFoundException('Cannot found cartItem');
      }
      await this.prismaService.product.update({
        where: {
          uuid: element.CartItem.product.uuid,
        },
        data: {
          stock: element.CartItem.product.stock - element.CartItem.quantity,
        },
      });
    });

    return true;
  }
}
