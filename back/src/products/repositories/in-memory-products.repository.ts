import { BadRequestException } from '@nestjs/common';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import { ProductsRepository } from './products.repository';
import { ProductsFindAllResult } from '../product.types';

export class InMemoryProductsRepository implements ProductsRepository {
  private products: Product[] = [];
  private nextId = 1;

  async findAll(name?: string, orderBy?: 'name' | 'price', order?: 'asc' | 'desc', page?: number, limit?: number): Promise<ProductsFindAllResult> {
  let result = this.products;

  if (name) 
    result = result.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
  
  if (orderBy === "name") 
    result = result.sort((a,b) => order === "desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name))

  if (orderBy === "price")
    result = result.sort((a, b) => order === "desc" ? b.price - a.price : a.price - b.price)

  if (page === undefined && limit === undefined) {
    return result;
  }

  page = Math.max(page || 1, 1);
  limit = Math.min(Math.max(limit || 10, 1), 50);
  const offset = (page - 1) * limit;
  result = result.slice(offset, offset + limit);

  return {
    data: result,
    meta: {
      page,
      limit,
      total: this.products.length,
      totalPages: Math.ceil(this.products.length / limit),
    },
  };
}

  async findById(id: number): Promise<Product | undefined> {
    const product = this.products.find((p) => p.id === id);
    return product;
  }

  async create(input: CreateProductInput): Promise<Product> {
    if (!input.categoryId) throw new BadRequestException('Category ID is required');
    const product: Product = {
      id: this.nextId++,
      name: input.name,
      price: input.price,
      stock: input.stock,
      categoryId: input.categoryId,
    };

    this.products.push(product);
    return product;
  }

  async update(id: number, input: UpdateProductInput): Promise<Product | undefined> {
    const product = await this.findById(id);
    if (!product) return undefined;

    if (input.name !== undefined) product.name = input.name;
    if (input.price !== undefined) product.price = input.price;
    if (input.stock !== undefined) product.stock = input.stock;

    return product;
  }

  async remove(id: number): Promise<Product | undefined> {
    const product = await this.findById(id);
    if (!product) return undefined;

    this.products = this.products.filter((p) => p.id !== id);
    return product;
  }

  async updateStock(product : Product, quantity: number): Promise<Product> {
    product.stock -= quantity;
    return product;
  }

  async findProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return this.products.filter(p => p.categoryId === categoryId);
  }
}

