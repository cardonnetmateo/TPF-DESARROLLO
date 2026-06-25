import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryEntity } from '../categories/category.entity';

@Entity('products')
export class ProductEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('float')
  price!: number;

  @Column()
  stock!: number;

  @ManyToOne(() => CategoryEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category!: CategoryEntity;
}