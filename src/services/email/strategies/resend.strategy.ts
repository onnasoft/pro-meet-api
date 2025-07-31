// src/services/email/strategies/resend.strategy.ts
import { Resend } from 'resend';
import { EmailStrategy } from './email-strategy.interface';
import { InternalServerErrorException } from '@nestjs/common';

export class ResendEmailStrategy implements EmailStrategy {
  private readonly resendClient: Resend;

  constructor(
    private readonly apiKey: string,
    private readonly fromEmail: string,
  ) {
    this.resendClient = new Resend(this.apiKey);
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    const response = await this.resendClient.emails.send({
      from: this.fromEmail,
      to,
      subject,
      html,
    });

    if (response.error) {
      throw new InternalServerErrorException(
        response.error.message || 'Failed to send email',
      );
    }
  }
}
