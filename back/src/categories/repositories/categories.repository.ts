import { Category, CreateCategoryInput, UpdateCategoryInput } from '../category.types';

export const CATEGORIES_REPOSITORY = 'CATEGORIES_REPOSITORY';

export interface CategoriesRepository {
  findAll(name?: string): Promise<Category[]>;
  findById(id: number): Promise<Category | undefined>;
  create(input: CreateCategoryInput): Promise<Category>;
  update(id: number, input: UpdateCategoryInput): Promise<Category | undefined>;
  remove(id: number): Promise<Category | undefined>;
}

