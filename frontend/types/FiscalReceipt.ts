import { ReceiptType } from "./ReceiptType";
import { Sale } from "./Sale";

export interface FiscalReceipt {
  id: number;

  cae?: string;
  caeExpiration?: string;

  pointOfSale?: number;
  receiptNumber?: number;

  type?: ReceiptType;
  sale?: Sale;

  netAmount?: string;
  taxAmount?: string;
  iibbPerception?: string;

  customerCuit?: string;
  customerName?: string;
  concept?: number;
}
