import dotenv from 'dotenv';
import app from './app.js';
import { getDb } from './db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize SQLite database and start listening
getDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[AEGIS-SERVER] Security API online on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[AEGIS-SERVER-INIT-FAILED]', err);
    process.exit(1);
  });
