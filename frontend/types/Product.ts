import { AIProductDescription } from "./AIProductDescription";
import { ProductStock } from "./ProductStock";
import { SyncEntity } from "./SyncEntity";

export interface Product extends SyncEntity {
  id: number;
  sku?: string;
  ean13?: string;
  qrCode?: string;

  stocks?: ProductStock[];
  aiDescriptions?: AIProductDescription[];

  baseCostPrice?: string; // BigDecimal
  currentSalePrice?: string; // BigDecimal
  lastSync?: string; // ISO date
}
