import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import {
  PRODUCTS_REPOSITORY,
  ProductsRepository,
} from '../repositories/products.repository';
import { ProductsFindAllResult } from '../product.types';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}

  findAll(
    name?: string,
    sortBy?: 'name' | 'price',
    order?: 'asc' | 'desc',
    page?: number,
    limit?: number
  ): Promise<ProductsFindAllResult> {
    return this.productsRepository.findAll(name, sortBy, order, page, limit);
  }

  findOne(id: number): Promise<Product | undefined> {
    const product = this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(input: CreateProductInput): Promise<Product> {
    return this.productsRepository.create(input);
  }

  update(id: number, input: UpdateProductInput): Promise<Product | undefined> {
    const product = this.productsRepository.update(id, input);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  remove(id: number): Promise<Product | undefined> {
    const product = this.productsRepository.remove(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    if (quantity > product.stock) throw new BadRequestException('Stock insuficiente');

    const updated = await this.productsRepository.updateStock(product, quantity);
    return updated;
  }

  findProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return this.productsRepository.findProductsByCategoryId(categoryId);
  }
}

