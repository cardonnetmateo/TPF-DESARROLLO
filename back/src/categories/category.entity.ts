import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('categories')
export class CategoryEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

}