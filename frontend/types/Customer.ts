export type CreateCustomerRequest = {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  creditLimit?: number;
  userId: number;
};

export type CustomerListResponse = {
  id: number;
  name: string;
  phone: string;
  currentDebt: number;
  creditLimit: number | null;
  tag: string | null;
  lastPurchase: string;
};

export type CustomerSaleResponse = {
  id: number;
  totalAmount: number;
  totalItems: number;
  status: string;
  createdAt: string;
};
