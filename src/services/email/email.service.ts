// src/services/email/email.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { createEmailStrategy } from './email-strategy.factory';
import { EmailStrategy } from './strategies/email-strategy.interface';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@/types/configuration';
import verification from './templates/verification';
import passwordReset from './templates/password-reset';
import welcome from './templates/welcome';
import Handlebars from 'handlebars';
import translations from './translations';

Handlebars.registerHelper('translate', function (key, options) {
  const language = options.data.root.language || 'en';
  let value = translations[language];

  key.split('.').forEach((k) => {
    value = value ? value[k] : null;
  });

  // Reemplazar variables
  if (value && options.hash) {
    Object.keys(options.hash).forEach((k) => {
      value = value.replace(new RegExp(`{{${k}}}`, 'g'), options.hash[k]);
    });
  }

  return value || key;
});

@Injectable()
export class EmailService {
  private readonly strategy: EmailStrategy;
  private readonly templates = {
    verification,
    passwordReset,
    welcome,
  };

  constructor(@Inject() private readonly configService: ConfigService) {
    const config = this.configService.get('config') as Configuration;
    this.strategy = createEmailStrategy(config.email.strategy, {
      resendApiKey: config.email.resendApiKey,
      fromEmail: config.email.fromEmail,
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await this.strategy.send(to, subject, html);
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    token: string,
  ): Promise<void> {
    const config = this.configService.get('config') as Configuration;
    const verificationUrl = `${config.baseUrl}/verify-email?token=${token}`;
    const template = this.templates.verification;
    const html = template({
      language: 'en',
      subject: translations['en'].emailVerification.subject,
      user: {
        name: name,
      },
      verificationUrl,
      expirationHours: 24,
      currentYear: new Date().getFullYear(),
      config: {
        socialLinks: {
          twitter: 'https://twitter.com/promeets',
          linkedin: 'https://linkedin.com/company/promeets',
          facebook: 'https://facebook.com/promeets',
        },
      },
    });

    await this.strategy.send(to, 'Verify your account', html);
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const config = this.configService.get('config') as Configuration;
    const url = `${config.baseUrl}/reset-password?token=${token}`;
    const template = this.templates.passwordReset;
    const html = template({
      reset_url: url,
    });

    console.log('Sending password reset email to:', to);

    await this.strategy.send(to, 'Reset your password', html);
  }

  async sendWelcomeEmail(to: string): Promise<void> {
    const template = this.templates.welcome;
    const html = template({});

    await this.strategy.send(to, 'Welcome!', html);
  }

  async sendCustomEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    await this.strategy.send(to, subject, html);
  }
}
