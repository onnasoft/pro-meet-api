// src/services/email/strategies/console.strategy.ts
import { EmailStrategy } from './email-strategy.interface';

export class ConsoleEmailStrategy implements EmailStrategy {
  async send(to: string, subject: string, html: string): Promise<void> {
    console.log('Sending email to:', to);
    console.log('Subject:', subject);
    console.log('HTML:', html);
  }
}
