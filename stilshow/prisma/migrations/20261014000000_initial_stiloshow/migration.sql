-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('CLIENTE', 'EMPLEADO', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "EstadoCita" AS ENUM ('CONFIRMADA', 'COMPLETADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM (
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
  'DOMINGO'
);

-- CreateTable
CREATE TABLE "usuarios" (
  "id" UUID NOT NULL,
  "email" VARCHAR(320) NOT NULL,
  "passwordHash" VARCHAR(255) NOT NULL,
  "nombre" VARCHAR(80) NOT NULL,
  "apellido" VARCHAR(80) NOT NULL,
  "telefono" VARCHAR(30),
  "rol" "RolUsuario" NOT NULL DEFAULT 'CLIENTE',
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizadoEn" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfiles_empleado" (
  "id" UUID NOT NULL,
  "usuarioId" UUID NOT NULL,
  "especialidad" VARCHAR(160) NOT NULL,
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizadoEn" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "perfiles_empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicios" (
  "id" UUID NOT NULL,
  "nombre" VARCHAR(120) NOT NULL,
  "descripcion" TEXT NOT NULL,
  "precio" DECIMAL(10,2) NOT NULL,
  "duracionMinutos" INTEGER NOT NULL,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizadoEn" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horarios_laborales" (
  "id" UUID NOT NULL,
  "empleadoId" UUID NOT NULL,
  "diaSemana" "DiaSemana" NOT NULL,
  "horaInicio" TIME(0) NOT NULL,
  "horaCierre" TIME(0) NOT NULL,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizadoEn" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "horarios_laborales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citas" (
  "id" UUID NOT NULL,
  "clienteId" UUID NOT NULL,
  "empleadoId" UUID NOT NULL,
  "servicioId" UUID NOT NULL,
  "iniciaEn" TIMESTAMP(3) NOT NULL,
  "terminaEn" TIMESTAMP(3) NOT NULL,
  "estado" "EstadoCita" NOT NULL DEFAULT 'CONFIRMADA',
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizadoEn" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "citas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
CREATE INDEX "usuarios_rol_activo_idx" ON "usuarios"("rol", "activo");
CREATE INDEX "usuarios_activo_idx" ON "usuarios"("activo");
CREATE UNIQUE INDEX "perfiles_empleado_usuarioId_key" ON "perfiles_empleado"("usuarioId");
CREATE INDEX "perfiles_empleado_especialidad_idx" ON "perfiles_empleado"("especialidad");
CREATE UNIQUE INDEX "servicios_nombre_key" ON "servicios"("nombre");
CREATE INDEX "servicios_activo_idx" ON "servicios"("activo");
CREATE UNIQUE INDEX "horarios_laborales_empleadoId_diaSemana_horaInicio_horaCierre_key"
  ON "horarios_laborales"("empleadoId", "diaSemana", "horaInicio", "horaCierre");
CREATE INDEX "horarios_laborales_empleadoId_diaSemana_activo_idx"
  ON "horarios_laborales"("empleadoId", "diaSemana", "activo");
CREATE INDEX "citas_clienteId_iniciaEn_idx" ON "citas"("clienteId", "iniciaEn");
CREATE INDEX "citas_empleadoId_iniciaEn_idx" ON "citas"("empleadoId", "iniciaEn");
CREATE INDEX "citas_servicioId_iniciaEn_idx" ON "citas"("servicioId", "iniciaEn");
CREATE INDEX "citas_estado_iniciaEn_idx" ON "citas"("estado", "iniciaEn");

-- Validate scalar values at the database boundary.
ALTER TABLE "servicios"
  ADD CONSTRAINT "servicios_precio_no_negativo" CHECK ("precio" >= 0),
  ADD CONSTRAINT "servicios_duracion_positiva" CHECK ("duracionMinutos" > 0);

ALTER TABLE "horarios_laborales"
  ADD CONSTRAINT "horarios_laborales_intervalo_valido" CHECK ("horaInicio" < "horaCierre");

ALTER TABLE "citas"
  ADD CONSTRAINT "citas_intervalo_valido" CHECK ("iniciaEn" < "terminaEn");

-- Prevent overlapping appointments for an employee, except cancelled appointments.
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "citas"
  ADD CONSTRAINT "citas_empleado_sin_solapamientos"
  EXCLUDE USING gist (
    "empleadoId" WITH =,
    tsrange("iniciaEn", "terminaEn", '[)') WITH &&
  )
  WHERE ("estado" <> 'CANCELADA');

-- AddForeignKey
ALTER TABLE "perfiles_empleado"
  ADD CONSTRAINT "perfiles_empleado_usuarioId_fkey"
  FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios_laborales"
  ADD CONSTRAINT "horarios_laborales_empleadoId_fkey"
  FOREIGN KEY ("empleadoId") REFERENCES "perfiles_empleado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citas"
  ADD CONSTRAINT "citas_clienteId_fkey"
  FOREIGN KEY ("clienteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "citas"
  ADD CONSTRAINT "citas_empleadoId_fkey"
  FOREIGN KEY ("empleadoId") REFERENCES "perfiles_empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "citas"
  ADD CONSTRAINT "citas_servicioId_fkey"
  FOREIGN KEY ("servicioId") REFERENCES "servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
