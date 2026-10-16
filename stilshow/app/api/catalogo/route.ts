import { NextResponse } from "next/server";
import { getActiveEmployees, getActiveServices } from "@/lib/catalog";

export async function GET() {
  try {
    const [services, employees] = await Promise.all([getActiveServices(), getActiveEmployees()]);
    return NextResponse.json({ services, employees });
  } catch {
    return NextResponse.json(
      { error: "No se pudo cargar el catálogo. Inténtalo de nuevo más tarde." },
      { status: 500 },
    );
  }
}
