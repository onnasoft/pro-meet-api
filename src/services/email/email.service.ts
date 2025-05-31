// src/services/email/email.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { createEmailStrategy } from './email-strategy.factory';
import { EmailStrategy } from './strategies/email-strategy.interface';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@/types/configuration';
import Handlebars from 'handlebars';
import * as fs from 'fs';

@Injectable()
export class EmailService {
  private readonly strategy: EmailStrategy;
  private readonly templates: {
    verification: Handlebars.TemplateDelegate;
    passwordReset: Handlebars.TemplateDelegate;
    welcome: Handlebars.TemplateDelegate;
  };

  constructor(@Inject() private readonly configService: ConfigService) {
    const config = this.configService.get('config') as Configuration;
    this.strategy = createEmailStrategy(config.email.strategy, {
      resendApiKey: config.email.resendApiKey,
      fromEmail: config.email.fromEmail,
    });

    const templates = {
      verification: fs.readFileSync(
        'src/services/email/templates/verification.html',
        'utf-8',
      ),
      passwordReset: fs.readFileSync(
        'src/services/email/templates/password-reset.html',
        'utf-8',
      ),
      welcome: fs.readFileSync(
        'src/services/email/templates/welcome.html',
        'utf-8',
      ),
    };
    this.templates = {
      verification: Handlebars.compile(templates.verification),
      passwordReset: Handlebars.compile(templates.passwordReset),
      welcome: Handlebars.compile(templates.welcome),
    };
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    token: string,
  ): Promise<void> {
    const config = this.configService.get('config') as Configuration;
    const url = `${config.baseUrl}/verify-email?token=${token}`;
    const template = this.templates.verification;
    const html = template({
      verification_url: url,
      user_name: name,
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
