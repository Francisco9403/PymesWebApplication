package com.backend.app.model;

import java.time.LocalDateTime;

import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class SyncEntity {
    private String localId; // UUID generado en el cliente (PouchDB/SQLite)
    private LocalDateTime serverUpdatedAt;
    private Boolean isDeleted = false;
    private Long version; // Optimistic Locking para conflictos de sincronización
}
