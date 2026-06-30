import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ExternalUser } from '../user.types';
import { UsersGateway } from './users.gateway';

@Injectable()
export class JsonPlaceholderUsersGateway implements UsersGateway {
  async fetchAll(): Promise<ExternalUser[]> {
    const { data } = await axios.get<ExternalUser[]>(
      'https://jsonplaceholder.typicode.com/users',
    );
    return data;
  }

  async fetchById(id: number | string): Promise<ExternalUser> {
    const { data } = await axios.get<ExternalUser>(
      `https://jsonplaceholder.typicode.com/users/${id}`,
    );
    return data;
  }
  
}

