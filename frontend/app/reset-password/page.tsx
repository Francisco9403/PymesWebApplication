import RestablecerPassword from "./RestablecerPassword";

export default function Page() {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300
        bg-slate-50 dark:bg-[#0A0A0F]"
    >
      {/* Ambient glows */}
      <div
        className="fixed rounded-full pointer-events-none blur-[120px] w-[500px] h-[500px] -top-[200px] -left-[150px]
        bg-[rgba(255,107,53,0.05)] dark:bg-[rgba(255,107,53,0.12)]"
      />
      <div
        className="fixed rounded-full pointer-events-none blur-[120px] w-[400px] h-[400px] -bottom-[150px] -right-[100px]
        bg-[rgba(0,201,167,0.04)] dark:bg-[rgba(0,201,167,0.08)]"
      />

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none bg-size-[60px_60px]
        bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)]
        dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)]"
      />

      <div className="relative z-10 w-full max-w-md flex flex-col gap-6">
        {/* Card */}
        <div
          className="w-full rounded-2xl p-8 transition-colors duration-300
            bg-white border border-slate-200 shadow-xl shadow-slate-200/50
            dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.08)] dark:shadow-none"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center text-base text-white">
                ◈
              </span>
              <span className="font-extrabold text-xl tracking-[-0.02em] text-slate-900 dark:text-[#F0EDE8]">
                Comercio<span className="text-[#FF6B35]">App</span>
              </span>
            </div>

            {/* Shield icon */}
            <div
              className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl
                bg-[rgba(0,201,167,0.1)]"
              style={{ border: "1px solid rgba(0,201,167,0.25)" }}
            >
              🛡️
            </div>

            <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-900 dark:text-[#F0EDE8]">
              Nueva contraseña
            </h1>
            <p className="text-sm mt-1.5 text-slate-500 dark:text-[#666]">
              Elegí una contraseña segura para tu cuenta.
            </p>
          </div>

          <RestablecerPassword />
        </div>

        <p className="text-center text-[0.7rem] font-bold uppercase tracking-widest text-slate-300 dark:text-[#333]">
          Junín • Buenos Aires • 2026
        </p>
      </div>
    </main>
  );
}
