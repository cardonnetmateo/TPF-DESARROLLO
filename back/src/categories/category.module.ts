import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './controllers/categories.controller';
import { CATEGORIES_REPOSITORY } from './repositories/categories.repository';
import { CategoriesServices } from './services/categories.service';
import { ProductsModule } from '../products/products.module';
import { CategoryEntity } from './category.entity';
import { TypeOrmCategoriesRepository } from './repositories/TypeOrmCategoriesRepository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), ProductsModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesServices,
    { provide: CATEGORIES_REPOSITORY, useClass: TypeOrmCategoriesRepository },
  ],
  exports: [CategoriesServices, CATEGORIES_REPOSITORY],
})
export class CategoriesModule {}
