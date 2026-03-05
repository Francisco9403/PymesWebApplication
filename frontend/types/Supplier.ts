import { CurrentAccount } from "./CurrencyAmount";
import { TaxCategory } from "./TaxCategory";

export interface Supplier {
  id: number;
  businessName?: string;
  cuit?: string;
  taxCategory?: TaxCategory;
  currentAccount?: CurrentAccount;
}
