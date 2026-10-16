import Link from "next/link";
import { connection } from "next/server";
import { Clock3 } from "lucide-react";
import { getActiveServices } from "@/lib/catalog";

export const instant = false;

export default async function ServiciosPage() {
  await connection();
  const services = await getActiveServices();
  return (
    <main className="catalog-page">
      <div className="content-width catalog-content">
        <Link className="catalog-brand" href="/">StiloShow</Link>
        <p className="eyebrow"><span /> Catálogo</p>
        <h1>Servicios para<br /><em>tu estilo.</em></h1>
        <p className="catalog-intro">Elige el servicio que mejor se adapta a ti. Todos los precios y duraciones están actualizados.</p>
        {services.length === 0 ? (
          <p className="catalog-empty">No hay servicios activos disponibles en este momento.</p>
        ) : (
          <div className="catalog-grid">
            {services.map((service) => (
              <article className="catalog-card" key={service.id}>
                <p className="catalog-card-label">Servicio StiloShow</p>
                <h2>{service.nombre}</h2>
                <p>{service.descripcion}</p>
                <div className="catalog-card-meta">
                  <span><Clock3 size={16} /> {service.duracionMinutos} min</span>
                  <strong>RD${service.precio}</strong>
                </div>
                <Link className="button button-primary" href="/iniciar-sesion">Seleccionar servicio</Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
