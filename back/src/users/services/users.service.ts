import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ExternalUser } from '../user.types';
import { USERS_GATEWAY, UsersGateway } from '../gateways/users.gateway';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_GATEWAY)
    private readonly usersGateway: UsersGateway,
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
  

  
}

