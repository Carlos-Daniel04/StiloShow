"use client";

export default function Error({ reset }: { reset: () => void }) {
  return <main className="catalog-page"><div className="content-width catalog-content"><p className="catalog-error">No se pudieron cargar los servicios.</p><button className="button button-primary" onClick={reset}>Intentar nuevamente</button></div></main>;
}
