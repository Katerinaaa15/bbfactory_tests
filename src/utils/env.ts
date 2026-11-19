import dotenv from 'dotenv';

dotenv.config();

/** Reads a required environment variable (credentials live in .env). */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name} (set it in .env)`);
  return value;
}
