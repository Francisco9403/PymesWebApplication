import { CurrentAccount } from "./Currency";
import { FiscalOrigin } from "./FiscalOrigin";
import { IvaCondition } from "./IvaCondition";

export interface Supplier {
  id: number;
  businessName?: string;
  cuit?: string;
  ivaCondition?: IvaCondition | null;
  fiscalOrigin?: FiscalOrigin | null;
  currentAccount?: CurrentAccount | null;
}
