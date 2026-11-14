# Aegis &mdash; Cryptographic Password Strength Analyzer & Security Laboratory

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-sql.js-003B57.svg)](https://sqlite.org/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-yellow.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An interactive, cryptographic security platform and password evaluation laboratory designed for an engineering internship submission. This system analyzes password strength through statistical Shannon entropy metrics, spatial keyboard walk recognition, NIST SP 800-63B guidelines, and zero-knowledge _k_-anonymity breach verification, complemented by a salted Bcrypt password reuse prevention database.

---

## 🎯 Key Objectives & Learning Outcomes

1. **Information Entropy ($H$)**: Measuring true password unpredictability via Shannon Entropy ($-\sum p_i \log_2 p_i$) and effective brute-force bit search space ($L \cdot \log_2 N$) rather than naive length rules.
2. **Pattern & Sequence Detection**: Identifying spatial keyboard walks (`qwerty`, `asdfgh`), sequential characters (`abc`, `12345`), repeated single and multi-character runs (`aaaa`, `abcabc`), calendar years ($1900-2099$), and leetspeak dictionary variants (`p@ssw0rd`).
3. **Zero-Knowledge $k$-Anonymity**: Querying billions of compromised credentials via truncated 5-character SHA-1 prefix models without leaking plaintext or complete hashes over the wire.
4. **Adaptive Salting & Hashing**: Demonstrating one-way adaptive cryptographic hashing (Bcrypt cost factor 12) with random 128-bit salting to prevent rainbow table precomputation and block credential reuse.
5. **Algorithmic Alternatives Generator**: Producing high-entropy Diceware passphrases and cryptographically random tokens using `window.crypto.getRandomValues()` (never `Math.random`).

---

## 🏗️ Architecture & Project Structure

```text
├── client/                      # Frontend Application (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/              # Three.js Holographic Padlock & Orbital Shield
│   │   │   ├── analyzer/        # Gauge, StrengthBar, Checklist, CrackTime, History Guard
│   │   │   ├── background/      # 60fps Canvas Particle Network & Perspective Floor
│   │   │   ├── hero/            # Landing Hero with character reveal & stats row
│   │   │   ├── how-it-works/    # Interactive Cryptography Labs & Pipeline Visualizer
│   │   │   └── ui/              # GlassCard, NeonButton, GlowBadge, SectionTitle, AnimatedCounter
│   │   ├── lib/
│   │   │   ├── data/            # Top 10,000 common passwords JSON & 500+ wordlist
│   │   │   ├── analyzer.js      # Pure, UI-agnostic password evaluation engine
│   │   │   ├── analyzer.test.js # 30 Vitest unit test cases
│   │   │   ├── breachChecker.js # Client-side SHA-1 & k-anonymity service
│   │   │   ├── suggest.js       # Alternatives generator with crypto.getRandomValues
│   │   │   └── suggest.test.js  # 8 Vitest unit test cases
│   │   ├── App.jsx              # Main dashboard view
│   │   ├── index.css            # Cyber theme, glassmorphism, & CSS variables
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                      # Backend API (Node.js + Express + SQLite + Bcrypt)
│   ├── src/
│   │   ├── app.js               # Express app, middleware (Helmet, CORS, rateLimit, Zod)
│   │   ├── app.test.js          # Supertest integration test suite (7 tests)
│   │   ├── db.js                # SQLite schema (users, password_history) & pruning
│   │   └── server.js            # Express server entrypoint
│   ├── data/                    # SQLite database storage (aegis.db)
│   ├── eslint.config.js
│   └── package.json
├── package.json                 # Monorepo workspaces & concurrent runner
├── .prettierrc                  # Code style formatting rules
└── README.md                    # Project documentation
```

---

## 🔬 Interactive Cryptography Laboratory ("How It Works")

The application embeds an interactive educational suite teaching core cryptographic fundamentals:

1. **End-to-End Cryptographic Dataflow Pipeline**: An animated SVG diagram tracing data traversal across 5 distinct stages: _Input → Heuristic Engine → Adaptive Hashing → Zero-Knowledge Verification → Security Verdict_.
2. **Live SHA-256 Matrix Hasher & Avalanche Visualizer**: Demonstrates the cryptographic avalanche effect in real time with a digital matrix scramble as characters mutate.
3. **Interactive 128-Bit Salting Engine**: Shows how identical plaintext passwords produce radically distinct, unpredictable Bcrypt hashes (`$2b$12$[SALT][HASH]`), destroying precomputed rainbow tables.
4. **Scroll-Triggered Cryptographic Deep Dives**: Framer Motion reveals for Shannon Information Entropy, Slow Adaptive Hashing (Bcrypt vs MD5/SHA-256), Salting, Threat Modeling (Brute Force vs Dictionary & Rule Engines), and $k$-Anonymity.
5. **NIST SP 800-63B Defense Accordion**: Expandable best practices covering passphrase length, credential stuffing mitigation, password managers, and phishing-resistant MFA (FIDO2/WebAuthn).

---

## 📡 Backend API Documentation

Base URL: `http://localhost:5000` (proxied in development to `/api`)

### Security Headers & Rate Limits

- **`helmet`**: Enforces secure HTTP headers (HSTS, Content-Security-Policy, X-Frame-Options).
- **`express-rate-limit`**:
  - Global API limiter: 120 requests / minute.
  - Credential evaluation limiter (`/api/check-reuse`, `/api/save-password`): 30 requests / minute to prevent automated brute-force probing.
- **Input Validation**: Strictly enforced via `zod` schemas.
- **Zero Plaintext Logging**: Plaintext credentials are never written to logs or stored.

---

### Endpoints

#### 1. `POST /api/check-reuse`

Compares an incoming password against the user's last 10 stored salted bcrypt hashes.

- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "username": "intern@aegis.dev",
    "password": "MySecretPassword2024!"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "reused": true,
    "countChecked": 4,
    "message": "Password matches one of your last 4 stored passwords!"
  }
  ```
- **Error Response (`400 Bad Request`)**:
  ```json
  {
    "error": "Validation failed",
    "details": ["Username must be at least 2 characters"]
  }
  ```

---

#### 2. `POST /api/save-password`

Hashes incoming password with Bcrypt (**cost factor 12, random salt**). Stores only the hash in SQLite and automatically prunes hashes older than the last 10 entries for that account.

- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "username": "intern@aegis.dev",
    "password": "NewFortressPassphrase#99"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Salted bcrypt hash (cost factor 12) successfully stored in history.",
    "historyCount": 5,
    "user": {
      "username": "intern@aegis.dev",
      "id": 1
    }
  }
  ```

---

#### 3. `GET /api/breach-check/:sha1prefix`

Proxies the HaveIBeenPwned range API using the $k$-anonymity model. Only the first 5 hexadecimal characters of the SHA-1 digest are transmitted.

- **Parameters**: `sha1prefix` &mdash; Exactly 5 hex characters (`/^[0-9A-Fa-f]{5}$/`, e.g. `5BAA6`).
- **Headers Included**: `Add-Padding: true` (prevents response size side-channel leakage).
- **Success Response (`200 OK`)**:
  ```text
  0018A45C4D1DEF81644B54AB7F969B88D65:1
  00D4F6E8F66CBC13D1602B77A4FB3A304B4:3
  ...
  ```
- **Error Response (`400 Bad Request`)**:
  ```json
  {
    "error": "Invalid prefix: must be exactly 5 hexadecimal characters (0-9, A-F)"
  }
  ```

---

#### 4. `GET /api/health`

Health check and service status probe.

- **Success Response (`200 OK`)**:
  ```json
  {
    "status": "ok",
    "service": "AEGIS Password Security & History API",
    "timestamp": "2026-11-13T00:30:00.000Z"
  }
  ```

---

## 🔒 Security Principles Demonstrated

1. **No Plaintext Persistence**: Plaintext credentials are never stored to database tables or printed in logs. Only salted bcrypt hashes (`$2b$12$...`) are persisted.
2. **Adaptive Work Factor (Cost 12)**: Bcrypt utilizes $2^{12} = 4,096$ key derivation iterations per comparison, rendering offline GPU cracking attacks computationally unfeasible (~$10,000\text{ attempts/sec}$ compared to $10^{10}\text{ attempts/sec}$ for unsalted MD5/SHA-256).
3. **128-Bit Salting**: Each hash incorporates 16 bytes of cryptographically secure random salt, guaranteeing identical passwords generate entirely unique hash outputs and defeating precomputed rainbow tables.
4. **Zero-Knowledge $k$-Anonymity**: The client computes the SHA-1 hash locally in browser memory using `crypto.subtle.digest('SHA-1')`. Only the 5-character prefix is queried over the wire, ensuring neither our backend nor HaveIBeenPwned ever learns the user's password or complete hash.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x, v20.x, v22+, or v24)
- [npm](https://www.npmjs.com/) (v9.x or higher)

### Installation

```bash
git clone <repository-url>
cd "Password strength analyzer"
npm install
```

### Running in Development

Starts both the **Express API** (`http://localhost:5000`) and the **Vite Client** (`http://localhost:5173`) concurrently:

```bash
npm run dev
```

### Running Automated Test Suites

Runs all 38 client unit tests and 7 backend integration tests across both workspaces:

```bash
npm test
```

### Code Quality & Linting

```bash
npm run lint    # ESLint across client & server
npm run format  # Prettier formatting
```

---

## 📄 License

This project is licensed under the MIT License.
