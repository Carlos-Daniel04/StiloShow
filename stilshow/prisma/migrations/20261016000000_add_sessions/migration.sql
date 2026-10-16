CREATE TABLE "sesiones" (
    "id" UUID NOT NULL,
    "usuarioId" UUID NOT NULL,
    "tokenHash" VARCHAR(64) NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "sesiones_tokenHash_key" ON "sesiones"("tokenHash");
CREATE INDEX "sesiones_usuarioId_expiraEn_idx" ON "sesiones"("usuarioId", "expiraEn");
CREATE INDEX "sesiones_expiraEn_idx" ON "sesiones"("expiraEn");
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_usuarioId_fkey"
  FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
