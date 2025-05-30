import * as bcrypt from 'bcrypt';

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
