import { hash, compare } from 'bcrypt';

export function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;

  return hash(password, saltRounds);
}

export function comparePasswords(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return compare(plainPassword, hashedPassword);
}
