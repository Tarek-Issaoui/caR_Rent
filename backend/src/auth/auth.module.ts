import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AtStrategy } from './strategies/at.startegy';
import { RtStrategy } from './strategies/rt.startegy';

@Module({
  imports :[
    PassportModule,
    JwtModule.register({
      secret: process.env.jwt_secret,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AtStrategy,
    RtStrategy,
    AuthService,
],
  exports: [PassportModule],
})
export class AuthModule {}
