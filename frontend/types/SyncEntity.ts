export interface SyncEntity {
  localId?: string;
  serverUpdatedAt?: string; // ISO date
  isDeleted?: boolean;
  version?: number;
}
