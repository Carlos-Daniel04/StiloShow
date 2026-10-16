"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Mode = "registro" | "inicio";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegistration = mode === "registro";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch(`/api/auth/${isRegistration ? "registro" : "iniciar-sesion"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "No se pudo completar la operación.");
        return;
      }
      router.push(result.redirectTo);
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servicio. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <Link className="auth-brand" href="/">StiloShow</Link>
        <p className="eyebrow"><span /> Barbería masculina</p>
        <h1 id="auth-title">{isRegistration ? "Crea tu cuenta" : "Bienvenido de nuevo"}</h1>
        <p className="auth-intro">
          {isRegistration ? "Regístrate como cliente para gestionar tus citas." : "Ingresa para continuar con tu experiencia StiloShow."}
        </p>
        <form className="auth-form" onSubmit={submit}>
          {isRegistration && (
            <>
              <label>Nombre<input name="nombre" required maxLength={80} autoComplete="given-name" /></label>
              <label>Apellido<input name="apellido" required maxLength={80} autoComplete="family-name" /></label>
              <label>Teléfono <span>(opcional)</span><input name="telefono" maxLength={30} autoComplete="tel" /></label>
            </>
          )}
          <label>Correo electrónico<input name="email" type="email" required maxLength={320} autoComplete="email" /></label>
          <label>Contraseña<input name="password" type="password" required minLength={12} autoComplete={isRegistration ? "new-password" : "current-password"} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? "Procesando..." : isRegistration ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </form>
        <p className="auth-switch">
          {isRegistration ? "¿Ya tienes una cuenta?" : "¿Aún no tienes cuenta?"}{" "}
          <Link href={isRegistration ? "/iniciar-sesion" : "/registro"}>
            {isRegistration ? "Inicia sesión" : "Regístrate"}
          </Link>
        </p>
        <Link className="auth-back" href="/">Volver al inicio</Link>
      </section>
    </main>
  );
}
