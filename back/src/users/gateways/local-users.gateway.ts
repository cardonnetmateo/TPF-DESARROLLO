import { Injectable } from '@nestjs/common';
import { UsersGateway } from './users.gateway';
import { ExternalUser } from '../user.types';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

@Injectable()
export class LocalUsersGateway implements UsersGateway {
    private readonly usersFilePath = resolve(
        process.cwd(),
        'src/users/data/users.json',
    );

    private async readUsers(): Promise<ExternalUser[]> {
        const fileContent = await readFile(this.usersFilePath, 'utf-8');
        const users = JSON.parse(fileContent) as ExternalUser[];
        
        return users;
    }

    async fetchAll(): Promise<ExternalUser[]> {
        return this.readUsers();
    }

    async fetchById(id: number | string): Promise<ExternalUser> {
        const users = await this.readUsers();
        const user = users.find((currentUser) => currentUser.id === Number(id));

        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        return user;
    }
}