import { CommunicationChannel } from "./Comunicattion";
import { Product } from "./Product";

export interface AIProductDescription {
  id: number;
  channel: CommunicationChannel;
  generatedContent?: string;
  product: Product;
}
