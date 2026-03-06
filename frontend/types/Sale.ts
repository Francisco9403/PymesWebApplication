import { Branch } from "./Branch";
import { CommunicationChannel } from "./Comunicattion";
import { FiscalReceipt } from "./FiscalReceipt";
import { Payment } from "./Payment";
import { Product } from "./Product";

export interface Sale {
  id: number;
  branch?: Branch;
  channel?: CommunicationChannel;

  items?: SaleItem[];

  totalAmount?: string;
  status?: SaleStatus;

  payment?: Payment;
  fiscalReceipt?: FiscalReceipt;

  createdAt?: string;
}

export interface SaleItem {
  id: number;
  product: Product;
  quantity: number;
  priceAtSale: string;
}

export enum SaleStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}
