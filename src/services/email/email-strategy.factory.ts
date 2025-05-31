// src/services/email/email-strategy.factory.ts
import { EmailStrategy } from './strategies/email-strategy.interface';
import { ConsoleEmailStrategy } from './strategies/console.strategy';
import { ResendEmailStrategy } from './strategies/resend.strategy';

export function createEmailStrategy(
  strategy: string = 'console',
  options?: { resendApiKey?: string; fromEmail?: string },
): EmailStrategy {
  switch (strategy) {
    case 'resend':
      return new ResendEmailStrategy(
        options?.resendApiKey || '',
        options?.fromEmail || '',
      );
    case 'console':
    default:
      return new ConsoleEmailStrategy();
  }
}
