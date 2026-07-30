/**
 * TEMPORARY admin authentication implementation.
 *
 * Replace this entire module with JWT-based auth backed by the database
 * when moving to production. The rest of the admin code imports only
 * `ADMIN_TOKEN_COOKIE` and `isValidAdminToken`, so swapping this file
 * is the only change needed.
 */

export const ADMIN_TOKEN_COOKIE = "zyventa_admin_token";

const ADMIN_TOKEN_VALUE = "zyventa-admin-v1-authenticated";

const ADMIN_CREDENTIALS = {
  email: "umardelvi@gmail.com",
  password: "123456",
} as const;

export function isValidAdminCredentials(email: string, password: string): boolean {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
}

export function isValidAdminToken(token: string | undefined): boolean {
  return token === ADMIN_TOKEN_VALUE;
}

export { ADMIN_TOKEN_VALUE };
