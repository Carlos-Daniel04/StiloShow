"use client";

import { useEffect, useState } from "react";
import type { CatalogEmployee } from "@/lib/catalog";

export default function EmployeePreview() {
  const [employees, setEmployees] = useState<CatalogEmployee[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/catalogo")
      .then(async (response) => {
        if (!response.ok) throw new Error("barberos");
        return response.json() as Promise<{ employees: CatalogEmployee[] }>;
      })
      .then((catalog) => setEmployees(catalog.employees))
      .catch(() => setError(true));
  }, []);

  if (error) return <p className="catalog-status">No se pudo cargar el equipo.</p>;
  if (!employees) return <p className="catalog-status">Cargando barberos...</p>;
  if (employees.length === 0) return <p className="catalog-status">No hay barberos disponibles por el momento.</p>;

  return (
    <div className="barbers-grid">
      {employees.slice(0, 3).map((employee, index) => (
        <article className="barber-card" key={employee.id}>
          <div className={`barber-portrait portrait-${(index % 3) + 1}`} aria-label={`Retrato ilustrativo de ${employee.nombre} ${employee.apellido}`}>
            <span>{employee.nombre[0]}{employee.apellido[0]}</span>
          </div>
          <div className="barber-info">
            <h3>{employee.nombre} {employee.apellido}</h3>
            <p>{employee.especialidad}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
