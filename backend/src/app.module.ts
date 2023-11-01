import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtAuthGuard } from './auth/guards/at-auth.guard';
import { AgenciesModule } from './agencies/agencies.module';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [PrismaModule, AuthModule ,UsersModule  ,AgenciesModule,CarsModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtAuthGuard,
    }
  ],
})
export class AppModule {}
