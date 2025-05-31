// src/services/email/strategies/resend.strategy.ts
import { Resend } from 'resend';
import { EmailStrategy } from './email-strategy.interface';

export class ResendEmailStrategy implements EmailStrategy {
  private readonly resendClient: Resend;

  constructor(
    private readonly apiKey: string,
    private readonly fromEmail: string,
  ) {
    this.resendClient = new Resend(this.apiKey);
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    await this.resendClient.emails.send({
      from: this.fromEmail,
      to,
      subject,
      html,
    });
  }
}
