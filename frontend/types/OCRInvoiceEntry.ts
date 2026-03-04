import { Supplier } from "./Supplier";

export interface OCRInvoiceEntry {
  id: number;
  rawTextOcr?: string;
  fileUrl?: string;
  supplier?: Supplier;
  processingDate?: string;
}
