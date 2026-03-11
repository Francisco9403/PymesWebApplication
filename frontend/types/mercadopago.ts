// https://www.mercadopago.com.ar/developers/es/docs/qr-code/create-store-and-pos

export interface BusinessHourRange {
  open: string;
  close: string;
}

export interface BusinessHours {
  monday?: BusinessHourRange[];
  tuesday?: BusinessHourRange[];
  wednesday?: BusinessHourRange[];
  thursday?: BusinessHourRange[];
  friday?: BusinessHourRange[];
  saturday?: BusinessHourRange[];
  sunday?: BusinessHourRange[];
}

export interface Location {
  street_number: string;
  street_name: string;
  city_name: string;
  state_name: string;
  latitude: number;
  longitude: number;
  reference?: string;
}

export interface BranchRequest {
  name: string;
  external_id: string;
  business_hours?: BusinessHours;
  location: Location;
}

// https://www.mercadopago.com.ar/developers/es/docs/qr-code/create-store-and-pos

export interface BranchLocation {
  address_line: string;
  latitude: number;
  longitude: number;
  reference?: string;
}

export interface BranchResponse {
  id: number;
  name: string;
  external_id: string;
  date_created: string;
  business_hours?: BusinessHours;
  location: BranchLocation;
}

// https://www.mercadopago.com.ar/developers/es/docs/qr-code/create-store-and-pos

export interface PosRequest {
  name: string;
  store_id: number;
  external_store_id: string;
  external_id: string;
  category?: number;
}

// https://www.mercadopago.com.ar/developers/es/docs/qr-code/create-store-and-pos

export interface PosQr {
  image: string;
  template_document: string;
  template_image: string;
}

export interface PosResponse {
  id: number;
  uuid: string;
  name: string;
  status: "active" | "inactive" | string;
  date_created: string;
  date_last_updated: string;
  user_id: number;
  fixed_amount: boolean;
  category: number;
  store_id: number;
  external_store_id: string;
  external_id: string;
  qr: PosQr;
}

// https://www.mercadopago.com.ar/developers/es/reference/qr-dynamic/_instore_orders_qr_seller_collectors_user_id_pos_external_pos_id_qrs/put

export interface MPOrderItem {
  sku_number?: string;
  category: string;
  title: string;
  description?: string;
  unit_price: number;
  quantity: number;
  unit_measure: "unit" | "pack" | "kg";
  total_amount: number;
}

export interface MPSponsor {
  id: number;
}

export interface MPCashOut {
  amount: number;
}

// external_reference, title, description, notification_url son opcionales
export interface CreateQROrderInput {
  external_reference?: string;
  title?: string;
  description?: string;
  notification_url?: string;
  total_amount: number;
  items: MPOrderItem[];
  sponsor?: MPSponsor;
  cash_out?: MPCashOut;
}

// ---

export interface BranchSearchResponse {
  results: BranchResponse[];
}
