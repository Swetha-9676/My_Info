import * as SQLite from 'expo-sqlite';
import { RAGEngine } from './RAGEngine';
import { AIService } from './AIService';

export interface Document {
  id: string;
  title: string;
  category: 'Academics' | 'Identity' | 'Finance' | 'Other';
  path: string;
  type: 'pdf' | 'image';
  createdAt: number;
  extractedText?: string;
}

export class DocumentService {
  private static db: SQLite.SQLiteDatabase;

  private static async getDb() {
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync('vault.db');
    }
    return this.db;
  }

  static async getDocuments(): Promise<Document[]> {
    const db = await this.getDb();
    const rows = await db.getAllAsync<Document>('SELECT * FROM documents ORDER BY createdAt DESC');
    return rows;
  }

  static async addDocument(doc: Omit<Document, 'id' | 'createdAt'>): Promise<Document> {
    const db = await this.getDb();
    const id = Math.random().toString(36).substr(2, 9);
    const createdAt = Date.now();
    
    // 🔥 REAL AI EXTRACTION
    const extractedText = await AIService.extractTextFromFile(doc.path, doc.type === 'pdf' ? 'application/pdf' : 'image/jpeg');

    await db.runAsync(
      'INSERT INTO documents (id, title, category, path, type, createdAt, extractedText) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, doc.title, doc.category, doc.path, doc.type, createdAt, extractedText]
    );

    // Also index for search
    await RAGEngine.indexDocument(id, extractedText);

    return { ...doc, id, createdAt, extractedText };
  }

  static async deleteDocument(id: string): Promise<void> {
    const db = await this.getDb();
    await db.runAsync('DELETE FROM documents WHERE id = ?', [id]);
    await db.runAsync('DELETE FROM document_chunks WHERE docId = ?', [id]);
  }
}
