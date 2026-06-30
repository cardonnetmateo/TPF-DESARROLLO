import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  Category,
} from '../category.types';
import {
  CATEGORIES_REPOSITORY,
  CategoriesRepository,
} from '../repositories/categories.repository';
import { Product } from '../../products/product.types';
import { ProductsService } from '../../products/services/products.service';

@Injectable()
export class CategoriesServices {
  constructor(
    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: CategoriesRepository,
    private readonly productsService: ProductsService,
  ) {}

  async findAll(name?: string): Promise<Category[]> {
    return this.categoriesRepository.findAll(name);
  }

  async findProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return this.productsService.findProductsByCategoryId(categoryId);
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const existing = await this.categoriesRepository.findAll();
    if (existing.some((c) => c.name.toLowerCase() === input.name.toLowerCase())) {
      throw new ConflictException('Category name already exists');
    }
    return this.categoriesRepository.create(input);
  }

  async update(id: number, input: UpdateCategoryInput): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new NotFoundException('Category not found');

    const existing = await this.categoriesRepository.findAll();
    if (existing.some((c) => c.id !== id && c.name.toLowerCase() === input.name.toLowerCase())) {
      throw new ConflictException('Category name already exists');
    }

    const updated = await this.categoriesRepository.update(id, input);
    if (!updated) throw new NotFoundException('Category not found');
    return updated;
  }

  async remove(id: number): Promise<Category> {
    const category = await this.categoriesRepository.remove(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}
