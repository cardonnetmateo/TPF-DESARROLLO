import { IsNotEmpty, Length } from 'class-validator';

export type Category = {
    id: number;
    name: string;
}

export class CreateCategoryInput {
    @IsNotEmpty()
    @Length(1, 128)
    name!: string;
}

export class UpdateCategoryInput {
    @IsNotEmpty()
    @Length(1, 128)
    name!: string;
}