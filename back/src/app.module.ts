import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './products/product.entity';
import { CategoryEntity } from './categories/category.entity';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TimingMiddleware } from './common/middlewares/timming.middleware';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from './users/user.entity';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, 
    envFilePath: ['.env', '.env.local'],}),
  AuthModule, ProductsModule, UsersModule, CategoriesModule,
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: 'database.sqlite',
    entities: [ProductEntity, CategoryEntity, UserEntity],
    synchronize: true,
  },)],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule implements NestModule {
  configure(consumer: import("@nestjs/common").MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware, TimingMiddleware).forRoutes('*');
  }
}

