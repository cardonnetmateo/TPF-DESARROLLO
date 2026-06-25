import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/user.entity';
import { UserRole } from '../users/user.types';
import { LoginInput, RegisterInput } from './auth.types';
import { randomUUID } from 'crypto';
import { Resend } from 'resend';
import { NotFoundException } from '@nestjs/common';

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

    await resend.emails.send({
      from: 'cardonnetmateo@gmail.com',
      to: [entity.email],
      subject: 'Verification Link',
      html: `<p><a href="${verificationUrl}">Link para verificar email</a></p>`,
    });

    return { id: entity.id, email: entity.email, role: entity.role };
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

    return { access_token: accessToken };
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
    
    const newToken = randomUUID();
    user.verificationToken = newToken;
    await this.usersRepo.save(user);

    const verificationUrl = `http://localhost:4200/verify-email?token=${newToken}`;
    const resend = new Resend(this.cfg.getOrThrow<string>('RESEND_API_KEY'));
    await resend.emails.send({
      from: 'cardonnetmateo@gmail.com',
      to: [user.email],
      subject: 'Verification Link',
      html: `<p><a href="${verificationUrl}">Link para verificar email</a></p>`,
    });

  }

}
