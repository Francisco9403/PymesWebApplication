import { Branch } from "./Branch";
import { SyncEntity } from "./SyncEntity";

export interface User extends SyncEntity {
  id: number;
  username: string;
  password: string;
  fullName?: string;
  email?: string;

  role?: Role;
  branch?: Branch;

  mfaEnabled?: boolean;
  mfaSecret?: string;

  phone?: string;

  active?: boolean;
  lastLogin?: string;
  activo?: boolean;
}

export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  SELLER = "SELLER",
  WAREHOUSE_OP = "WAREHOUSE_OP",
  AUDITOR = "AUDITOR",
}
