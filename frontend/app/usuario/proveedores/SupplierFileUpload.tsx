export default function SupplierFileUpload({
  analyzeAction,
  analyzing,
}: {
  analyzeAction: (formData: FormData) => void;
  analyzing: boolean;
}) {
  return (
    <form
      action={analyzeAction}
      className="card-container p-8 animate-in fade-in slide-in-from-top-4 duration-500"
    >
      {/* Encabezado */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-8">
        <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-sm">
          🏭
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Importar Proveedor
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Sube el archivo de lista de precios para analizar
          </p>
        </div>
      </div>
      {/* Zona de carga */}
      <label
        htmlFor="supplier-file"
        className="group flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-indigo-50/40 hover:border-indigo-300 transition-all duration-200"
      >
        <div className="flex flex-col items-center gap-3 pointer-events-none">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 shadow-sm flex items-center justify-center text-2xl transition-all duration-200">
            📄
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">
              Haz clic para seleccionar un archivo
            </p>
            <p className="text-xs text-slate-400 font-medium">
              Formatos soportados:
              <span className="font-bold">.xlsx, .csv, .pdf</span>
            </p>
          </div>
        </div>
        <input
          id="supplier-file"
          type="file"
          name="file"
          required
          className="sr-only"
        />
      </label>
      {/* Footer del form */}
      <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-50">
        {analyzing ? (
          <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
            <svg
              className="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Procesando archivo...
          </div>
        ) : (
          <p className="text-xs text-slate-400 font-medium">
            La IA extraerá los productos automáticamente
          </p>
        )}
        <button
          type="submit"
          disabled={analyzing}
          className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {analyzing ? (
            <span className="animate-pulse">Analizando...</span>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.75 3.75 0 01-5.304 0l-.306-.346z"
                />
              </svg>
              Analizar Archivo
            </>
          )}
        </button>
      </div>
    </form>
  );
}
