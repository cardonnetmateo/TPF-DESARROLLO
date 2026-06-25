import { IsInt,IsNotEmpty,IsNumber,IsOptional,IsPositive,Length,Min } from 'class-validator';

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
};

export class CreateProductInput {
  @IsNotEmpty()
  @Length(2, 100)
  name!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsInt()
  @Min(0)
  stock!: number;

  @IsInt()
  categoryId!: number;
}

export class UpdateProductInput {
  @IsOptional()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;
}

export type PaginatedResult<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ProductsFindAllResult = Product[] | PaginatedResult<Product>;