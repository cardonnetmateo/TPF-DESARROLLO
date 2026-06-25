import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user.entity';
import { ExternalUser } from '../user.types';
import { UsersGateway } from './users.gateway';

@Injectable()
export class DbUsersGateway implements UsersGateway {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async fetchAll(): Promise<ExternalUser[]> {
    const users = await this.usersRepo.find();
    return users.map((u) => ({
      id: u.id,
      name: u.name ?? u.email.split('@')[0],
      username: u.email.split('@')[0],
      email: u.email,
    }));
  }

  async fetchById(id: number | string): Promise<ExternalUser> {
    const user = await this.usersRepo.findOne({ where: { id: String(id) } });
    if (!user) throw new NotFoundException('User not found');
    return {
      id: user.id,
      name: user.name ?? user.email.split('@')[0],
      username: user.email.split('@')[0],
      email: user.email,
    };
  }
}
