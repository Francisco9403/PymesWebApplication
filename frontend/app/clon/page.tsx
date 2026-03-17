"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const features = [
  {
    icon: "⚡",
    tag: "Core",
    title: "Inventario Omnicanal",
    desc: "Sincronización en tiempo real entre mostrador, web y WhatsApp. Si el stock llega a cero, la publicación se pausa automáticamente.",
    color: "#FF6B35",
  },
  {
    icon: "🧾",
    tag: "OCR & IA",
    title: "Ingreso Inteligente",
    desc: "Cargá facturas de proveedores por foto, PDF o Excel. El sistema actualiza stock y precios de costo sin intervención manual.",
    color: "#00C9A7",
  },
  {
    icon: "📲",
    tag: "Pagos",
    title: "QR Dinámico & Webhooks",
    desc: "QR con monto exacto por venta. La transacción se confirma solo cuando el pago es verificado digitalmente — sin estafas.",
    color: "#4ECDC4",
  },
  {
    icon: "💱",
    tag: "Finanzas",
    title: "Multi-moneda Dinámica",
    desc: "Tipos de cambio sincronizados (Oficial, MEP, Cripto). Reglas de markup automático cuando el dólar sube más de tu umbral.",
    color: "#FFD166",
  },
  {
    icon: "🏛️",
    tag: "ARCA",
    title: "Facturación Electrónica",
    desc: "Comprobantes A, B y C desde el punto de cobro. Exportación nativa para Libro IVA Digital y retenciones IIBB/Ganancias.",
    color: "#A855F7",
  },
  {
    icon: "🤖",
    tag: "IA & Alertas",
    title: "Asistente WhatsApp",
    desc: "Bot con lenguaje natural que cierra ventas, agenda turnos y avisa si viene una ola de frío antes de que se te vacíe la góndola.",
    color: "#06B6D4",
  },
];

const stats = [
  { value: "99.9%", label: "Uptime garantizado" },
  { value: "<2s", label: "Confirmación de pago" },
  { value: "100%", label: "Cumplimiento ARCA" },
  { value: "0 cortes", label: "Modo Offline-First" },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((p) => (p + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main
      style={{
        fontFamily: "'Sora', 'DM Sans', sans-serif",
        background: "#0A0A0F",
        color: "#F0EDE8",
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hero-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }
        .glow-orange { background: rgba(255,107,53,0.18); width: 600px; height: 600px; top: -150px; left: -100px; }
        .glow-teal   { background: rgba(0,201,167,0.12); width: 500px; height: 500px; top: 100px; right: -150px; }
        .glow-purple { background: rgba(168,85,247,0.10); width: 400px; height: 400px; bottom: 0; left: 40%; }

        .nav-item {
          color: #9A9A9A;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .nav-item:hover { color: #F0EDE8; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,107,53,0.3);
          background: rgba(255,107,53,0.08);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #FF6B35;
          font-family: 'DM Mono', monospace;
        }

        .ping {
          display: inline-block;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #00C9A7;
          position: relative;
        }
        .ping::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: rgba(0,201,167,0.4);
          animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }

        .hero-title {
          font-size: clamp(3rem, 8vw, 7rem);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .accent { color: #FF6B35; }
        .accent-teal { color: #00C9A7; }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          background: #FF6B35;
          color: #0A0A0F;
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.02em;
          border-radius: 6px;
          text-decoration: none;
          transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
          border: none;
          cursor: pointer;
        }
        .btn-primary:hover {
          background: #FF8555;
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(255,107,53,0.3);
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 32px;
          background: transparent;
          color: #F0EDE8;
          font-weight: 600;
          font-size: 0.95rem;
          border: 1px solid rgba(240,237,232,0.2);
          border-radius: 6px;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s;
          cursor: pointer;
        }
        .btn-ghost:hover {
          border-color: rgba(240,237,232,0.5);
          background: rgba(240,237,232,0.05);
        }

        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 28px;
          transition: border-color 0.25s, background 0.25s, transform 0.25s;
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,107,53,0.04) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: 12px;
        }
        .feature-card:hover::before { opacity: 1; }
        .feature-card:hover {
          border-color: rgba(255,107,53,0.25);
          background: rgba(255,255,255,0.05);
          transform: translateY(-4px);
        }
        .feature-card.active {
          border-color: rgba(255,107,53,0.4);
          background: rgba(255,107,53,0.06);
        }

        .feature-tag {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 4px;
          background: rgba(255,255,255,0.06);
          color: #9A9A9A;
        }

        .stat-item {
          text-align: center;
          padding: 32px 24px;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .stat-item:last-child { border-right: none; }
        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #FF6B35, #FFD166);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label {
          font-size: 0.8rem;
          color: #666;
          font-weight: 500;
          margin-top: 4px;
          letter-spacing: 0.03em;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        }

        .scroll-fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .scroll-fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .marquee-track {
          display: flex;
          gap: 40px;
          animation: marquee 20s linear infinite;
          white-space: nowrap;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-item {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #444;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .marquee-dot { color: #FF6B35; font-size: 1rem; }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 0.75rem;
          color: #888;
          font-weight: 500;
        }

        .cta-section {
          background: linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(0,201,167,0.05) 100%);
          border: 1px solid rgba(255,107,53,0.15);
          border-radius: 20px;
          padding: 80px 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%);
          top: -100px; left: -100px;
          border-radius: 50%;
        }
        .cta-section::after {
          content: '';
          position: absolute;
          width: 250px; height: 250px;
          background: radial-gradient(circle, rgba(0,201,167,0.12) 0%, transparent 70%);
          bottom: -80px; right: -80px;
          border-radius: 50%;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: clamp(2.5rem, 10vw, 4rem); }
          .cta-section { padding: 48px 28px; }
          .stat-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .stat-item:last-child { border-bottom: none; }
        }

        .nav-blur {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(10,10,15,0.8);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .corner-bracket {
          position: absolute;
          width: 18px; height: 18px;
          opacity: 0.3;
        }
        .corner-bracket.tl { top: 0; left: 0; border-top: 2px solid #FF6B35; border-left: 2px solid #FF6B35; }
        .corner-bracket.br { bottom: 0; right: 0; border-bottom: 2px solid #FF6B35; border-right: 2px solid #FF6B35; }

        .shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* NAV */}
      <nav
        className="nav-blur"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 clamp(20px, 5vw, 80px)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 32,
                height: 32,
                background: "#FF6B35",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
              }}
            >
              ◈
            </span>
            <span
              style={{
                fontWeight: 800,
                fontSize: "1.15rem",
                letterSpacing: "-0.02em",
              }}
            >
              Comercio<span style={{ color: "#FF6B35" }}>App</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: 36,
              alignItems: "center",
            }}
            className="hide-mobile"
          >
            <a href="#features" className="nav-item">Funciones</a>
            <a href="#compliance" className="nav-item">ARCA</a>
            <a href="#stats" className="nav-item">Métricas</a>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link href="/iniciar-sesion" className="btn-ghost" style={{ padding: "10px 20px", fontSize: "0.85rem" }}>
              Ingresar
            </Link>
            <Link href="/registro" className="btn-primary" style={{ padding: "10px 20px", fontSize: "0.85rem" }}>
              Prueba Gratis →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "120px clamp(20px, 5vw, 80px) 80px",
          overflow: "hidden",
        }}
      >
        <div className="hero-glow glow-orange" />
        <div className="hero-glow glow-teal" />
        <div className="hero-glow glow-purple" />

        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            {/* Left */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <div>
                <span className="badge">
                  <span className="ping" />
                  Sistema Activo v2.0 — Junín, Buenos Aires
                </span>
              </div>

              <h1 className="hero-title">
                Tu comercio,<br />
                sin <span className="accent">límites</span><br />
                <span style={{ color: "rgba(240,237,232,0.3)" }}>ni excusas.</span>
              </h1>

              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#888",
                  lineHeight: 1.7,
                  maxWidth: 480,
                  fontWeight: 400,
                }}
              >
                Gestión omnicanal de inventario, pagos con QR dinámico, facturación ARCA y un asistente de IA para PyMEs y comercios de proximidad que quieren crecer en serio.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Link href="/registro" className="btn-primary">
                  Empezar Gratis →
                </Link>
                <Link href="#features" className="btn-ghost">
                  Ver Funciones
                </Link>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["Offline-First", "Factura Electrónica", "WhatsApp Bot", "Multi-Sucursal"].map((t) => (
                  <span key={t} className="pill">✓ {t}</span>
                ))}
              </div>
            </div>

            {/* Right — Live dashboard mock */}
            <div
              style={{
                position: "relative",
                transform: `translateY(${scrollY * 0.05}px)`,
                transition: "transform 0.1s linear",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  padding: 24,
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Mock header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <span style={{ fontSize: "0.75rem", color: "#555", fontFamily: "'DM Mono', monospace" }}>PANEL PRINCIPAL</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["#FF5F57", "#FEBC2E", "#28C840"].map(c => (
                      <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                    ))}
                  </div>
                </div>

                {/* Sales today */}
                <div
                  style={{
                    background: "rgba(255,107,53,0.08)",
                    border: "1px solid rgba(255,107,53,0.2)",
                    borderRadius: 10,
                    padding: "20px",
                    marginBottom: 16,
                  }}
                >
                  <div style={{ fontSize: "0.7rem", color: "#FF6B35", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", marginBottom: 6 }}>VENTAS HOY</div>
                  <div style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>$847.320</div>
                  <div style={{ fontSize: "0.75rem", color: "#00C9A7", marginTop: 4 }}>↑ 12.4% vs ayer</div>
                </div>

                {/* Mini cards */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {[
                    { label: "Stock Crítico", value: "3 items", color: "#FFD166", icon: "⚠️" },
                    { label: "Pagos Pendientes", value: "0", color: "#00C9A7", icon: "✅" },
                    { label: "Fact. Emitidas", value: "28", color: "#A855F7", icon: "🧾" },
                    { label: "Dólar MEP", value: "$1.247", color: "#06B6D4", icon: "💱" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 8,
                        padding: "14px",
                      }}
                    >
                      <div style={{ fontSize: "0.65rem", color: "#555", marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>{item.label}</div>
                      <div style={{ fontWeight: 700, color: item.color, fontSize: "1rem" }}>{item.icon} {item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Alert */}
                <div
                  className="shimmer"
                  style={{
                    background: "rgba(0,201,167,0.06)",
                    border: "1px solid rgba(0,201,167,0.2)",
                    borderRadius: 8,
                    padding: "12px 14px",
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>🤖</span>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#00C9A7", fontWeight: 700, marginBottom: 2 }}>ALERTA IA</div>
                    <div style={{ fontSize: "0.72rem", color: "#777", lineHeight: 1.4 }}>
                      Ola de frío pronosticada. Revisá stock de café, té y chocolatada.
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating QR mock */}
              <div
                style={{
                  position: "absolute",
                  bottom: -20,
                  right: -20,
                  background: "#F0EDE8",
                  borderRadius: 12,
                  padding: 16,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                  animation: "float 4s ease-in-out infinite",
                }}
              >
                <style>{`@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }`}</style>
                <div style={{ fontSize: "0.6rem", color: "#333", fontWeight: 700, marginBottom: 8, textAlign: "center", letterSpacing: "0.08em" }}>QR DINÁMICO</div>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    background: "#0A0A0F",
                    borderRadius: 6,
                    display: "grid",
                    gridTemplateColumns: "repeat(8, 1fr)",
                    gap: 2,
                    padding: 6,
                  }}
                >
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        background: Math.random() > 0.4 ? "#0A0A0F" : "#F0EDE8",
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: "0.65rem", color: "#FF6B35", textAlign: "center", marginTop: 8, fontWeight: 700 }}>$2.450,00</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ overflow: "hidden", padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="marquee-track">
          {[...Array(2)].flatMap(() =>
            ["Inventario Omnicanal", "Factura Electrónica ARCA", "QR Dinámico", "WhatsApp Bot", "Offline-First", "Multi-Sucursal", "OCR Inteligente", "Dólar MEP Sync", "Cuentas Corrientes", "Alertas IA"].map((t) => (
              <span key={t + Math.random()} className="marquee-item">
                {t}
                <span className="marquee-dot">◆</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* STATS */}
      <section id="stats" style={{ padding: "80px clamp(20px, 5vw, 80px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
            }}
          >
            {stats.map((s) => (
              <div key={s.label} className="stat-item">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px clamp(20px, 5vw, 80px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="badge" style={{ marginBottom: 20 }}>Funcionalidades</div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Todo lo que tu comercio<br />
              <span className="accent">necesita, nativo.</span>
            </h2>
            <p style={{ color: "#666", marginTop: 16, fontSize: "1rem", maxWidth: 520, margin: "16px auto 0" }}>
              Sin integraciones frágiles. Sin hojas de cálculo. Sin excusas para no saber qué pasa en tu negocio.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`feature-card ${activeFeature === i ? "active" : ""}`}
                onMouseEnter={() => setActiveFeature(i)}
              >
                <div className="corner-bracket tl" style={{ borderColor: f.color, opacity: activeFeature === i ? 0.6 : 0.15 }} />
                <div className="corner-bracket br" style={{ borderColor: f.color, opacity: activeFeature === i ? 0.6 : 0.15 }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <span style={{ fontSize: "1.8rem" }}>{f.icon}</span>
                  <span className="feature-tag">{f.tag}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: 10, letterSpacing: "-0.01em" }}>{f.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* COMPLIANCE */}
      <section id="compliance" style={{ padding: "100px clamp(20px, 5vw, 80px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            <div>
              <div className="badge" style={{ marginBottom: 20, borderColor: "rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.08)", color: "#A855F7" }}>
                Cumplimiento ARCA
              </div>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
                Facturá.<br />
                Cumplí.<br />
                <span className="accent-teal">Tranquilo.</span>
              </h2>
              <p style={{ color: "#666", lineHeight: 1.75, marginBottom: 28, fontSize: "0.95rem" }}>
                Emisión de comprobantes A, B y C embebida en el flujo de cobro. Exportación automática para Libro IVA Digital. Reportes de retenciones IIBB y Ganancias listos para los aplicativos de ARCA.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  "Factura A / B / C desde el mostrador",
                  "Exportación Libro IVA Digital",
                  "Retenciones IIBB y Ganancias",
                  "MFA + cifrado Ley 25.326",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#A855F7", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.9rem", color: "#AAA" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance visual */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { step: "01", title: "Venta confirmada", desc: "El pago es verificado via webhook antes de cerrar la transacción.", icon: "✅", color: "#00C9A7" },
                { step: "02", title: "Comprobante emitido", desc: "Factura A/B/C generada automáticamente y enviada por email.", icon: "🧾", color: "#A855F7" },
                { step: "03", title: "ARCA registrado", desc: "Los datos se exportan al formato correcto para los aplicativos fiscales.", icon: "🏛️", color: "#FF6B35" },
              ].map((s) => (
                <div
                  key={s.step}
                  style={{
                    display: "flex",
                    gap: 20,
                    padding: 24,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: `${s.color}15`,
                      border: `1px solid ${s.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      flexShrink: 0,
                    }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#444", marginBottom: 4 }}>PASO {s.step}</div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: "0.82rem", color: "#666", lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* CTA */}
      <section style={{ padding: "100px clamp(20px, 5vw, 80px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="cta-section">
            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="badge" style={{ marginBottom: 24, margin: "0 auto 24px" }}>
                <span className="ping" />
                Comenzá hoy — sin tarjeta de crédito
              </div>
              <h2
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: 20,
                }}
              >
                Tu negocio merece<br />
                <span className="accent">tecnología real.</span>
              </h2>
              <p style={{ color: "#666", fontSize: "1rem", maxWidth: 460, margin: "0 auto 40px", lineHeight: 1.7 }}>
                Probá ComercioApp sin compromiso. Configuración en menos de 15 minutos. Soporte en español, por humanos reales, desde Argentina.
              </p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/registro" className="btn-primary" style={{ fontSize: "1rem", padding: "18px 44px" }}>
                  Empezar Gratis →
                </Link>
                <Link href="/demo" className="btn-ghost" style={{ fontSize: "1rem", padding: "18px 36px" }}>
                  Ver Demo en Vivo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "40px clamp(20px, 5vw, 80px)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 24, height: 24, background: "#FF6B35", borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>◈</span>
            <span style={{ fontWeight: 700, color: "#F0EDE8" }}>ComercioApp</span>
            <span style={{ color: "#333", fontSize: "0.8rem" }}>—</span>
            <span style={{ color: "#444", fontSize: "0.8rem" }}>Desarrollado en Junín, Buenos Aires</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacidad", "Términos", "Soporte"].map((t) => (
              <a key={t} href="#" style={{ color: "#444", fontSize: "0.8rem", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#F0EDE8")}
                onMouseLeave={e => (e.currentTarget.style.color = "#444")}
              >{t}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          section > div > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          section > div > div[style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </main>
  );
}
