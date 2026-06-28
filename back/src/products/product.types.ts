import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, Length, MaxLength, Min } from 'class-validator';

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  category: { id: number; name: string };
};

export class CreateProductInput {
  @IsNotEmpty()
  @MaxLength(256)
  name!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsInt()
  categoryId?: number | null;
}

export class UpdateProductInput {
  @IsOptional()
  @MaxLength(256)
  name?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsInt()
  categoryId?: number | null;
}

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type ProductsFindAllResult = Product[] | PaginatedResult<Product>;