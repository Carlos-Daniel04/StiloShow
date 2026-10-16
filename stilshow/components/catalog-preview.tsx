"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Clock3, Scissors, ShieldCheck, Sparkles } from "lucide-react";
import type { CatalogEmployee, CatalogService } from "@/lib/catalog";

type CatalogResponse = { services: CatalogService[]; employees: CatalogEmployee[] };
const icons = [Scissors, Sparkles, ShieldCheck];

export default function CatalogPreview() {
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/catalogo")
      .then(async (response) => {
        if (!response.ok) throw new Error("catalogo");
        return response.json() as Promise<CatalogResponse>;
      })
      .then(setCatalog)
      .catch(() => setError(true));
  }, []);

  if (error) return <p className="catalog-status">No se pudo cargar el catálogo.</p>;
  if (!catalog) return <p className="catalog-status">Cargando servicios y barberos...</p>;

  return (
    <>
      <div className="services-grid">
        {catalog.services.length === 0 ? (
          <p className="catalog-status">No hay servicios disponibles por el momento.</p>
        ) : (
          catalog.services.slice(0, 3).map((service, index) => {
            const Icon = icons[index % icons.length];
            return (
              <article className={`service-card ${index === 1 ? "service-card-featured" : ""}`} key={service.id}>
                <div className="service-icon"><Icon size={23} strokeWidth={1.6} /></div>
                <p className="service-number">0{index + 1}</p>
                <h3>{service.nombre}</h3>
                <p className="service-description">{service.descripcion}</p>
                <div className="service-meta">
                  <span><Clock3 size={15} /> {service.duracionMinutos} min</span>
                  <strong>RD${service.precio}</strong>
                </div>
                <a href="/iniciar-sesion" aria-label={`Reservar ${service.nombre}`}>
                  Consultar disponibilidad <ArrowRight size={16} />
                </a>
              </article>
            );
          })
        )}
      </div>
      {catalog.services.length > 3 && <a className="catalog-more-link" href="/servicios">Ver todos los servicios <ArrowRight size={16} /></a>}
    </>
  );
}
