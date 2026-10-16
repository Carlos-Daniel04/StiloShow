import { NextResponse } from "next/server";
import { hashPassword, createSession } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const nombre = text(body.nombre);
    const apellido = text(body.apellido);
    const email = text(body.email).toLowerCase();
    const telefono = text(body.telefono);
    const password = typeof body.password === "string" ? body.password : "";

    if (!nombre || !apellido || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Completa los datos obligatorios con un formato válido." }, { status: 400 });
    }
    if (password.length < 12) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 12 caracteres." }, { status: 400 });
    }
    if (nombre.length > 80 || apellido.length > 80 || telefono.length > 30) {
      return NextResponse.json({ error: "Los datos ingresados exceden el tamaño permitido." }, { status: 400 });
    }
    const existing = await prisma.usuario.findUnique({ where: { email }, select: { id: true } });
    if (existing) return NextResponse.json({ error: "No se pudo crear la cuenta con esos datos." }, { status: 409 });

    const user = await prisma.usuario.create({
      data: { nombre, apellido, email, telefono: telefono || null, passwordHash: hashPassword(password), rol: "CLIENTE" },
      select: { id: true },
    });
    await createSession(user.id);
    return NextResponse.json({ redirectTo: "/cuenta" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo completar el registro. Inténtalo de nuevo." }, { status: 500 });
  }
}
