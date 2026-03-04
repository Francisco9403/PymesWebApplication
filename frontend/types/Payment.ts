import { Currency } from "./Currency";
import { PaymentStatus } from "./PaymentStatus";
import { Sale } from "./Sale";

export interface Payment {
  id: number;
  transactionId?: string;
  amount?: string; // BigDecimal
  status?: PaymentStatus;

  qrData?: string;
  currency?: Currency;
  exchangeRateAtTime?: string;

  sale: Sale;
}
