export interface Product {
  id: number;
  sku?: string;
  currentSalePrice?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
