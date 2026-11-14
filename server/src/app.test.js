import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from './app.js';
import { clearDb } from './db.js';

describe('AEGIS Backend Security API Integration Tests', () => {
  process.env.BCRYPT_ROUNDS = '4'; // Fast rounds for tests

  beforeEach(async () => {
    await clearDb();
  });

  describe('GET /api/health', () => {
    it('returns 200 OK and status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toContain('AEGIS');
    });
  });

  describe('POST /api/check-reuse & POST /api/save-password', () => {
    it('validates required fields with zod and rejects invalid payload', async () => {
      const resMissing = await request(app).post('/api/save-password').send({});
      expect(resMissing.status).toBe(400);
      expect(resMissing.body.error).toBe('Validation failed');

      const resBadUser = await request(app).post('/api/save-password').send({
        username: 'a', // too short (< 2)
        password: 'ValidPassword123!',
      });
      expect(resBadUser.status).toBe(400);
      expect(resBadUser.body.details).toBeDefined();
    });

    it('returns reused: false when user has no prior history', async () => {
      const res = await request(app).post('/api/check-reuse').send({
        username: 'alice',
        password: 'FirstPassword123!',
      });
      expect(res.status).toBe(200);
      expect(res.body.reused).toBe(false);
      expect(res.body.countChecked).toBe(0);
    });

    it('saves salted bcrypt hash and prevents password reuse', async () => {
      const testUser = 'bob_dev';
      const testPassword = 'SecretP@ssword2024!';

      // 1. Save password to history
      const saveRes = await request(app).post('/api/save-password').send({
        username: testUser,
        password: testPassword,
      });
      expect(saveRes.status).toBe(200);
      expect(saveRes.body.success).toBe(true);
      expect(saveRes.body.historyCount).toBe(1);

      // 2. Check reuse with exact same password -> MUST BE TRUE
      const checkSameRes = await request(app).post('/api/check-reuse').send({
        username: testUser,
        password: testPassword,
      });
      expect(checkSameRes.status).toBe(200);
      expect(checkSameRes.body.reused).toBe(true);
      expect(checkSameRes.body.countChecked).toBe(1);

      // 3. Check reuse with different password -> MUST BE FALSE
      const checkDiffRes = await request(app).post('/api/check-reuse').send({
        username: testUser,
        password: 'CompletelyDifferentPassword99#',
      });
      expect(checkDiffRes.status).toBe(200);
      expect(checkDiffRes.body.reused).toBe(false);
    });

    it('maintains strict retention of the last 10 passwords only', async () => {
      const username = 'retention_user';

      // Save 12 distinct passwords sequentially
      for (let i = 1; i <= 12; i++) {
        await request(app)
          .post('/api/save-password')
          .send({
            username,
            password: `IterationPassword_${i}_Secret!`,
          });
      }

      // 1st password should have been pruned (exceeds 10 retention window)
      const resFirstPruned = await request(app).post('/api/check-reuse').send({
        username,
        password: 'IterationPassword_1_Secret!',
      });
      expect(resFirstPruned.body.reused).toBe(false);

      // 12th (most recent) password must be present
      const resRecent = await request(app).post('/api/check-reuse').send({
        username,
        password: 'IterationPassword_12_Secret!',
      });
      expect(resRecent.body.reused).toBe(true);
      expect(resRecent.body.countChecked).toBe(10);
    });
  });

  describe('GET /api/breach-check/:sha1prefix', () => {
    it('rejects invalid sha1prefix formats', async () => {
      const resShort = await request(app).get('/api/breach-check/123'); // 3 chars
      expect(resShort.status).toBe(400);

      const resNonHex = await request(app).get('/api/breach-check/GGGGG'); // invalid hex
      expect(resNonHex.status).toBe(400);
    });

    it('proxies valid 5-char hex prefix and returns matching suffixes', async () => {
      // 5BAA6 is SHA-1 prefix for "password"
      const res = await request(app).get('/api/breach-check/5BAA6');
      if (res.status === 200) {
        expect(res.headers['content-type']).toContain('text/plain');
        expect(res.text).toContain(':');
      } else {
        // Handle external network sandbox limitation gracefully
        expect([502, 504]).toContain(res.status);
      }
    });
  });
});
