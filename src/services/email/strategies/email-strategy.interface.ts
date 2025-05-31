// src/services/email/strategies/email-strategy.interface.ts
export interface EmailStrategy {
  send(to: string, subject: string, html: string): Promise<void>;
}
