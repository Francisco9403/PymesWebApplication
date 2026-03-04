import { Product } from "./Product";

export interface SaleItem {
  id: number;
  product: Product;
  quantity: number;
  priceAtSale: string; // BigDecimal
}
