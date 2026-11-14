import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DB_DIR, 'aegis.db');

let dbInstance = null;

/**
 * Initializes and returns the SQLite database instance.
 * Automatically creates tables if not present and persists to data/aegis.db.
 */
export async function getDb() {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  let db;
  if (fs.existsSync(DB_FILE)) {
    const fileBuffer = fs.readFileSync(DB_FILE);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Initialize schema
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL COLLATE NOCASE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS password_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_history_user_id ON password_history(user_id);
  `);

  // Helper to persist database state to disk
  db.persist = () => {
    try {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_FILE, buffer);
    } catch (err) {
      // Handle disk write errors safely without crashing
      console.error('[DB-PERSIST-ERROR]', err.message);
    }
  };

  // Initial persist
  db.persist();

  dbInstance = db;
  return dbInstance;
}

/**
 * Finds a user by username or creates one if not found.
 *
 * @param {string} username
 * @returns {Promise<{ id: number, username: string, created_at: string }>}
 */
export async function getOrCreateUser(username) {
  const db = await getDb();
  const cleanUsername = username.trim().toLowerCase();

  // 1. Try finding existing
  const stmt = db.prepare(
    'SELECT id, username, created_at FROM users WHERE username = ?'
  );
  stmt.bind([cleanUsername]);
  let user = null;
  if (stmt.step()) {
    user = stmt.getAsObject();
  }
  stmt.free();

  if (user) return user;

  // 2. Insert new user
  db.run('INSERT INTO users (username) VALUES (?)', [cleanUsername]);
  db.persist();

  // 3. Fetch newly created user
  const fetchStmt = db.prepare(
    'SELECT id, username, created_at FROM users WHERE username = ?'
  );
  fetchStmt.bind([cleanUsername]);
  if (fetchStmt.step()) {
    user = fetchStmt.getAsObject();
  }
  fetchStmt.free();

  return user;
}

/**
 * Retrieves the last N password hashes for a given user.
 *
 * @param {number} userId
 * @param {number} [limit=10]
 * @returns {Promise<Array<{ id: number, hash: string, created_at: string }>>}
 */
export async function getPasswordHistory(userId, limit = 10) {
  const db = await getDb();
  const stmt = db.prepare(`
    SELECT id, hash, created_at
    FROM password_history
    WHERE user_id = ?
    ORDER BY id DESC
    LIMIT ?
  `);
  stmt.bind([userId, limit]);

  const history = [];
  while (stmt.step()) {
    history.push(stmt.getAsObject());
  }
  stmt.free();

  return history;
}

/**
 * Inserts a new password hash for a user and keeps only the latest N (default: 10).
 *
 * @param {number} userId
 * @param {string} hash
 * @param {number} [keepLast=10]
 * @returns {Promise<{ insertedId: number, totalKept: number }>}
 */
export async function addPasswordHash(userId, hash, keepLast = 10) {
  const db = await getDb();

  // 1. Insert new hash
  db.run('INSERT INTO password_history (user_id, hash) VALUES (?, ?)', [userId, hash]);

  // 2. Delete hashes older than the last keepLast entries for this user
  db.run(
    `
    DELETE FROM password_history
    WHERE user_id = ? AND id NOT IN (
      SELECT id FROM password_history
      WHERE user_id = ?
      ORDER BY id DESC
      LIMIT ?
    )
  `,
    [userId, userId, keepLast]
  );

  db.persist();

  // 3. Count remaining
  const countStmt = db.prepare(
    'SELECT COUNT(*) as count FROM password_history WHERE user_id = ?'
  );
  countStmt.bind([userId]);
  let count = 0;
  if (countStmt.step()) {
    count = countStmt.getAsObject().count;
  }
  countStmt.free();

  return { totalKept: count };
}

/**
 * Resets / clears tables (useful for unit testing).
 */
export async function clearDb() {
  const db = await getDb();
  db.run('DELETE FROM password_history;');
  db.run('DELETE FROM users;');
  db.persist();
}
