import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '@/services/email/email.module';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    EmailModule,
    NotificationsModule,
    PassportModule.register({ defaultStrategy: 'local' }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
