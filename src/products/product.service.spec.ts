import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Category, Product } from '@prisma/client';
import { commerce, datatype, lorem } from 'faker';
import { CategoryFactory } from '../common/factories/category.factory';
import { ProductFactory } from '../common/factories/product.factory';
import { PrismaService } from '../prisma/prisma.service';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/request/create-product.dto';

describe('ProductService', () => {
  let productservice: ProductService;
  let prismaService: PrismaService;
  let productFactory: ProductFactory;
  let categoryFactory: CategoryFactory;
  let products: Product[];
  let category: Category;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, PrismaService],
    }).compile();

    productservice = module.get<ProductService>(ProductService);
    prismaService = module.get<PrismaService>(PrismaService);
    categoryFactory = new CategoryFactory(prismaService);
    productFactory = new ProductFactory(prismaService);
    category = await categoryFactory.make({
      name: lorem.word(),
    });
    products = await productFactory.makeMany(10, {
      description: lorem.paragraph(),
      name: commerce.productName(),
      stock: datatype.number(),
      unitPrice: datatype.float(),
      category: {
        connect: {
          uuid: category.uuid,
        },
      },
    });
  });

  it('Should be defined', () => {
    expect(productservice).toBeDefined();
  });

  afterAll(async () => {
    await prismaService.clearDatabase();
    await prismaService.$disconnect();
  });

  describe('CreateProduct', () => {
    it('Should return a product created', async () => {
      const params: CreateProductDto = {
        description: lorem.paragraph(),
        name: commerce.productName(),
        stock: datatype.number(),
        unitPrice: datatype.float(),
        categoryUuid: category.uuid,
      };

      const result = await productservice.createProduct(params);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('uuid', result.uuid);
      expect(result).toHaveProperty('description', params.description);
      expect(result).toHaveProperty('name', params.name);
      expect(result).toHaveProperty('stock', params.stock);
      expect(result).toHaveProperty('unitPrice', params.unitPrice);
    });
  });

  describe('findOne', () => {
    it('Should return a required product', async () => {
      const result = await productservice.findOne({
        uuid: products[0].uuid,
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('uuid', products[0].uuid);
      expect(result).toHaveProperty('description', products[0].description);
      expect(result).toHaveProperty('name', products[0].name);
      expect(result).toHaveProperty('stock', products[0].stock);
      expect(result).toHaveProperty('unitPrice', products[0].unitPrice);
    });

    it('Should throw an error when the uuid is not valid', async () => {
      expect(productservice.findOne({ uuid: datatype.uuid() })).rejects.toThrow(
        new NotFoundException('Product does not exist'),
      );
    });
  });

  describe('updateProduct', () => {
    it('Should return an updated product', async () => {
      const name = commerce.productName();
      const result = await productservice.updateProduct(
        {
          uuid: products[0].uuid,
        },
        {
          name,
        },
      );

      expect(result).toBeDefined();
      expect(result).toHaveProperty('description', products[0].description);
      expect(result).toHaveProperty('name', name);
      expect(result).toHaveProperty('stock', products[0].stock);
      expect(result).toHaveProperty('unitPrice', products[0].unitPrice);
    });
  });

  describe('getAll', () => {
    it('Should return a list of filter products by category', async () => {
      const result = await productservice.getAll(
        {
          page: 5,
          take: 2,
        },
        category.name,
      );

      expect(result).toBeDefined();
      expect(result).toHaveProperty('products');
      expect(result).toHaveProperty('pagination');
    });

    it('Should return a full list of products', async () => {
      const result = await productservice.getAll(
        {
          page: 5,
          take: 2,
        },
        '',
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty('products');
      expect(result).toHaveProperty('pagination');
    });
  });
});
