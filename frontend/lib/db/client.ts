import PouchDB from 'pouchdb-browser';

// Extender PouchDB con plugins si es necesario en el futuro (ej. find, authentication)
// PouchDB.plugin(require('pouchdb-find'));

// Tipado de documentos básicos
export interface BaseDoc {
    _id: string;
    _rev?: string;
    createdAt: number;
    updatedAt: number;
    type: string;
}

// Inicialización Lazy del cliente para evitar problemas de SSR (Server-Side Rendering) en Next.js
class DBClient {
    private static instance: PouchDB.Database;

    public static getInstance(): PouchDB.Database {
        if (!DBClient.instance) {
            if (typeof window !== 'undefined') {
                // En frontend: Usar PouchDB en el navegador para Offline-First
                DBClient.instance = new PouchDB('pymes_y_comercios_local_db', {
                    auto_compaction: true,
                });
            } else {
                // En backend (SSR): Usar temporalmente un mock o un PouchDB en memoria
                // Esto previene errores de PouchDB-browser en Node.js
                DBClient.instance = new PouchDB('memory_db', { adapter: 'memory' } as any);
            }
        }
        return DBClient.instance;
    }
}

export const db = DBClient.getInstance;
