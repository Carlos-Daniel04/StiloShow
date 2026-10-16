import Link from "next/link";
import { connection } from "next/server";
import { getActiveEmployees } from "@/lib/catalog";

export const instant = false;

export default async function BarberosPage() {
  await connection();
  const employees = await getActiveEmployees();
  return (
    <main className="catalog-page">
      <div className="content-width catalog-content">
        <Link className="catalog-brand" href="/">StiloShow</Link>
        <p className="eyebrow"><span /> Nuestro equipo</p>
        <h1>Barberos con<br /><em>carácter.</em></h1>
        <p className="catalog-intro">Conoce a los profesionales activos de StiloShow y sus días generales de atención.</p>
        {employees.length === 0 ? (
          <p className="catalog-empty">No hay barberos activos disponibles en este momento.</p>
        ) : (
          <div className="catalog-grid employee-grid">
            {employees.map((employee, index) => (
              <article className="catalog-card employee-card" key={employee.id}>
                <div className={`barber-portrait portrait-${(index % 3) + 1}`}><span>{employee.nombre[0]}{employee.apellido[0]}</span></div>
                <p className="catalog-card-label">Barbero activo</p>
                <h2>{employee.nombre} {employee.apellido}</h2>
                <p>{employee.especialidad}</p>
                <strong className="employee-availability">{employee.disponibilidad}</strong>
                <Link className="button button-primary" href="/iniciar-sesion">Seleccionar barbero</Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
