import { Branch } from "./Branch";
import { Product } from "./Product";

export interface ProductStock {
  id: number;
  product: Product;
  branch: Branch;

  quantity: number;
  criticalThreshold?: number;
  salesVelocity?: number;
}
