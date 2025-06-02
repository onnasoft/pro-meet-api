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
import {
  comparePassword,
  generateRandomToken,
  hashPassword,
} from '@/utils/secure';
import { UsersService } from '@/resources/users/users.service';
import { EmailService } from '@/services/email/email.service';
import { GoogleIdTokenPayload } from '@/types/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@/types/configuration';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
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

      const passwordResetToken = generateRandomToken();
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

      const passwordResetToken = generateRandomToken();
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
        select: ['id', 'email', 'password', 'name', 'isEmailVerified'],
      });

      if (!user) {
        return null;
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      if (!user.isEmailVerified) {
        throw new UnauthorizedException('Email not verified');
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

  async verifyEmail(token: string) {
    try {
      const user = await this.usersService.findOne({
        where: { verificationToken: token },
        select: ['id', 'email', 'name', 'verificationTokenExpiresAt'],
      });

      if (!user) {
        throw new UnauthorizedException('Invalid verification token');
      }

      if (!user.verificationTokenExpiresAt) {
        throw new UnauthorizedException('Verification token not found');
      }

      if (user.verificationTokenExpiresAt < new Date()) {
        throw new UnauthorizedException('Verification token expired');
      }

      this.usersService.update(user.id, {
        isEmailVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      });

      await this.emailService.sendWelcomeEmail(user.email);
    } catch (error) {
      this.logger.error(
        `Error during email verification with token ${token}: ${error.message}`,
      );

      if (error instanceof UnauthorizedException) {
        throw error;
      }
    }
  }

  async resendVerification(email: string) {
    try {
      const user = await this.usersService.findOne({
        where: { email },
        select: ['id', 'email', 'name', 'verificationToken'],
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user.isEmailVerified) {
        throw new ConflictException('Email already verified');
      }

      const verificationToken = generateRandomToken();
      this.usersService.update(user.id, {
        verificationToken,
        verificationTokenExpiresAt: new Date(Date.now() + 3600000 * 24),
      });

      await this.emailService.sendVerificationEmail(
        user.email,
        user.name,
        verificationToken,
      );

      return {
        message: 'Verification email resent successfully',
      };
    } catch (error) {
      this.logger.error(
        `Error during resend verification for email ${email}: ${error.message}`,
        error.stack,
      );

      if (
        error instanceof UnauthorizedException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to resend verification email. Please try again later.',
      );
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const user = await this.usersService.findOne({
        where: { passwordResetToken: token },
        select: ['id', 'email', 'name', 'passwordResetTokenExpiresAt'],
      });

      if (!user) {
        throw new UnauthorizedException('Invalid reset token');
      }

      if (!user.passwordResetTokenExpiresAt) {
        throw new UnauthorizedException('Reset token not found');
      }

      if (user.passwordResetTokenExpiresAt < new Date()) {
        throw new UnauthorizedException('Reset token expired');
      }

      const hashedPassword = await hashPassword(newPassword);
      this.usersService.update(user.id, {
        password: hashedPassword,
        isEmailVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
        passwordResetToken: null,
        passwordResetTokenExpiresAt: null,
      });

      return {
        message: 'Password successfully reset',
      };
    } catch (error) {
      this.logger.error(
        `Error during password reset with token ${token}: ${error.message}`,
        error.stack,
      );

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to reset password. Please try again later.',
      );
    }
  }

  login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginWithGoogle(token: string) {
    const config = this.configService.get('config') as Configuration;
    if (
      !(await this.jwtService.verifyAsync(token, {
        secret: config.secret,
      }))
    ) {
      throw new UnauthorizedException('Invalid Google token');
    }
    const decoded: GoogleIdTokenPayload = this.jwtService.decode(token);

    if (!decoded || !decoded.email) {
      throw new UnauthorizedException('Invalid Google token payload');
    }

    let user = await this.usersService.findOne({
      where: { email: decoded.email },
      select: ['id', 'email', 'name', 'isEmailVerified'],
    });

    if (!user) {
      user = await this.usersService.create({
        email: decoded.email,
        name: decoded.name,
        password: await hashPassword(generateRandomToken()),
        isEmailVerified: true,
      });
    } else if (!user.isEmailVerified) {
      throw new ConflictException('Email not verified');
    }

    return this.login(user);
  }
}
