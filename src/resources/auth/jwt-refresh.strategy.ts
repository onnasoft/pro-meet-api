import { Configuration } from '@/types/configuration';
import { JWTPayload } from '@/types/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    const config = configService.get('config') as Configuration;
    if (!config) {
      throw new Error('Configuration not found');
    }

    const jwtSecret = config.secret;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => req?.cookies?.accessToken || null,
      ]),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JWTPayload) {
    if (!payload.refresh) {
      return false;
    }
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      rememberMe: payload.rememberMe,
    };
  }
}
