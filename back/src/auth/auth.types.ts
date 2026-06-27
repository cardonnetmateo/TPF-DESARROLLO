import { IsEmail, IsNotEmpty, IsOptional, Length, MinLength } from 'class-validator';

export class RegisterInput {
  @IsOptional()
  @Length(2, 100)
  name?: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @MinLength(8)
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

export class ForgotPasswordInput {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class ResetPasswordInput {
  @IsNotEmpty()
  token!: string;

  @MinLength(8)
  @IsNotEmpty()
  password!: string;
}
