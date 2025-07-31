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
import organizationUserInvite from './templates/organization-user-invite';
import { Language } from '@/utils/language';

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
    organizationUserInvite,
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
    options: {
      name: string;
      token: string;
      language: Language;
    },
  ): Promise<void> {
    const config = this.configService.get('config') as Configuration;
    const verificationUrl = `${config.baseUrl}/verify-email?token=${options.token}`;
    const template = this.templates.verification;
    const html = template({
      language: options.language,
      subject: translations[options.language].emailVerification.subject,
      user: {
        name: options.name,
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

    await this.strategy.send(
      to,
      translations[options.language].emailVerification.subject,
      html,
    );
  }

  async sendPasswordResetEmail(
    to: string,
    options: {
      name: string;
      token: string;
      language: Language;
    },
  ): Promise<void> {
    const config = this.configService.get('config') as Configuration;
    const resetUrl = `${config.baseUrl}/reset-password?token=${options.token}`;
    const template = this.templates.passwordReset;

    const html = template({
      language: options.language || 'en',
      subject: translations[options.language || 'en'].passwordReset.subject,
      user: {
        name: options.name,
      },
      resetUrl,
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

    await this.strategy.send(
      to,
      translations[options.language].passwordReset.subject,
      html,
    );
  }

  async sendWelcomeEmail(
    to: string,
    options: {
      name: string;
      language: string;
    },
  ): Promise<void> {
    const config = this.configService.get('config') as Configuration;
    const template = this.templates.welcome;
    const html = template({
      language: options.language,
      subject:
        translations[options.language].welcome?.subject ||
        'Welcome to ProMeets',
      user: {
        name: options.name,
      },
      currentYear: new Date().getFullYear(),
      config: {
        baseUrl: config.baseUrl,
        socialLinks: {
          twitter: 'https://twitter.com/promeets',
          linkedin: 'https://linkedin.com/company/promeets',
          facebook: 'https://facebook.com/promeets',
        },
      },
    });

    await this.strategy.send(
      to,
      translations[options.language].welcome?.subject || 'Welcome to ProMeets',
      html,
    );
  }

  async sendOrganizationInviteEmail(
    to: string,
    options: {
      userName: string;
      inviterName: string;
      organizationName: string;
      role: string;
      token: string;
      existingAccount: boolean;
      language: Language;
    },
  ): Promise<void> {
    const config = this.configService.get('config') as Configuration;
    const acceptUrl = `${config.baseUrl}/accept-invite?token=${options.token}`;
    const template = this.templates.organizationUserInvite;

    const html = template({
      language: options.language,
      subject: translations[options.language].organizationInvite.subject,
      user: {
        name: options.userName,
      },
      inviter: {
        name: options.inviterName,
      },
      organization: {
        name: options.organizationName,
      },
      role: options.role,
      acceptUrl,
      existingAccount: options.existingAccount,
      currentYear: new Date().getFullYear(),
      config: {
        socialLinks: {
          twitter: 'https://twitter.com/promeets',
          linkedin: 'https://linkedin.com/company/promeets',
          facebook: 'https://facebook.com/promeets',
        },
      },
    });

    await this.strategy.send(
      to,
      translations[options.language].organizationInvite.subject,
      html,
    );
  }

  async sendCustomEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    await this.strategy.send(to, subject, html);
  }
}
