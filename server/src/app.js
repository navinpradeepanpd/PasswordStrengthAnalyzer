import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { getOrCreateUser, getPasswordHistory, addPasswordHash } from './db.js';

const app = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);
app.use(express.json({ limit: '10kb' }));

// Global Rate Limiting: 120 requests per minute
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again shortly.' },
});
app.use(globalLimiter);

// Specific stricter limiter for password endpoints to prevent brute-force probing
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30, // 30 attempts per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded for credential evaluation. Please slow down.' },
});

// Zod Validation Schemas
const credentialSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .trim()
    .min(2, 'Username must be at least 2 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      'Username can only contain alphanumeric, dash, dot, and underscore'
    ),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password cannot be empty')
    .max(256, 'Password length exceeds security limit'),
});

const sha1PrefixSchema = z
  .string()
  .trim()
  .regex(/^[0-9A-Fa-f]{5}$/, 'Prefix must be exactly 5 hexadecimal characters');

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AEGIS Password Security & History API',
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/check-reuse
 * Compares incoming password against the user's last 10 stored salted bcrypt hashes.
 * Plaintext passwords are NEVER logged or stored.
 */
app.post('/api/check-reuse', authLimiter, async (req, res) => {
  try {
    const parseResult = credentialSchema.safeParse(req.body);
    if (!parseResult.success) {
      const messages = (parseResult.error.issues || parseResult.error.errors || []).map(
        (e) => e.message
      );
      return res.status(400).json({
        error: 'Validation failed',
        details: messages,
      });
    }

    const { username, password } = parseResult.data;

    const user = await getOrCreateUser(username);
    const history = await getPasswordHistory(user.id, 10);

    if (history.length === 0) {
      return res.json({
        reused: false,
        countChecked: 0,
        message: 'No previous password history found for this user.',
      });
    }

    // Compare against stored bcrypt hashes
    let isReused = false;
    for (const entry of history) {
      const match = await bcrypt.compare(password, entry.hash);
      if (match) {
        isReused = true;
        break;
      }
    }

    return res.json({
      reused: isReused,
      countChecked: history.length,
      message: isReused
        ? `Password matches one of your last ${history.length} stored passwords!`
        : `Verified: Not found in your last ${history.length} stored passwords.`,
    });
  } catch (err) {
    console.error('[CHECK-REUSE-ERROR]', err.message);
    return res
      .status(500)
      .json({ error: 'Internal server error evaluating password reuse.' });
  }
});

/**
 * POST /api/save-password
 * Hashes incoming password with bcrypt (cost factor 12, salted).
 * Stores only the hash in the database and retains the last 10 entries.
 * Plaintext passwords are NEVER logged or stored.
 */
app.post('/api/save-password', authLimiter, async (req, res) => {
  try {
    const parseResult = credentialSchema.safeParse(req.body);
    if (!parseResult.success) {
      const messages = (parseResult.error.issues || parseResult.error.errors || []).map(
        (e) => e.message
      );
      return res.status(400).json({
        error: 'Validation failed',
        details: messages,
      });
    }

    const { username, password } = parseResult.data;

    // Hash with Bcrypt (cost 12 by default, or configurable via env)
    const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;
    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await getOrCreateUser(username);
    const { totalKept } = await addPasswordHash(user.id, hash, 10);

    return res.json({
      success: true,
      message: 'Salted bcrypt hash (cost factor 12) successfully stored in history.',
      historyCount: totalKept,
      user: {
        username: user.username,
        id: user.id,
      },
    });
  } catch (err) {
    console.error('[SAVE-PASSWORD-ERROR]', err.message);
    return res.status(500).json({ error: 'Internal server error saving password hash.' });
  }
});

/**
 * GET /api/breach-check/:sha1prefix
 * Proxies the HaveIBeenPwned range API using k-anonymity.
 * Only the first 5 hexadecimal characters are transmitted.
 * Handles timeouts and API errors gracefully.
 */
app.get('/api/breach-check/:sha1prefix', async (req, res) => {
  try {
    const prefixResult = sha1PrefixSchema.safeParse(req.params.sha1prefix);
    if (!prefixResult.success) {
      return res.status(400).json({
        error: 'Invalid prefix: must be exactly 5 hexadecimal characters (0-9, A-F)',
      });
    }

    const prefix = prefixResult.data.toUpperCase();

    // Call HIBP Range API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const hibpUrl = `https://api.pwnedpasswords.com/range/${prefix}`;
    const response = await fetch(hibpUrl, {
      headers: {
        'User-Agent': 'Aegis-Password-Analyzer/1.0',
        'Add-Padding': 'true',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return res.status(502).json({
        error: `HIBP API returned upstream error status ${response.status}`,
      });
    }

    const bodyText = await response.text();
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24h as breach counts for prefixes are static
    return res.send(bodyText);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Upstream breach check request timed out.' });
    }
    console.error('[BREACH-CHECK-PROXY-ERROR]', err.message);
    return res.status(502).json({ error: 'Failed to contact breach database.' });
  }
});

export default app;
