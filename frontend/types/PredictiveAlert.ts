import { AlertType } from "./AlertType";

export interface PredictiveAlert {
  id: number;
  type?: AlertType;
  message?: string;
  probabilityScore?: string;
  contextData?: string; // JSON string
  resolved?: boolean;
}
