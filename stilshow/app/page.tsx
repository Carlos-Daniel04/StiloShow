"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Menu,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import CatalogPreview from "@/components/catalog-preview";
import EmployeePreview from "@/components/employee-preview";

const navigation = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Barberos", href: "#barberos" },
  { label: "Nosotros", href: "#nosotros" },
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <main className="site-shell">
      <nav className="navbar" aria-label="Navegación principal">
        <div className="content-width navbar-inner">
          <a className="brand" href="#inicio" onClick={closeMenu} aria-label="StiloShow, inicio">
            <span className="brand-mark">S</span>
            <span>
              <strong>StiloShow</strong>
              <small>Barbería masculina</small>
            </span>
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`nav-links ${isMenuOpen ? "nav-links-open" : ""}`}>
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
            <a className="button button-small button-bronze" href="/iniciar-sesion" onClick={closeMenu}>
              Reservar una cita <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </nav>

      <section className="hero" id="inicio">
        <div className="hero-texture" aria-hidden="true" />
        <div className="content-width hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Barbería masculina</p>
            <h1>Tu estilo.<br /><em>Tu presencia.</em></h1>
            <p className="hero-description">
              Cortes precisos, barba impecable y una experiencia pensada para
              hombres que saben cómo quieren verse.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="/iniciar-sesion">
                Reservar una cita <ArrowRight size={18} />
              </a>
              <a className="text-link" href="#servicios">
                Ver servicios <span>↓</span>
              </a>
            </div>
            <div className="hero-note">
              <span className="hero-rule" />
              <p><strong>Calidad en cada detalle.</strong><br />Tu próxima imagen empieza aquí.</p>
            </div>
          </div>
          <div className="hero-visual" aria-label="Ambiente de barbería masculina StiloShow">
            <div className="barber-poster">
              <div className="poster-light" aria-hidden="true" />
              <div className="poster-chair" aria-hidden="true">
                <span className="chair-head" />
                <span className="chair-back" />
                <span className="chair-seat" />
              </div>
              <div className="poster-copy">
                <span>STILOSHOW</span>
                <strong>Estilo<br />con carácter</strong>
                <small>BARBER SHOP / SINCE 2024</small>
              </div>
            </div>
            <div className="floating-card">
              <span className="floating-icon"><Check size={15} /></span>
              <span><strong>Atención de primera</strong><small>Sin prisas, a tu manera</small></span>
            </div>
            <span className="visual-stamp">EST.<br /><strong>24</strong></span>
          </div>
        </div>
      </section>

      <section className="trust-bar" aria-label="Beneficios de StiloShow">
        <div className="content-width trust-inner">
          <p><ShieldCheck size={16} /> Barberos expertos</p>
          <span className="trust-line" />
          <p><Clock3 size={16} /> Puntualidad y detalle</p>
          <span className="trust-line" />
          <p><UserRound size={16} /> Un espacio para ti</p>
        </div>
      </section>

      <section className="section section-services" id="servicios">
        <div className="content-width">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span /> Servicios destacados</p>
              <h2>Tu corte no es<br /><em>cualquier corte.</em></h2>
            </div>
            <p className="section-intro">
              Técnicas clásicas y actuales, productos premium y un acabado
              que mantiene tu estilo por más tiempo.
            </p>
          </div>
          <CatalogPreview />
        </div>
      </section>

      <section className="barbers-section" id="barberos">
        <div className="content-width">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span /> Nuestro equipo</p>
              <h2>Manos expertas,<br /><em>estilo auténtico.</em></h2>
            </div>
            <p className="section-intro">
              Conoce a los barberos que convierten cada visita en una
              experiencia hecha a tu medida.
            </p>
          </div>
          <EmployeePreview />
          <a className="text-link section-more-link" href="/barberos">Conocer nuestro equipo <ArrowRight size={16} /></a>
        </div>
      </section>

      <section className="about-section" id="nosotros">
        <div className="content-width about-grid">
          <div className="about-art" aria-hidden="true">
            <div className="about-emblem"><span>S</span></div>
            <span className="about-word">STILOSHOW / BARBER SHOP</span>
          </div>
          <div className="about-copy">
            <p className="eyebrow"><span /> Sobre StiloShow</p>
            <h2>Más que un corte.<br /><em>Una actitud.</em></h2>
            <p>
              Creamos un espacio donde la técnica, la conversación y el buen
              gusto se encuentran. Entra como eres. Sal con más confianza.
            </p>
            <a className="text-link" href="/iniciar-sesion">Ven a conocernos <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      <section className="booking-cta" id="reservar">
        <div className="content-width booking-inner">
          <div>
            <p className="eyebrow eyebrow-light"><span /> Tu próximo look te espera</p>
            <h2>Haz espacio para<br /><em>tu mejor versión.</em></h2>
          </div>
          <div className="booking-action">
            <p>Reserva tu espacio en StiloShow.<br />Nosotros nos encargamos del resto.</p>
            <button className="button button-light" type="button">
              <CalendarDays size={18} /> Reservas próximamente
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="content-width footer-inner">
          <div className="footer-brand">
            <a className="brand brand-footer" href="#inicio">
              <span className="brand-mark">S</span>
              <span><strong>StiloShow</strong><small>Barbería masculina</small></span>
            </a>
            <p>Precisión, presencia y estilo.</p>
          </div>
          <div className="footer-contact">
            <p>Visítanos</p>
            <span>La Romana, República Dominicana</span>
            <span>carlorijo4@gmail.com</span>
          </div>
          <a className="social-link" href="#inicio" aria-label="Redes sociales de StiloShow"><Sparkles size={18} /></a>
        </div>
        <div className="content-width footer-bottom">
          <span>© 2026 StiloShow. Todos los derechos reservados.</span>
          <span>Hecho con carácter y estilo.</span>
        </div>
      </footer>
    </main>
  );
}
