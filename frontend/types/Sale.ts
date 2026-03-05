import { Branch } from "./Branch";
import { CommunicationChannel } from "./Comunicattion";
import { FiscalReceipt } from "./FiscalReceipt";
import { Payment } from "./Payment";
import { SaleItem } from "./SaleItem";
import { SaleStatus } from "./SaleStatus";

export interface Sale {
  id: number;
  branch?: Branch;
  channel?: CommunicationChannel;

  items?: SaleItem[];

  totalAmount?: string; // BigDecimal
  status?: SaleStatus;

  payment?: Payment;
  fiscalReceipt?: FiscalReceipt;

  createdAt?: string;
}
