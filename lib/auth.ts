import { createHmac } from "crypto";

export const SESSION_COOKIE = "prosonus_admin_session";

// Salt fijo — cambiarlo invalida todas las sesiones activas
const HMAC_SALT = "prosonus-admin-v1";

/**
 * Computa el token de sesión esperado a partir de las credenciales en env.
 * Solo disponible en Node.js runtime (server actions, API routes).
 */
export function computeSessionToken(): string {
  const user = process.env.ADMIN_USER ?? "";
  const pass = process.env.ADMIN_PASS ?? "";
  return createHmac("sha256", HMAC_SALT)
    .update(`${user}:${pass}`)
    .digest("hex");
}

/**
 * Valida usuario y contraseña contra las variables de entorno.
 */
export function verifyCredentials(user: string, pass: string): boolean {
  const envUser = process.env.ADMIN_USER ?? "";
  const envPass = process.env.ADMIN_PASS ?? "";
  // Comparación constante para evitar timing attacks
  return user === envUser && pass === envPass;
}
