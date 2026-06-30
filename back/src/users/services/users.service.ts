import { BadGatewayException, BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user.entity';
import { ExternalUser, UserRole } from '../user.types';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UpdateEmailDto } from '../dto/update-email.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { USERS_GATEWAY, UsersGateway } from '../gateways/users.gateway';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_GATEWAY)
    private readonly usersGateway: UsersGateway,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly cfg: ConfigService,
  ) {}
  
  async findAll(): Promise<ExternalUser[]> {
    try {
      return await this.usersGateway.fetchAll();
    } catch {
      throw new BadGatewayException('Upstream users service failed');
    }
  }

  async findOne(id: number | string): Promise<ExternalUser> {
    try {
      return await this.usersGateway.fetchById(id);
    } catch {
      throw new BadGatewayException('Upstream users service failed');
    }
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.id = :id', { id: userId })
      .getOne();

    if (!user) throw new NotFoundException();

    const ok = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!ok) throw new BadRequestException('Current password is incorrect');

    const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
    user.passwordHash = await bcrypt.hash(dto.newPassword, rounds);
    await this.usersRepo.save(user);

    return { message: 'Password updated' };
  }

  async updateEmail(userId: string, dto: UpdateEmailDto) {
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.id = :id', { id: userId })
      .getOne();

    if (!user) throw new NotFoundException();

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Password is incorrect');

    const email = dto.newEmail.trim().toLowerCase();
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('Email already in use');

    user.email = email;
    await this.usersRepo.save(user);

    return { message: 'Email updated' };
  }

  async updateRole(userId: string, dto: UpdateRoleDto, requesterId: string) {
    if (userId === requesterId) throw new ForbiddenException('Cannot change your own role');

    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.role === UserRole.USER) {
      const adminCount = await this.usersRepo.count({ where: { role: UserRole.ADMIN } });
      if (adminCount <= 1) throw new ForbiddenException('Cannot demote the only admin');
    }

    user.role = dto.role;
    await this.usersRepo.save(user);

    return { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt };
  }
}

