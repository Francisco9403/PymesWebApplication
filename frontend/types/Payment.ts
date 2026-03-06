import { Currency } from "./Currency";
import { Sale } from "./Sale";

export interface Payment {
  id: number;
  transactionId?: string;
  amount?: string;
  status?: PaymentStatus;

  qrData?: string;
  currency?: Currency;
  exchangeRateAtTime?: string;

  sale: Sale;
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  REFUNDED = "REFUNDED",
  PARTIALLY_PAID = "PARTIALLY_PAID",
}
