import { SetMetadata } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

const saltRounds = 10; // Coste del procesamiento (10-12 es buen balance entre seguridad y rendimiento)

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

export function generateRandomToken(): string {
  return randomBytes(32).toString('hex');
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
