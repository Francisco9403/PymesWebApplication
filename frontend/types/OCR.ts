import { FiscalOrigin } from "./FiscalOrigin";
import { IvaCondition } from "./IvaCondition";
import { Supplier } from "./Supplier";

export interface OCRInvoiceEntry {
  id: number;
  rawTextOcr?: string;
  fileUrl?: string;
  supplier?: Supplier;
  processingDate?: string;
}

export interface OCRProduct {
  name: string;
  baseCostPrice: number;
  ean13?: string;
  sku?: string;
}

export interface OCRResult {
  businessName: string;
  cuit: string;
  ivaCondition: IvaCondition;
  fiscalOrigin: FiscalOrigin;
  products: OCRProduct[];
}

export interface EditableProduct extends OCRProduct {
  quantity: number;
  lastCostPrice?: number;
}

export interface EditableOCRData extends Omit<OCRResult, "products"> {
  products: EditableProduct[];
}

/* ---------- Tipos flexibles que puede devolver la IA ---------- */

export interface RawOCRProduct {
  name?: string;
  descripcion?: string;
  baseCostPrice?: number;
  ean13?: string;
  precio?: number;
}

export interface RawOCRResult {
  businessName?: string;
  razonSocial?: string;
  cuit?: string;
  ivaCondition?: IvaCondition;
  fiscalOrigin?: FiscalOrigin;
  products?: RawOCRProduct[];
  productos?: RawOCRProduct[];
}
