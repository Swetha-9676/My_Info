import * as SQLite from 'expo-sqlite';

export class RAGEngine {
  private static db: SQLite.SQLiteDatabase;

  static async initialize() {
    try {
      this.db = await SQLite.openDatabaseAsync('vault.db');
      
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS documents (
          id TEXT PRIMARY KEY,
          title TEXT,
          category TEXT,
          path TEXT,
          type TEXT,
          extractedText TEXT,
          createdAt INTEGER
        );
      `);

      try {
        await this.db.execAsync('ALTER TABLE documents ADD COLUMN type TEXT;');
      } catch (e) {}

      await this.db.execAsync(`
        CREATE VIRTUAL TABLE IF NOT EXISTS document_chunks USING fts5(
          docId,
          content
        );
      `);
      console.log('RAGEngine initialized');
    } catch (error) {
      console.error('RAGEngine Init Error:', error);
    }
  }

  static chunkText(text: string, chunkSize: number = 800, overlap: number = 200): string[] {
    const chunks = [];
    if (!text) return [];
    let i = 0;
    while (i < text.length) {
      chunks.push(text.slice(i, i + chunkSize));
      i += (chunkSize - overlap);
      if (chunkSize - overlap <= 0) break;
    }
    return chunks;
  }

  static async indexDocument(docId: string, text: string) {
    if (!this.db) await this.initialize();
    const chunks = this.chunkText(text);
    for (const chunk of chunks) {
      await this.db.runAsync(
        'INSERT INTO document_chunks (docId, content) VALUES (?, ?)', 
        [docId, chunk]
      );
    }
  }

  static async search(query: string, limit: number = 5): Promise<string[]> {
    if (!this.db) await this.initialize();
    try {
      // 1. Clean the query and split into keywords
      const keywords = query.toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .split(/\s+/)
        .filter(word => word.length > 2); // Only use words longer than 2 chars

      if (keywords.length === 0) return [];

      // 2. Build a multi-keyword LIKE query
      // This is much more robust than a single sentence search
      const likeClauses = keywords.map(() => 'content LIKE ?').join(' OR ');
      const params = keywords.map(word => `%${word}%`);
      
      const sql = `SELECT content FROM document_chunks WHERE ${likeClauses} LIMIT ${limit}`;
      const results = await this.db.getAllAsync<{content: string}>(sql, params);
      
      return results.map(r => r.content);
    } catch (error) {
      console.error('Search Error:', error);
      return [];
    }
  }
}
