import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import {
  CreateProductInput,
  Product,
  ProductsFindAllResult,
  UpdateProductInput,
} from '../product.types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('name') name?: string,
    @Query('orderBy') orderBy?: 'name' | 'price',
    @Query('order') order?: 'asc' | 'desc',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<ProductsFindAllResult> {
    const parsedPage = page === undefined ? undefined : Number(page);
    const parsedLimit = limit === undefined ? undefined : Number(limit);

    return this.productsService.findAll(name, orderBy, order, parsedPage, parsedLimit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product | undefined> {
    return this.productsService.findOne(Number(id)); 
  }

  @Post()
  create(@Body() body: CreateProductInput): Promise<Product> {
    return this.productsService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateProductInput): Promise<Product | undefined> {
    return this.productsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Product | undefined> {
    return this.productsService.remove(Number(id));
  }

  @Patch(':id/stock')
  updateStock(
    @Param('id') id: string,
    @Body() body: { quantity: number },
  ): Promise<Product> {
    return this.productsService.updateStock(Number(id), body.quantity);
  }
}

