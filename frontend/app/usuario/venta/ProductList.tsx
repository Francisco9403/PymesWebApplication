interface CartItem {
  product: {
    id: number;
    sku?: string;
    currentSalePrice?: string;
  };
  quantity: number;
}

interface Props {
  cart: CartItem[];
}

export default function ProductList({ cart }: Props) {
  const total = cart.reduce(
    (acc, item) =>
      acc + Number(item.product.currentSalePrice ?? 0) * item.quantity,
    0,
  );

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Productos Agregados</h3>

      {cart.length === 0 && (
        <p className="text-gray-500">No hay productos en la venta.</p>
      )}

      {cart.map((item) => (
        <div
          key={item.product.id}
          className="flex justify-between py-2 border-b"
        >
          <span>
            {item.product.sku} x{item.quantity}
          </span>
          <span>
            $
            {(
              Number(item.product.currentSalePrice ?? 0) * item.quantity
            ).toFixed(2)}
          </span>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="mt-4 text-right font-bold text-lg">
          Total: ${total.toFixed(2)}
        </div>
      )}
    </div>
  );
}
