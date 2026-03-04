import { Branch } from "./Branch";
import { SyncEntity } from "./SyncEntity";
import { UserRole } from "./UserRole";

export interface User extends SyncEntity {
  id: number;
  username: string;
  password: string;
  fullName?: string;
  email?: string;

  role?: UserRole;
  branch?: Branch;

  mfaEnabled?: boolean;
  mfaSecret?: string;

  phone?: string;

  active?: boolean;
  lastLogin?: string;
  activo?: boolean;
}
