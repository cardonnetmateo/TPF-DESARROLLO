import { Injectable } from '@nestjs/common';
import { Category, CreateCategoryInput } from '../category.types';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class InMemoryCategoriesRepository implements CategoriesRepository {
  private categories: Category[] = [];
  private nextId: number = 1;

  async findAll(name?: string): Promise<Category[]> {
    if (name) {
      return this.categories.filter((c) => c.name.includes(name));
    }
    return this.categories;
  }

  async findById(id: number): Promise<Category | undefined> {
    return this.categories.find((c) => c.id === id);
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const category: Category = {
      id: this.nextId++,
      name: input.name,
    };

    this.categories.push(category);
    return category;
  }

  async remove(id: number): Promise<Category | undefined> {
    const category = await this.findById(id);
    if (!category) return undefined;

    this.categories = this.categories.filter((c) => c.id !== id);
    return category;
  }
}
