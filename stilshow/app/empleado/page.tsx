import { requireUser } from "@/lib/auth";
import { connection } from "next/server";

export const instant = false;

export default async function EmpleadoPage() {
  await connection();
  const user = await requireUser(["EMPLEADO"]);
  return (
    <main className="private-page">
      <div className="private-card">
        <p className="eyebrow"><span /> Panel de empleado</p>
        <h1>Hola, {user.nombre}</h1>
        <p>Tu agenda y las citas asignadas estarán disponibles aquí en la siguiente fase.</p>
        <form action="/api/auth/cerrar-sesion" method="post">
          <button className="button button-primary" type="submit">Cerrar sesión</button>
        </form>
      </div>
    </main>
  );
}
