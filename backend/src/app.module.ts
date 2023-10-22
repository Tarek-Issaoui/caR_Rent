import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
// import { CarsModule } from './cars/cars.module';
// import { AgenciesModule } from './agencies/agencies.module';
// import { PostsModule } from './posts/posts.module';
// import { ReviewsModule } from './reviews/reviews.module';
// import { ReservationsModule } from './reservations/reservations.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtAuthGuard } from './auth/guards/at-auth.guard';
import { AgenciesModule } from './agencies/agencies.module';

@Module({
  imports: [PrismaModule, AuthModule ,UsersModule ,AgenciesModule ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtAuthGuard,
    }
  ],
})
export class AppModule {}
