import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  register(registerAuthDto: RegisterAuthDto) {
    return registerAuthDto;
  }
}
