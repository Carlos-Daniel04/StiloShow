import { randomBytes, scryptSync } from "node:crypto";
import prismaPackage from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = prismaPackage;

const adminPassword = process.env.STILOSHOW_SEED_ADMIN_PASSWORD;
if (!adminPassword || adminPassword.length < 12) {
  throw new Error(
    "Define STILOSHOW_SEED_ADMIN_PASSWORD con al menos 12 caracteres antes de ejecutar el seed.",
  );
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("Define DATABASE_URL antes de ejecutar el seed.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

function timeOnDate(hour, minute = 0) {
  return new Date(Date.UTC(1970, 0, 1, hour, minute));
}

const developmentServices = [
  {
    nombre: "DEV - Corte clásico",
    descripcion: "Servicio de desarrollo para validar el flujo de corte clásico.",
    precio: "500.00",
    duracionMinutos: 45,
  },
  {
    nombre: "DEV - Corte + barba",
    descripcion: "Servicio de desarrollo para validar corte y arreglo de barba.",
    precio: "800.00",
    duracionMinutos: 60,
  },
  {
    nombre: "DEV - Afeitado tradicional",
    descripcion: "Servicio de desarrollo para validar el afeitado tradicional.",
    precio: "600.00",
    duracionMinutos: 40,
  },
];

const developmentEmployees = [
  {
    email: "empleado1.dev@stilshow.local",
    nombre: "Empleado",
    apellido: "Desarrollo Uno",
    telefono: "809-000-0001",
    especialidad: "Cortes clásicos y barba",
  },
  {
    email: "empleado2.dev@stilshow.local",
    nombre: "Empleado",
    apellido: "Desarrollo Dos",
    telefono: "809-000-0002",
    especialidad: "Fade y afeitado tradicional",
  },
];

const developmentSchedules = [
  ["LUNES", 9, 18],
  ["MARTES", 9, 18],
  ["MIERCOLES", 9, 18],
  ["JUEVES", 9, 18],
  ["VIERNES", 9, 18],
  ["SABADO", 9, 14],
];

async function main() {
  const admin = await prisma.usuario.upsert({
    where: { email: "admin.dev@stilshow.local" },
    update: {
      nombre: "Administrador",
      apellido: "Desarrollo",
      rol: "ADMINISTRADOR",
      activo: true,
      passwordHash: hashPassword(adminPassword),
    },
    create: {
      email: "admin.dev@stilshow.local",
      passwordHash: hashPassword(adminPassword),
      nombre: "Administrador",
      apellido: "Desarrollo",
      telefono: "809-000-0000",
      rol: "ADMINISTRADOR",
    },
  });

  const employees = [];
  for (const employee of developmentEmployees) {
    const user = await prisma.usuario.upsert({
      where: { email: employee.email },
      update: {
        nombre: employee.nombre,
        apellido: employee.apellido,
        telefono: employee.telefono,
        rol: "EMPLEADO",
        activo: true,
      },
      create: {
        email: employee.email,
        passwordHash: hashPassword(adminPassword),
        nombre: employee.nombre,
        apellido: employee.apellido,
        telefono: employee.telefono,
        rol: "EMPLEADO",
      },
    });

    const profile = await prisma.perfilEmpleado.upsert({
      where: { usuarioId: user.id },
      update: { especialidad: employee.especialidad },
      create: { usuarioId: user.id, especialidad: employee.especialidad },
    });
    employees.push(profile);
  }

  const client = await prisma.usuario.upsert({
    where: { email: "cliente.dev@stilshow.local" },
    update: {
      nombre: "Cliente",
      apellido: "Desarrollo",
      telefono: "809-000-0010",
      rol: "CLIENTE",
      activo: true,
    },
    create: {
      email: "cliente.dev@stilshow.local",
      passwordHash: hashPassword(adminPassword),
      nombre: "Cliente",
      apellido: "Desarrollo",
      telefono: "809-000-0010",
      rol: "CLIENTE",
    },
  });

  const services = [];
  for (const service of developmentServices) {
    services.push(
      await prisma.servicio.upsert({
        where: { nombre: service.nombre },
        update: service,
        create: service,
      }),
    );
  }

  for (const employee of employees) {
    for (const [day, start, end] of developmentSchedules) {
      await prisma.horarioLaboral.upsert({
        where: {
          empleadoId_diaSemana_horaInicio_horaCierre: {
            empleadoId: employee.id,
            diaSemana: day,
            horaInicio: timeOnDate(start),
            horaCierre: timeOnDate(end),
          },
        },
        update: { activo: true },
        create: {
          empleadoId: employee.id,
          diaSemana: day,
          horaInicio: timeOnDate(start),
          horaCierre: timeOnDate(end),
        },
      });
    }
  }

  console.log(
    JSON.stringify(
      {
        entorno: "desarrollo",
        administrador: admin.email,
        empleados: employees.length,
        cliente: client.email,
        servicios: services.length,
        horariosPorEmpleado: developmentSchedules.length,
      },
      null,
      2,
    ),
  );
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
