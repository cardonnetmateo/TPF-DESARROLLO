import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { DbUsersGateway } from './gateways/db-users.gateway';
import { LocalUsersGateway } from './gateways/local-users.gateway';
import { JsonPlaceholderUsersGateway } from './gateways/jsonplaceholder-users.gateway';
import { USERS_GATEWAY } from './gateways/users.gateway';
import { UsersService } from './services/users.service';
import { UserEntity } from './user.entity';

@Global()
@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UsersService,
    DbUsersGateway,
    JsonPlaceholderUsersGateway,
    LocalUsersGateway,
    {
      provide: USERS_GATEWAY,
      useFactory: (
        dbGateway: DbUsersGateway,
        jsonPlaceholderGateway: JsonPlaceholderUsersGateway,
        localGateway: LocalUsersGateway,
      ) => {
        const source = process.env.USERS_SOURCE ?? 'db';
        switch (source) {
          case 'jsonplaceholder': return jsonPlaceholderGateway;
          case 'file': return localGateway;
          default: return dbGateway;
        }
      },
      inject: [DbUsersGateway, JsonPlaceholderUsersGateway, LocalUsersGateway],
    },
  ],
  exports: [UsersService, USERS_GATEWAY],
})
export class UsersModule {}