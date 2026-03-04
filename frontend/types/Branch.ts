import { ProductStock } from "./ProductStock";

export interface Branch {
  id: number;
  name?: string;
  address?: string;
  phone?: string;
  isPointOfSale: boolean;

  inventory?: ProductStock[];
}
