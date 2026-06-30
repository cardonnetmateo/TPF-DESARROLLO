import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../category.types';
import { Product } from '../../products/product.types';
import { CategoriesServices } from '../services/categories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../users/user.types';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesServices) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('name') name?: string): Promise<Category[]> {
    return this.categoriesService.findAll(name);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/products')
  async findProductsByCategory(@Param('id', ParseIntPipe) id: number): Promise<Product[]> {
    return this.categoriesService.findProductsByCategoryId(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() body: CreateCategoryInput): Promise<Category> {
    return this.categoriesService.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateCategoryInput): Promise<Category> {
    return this.categoriesService.update(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoriesService.remove(id);
  }
}
