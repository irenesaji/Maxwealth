import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { jwtConstants } from './constants';
import { NotificationsModule } from 'src/utils/notifications/notifications.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { EnablexModule } from 'src/utils/enablex/enablex.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { ConfigModule } from '@nestjs/config';
import { BrevoModule } from 'src/utils/brevo/brevo.module';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserOnboardingDetails]),
    UsersModule,
    NotificationsModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5d' },
    }),
    HttpModule,
    EnablexModule,
    ConfigModule,
    BrevoModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
