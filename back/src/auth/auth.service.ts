import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/user.entity';
import { UserRole } from '../users/user.types';
import { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from './auth.types';
import { randomUUID } from 'crypto';
import { Resend } from 'resend';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly cfg: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async getMe(userId: string) {
    return this.usersRepo.findOne({
      where: { id: userId },
    });
  }

  async register(dto: RegisterInput) {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) { throw new ConflictException('Email already registered'); }

    const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
    const passwordHash = await bcrypt.hash(dto.password, rounds);
    const countUsers = await this.usersRepo.count();
    const role = countUsers === 0 ? UserRole.ADMIN : UserRole.USER;
    const name = dto.name ?? email.split('@')[0];
    const verificationToken = randomUUID();
    
    const entity = this.usersRepo.create({ email, name, passwordHash, role, verificationToken });
    await this.usersRepo.save(entity);

    const resend = new Resend(this.cfg.getOrThrow<string>('RESEND_API_KEY'));
    const verificationUrl = `http://localhost:4200/verify-email?token=${verificationToken}`;

    const fromEmail = this.cfg.get<string>('RESEND_FROM_EMAIL') || 'onboarding@resend.dev';

    await resend.emails.send({
      from: fromEmail,
      to: [entity.email],
      subject: 'Verification Link',
      html: `<p><a href="${verificationUrl}">Link para verificar email</a></p>`,
    });

    const accessToken = this.jwtService.sign({
      sub: entity.id,
      role: entity.role,
    });

    return {
      user: { id: entity.id, email: entity.email, role: entity.role, isVerified: entity.isVerified, createdAt: entity.createdAt },
      access_token: accessToken,
    };
  }

  async login(dto: LoginInput) {
    const email = dto.email.trim().toLowerCase();

    const q = this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email });

    const user = await q.getOne();

    if (!user) {throw new UnauthorizedException('Credenciales inválidas');}

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {throw new UnauthorizedException('Credenciales inválidas');}

    const accessToken = this.jwtService.sign({
      sub: user.id,
      role: user.role,
    });

    return {
      user: { id: user.id, email: user.email, role: user.role, isVerified: user.isVerified, createdAt: user.createdAt },
      access_token: accessToken,
    };
  }

  async verifyEmail(token: string) {
    const user = await this.usersRepo.findOne({ where: { verificationToken: token } });
    if (!user) { throw new UnauthorizedException('Token inválido o expirado'); }

    user.isVerified = true;
    user.verificationToken = null;
    await this.usersRepo.save(user);

    return { message: 'Email verificado' };
  }

  async resendVerification(userId:string){
    const user = await this.usersRepo.findOne({where: {id: userId}});
    if (!user) { throw new NotFoundException() }
    if (user.isVerified) { throw new BadRequestException('El email ya está verificado'); }

    const newToken = randomUUID();
    user.verificationToken = newToken;
    await this.usersRepo.save(user);

    const verificationUrl = `http://localhost:4200/verify-email?token=${newToken}`;
    const resend = new Resend(this.cfg.getOrThrow<string>('RESEND_API_KEY'));
    const fromEmail = this.cfg.get<string>('RESEND_FROM_EMAIL') || 'onboarding@resend.dev';
    await resend.emails.send({
      from: fromEmail,
      to: [user.email],
      subject: 'Verification Link',
      html: `<p><a href="${verificationUrl}">Link para verificar email</a></p>`,
    });

    return { message: 'Email reenviado' };
  }

  async forgotPassword(dto: ForgotPasswordInput) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.usersRepo.findOne({ where: { email } });

    if (user) {
      const token = randomUUID();
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      user.resetPasswordToken = token;
      user.resetPasswordExpires = expires;
      await this.usersRepo.save(user);

      const resetUrl = `http://localhost:4200/reset-password?token=${token}`;
      const resend = new Resend(this.cfg.getOrThrow<string>('RESEND_API_KEY'));
      const fromEmail = this.cfg.get<string>('RESEND_FROM_EMAIL') || 'onboarding@resend.dev';

      await resend.emails.send({
        from: fromEmail,
        to: [user.email],
        subject: 'Password Reset',
        html: `<p><a href="${resetUrl}">Link para resetear contraseña</a></p>`,
      });
    }

    return { message: 'Si el email existe, recibirás un link' };
  }

  async resetPassword(dto: ResetPasswordInput) {
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.resetPasswordToken')
      .addSelect('u.resetPasswordExpires')
      .where('u.resetPasswordToken = :token', { token: dto.token })
      .getOne();

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
    const passwordHash = await bcrypt.hash(dto.password, rounds);

    user.passwordHash = passwordHash;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.usersRepo.save(user);

    return { message: 'Contraseña actualizada' };
  }

}
