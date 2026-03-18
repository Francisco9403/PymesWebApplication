import { CartItem } from "@/types/Cart";

export default function ProductList({
  cart,
  removeFromCart,
}: {
  cart: CartItem[];
  removeFromCart: (productId: number) => void;
}) {
  const total = cart.reduce(
    (acc, item) =>
      acc + Number(item.product.currentSalePrice ?? 0) * item.quantity,
    0,
  );

  return (
    <div
      className="p-6 rounded-xl transition-colors
        bg-white border border-slate-200
        dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.07)]"
    >
      <div className="flex items-center gap-2 mb-6">
        <h3
          className="text-lg font-extrabold tracking-[-0.01em]
          text-slate-800 dark:text-[#F0EDE8]"
        >
          Resumen de Venta
        </h3>
        <span
          className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide
            bg-slate-100 text-slate-500
            dark:bg-[rgba(255,255,255,0.06)] dark:text-[#666]"
        >
          {cart.length} items
        </span>
      </div>

      {cart.length === 0 ? (
        <div
          className="py-10 text-center rounded-xl border-2 border-dashed
            border-slate-100 dark:border-[rgba(255,255,255,0.06)]"
        >
          <p className="font-medium italic text-slate-400 dark:text-[#444]">
            El carrito está vacío
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-[rgba(255,255,255,0.04)]">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="group flex justify-between items-center py-4"
            >
              <div className="flex flex-col gap-0.5">
                <span
                  className="font-bold transition-colors
                  text-slate-900 group-hover:text-[#FF6B35]
                  dark:text-[#F0EDE8] dark:group-hover:text-[#FF6B35]"
                >
                  {item.product.sku}
                </span>
                <span className="text-xs text-slate-400 dark:text-[#555]">
                  Cantidad: {item.quantity}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className="font-mono font-bold tabular-nums
                  text-slate-700 dark:text-[#AAA]"
                >
                  $
                  {(
                    Number(item.product.currentSalePrice ?? 0) * item.quantity
                  ).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-base font-bold transition-all
                    text-red-400 hover:text-red-600 hover:bg-red-50
                    dark:text-red-500 dark:hover:text-red-400 dark:hover:bg-[rgba(239,68,68,0.08)]"
                >
                  −
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div
          className="mt-8 pt-5 flex justify-between items-end
            border-t-2 border-slate-900 dark:border-[rgba(255,255,255,0.2)]"
        >
          <span
            className="text-sm font-bold uppercase tracking-tight
            text-slate-400 dark:text-[#555]"
          >
            Total a Pagar
          </span>
          <span
            className="text-4xl font-extrabold tracking-[-0.03em] tabular-nums
            text-slate-900 dark:text-[#F0EDE8]"
          >
            ${total.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
