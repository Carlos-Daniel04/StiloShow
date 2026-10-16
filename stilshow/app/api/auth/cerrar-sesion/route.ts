import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  } catch {
    return NextResponse.json({ error: "No se pudo cerrar la sesión." }, { status: 500 });
  }
}
