import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import { PaginatedResult, ProductsFindAllResult } from '../product.types';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

export interface ProductsRepository {
  findAll(name?: string, orderBy?: 'name' | 'price', order?: 'asc' | 'desc', page?: number, limit?: number): Promise<ProductsFindAllResult>;
  findById(id: number): Promise<Product | undefined>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: number, input: UpdateProductInput): Promise<Product | undefined>;
  remove(id: number): Promise<Product | undefined>;
  updateStock(product: Product, quantity: number): Promise<Product>;
  findProductsByCategoryId(categoryId: number): Promise<Product[]>;
}

