import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../product.entity';
import { ProductsRepository } from './products.repository';
import { Product, ProductsFindAllResult, UpdateProductInput } from '../product.types';
import { CategoryEntity} from '../../categories/category.entity';


@Injectable()
export class TypeOrmProductsRepository
  implements ProductsRepository {

  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  private toEntity(product: Product): ProductEntity {
  const entity = new ProductEntity();
  entity.id = product.id;
  entity.name = product.name;
  entity.price = product.price;
  entity.stock = product.stock;
  entity.category = { id: product.categoryId } as CategoryEntity;
  return entity;
}

  private toProduct(entity: ProductEntity): Product {
  return {
    id: entity.id,
    name: entity.name,
    price: entity.price,
    stock: entity.stock,
    categoryId: entity.category.id,
  };
  
}

async findAll(name?: string,orderBy?: 'name' | 'price',order?: 'asc' | 'desc',page?: number,limit?: number,): Promise<ProductsFindAllResult> {
  
const query = this.repository
.createQueryBuilder('product')
.leftJoinAndSelect('product.category', 'category');

if (name) {query.where('LOWER(product.name) LIKE :name', {name: `%${name.toLowerCase()}%`,});}

if (orderBy) {query.orderBy(`product.${orderBy}`,(order ?? 'asc').toUpperCase() as 'ASC' | 'DESC',);}

if (page === undefined && limit === undefined) {
const entities = await query.getMany();
return entities.map(entity => this.toProduct(entity));
}

page = Math.max(page || 1, 1);
limit = Math.min(Math.max(limit || 5, 1), 50);
const offset = (page - 1) * limit;
query.skip(offset);
query.take(limit);
const [entities, total] = await query.getManyAndCount();

return {
data: entities.map(entity => this.toProduct(entity)),
meta: {page,limit,total,totalPages: Math.ceil(total / limit)}
};

}

async findById(id: number): Promise<Product | undefined> {

  const entity = await this.repository.findOne({
    where: { id },
    relations: {
      category: true,
    },
  });

  if (!entity) return undefined;

  return this.toProduct(entity);
}

async create(product: Product): Promise<Product> {

  const entity = this.repository.create({
    name: product.name,
    price: product.price,
    stock: product.stock,
    category: {
      id: product.categoryId,
    } as CategoryEntity,
  });

  const saved = await this.repository.save(entity);

  return this.toProduct(saved);
}

async update(id: number, product: UpdateProductInput): Promise<Product | undefined> {
  const selectProduct = await this.findById(id);
  if (!selectProduct) return undefined;

  const entity = this.toEntity(selectProduct);
  entity.name = product.name ?? entity.name;
  entity.price = product.price ?? entity.price;
  entity.stock = product.stock ?? entity.stock;
  

  const saved = await this.repository.save(entity);
  return this.toProduct(saved);
}


async remove(id: number): Promise<Product | undefined> {
  const product = await this.findById(id);
  if (!product) return undefined;
  await this.repository.delete(id);
  return product;
}

async updateStock(product: Product, quantity: number): Promise<Product> {
  const entity = this.toEntity(product);
  entity.stock -= quantity;
  const saved = await this.repository.save(entity);
  return this.toProduct(saved);
}

async findProductsByCategoryId(categoryId: number): Promise<Product[]> {
  const entities = await this.repository.find({
    where: { category: { id: categoryId } },
    relations: { category: true },
  });
  return entities.map(entity => this.toProduct(entity));
}



}
