import { requireUser } from "@/lib/auth";
import { connection } from "next/server";

export const instant = false;

export default async function CuentaPage() {
  await connection();
  const user = await requireUser(["CLIENTE"]);
  return (
    <main className="private-page">
      <div className="private-card">
        <p className="eyebrow"><span /> Área privada</p>
        <h1>Hola, {user.nombre}</h1>
        <p>Tu cuenta de cliente está lista. Aquí podrás gestionar tus citas cuando el módulo de reservas esté disponible.</p>
        <form action="/api/auth/cerrar-sesion" method="post"><button className="button button-primary">Cerrar sesión</button></form>
      </div>
    </main>
  );
}
