"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";

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
  const [qrSquares, setQrSquares] = useState<string[]>([]);
  const { darkMode, toggleDark } = useTheme();

  useEffect(() => {
    const colors = Array.from({ length: 64 }, () =>
      Math.random() > 0.4 ? "#0A0A0F" : "#F0EDE8"
    );
    setQrSquares(colors);
  }, []);

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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <main
      className="overflow-x-hidden min-h-screen font-sora transition-colors duration-300
        bg-white text-slate-900
        dark:bg-[#0A0A0F] dark:text-[#F0EDE8]"
    >
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-[clamp(20px,5vw,80px)] transition-colors duration-300
          backdrop-blur-[20px]
          bg-white/80 border-b border-slate-200
          dark:bg-[rgba(10,10,15,0.8)] dark:border-[rgba(255,255,255,0.05)]"
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-between h-16">

          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center text-base text-white">◈</span>
            <span className="font-extrabold text-[1.15rem] tracking-[-0.02em]">
              Comercio<span className="text-[#FF6B35]">App</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-9">
            {[["#features", "Funciones"], ["#compliance", "ARCA"], ["#stats", "Métricas"]].map(([href, label]) => (
              <a
                key={href} href={href}
                className="no-underline text-[0.85rem] font-semibold tracking-[0.05em] uppercase transition-colors
                  text-slate-500 hover:text-slate-900
                  dark:text-[#9A9A9A] dark:hover:text-[#F0EDE8]"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              aria-label="Cambiar tema"
              className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-150
                bg-slate-100 hover:bg-slate-200 text-slate-500
                dark:bg-[rgba(255,255,255,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)] dark:text-[#9A9A9A]"
            >
              {darkMode ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            <Link
              href="/iniciar-sesion"
              className="inline-flex items-center gap-[10px] px-5 py-2.5 font-semibold text-[0.85rem] rounded-[6px] no-underline cursor-pointer transition-colors duration-200
                bg-transparent border border-slate-300 text-slate-700 hover:border-slate-500 hover:bg-slate-50
                dark:border-[rgba(240,237,232,0.2)] dark:text-[#F0EDE8] dark:hover:border-[rgba(240,237,232,0.5)] dark:hover:bg-[rgba(240,237,232,0.05)]"
            >
              Ingresar
            </Link>
            <Link
              href="/registro"
              className="inline-flex items-center gap-[10px] px-5 py-2.5 bg-[#FF6B35] text-white font-bold text-[0.85rem] tracking-[0.02em] rounded-[6px] no-underline border-0 cursor-pointer transition-[transform,box-shadow,background-color] hover:bg-[#FF8555] hover:-translate-y-[2px] hover:shadow-[0_20px_40px_rgba(255,107,53,0.3)]"
            >
              Prueba Gratis →
            </Link>
          </div>
        </div>
      </nav>

      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center pt-[120px] pb-20 px-[clamp(20px,5vw,80px)] overflow-hidden"
      >
        <div className="absolute rounded-full pointer-events-none blur-[120px] w-[600px] h-[600px] -top-[150px] -left-[100px]
          bg-[rgba(255,107,53,0.08)] dark:bg-[rgba(255,107,53,0.18)]" />
        <div className="absolute rounded-full pointer-events-none blur-[120px] w-[500px] h-[500px] top-[100px] -right-[150px]
          bg-[rgba(0,201,167,0.06)] dark:bg-[rgba(0,201,167,0.12)]" />
        <div className="absolute rounded-full pointer-events-none blur-[120px] w-[400px] h-[400px] bottom-0 left-[40%]
          bg-[rgba(168,85,247,0.05)] dark:bg-[rgba(168,85,247,0.10)]" />

        <div
          className="absolute inset-0 pointer-events-none bg-size-[60px_60px]
            bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]
            dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"
        />

        <div className="relative z-10 max-w-[1280px] w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">

            <div className="flex flex-col gap-8">
              <div>
                <span className="inline-flex items-center gap-2 px-[14px] py-[6px] rounded-full border border-[rgba(255,107,53,0.3)] bg-[rgba(255,107,53,0.08)] text-[0.72rem] font-bold tracking-widest uppercase text-[#FF6B35] font-dmMono">
                  <span
                    className="relative inline-block w-2 h-2 rounded-full bg-[#00C9A7]
                      before:content-[''] before:absolute before:inset-[-3px] before:rounded-full before:bg-[rgba(0,201,167,0.4)] before:animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"
                  />
                  Sistema Activo v2.0 — Junín, Buenos Aires
                </span>
              </div>

              <h1 className="font-extrabold leading-none tracking-[-0.03em] text-[clamp(2.5rem,10vw,4rem)] md:text-[clamp(3rem,8vw,7rem)]">
                Tu comercio,<br />
                sin <span className="text-[#FF6B35]">límites</span><br />
                <span className="text-slate-300 dark:text-[rgba(240,237,232,0.3)]">ni excusas.</span>
              </h1>

              <p className="text-[1.1rem] leading-[1.7] max-w-[480px] font-normal text-slate-500 dark:text-[#888]">
                Gestión omnicanal de inventario, pagos con QR dinámico, facturación ARCA y un asistente de IA para PyMEs y comercios de proximidad que quieren crecer en serio.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/registro"
                  className="inline-flex items-center gap-[10px] px-9 py-4 bg-[#FF6B35] text-white font-bold text-[0.95rem] tracking-[0.02em] rounded-[6px] no-underline border-0 cursor-pointer transition-[transform,box-shadow,background-color] hover:bg-[#FF8555] hover:-translate-y-[2px] hover:shadow-[0_20px_40px_rgba(255,107,53,0.3)]"
                >
                  Empezar Gratis →
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center gap-[10px] px-8 py-[15px] font-semibold text-[0.95rem] rounded-[6px] no-underline cursor-pointer transition-colors duration-200
                    bg-transparent border border-slate-300 text-slate-700 hover:border-slate-500 hover:bg-slate-50
                    dark:border-[rgba(240,237,232,0.2)] dark:text-[#F0EDE8] dark:hover:border-[rgba(240,237,232,0.5)] dark:hover:bg-[rgba(240,237,232,0.05)]"
                >
                  Ver Funciones
                </Link>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {["Offline-First", "Factura Electrónica", "WhatsApp Bot", "Multi-Sucursal"].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-[6px] px-3 py-[5px] rounded-full text-[0.75rem] font-medium
                      bg-slate-100 border border-slate-200 text-slate-500
                      dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(255,255,255,0.1)] dark:text-[#888]"
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="relative transition-transform duration-100 ease-linear"
              style={{ transform: `translateY(${scrollY * 0.05}px)` }}
            >
              <div
                className="rounded-2xl p-6 backdrop-blur-md
                  bg-white/90 border border-slate-200 shadow-xl shadow-slate-200/60
                  dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.1)] dark:shadow-none"
              >
                <div className="flex justify-between items-center mb-5">
                  <span className="text-[0.75rem] font-dmMono text-slate-400 dark:text-[#555]">PANEL PRINCIPAL</span>
                  <div className="flex gap-1.5">
                    {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                      <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                </div>

                <div
                  className="rounded-[10px] p-5 mb-4
                    bg-[rgba(255,107,53,0.06)] border border-[rgba(255,107,53,0.15)]
                    dark:bg-[rgba(255,107,53,0.08)] dark:border-[rgba(255,107,53,0.2)]"
                >
                  <div className="text-[0.7rem] text-[#FF6B35] font-dmMono tracking-widest mb-1.5">VENTAS HOY</div>
                  <div className="text-[2.2rem] font-extrabold tracking-[-0.03em]">$847.320</div>
                  <div className="text-[0.75rem] text-[#00C9A7] mt-1">↑ 12.4% vs ayer</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Stock Crítico", value: "3 items", color: "#FFD166", icon: "⚠️" },
                    { label: "Pagos Pendientes", value: "0", color: "#00C9A7", icon: "✅" },
                    { label: "Fact. Emitidas", value: "28", color: "#A855F7", icon: "🧾" },
                    { label: "Dólar MEP", value: "$1.247", color: "#06B6D4", icon: "💱" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg p-[14px]
                        bg-slate-50 border border-slate-200
                        dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
                    >
                      <div className="text-[0.65rem] mb-1 font-dmMono text-slate-400 dark:text-[#555]">{item.label}</div>
                      <div className="font-bold text-base" style={{ color: item.color }}>{item.icon} {item.value}</div>
                    </div>
                  ))}
                </div>

                <div
                  className="rounded-lg px-[14px] py-3 flex items-start gap-2.5
                    animate-[shimmer_3s_infinite] bg-size-[200%_100%]
                    bg-[rgba(0,201,167,0.05)] border border-[rgba(0,201,167,0.15)]
                    dark:bg-[rgba(0,201,167,0.06)] dark:border-[rgba(0,201,167,0.2)]"
                >
                  <span className="text-base">🤖</span>
                  <div>
                    <div className="text-[0.7rem] text-[#00C9A7] font-bold mb-0.5">ALERTA IA</div>
                    <div className="text-[0.72rem] leading-[1.4] text-slate-500 dark:text-[#777]">
                      Ola de frío pronosticada. Revisá stock de café, té y chocolatada.
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-5 -right-5 rounded-xl p-4 animate-[float_4s_ease-in-out_infinite]
                  bg-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                  dark:bg-[#F0EDE8] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              >
                <div className="text-[0.6rem] font-bold mb-2 text-center tracking-[0.08em] text-slate-600 dark:text-[#333]">QR DINÁMICO</div>
                <div className="w-[72px] h-[72px] bg-[#0A0A0F] rounded-[6px] grid grid-cols-8 gap-0.5 p-1.5">
                  {qrSquares.map((color, i) => (
                    <div key={i} className="rounded-[1px]" style={{ background: color }} />
                  ))}
                </div>
                <div className="text-[0.65rem] text-[#FF6B35] text-center mt-2 font-bold">$2.450,00</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className="overflow-hidden py-5
          border-t border-b border-slate-200
          dark:border-[rgba(255,255,255,0.05)]"
      >
        <div className="flex gap-10 whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          {[...Array(2)].flatMap(() =>
            ["Inventario Omnicanal", "Factura Electrónica ARCA", "QR Dinámico", "WhatsApp Bot", "Offline-First", "Multi-Sucursal", "OCR Inteligente", "Dólar MEP Sync", "Cuentas Corrientes", "Alertas IA"].map((t) => (
              <span
                key={t + Math.random()}
                className="flex items-center gap-4 text-[0.8rem] font-semibold tracking-[0.08em] uppercase
                  text-slate-300 dark:text-[#444]"
              >
                {t}
                <span className="text-[#FF6B35] text-base">◆</span>
              </span>
            ))
          )}
        </div>
      </div>

      <section id="stats" className="py-20 px-[clamp(20px,5vw,80px)]">
        <div className="max-w-[1280px] mx-auto">
          <div
            className="grid grid-cols-2 md:grid-cols-4 rounded-2xl
              bg-slate-50 border border-slate-200
              dark:bg-[rgba(255,255,255,0.02)] dark:border-[rgba(255,255,255,0.07)]"
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`text-center px-6 py-8 transition-colors
                  ${i < stats.length - 1
                    ? "border-b border-slate-200 md:border-b-0 md:border-r dark:border-[rgba(255,255,255,0.06)]"
                    : ""
                  }`}
              >
                <div className="text-[2.5rem] font-extrabold tracking-[-0.03em] bg-linear-to-r from-[#FF6B35] to-[#FFD166] bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-[0.8rem] font-medium mt-1 tracking-[0.03em] text-slate-500 dark:text-[#666]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent dark:via-[rgba(255,255,255,0.08)]" />

      <section id="features" className="py-24 px-[clamp(20px,5vw,80px)]">
        <div className="max-w-[1280px] mx-auto">

          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-[14px] py-[6px] rounded-full border border-[rgba(255,107,53,0.3)] bg-[rgba(255,107,53,0.08)] text-[0.72rem] font-bold tracking-widest uppercase text-[#FF6B35] font-dmMono mb-5"
            >
              Funcionalidades
            </div>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.03em] leading-[1.1]">
              Todo lo que tu comercio<br />
              <span className="text-[#FF6B35]">necesita, nativo.</span>
            </h2>
            <p className="mt-4 text-base max-w-[520px] mx-auto text-slate-500 dark:text-[#666]">
              Sin integraciones frágiles. Sin hojas de cálculo. Sin excusas para no saber qué pasa en tu negocio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`relative overflow-hidden cursor-default rounded-xl p-7
                  border transition-[border-color,background-color,transform] duration-250
                  before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,107,53,0.04)_0%,transparent_60%)] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
                  bg-slate-50 border-slate-200 hover:border-[rgba(255,107,53,0.3)] hover:bg-white hover:-translate-y-1
                  dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)] dark:hover:border-[rgba(255,107,53,0.25)] dark:hover:bg-[rgba(255,255,255,0.05)] dark:hover:-translate-y-1
                  ${activeFeature === i
                    ? "border-[rgba(255,107,53,0.4)]! bg-[rgba(255,107,53,0.04)]! dark:bg-[rgba(255,107,53,0.06)]!"
                    : ""}`}
                onMouseEnter={() => setActiveFeature(i)}
              >
                <div
                  className="absolute w-[18px] h-[18px] top-0 left-0 border-t-2 border-l-2"
                  style={{ borderColor: f.color, opacity: activeFeature === i ? 0.6 : 0.15 }}
                />
                <div
                  className="absolute w-[18px] h-[18px] bottom-0 right-0 border-b-2 border-r-2"
                  style={{ borderColor: f.color, opacity: activeFeature === i ? 0.6 : 0.15 }}
                />

                <div className="flex justify-between items-start mb-4">
                  <span className="text-[1.8rem]">{f.icon}</span>
                  <span
                    className="font-dmMono text-[0.65rem] font-medium tracking-[0.12em] uppercase px-2 py-[3px] rounded
                      bg-slate-200 text-slate-500
                      dark:bg-[rgba(255,255,255,0.06)] dark:text-[#9A9A9A]"
                  >
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-bold text-[1.05rem] mb-2.5 tracking-[-0.01em]">{f.title}</h3>
                <p className="text-[0.85rem] leading-[1.65] text-slate-500 dark:text-[#666]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent dark:via-[rgba(255,255,255,0.08)]" />

      <section id="compliance" className="py-24 px-[clamp(20px,5vw,80px)]">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">

            <div>
              <div
                className="inline-flex items-center gap-2 px-[14px] py-[6px] rounded-full border border-[rgba(168,85,247,0.3)] bg-[rgba(168,85,247,0.08)] text-[0.72rem] font-bold tracking-widest uppercase text-[#A855F7] font-dmMono mb-5"
              >
                Cumplimiento ARCA
              </div>
              <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-extrabold tracking-[-0.03em] leading-[1.1] mb-5">
                Facturá.<br />
                Cumplí.<br />
                <span className="text-[#00C9A7]">Tranquilo.</span>
              </h2>
              <p className="leading-[1.75] mb-7 text-[0.95rem] text-slate-500 dark:text-[#666]">
                Emisión de comprobantes A, B y C embebida en el flujo de cobro. Exportación automática para Libro IVA Digital. Reportes de retenciones IIBB y Ganancias listos para los aplicativos de ARCA.
              </p>
              <div className="flex flex-col gap-3.5">
                {[
                  "Factura A / B / C desde el mostrador",
                  "Exportación Libro IVA Digital",
                  "Retenciones IIBB y Ganancias",
                  "MFA + cifrado Ley 25.326",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] shrink-0" />
                    <span className="text-[0.9rem] text-slate-600 dark:text-[#AAA]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { step: "01", title: "Venta confirmada", desc: "El pago es verificado via webhook antes de cerrar la transacción.", icon: "✅", color: "#00C9A7" },
                { step: "02", title: "Comprobante emitido", desc: "Factura A/B/C generada automáticamente y enviada por email.", icon: "🧾", color: "#A855F7" },
                { step: "03", title: "ARCA registrado", desc: "Los datos se exportan al formato correcto para los aplicativos fiscales.", icon: "🏛️", color: "#FF6B35" },
              ].map((s) => (
                <div
                  key={s.step}
                  className="flex gap-5 p-6 rounded-xl items-start
                    bg-slate-50 border border-slate-200
                    dark:bg-[rgba(255,255,255,0.02)] dark:border-[rgba(255,255,255,0.06)]"
                >
                  <div
                    className="w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 text-xl"
                    style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <div className="font-dmMono text-[0.6rem] mb-1 text-slate-400 dark:text-[#444]">PASO {s.step}</div>
                    <div className="font-bold text-[0.95rem] mb-1">{s.title}</div>
                    <div className="text-[0.82rem] leading-normal text-slate-500 dark:text-[#666]">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent dark:via-[rgba(255,255,255,0.08)]" />

      <section className="py-24 px-[clamp(20px,5vw,80px)]">
        <div className="max-w-[1280px] mx-auto">
          <div
            className="relative overflow-hidden text-center rounded-[20px] p-12 md:p-20
              border
              bg-linear-to-br from-[rgba(255,107,53,0.05)] to-[rgba(0,201,167,0.03)] border-[rgba(255,107,53,0.12)]
              dark:from-[rgba(255,107,53,0.08)] dark:to-[rgba(0,201,167,0.05)] dark:border-[rgba(255,107,53,0.15)]
              before:content-[''] before:absolute before:w-[300px] before:h-[300px] before:rounded-full before:bg-[radial-gradient(circle,rgba(255,107,53,0.12)_0%,transparent_70%)] before:-top-[100px] before:-left-[100px]
              after:content-[''] after:absolute after:w-[250px] after:h-[250px] after:rounded-full after:bg-[radial-gradient(circle,rgba(0,201,167,0.10)_0%,transparent_70%)] after:-bottom-[80px] after:-right-[80px]"
          >
            <div className="relative z-10">
              <div
                className="inline-flex items-center gap-2 px-[14px] py-[6px] rounded-full border border-[rgba(255,107,53,0.3)] bg-[rgba(255,107,53,0.08)] text-[0.72rem] font-bold tracking-widest uppercase text-[#FF6B35] font-dmMono mb-6"
              >
                <span
                  className="relative inline-block w-2 h-2 rounded-full bg-[#00C9A7]
                    before:content-[''] before:absolute before:inset-[-3px] before:rounded-full before:bg-[rgba(0,201,167,0.4)] before:animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"
                />
                Comenzá hoy — sin tarjeta de crédito
              </div>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-[-0.03em] leading-none mb-5">
                Tu negocio merece<br />
                <span className="text-[#FF6B35]">tecnología real.</span>
              </h2>
              <p className="text-base max-w-[460px] mx-auto mb-10 leading-[1.7] text-slate-500 dark:text-[#666]">
                Probá ComercioApp sin compromiso. Configuración en menos de 15 minutos. Soporte en español, por humanos reales, desde Argentina.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/registro"
                  className="inline-flex items-center gap-[10px] px-11 py-[18px] bg-[#FF6B35] text-white font-bold text-base tracking-[0.02em] rounded-[6px] no-underline border-0 cursor-pointer transition-[transform,box-shadow,background-color] hover:bg-[#FF8555] hover:-translate-y-[2px] hover:shadow-[0_20px_40px_rgba(255,107,53,0.3)]"
                >
                  Empezar Gratis →
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-[10px] px-9 py-[18px] font-semibold text-base rounded-[6px] no-underline cursor-pointer transition-colors duration-200
                    bg-transparent border border-slate-300 text-slate-700 hover:border-slate-500 hover:bg-slate-50
                    dark:border-[rgba(240,237,232,0.2)] dark:text-[#F0EDE8] dark:hover:border-[rgba(240,237,232,0.5)] dark:hover:bg-[rgba(240,237,232,0.05)]"
                >
                  Ver Demo en Vivo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        className="py-10 px-[clamp(20px,5vw,80px)]
          border-t border-slate-200
          dark:border-[rgba(255,255,255,0.05)]"
      >
        <div className="max-w-[1280px] mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 bg-[#FF6B35] rounded-[6px] inline-flex items-center justify-center text-[0.75rem] text-white">◈</span>
            <span className="font-bold">ComercioApp</span>
            <span className="text-[0.8rem] text-slate-300 dark:text-[#333]">—</span>
            <span className="text-[0.8rem] text-slate-400 dark:text-[#444]">Desarrollado en Junín, Buenos Aires</span>
          </div>
          <div className="flex gap-6">
            {["Privacidad", "Términos", "Soporte"].map((t) => (
              <a
                key={t} href="#"
                className="text-[0.8rem] no-underline transition-colors duration-200
                  text-slate-400 hover:text-slate-800
                  dark:text-[#444] dark:hover:text-[#F0EDE8]"
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
