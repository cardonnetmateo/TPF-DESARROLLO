import { Category, CreateCategoryInput } from '../category.types';

export const CATEGORIES_REPOSITORY = 'CATEGORIES_REPOSITORY';

export interface CategoriesRepository {
  findAll(name?: string): Promise<Category[]>;
  findById(id: number): Promise<Category | undefined>;
  create(input: CreateCategoryInput): Promise<Category>;
  remove(id: number): Promise<Category | undefined>;
}

