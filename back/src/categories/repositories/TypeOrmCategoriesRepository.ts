import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../categories/category.entity';
import { CategoriesRepository } from './categories.repository';
import { Category, CreateCategoryInput } from '../category.types';

@Injectable()
export class TypeOrmCategoriesRepository implements CategoriesRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
  ) {}

  private toCategory(entity: CategoryEntity): Category {
    return {
      id: entity.id,
      name: entity.name,
    };
  }

  async findAll(name?: string): Promise<Category[]> {
    const query = this.categoriesRepository.createQueryBuilder('category');

    if (name) {
      query.where('LOWER(category.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      });
    }

    const entities = await query.getMany();
    return entities.map((entity) => this.toCategory(entity));
  }

  async findById(id: number): Promise<Category | undefined> {
    const entity = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!entity) return undefined;
    return this.toCategory(entity);
  }

  async create(category: CreateCategoryInput): Promise<Category> {
    const entity = this.categoriesRepository.create({
      name: category.name,
    });

    const saved = await this.categoriesRepository.save(entity);
    return this.toCategory(saved);
  }

  async remove(id: number): Promise<Category | undefined> {
    const category = await this.findById(id);
    if (!category) return undefined;
    await this.categoriesRepository.delete(id);
    return category;
  }

  
}

