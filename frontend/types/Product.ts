import { AIProductDescription } from "./AIProductDescription";
import { Branch } from "./Branch";
import { SyncEntity } from "./SyncEntity";

export interface Product extends SyncEntity {
  id: number;
  sku?: string;
  ean13?: string;
  qrCode?: string;

  stocks?: ProductStock[];
  aiDescriptions?: AIProductDescription[];

  baseCostPrice?: string;
  currentSalePrice?: string;
  lastSync?: string;
}

export interface ProductStock {
  id: number;
  product: Product;
  branch: Branch;

  quantity: number;
  criticalThreshold?: number;
  salesVelocity?: number;
}

export interface ProductResponse {
  id: number;
  sku: string;
  currentSalePrice: number;
  ean13: number;
  baseCostPrice: number;
}
