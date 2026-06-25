import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Category, CreateCategoryInput } from '../category.types';
import { Product } from '../../products/product.types';
import { CategoriesServices } from '../services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesServices) {}

  @Get()
  async findAll(@Query('name') name?: string): Promise<Category[]> {
    return this.categoriesService.findAll(name);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Get(':id/products')
  async findProductsByCategory(@Param('id', ParseIntPipe) id: number): Promise<Product[]> {
    return this.categoriesService.findProductsByCategoryId(id);
  }

  @Post()
  async create(@Body() body: CreateCategoryInput): Promise<Category> {
    return this.categoriesService.create(body);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoriesService.remove(id);
  }
}
