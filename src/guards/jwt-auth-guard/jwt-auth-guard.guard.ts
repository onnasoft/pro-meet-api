import { IS_PUBLIC_KEY } from '@/utils/secure';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const canActivate = super.canActivate(context);
    if (canActivate instanceof Promise) {
      return canActivate
        .then((result) => result || isPublic)
        .catch((error) => {
          if (error instanceof UnauthorizedException) {
            return isPublic;
          }
          throw error;
        });
    }

    return canActivate || isPublic;
  }
}
