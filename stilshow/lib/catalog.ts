import { getPrisma } from "@/lib/prisma";

export type CatalogService = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  duracionMinutos: number;
};

export type CatalogEmployee = {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  disponibilidad: string;
  diasDisponibles: string[];
};

const dayNames: Record<string, string> = {
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
};

export async function getActiveServices(): Promise<CatalogService[]> {
  const services = await getPrisma().servicio.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true, descripcion: true, precio: true, duracionMinutos: true },
  });

  return services.map((service) => ({
    ...service,
    precio: service.precio.toFixed(2),
  }));
}

export async function getActiveEmployees(): Promise<CatalogEmployee[]> {
  const employees = await getPrisma().perfilEmpleado.findMany({
    where: {
      usuario: { activo: true, rol: "EMPLEADO" },
      horarios: { some: { activo: true } },
    },
    orderBy: { usuario: { nombre: "asc" } },
    select: {
      id: true,
      especialidad: true,
      usuario: { select: { nombre: true, apellido: true } },
      horarios: { where: { activo: true }, select: { diaSemana: true } },
    },
  });

  return employees.map((employee) => {
    const days = [...new Set(employee.horarios.map((schedule) => dayNames[schedule.diaSemana]))];
    return {
      id: employee.id,
      nombre: employee.usuario.nombre,
      apellido: employee.usuario.apellido,
      especialidad: employee.especialidad,
      disponibilidad: days.length ? `Disponible ${days.join(", ")}` : "Disponibilidad por confirmar",
      diasDisponibles: days,
    };
  });
}
