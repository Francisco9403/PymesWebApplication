import { AIProductDescription } from "./AIProductDescription";
import { Branch } from "./Branch";
import { SyncEntity } from "./SyncEntity";

export interface Product extends SyncEntity {
  id: number;
  sku?: string;
  ean13?: string;
  qrCode?: string;
  name: string;
  strategicMultiplier?: number;
  strategicReason?: string;
  ignoreStrategicRules?: boolean;

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
  name: string;
  ean13: string;
  baseCostPrice: number;
  currentSalePrice: number;

  // ⚡ AGREGAR ESTOS CAMPOS NUEVOS:
  // Los ponemos como opcionales (?) por si algún producto viejo no los trae
  strategicMultiplier?: number;
  strategicReason?: string;
  ignoreStrategicRules?: boolean;
}
