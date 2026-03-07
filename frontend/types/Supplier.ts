import { CurrentAccount } from "./Currency";
import { TaxCategory } from "./TaxCategory";

export interface Supplier {
  id: number;
  businessName?: string;
  cuit?: string;
  taxCategory?: TaxCategory;
  currentAccount?: CurrentAccount;
}
