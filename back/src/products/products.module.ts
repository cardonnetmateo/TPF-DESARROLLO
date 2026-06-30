import { Global, Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { InMemoryProductsRepository } from './repositories/in-memory-products.repository';
import { PRODUCTS_REPOSITORY } from './repositories/products.repository';
import { ProductsService } from './services/products.service';
import { ProductEntity } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmProductsRepository } from './repositories/TypeOrmProductsRepository';

@Global()
@Module({
  controllers: [ProductsController],
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [
    ProductsService,
    { provide: PRODUCTS_REPOSITORY, useClass: TypeOrmProductsRepository },
  ],
  exports: [ProductsService, PRODUCTS_REPOSITORY],
})
export class ProductsModule {}
