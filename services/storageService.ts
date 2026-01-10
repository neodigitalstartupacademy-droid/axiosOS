
import { DiagnosticReport, AuthUser } from '../types';

const DB_NAME = 'ndsa_master_vault_v8';
const DB_VERSION = 2;
const STORES = {
  REPORTS: 'reports',
  USER_DNA: 'user_dna',
  ACADEMY_PROGRESS: 'academy_progress',
  CHATS: 'chats'
};

export const storageService = {
  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        Object.values(STORES).forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async saveItem(storeName: string, item: any): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getItem(storeName: string, id: string): Promise<any> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async getAllReports(): Promise<DiagnosticReport[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.REPORTS, 'readonly');
      const store = transaction.objectStore(STORES.REPORTS);
      const request = store.getAll();
      request.onsuccess = () => {
        const results = (request.result || []).map(r => ({ ...r, date: new Date(r.date) }));
        resolve(results.sort((a, b) => b.date.getTime() - a.date.getTime()));
      };
      request.onerror = () => reject(request.error);
    });
  },

  async deleteReport(id: string): Promise<void> {
    const db = await this.init();
    const transaction = db.transaction(STORES.REPORTS, 'readwrite');
    transaction.objectStore(STORES.REPORTS).delete(id);
  },

  async saveReport(report: DiagnosticReport): Promise<void> {
    await this.saveItem(STORES.REPORTS, report);
  }
};
