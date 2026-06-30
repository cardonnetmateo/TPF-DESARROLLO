import { ExternalUser } from '../user.types';

export const USERS_GATEWAY = 'USERS_GATEWAY';

export interface UsersGateway {
  fetchAll(): Promise<ExternalUser[]>;
  
  fetchById(id: number | string): Promise<ExternalUser>;
}

