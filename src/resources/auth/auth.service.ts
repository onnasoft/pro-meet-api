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
import { OauthIdTokenPayload } from '@/types/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@/types/configuration';
import { Role } from '@/types/role';
import { NotificationsService } from '../notifications/notifications.service';
import { Notification } from '@/entities/Notification';
import { I18nService } from 'nestjs-i18n';
import { GoogleUserInfo } from '@/types/google';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async session(user: User) {
    return this.usersService.findOne({
      where: { email: user.email },
    });
  }

  async register(registerDto: RegisterAuthDto, lang = 'en') {
    try {
      const existingUser = await this.usersService.findOne({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException(
          this.i18n.translate('auth.email_already_registered', { lang }),
        );
      }

      const hashedPassword = await hashPassword(registerDto.password);
      const newUser = await this.usersService.create({
        ...registerDto,
        password: hashedPassword,
      });

      const passwordResetToken = generateRandomToken();
      await this.usersService.update(newUser.id, {
        verificationToken: passwordResetToken,
        verificationTokenExpiresAt: new Date(Date.now() + 3600000 * 24),
      });

      await this.notificationsService.create(
        new Notification({
          title: await this.i18n.translate('notifications.welcome_title', {
            lang,
          }),
          userId: newUser.id,
          metadata: {
            type: 'welcome',
            message: this.i18n.translate('notifications.welcome_message', {
              lang,
            }),
          },
        }),
      );

      await this.emailService.sendVerificationEmail(
        newUser.email,
        newUser.name,
        passwordResetToken,
      );

      await this.notificationsService.create(
        new Notification({
          title: await this.i18n.translate(
            'notifications.new_registration_title',
            { lang },
          ),
          userId: newUser.id,
          metadata: {
            type: 'registration',
            message: this.i18n.translate(
              'notifications.new_registration_message',
              { lang, args: { email: newUser.email } },
            ),
          },
        }),
      );

      return {
        message: this.i18n.translate('auth.registration_success', {
          lang,
        }),
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
        this.i18n.translate('auth.registration_failed', { lang }),
      );
    }
  }

  async forgotPassword(email: string, lang = 'en') {
    try {
      const user = await this.usersService.findOne({
        where: { email },
        select: ['id', 'email', 'name'],
      });

      if (!user) {
        throw new UnauthorizedException(
          this.i18n.translate('auth.user_not_found', { lang }),
        );
      }

      const passwordResetToken = generateRandomToken();
      await this.usersService.update(user.id, {
        passwordResetToken,
        passwordResetTokenExpiresAt: new Date(Date.now() + 3600000),
      });

      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        passwordResetToken,
        lang,
      );

      await this.notificationsService.create(
        new Notification({
          title: await this.i18n.translate(
            'notifications.password_reset_title',
            { lang },
          ),
          userId: user.id,
          metadata: {
            type: 'password_reset',
            message: this.i18n.translate(
              'notifications.password_reset_message',
              { lang, args: { email: user.email } },
            ),
          },
        }),
      );

      return {
        message: this.i18n.translate('auth.password_reset_link_sent', {
          lang,
        }),
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
        this.i18n.translate('auth.password_reset_failed', { lang }),
      );
    }
  }

  async validateUser(
    email: string,
    password: string,
    lang = 'en',
  ): Promise<{
    user: Partial<User> | null;
    message?: string;
  }> {
    try {
      const user = await this.usersService.findOne({
        where: { email },
        select: ['id', 'email', 'password', 'name', 'isEmailVerified'],
      });

      if (!user) {
        throw new UnauthorizedException(
          this.i18n.translate('auth.invalid_credentials', { lang }),
        );
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          this.i18n.translate('auth.invalid_credentials', { lang }),
        );
      }

      if (!user.isEmailVerified) {
        throw new UnauthorizedException(
          this.i18n.translate('auth.email_not_verified', { lang }),
        );
      }

      await this.notificationsService.create(
        new Notification({
          title: await this.i18n.translate('notifications.user_login_title', {
            lang,
          }),
          userId: user.id,
          metadata: {
            type: 'login',
            message: this.i18n.translate('notifications.user_login_message', {
              lang,
              args: { email: user.email },
            }),
          },
        }),
      );

      return {
        user: await this.usersService.findOne({
          where: { email },
          select: ['id', 'email', 'name'],
        }),
        message: this.i18n.translate('auth.login_successful', { lang }),
      };
    } catch (error) {
      this.logger.error(
        `Error during login for email ${email}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async verifyEmail(token: string, lang = 'en') {
    try {
      const user = await this.usersService.findOne({
        where: { verificationToken: token },
        select: ['id', 'email', 'name', 'verificationTokenExpiresAt'],
      });

      if (!user) {
        throw new UnauthorizedException(
          this.i18n.translate('auth.invalid_verification_token', {
            lang,
          }),
        );
      }

      if (!user.verificationTokenExpiresAt) {
        throw new UnauthorizedException(
          this.i18n.translate('auth.verification_token_not_found', {
            lang,
          }),
        );
      }

      if (user.verificationTokenExpiresAt < new Date()) {
        throw new UnauthorizedException(
          this.i18n.translate('auth.verification_token_expired', {
            lang,
          }),
        );
      }

      await this.usersService.update(user.id, {
        isEmailVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      });

      await this.notificationsService.create(
        new Notification({
          title: await this.i18n.translate(
            'notifications.email_verified_title',
            { lang },
          ),
          userId: user.id,
          metadata: {
            type: 'email_verification',
            message: this.i18n.translate(
              'notifications.email_verified_message',
              { lang, args: { email: user.email } },
            ),
          },
        }),
      );

      await this.emailService.sendWelcomeEmail(user.email, user.name, lang);
    } catch (error) {
      this.logger.error(
        `Error during email verification with token ${token}: ${error.message}`,
      );

      if (error instanceof UnauthorizedException) {
        throw error;
      }
    }
  }

  async resendVerification(email: string, lang = 'en') {
    try {
      const user = await this.usersService.findOne({
        where: { email },
        select: ['id', 'email', 'name', 'verificationToken', 'isEmailVerified'],
      });

      if (!user) {
        throw new UnauthorizedException(
          this.i18n.translate('auth.user_not_found', { lang }),
        );
      }

      if (user.isEmailVerified) {
        throw new ConflictException(
          this.i18n.translate('auth.email_already_verified', { lang }),
        );
      }

      const verificationToken = generateRandomToken();
      await this.usersService.update(user.id, {
        verificationToken,
        verificationTokenExpiresAt: new Date(Date.now() + 3600000 * 24),
      });

      await this.emailService.sendVerificationEmail(
        user.email,
        user.name,
        verificationToken,
      );

      await this.notificationsService.create(
        new Notification({
          title: await this.i18n.translate(
            'notifications.verification_resent_title',
            { lang },
          ),
          userId: user.id,
          metadata: {
            type: 'verification',
            message: this.i18n.translate(
              'notifications.verification_resent_message',
              { lang, args: { email: user.email } },
            ),
          },
        }),
      );

      return {
        message: this.i18n.translate('auth.verification_email_resent', {
          lang,
        }),
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
        this.i18n.translate('auth.verification_resend_failed', { lang }),
      );
    }
  }

  async resetPassword(token: string, newPassword: string, lang = 'en') {
    try {
      const user = await this.usersService.findOne({
        where: { passwordResetToken: token },
        select: ['id', 'email', 'name', 'passwordResetTokenExpiresAt'],
      });

      if (!user) {
        throw new UnauthorizedException(
          this.i18n.translate('auth.invalid_reset_token', { lang }),
        );
      }

      if (!user.passwordResetTokenExpiresAt) {
        throw new UnauthorizedException(
          this.i18n.translate('auth.reset_token_not_found', { lang }),
        );
      }

      if (user.passwordResetTokenExpiresAt < new Date()) {
        throw new UnauthorizedException(
          this.i18n.translate('auth.reset_token_expired', { lang }),
        );
      }

      const hashedPassword = await hashPassword(newPassword);
      await this.usersService.update(user.id, {
        password: hashedPassword,
        isEmailVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
        passwordResetToken: null,
        passwordResetTokenExpiresAt: null,
      });

      await this.notificationsService.create(
        new Notification({
          title: this.i18n.translate('notifications.password_reset_title', {
            lang,
          }),
          userId: user.id,
          metadata: {
            type: 'password_reset',
            message: this.i18n.translate(
              'notifications.password_reset_message',
              { lang, args: { email: user.email } },
            ),
          },
        }),
      );

      return {
        message: this.i18n.translate('auth.password_reset_success', {
          lang,
        }),
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
        this.i18n.translate('auth.password_reset_failed', { lang }),
      );
    }
  }

  async login(user: User, rememberMe: boolean = false) {
    const luser = await this.usersService.findOne({
      where: { email: user.email },
      select: ['id', 'email', 'role'],
    });

    const payload = {
      email: user.email,
      sub: user.id,
      role: luser?.role || Role.User,
      rememberMe: rememberMe,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: rememberMe ? '30d' : '1h',
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: rememberMe ? '90d' : '30d',
    });

    return { access_token, refresh_token };
  }

  refreshToken(user: User, rememberMe: boolean = false) {
    const payload = { email: user.email, sub: user.id, role: Role.User };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: rememberMe ? '30d' : '1h',
    });

    return {
      access_token: accessToken,
    };
  }

  async verifyToken(token: string) {
    const config = this.configService.get('config') as Configuration;
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: config.secret,
      });
      return decoded;
    } catch (error) {
      this.logger.error(
        `Token verification failed: ${error.message}`,
        error.stack,
      );
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async OAuthGoogleLogin(token: string) {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userInfo: GoogleUserInfo = await res.json();

    const user = await this.usersService.findOne({
      where: { email: userInfo.email },
      select: ['id', 'email', 'name', 'isEmailVerified'],
    });

    if (!user) {
      const newUser = await this.usersService.create({
        email: userInfo.email,
        name: userInfo.name,
        password: await hashPassword(generateRandomToken()),
        isEmailVerified: true,
      });

      await this.notificationsService.create(
        new Notification({
          title: 'OAuth Google Login',
          userId: newUser.id,
          metadata: {
            type: 'oauth_login',
            message: `User registered via OAuth Google with email: ${newUser.email}`,
          },
        }),
      );

      return this.login(newUser);
    }

    if (!user.isEmailVerified) {
      await this.usersService.update(user.id, {
        isEmailVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      });
    }

    return this.login(user);
  }

  async OAuthLogin(token: string) {
    try {
      const decoded: OauthIdTokenPayload = await this.verifyToken(token);

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

      await this.notificationsService.create(
        new Notification({
          title: 'OAuth Login',
          userId: user.id,
          metadata: {
            type: 'oauth_login',
            message: `User logged in via OAuth with email: ${user.email}`,
          },
        }),
      );

      return this.refreshToken(user);
    } catch (error) {
      this.logger.error(
        `Error during OAuth login with token ${token}: ${error.message}`,
        error.stack,
      );

      if (
        error instanceof UnauthorizedException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'OAuth login failed. Please try again later.',
      );
    }
  }
}
