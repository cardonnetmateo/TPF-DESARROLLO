import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput, RegisterInput } from './auth.types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    return this.authService.getMe(req.user.id);
}
  @Post('register')
  async register(@Body() dto: RegisterInput) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginInput) {
    return this.authService.login(dto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: { token: string }) {
    return this.authService.verifyEmail(dto.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-verification')
  async resendVerification(@Request() req) {
    return this.authService.resendVerification(req.user.id);
  }
}
