export enum Currency {
  ARS = "ARS",
  USD = "USD",
  EUR = "EUR",
}

export interface CurrentAccount {
  id: number;
  ownerId?: number;
  balance?: string;
  creditLimit?: string;
}

export interface CurrencyConfig {
  code: string;
  rate?: string;
  markupPercentage?: number;
  lastUpdate?: string;
}
