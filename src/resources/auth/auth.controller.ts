import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@/entities/User';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ForgotPasswordAuthDto } from './dto/forgot-password-auth.dto';
import { Public } from '@/utils/secure';
import { I18nLang } from 'nestjs-i18n';
import { ResendVerificationAuthDto } from './dto/resend-verification-auth.dto';
import { OAuthAuthDto } from './dto/oauth-auth.dto';
import { Language } from '@/utils/language';
import { Role } from '@/types/role';
import { jwtDecode } from 'jwt-decode';
import { JWTPayload } from '@/types/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  async register(
    @Body() registerDto: RegisterAuthDto,
    @I18nLang() lang: Language = 'en',
  ) {
    return this.authService.register(registerDto, lang);
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(
    @Req() req: Request & { user: User },
    @Body() payload: LoginAuthDto,
  ) {
    return this.authService.login(req.user, payload.rememberMe);
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('/refresh-token')
  refresh(@Req() req: Request & { user: User }) {
    const rawToken =
      (req.headers as any)?.authorization?.replace('Bearer ', '') || '';

    const decoded = jwtDecode(rawToken) as JWTPayload;

    return this.authService.refreshToken(req.user, decoded.rememberMe);
  }

  @Public()
  @Post('/oauth/login')
  OAuthLogin(@Body() payload: OAuthAuthDto) {
    return this.authService.OAuthLogin(payload.token);
  }

  @Public()
  @Post('/oauth/google')
  OAuthGoogleLogin(@Body() payload: OAuthAuthDto) {
    return this.authService.OAuthGoogleLogin(payload.token);
  }

  @Public()
  @Post('/forgot-password')
  async forgotPassword(
    @Body() payload: ForgotPasswordAuthDto,
    @I18nLang() lang: Language = 'en',
  ) {
    return this.authService.forgotPassword(payload.email, lang);
  }

  @Public()
  @Post('/verify-email')
  async verifyEmail(@Body('token') token: string, @I18nLang() lang: string) {
    await this.authService.verifyEmail(token, lang);

    return {
      message: 'Email successfully verified',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Post('/resend-verification')
  async resendVerification(
    @Body() payload: ResendVerificationAuthDto,
    @I18nLang() lang: Language = 'en',
  ) {
    await this.authService.resendVerification(payload.email, lang);

    return {
      message: 'Verification email resent successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Post('/reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
    @I18nLang() lang: string,
  ) {
    await this.authService.resetPassword(token, newPassword, lang);

    return {
      message: 'Password successfully reset',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }

  @SetMetadata('roles', [Role.User, Role.Admin])
  @Get('/session')
  async me(@Req() req: Request & { user: User }) {
    return this.authService.session(req.user);
  }
}
