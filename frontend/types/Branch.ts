import { ProductStock } from "./Product";

export interface Branch {
  id: number;
  name?: string;
  address?: string;
  phone?: string;
  isPointOfSale: boolean;

  inventory?: ProductStock[];
}
