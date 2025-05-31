import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { EmailService } from '@/services/email/email.service';

@Module({
  controllers: [AuthController],
  imports: [UsersModule, PassportModule.register({ defaultStrategy: 'local' })],
  providers: [AuthService, LocalStrategy, EmailService],
})
export class AuthModule {}
