interface CartItem {
  product: {
    id: number;
    sku?: string;
    currentSalePrice?: string;
  };
  quantity: number;
}

export default function ProductList({ cart }: { cart: CartItem[] }) {
  const total = cart.reduce(
    (acc, item) =>
      acc + Number(item.product.currentSalePrice ?? 0) * item.quantity,
    0,
  );

  return (
    <div className="card-container p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span>Resumen de Venta</span>
        <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] uppercase font-black">
          {cart.length} items
        </span>
      </h3>

      <div className="space-y-1">
        {cart.length === 0 ? (
          <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
            <p className="text-slate-400 font-medium italic">
              El carrito está vacío
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between items-center py-4 group"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.product.sku}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Cantidad: {item.quantity}
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-700">
                  $
                  {(
                    Number(item.product.currentSalePrice ?? 0) * item.quantity
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="mt-8 pt-6 border-t-2 border-slate-900 flex justify-between items-end">
          <span className="text-sm font-black text-slate-400 uppercase tracking-tighter">
            Total a Pagar
          </span>
          <span className="text-4xl font-black text-slate-900 tracking-tight">
            ${total.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
