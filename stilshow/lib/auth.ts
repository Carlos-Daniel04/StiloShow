import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";

export const SESSION_COOKIE = "stilshow_session";
const SESSION_DAYS = 7;

export type AuthUser = {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: "CLIENTE" | "EMPLEADO" | "ADMINISTRADOR";
};

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;
  const derivedKey = scryptSync(password, salt, 64);
  const storedKey = Buffer.from(key, "hex");
  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const prisma = getPrisma();
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.sesion.create({
    data: { usuarioId: userId, tokenHash: hashToken(token), expiraEn: expires },
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires,
    path: "/",
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const prisma = getPrisma();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.sesion.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { usuario: true },
  });
  if (!session || session.expiraEn <= new Date() || !session.usuario.activo) return null;
  return session.usuario;
}

export async function destroySession() {
  const prisma = getPrisma();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await prisma.sesion.deleteMany({ where: { tokenHash: hashToken(token) } });
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireUser(roles?: AuthUser["rol"][]) {
  const user = await getCurrentUser();
  if (!user) redirect("/iniciar-sesion");
  if (roles && !roles.includes(user.rol)) redirect(homeForRole(user.rol));
  return user;
}

export function homeForRole(role: AuthUser["rol"]) {
  return role === "ADMINISTRADOR" ? "/admin" : role === "EMPLEADO" ? "/empleado" : "/cuenta";
}
