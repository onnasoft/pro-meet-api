import { JwtService } from '@nestjs/jwt';
import { User } from '@/entities/User';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { comparePassword, hashPassword } from '@/utils/secure';
import { UsersService } from '@/resources/users/users.service';
import { EmailService } from '@/services/email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly emailService: EmailService,
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

      const passwordResetToken = Math.random().toString(36).substring(2, 15);
      this.usersService.update(newUser.id, {
        verificationToken: passwordResetToken,
        verificationTokenExpiresAt: new Date(Date.now() + 3600000 * 24),
      });

      await this.emailService.sendVerificationEmail(
        newUser.email,
        newUser.name,
        passwordResetToken,
      );

      return {
        message:
          'Registration successful. Please check your email to verify your account.',
      };
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

  async forgotPassword(email: string) {
    try {
      const user = await this.usersService.findOne({
        where: { email },
        select: ['id', 'email', 'name'],
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const passwordResetToken = Math.random().toString(36).substring(2, 15);
      this.usersService.update(user.id, {
        passwordResetToken: passwordResetToken,
        passwordResetTokenExpiresAt: new Date(Date.now() + 3600000),
      });

      await this.emailService.sendPasswordResetEmail(
        user.email,
        passwordResetToken,
      );

      // Here you would typically send a reset password email
      // For simplicity, we just return the user data
      return {
        message: 'Password reset link sent to your email',
        user,
      };
    } catch (error) {
      this.logger.error(
        `Error during forgot password for email ${email}: ${error.message}`,
        error.stack,
      );

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to process forgot password request. Please try again later.',
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
