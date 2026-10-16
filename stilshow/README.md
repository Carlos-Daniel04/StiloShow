# StiloShow

Aplicación web responsive para la gestión de una barbería masculina.

## Desarrollo local

### Iniciar la aplicación

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Seed de desarrollo

El seed crea datos claramente identificables con el sufijo `.dev@stilshow.local`:

- Un administrador.
- Dos empleados con perfil y horarios laborales.
- Un cliente.
- Tres servicios.

Antes de ejecutarlo, copia [`.env.example`](./.env.example) como `.env`, define
`DATABASE_URL` y proporciona la contraseña del seed mediante una variable de
entorno. La contraseña no está escrita en el código:

```powershell
Copy-Item .env.example .env
npx prisma migrate deploy
$env:STILOSHOW_SEED_ADMIN_PASSWORD = "una-clave-local-de-al-menos-12-caracteres"
npm run db:seed
```

El comando es idempotente: puede ejecutarse varias veces sin duplicar los datos
de desarrollo. La contraseña se almacena como hash usando `scrypt` y un salt
aleatorio.

Las cuentas de desarrollo creadas son:

```text
Administrador: admin.dev@stilshow.local
Empleado 1: empleado1.dev@stilshow.local
Empleado 2: empleado2.dev@stilshow.local
Cliente: cliente.dev@stilshow.local
```

El seed requiere que la base de datos PostgreSQL de `DATABASE_URL` ya tenga
aplicada la migración inicial.

## Autenticación

La aplicación incluye registro público únicamente para clientes, inicio de
sesión y cierre de sesión. Las contraseñas se almacenan como hashes `scrypt`;
las sesiones se guardan en PostgreSQL y el navegador solo recibe una cookie
`httpOnly`.

Las rutas protegidas son:

- `/cuenta` para clientes.
- `/empleado` para empleados.
- `/admin` para administradores.

El acceso a cada ruta se valida nuevamente en el servidor según el rol, aunque
el usuario intente escribir otra ruta manualmente.

## Catálogo

El catálogo público está disponible en:

- `/servicios`, que muestra únicamente servicios activos desde PostgreSQL.
- `/barberos`, que muestra únicamente empleados activos con horarios laborales activos.

Ambas páginas incluyen estados de carga, error y lista vacía. La portada usa
la misma API en `/api/catalogo` para sus vistas resumidas.

## Calidad

```bash
npm run lint
npx tsc --noEmit
npm run build
```
