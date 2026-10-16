import { NextResponse } from "next/server";
import { createSession, homeForRole, verifyPassword } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user || !user.activo || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "El correo o la contraseña no son correctos." }, { status: 401 });
    }
    await createSession(user.id);
    return NextResponse.json({ redirectTo: homeForRole(user.rol) });
  } catch {
    return NextResponse.json({ error: "No se pudo iniciar sesión. Inténtalo de nuevo." }, { status: 500 });
  }
}
