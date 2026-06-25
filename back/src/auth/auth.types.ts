import { IsEmail, IsNotEmpty, IsOptional, Length, MinLength } from 'class-validator';

export class RegisterInput {
  @IsOptional()
  @Length(2, 100)
  name?: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @MinLength(6)
  @IsNotEmpty()
  password!: string;
}

export class LoginInput {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;
}
