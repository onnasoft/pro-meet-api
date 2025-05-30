import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '@/entities/User';
import { comparePassword, hashPassword } from '@/utils/secure';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterAuthDto) {
    try {
      const existingUser = await this.usersService.findOne({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already registered');
      }

      const hashedPassword = await hashPassword(registerDto.password);
      const newUser = await this.usersService.create({
        ...registerDto,
        password: hashedPassword,
      });

      return this.login(newUser);
    } catch (error) {
      this.logger.error(
        `Error during registration: ${error.message}`,
        error.stack,
      );

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Registration failed. Please try again later.',
      );
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findOne({
        where: { email },
        select: ['id', 'email', 'password', 'name'],
      });

      if (!user) {
        return null;
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      return {
        user: await this.usersService.findOne({
          where: { email },
          select: ['id', 'email', 'name'],
        }),
        message: 'Login successful',
      };
    } catch (error) {
      this.logger.error(
        `Error during login for email ${email}: ${error.message}`,
        error.stack,
      );

      if (error instanceof UnauthorizedException) {
        throw error;
      }
    }

    return null;
  }

  login(user: User) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
