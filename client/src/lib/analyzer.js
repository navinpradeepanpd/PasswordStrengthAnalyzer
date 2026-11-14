/**
 * Password Strength Analyzer Core Module
 * Pure cryptographic, information entropy, pattern detection, and crack-time evaluation library.
 */

// Top common password fallback cache (sync)
let commonPasswordsCache = null;

/**
 * Lazily loads the full ~10,000 common passwords dataset.
 * Returns a Set for O(1) membership lookup.
 */
export async function loadCommonPasswords() {
  if (!commonPasswordsCache) {
    try {
      const data = await import('./data/commonPasswords.json');
      const list = data.default || data;
      commonPasswordsCache = new Set(list.map((p) => String(p).toLowerCase()));
    } catch {
      // In case dynamic import fails or during unit tests with fallback
      commonPasswordsCache = new Set(TOP_COMMON_PASSWORDS_FALLBACK);
    }
  }
  return commonPasswordsCache;
}

/**
 * Synchronous setter / initializer for the common passwords Set.
 * Useful for tests or preloading.
 */
export function setCommonPasswords(passwordsArray) {
  if (Array.isArray(passwordsArray)) {
    commonPasswordsCache = new Set(passwordsArray.map((p) => String(p).toLowerCase()));
  } else if (passwordsArray instanceof Set) {
    commonPasswordsCache = passwordsArray;
  }
}

/**
 * Top well-known breached passwords baseline (fallback until 10k JSON is loaded)
 */
export const TOP_COMMON_PASSWORDS_FALLBACK = [
  'password',
  '123456',
  '123456789',
  'guest',
  'qwerty',
  '12345678',
  '111111',
  '12345',
  '1234567',
  'dragon',
  '123123',
  'baseball',
  'football',
  'monkey',
  'letmein',
  'shadow',
  'master',
  '666666',
  'superman',
  'trustno1',
  '1234567890',
  'iloveyou',
  'princess',
  'admin',
  'welcome',
  'sunshine',
  'starwars',
  'killer',
  'charlie',
  'jordan',
  'michael',
  'secret',
  'freedom',
  'password1',
  'monkey1',
  'pass123',
  'test123',
  'admin123',
  'root',
  'toor',
  'passcode',
  'changeme',
  '00000000',
  'password123',
  'p@ssword',
  'p@ssw0rd',
  'welcome1',
  'welcome123',
  'admin123',
  'qwerty123',
  'asdfghjkl',
  'zxcvbnm',
];

// QWERTY keyboard rows (forward and reverse)
const KEYBOARD_ROWS = [
  '`1234567890-=',
  '~!@#$%^&*()_+',
  'qwertyuiop[]\\',
  'QWERTYUIOP{}|',
  "asdfghjkl;'",
  'ASDFGHJKL:"',
  'zxcvbnm,./',
  'ZXCVBNM<>?',
  '7894561230', // Keypad
];

// Common leetspeak substitutions
const LEET_MAP = {
  '@': 'a',
  4: 'a',
  8: 'b',
  3: 'e',
  1: 'i',
  '!': 'i',
  0: 'o',
  $: 's',
  5: 's',
  7: 't',
  '+': 't',
};

const COMMON_ROOT_WORDS = [
  'password',
  'admin',
  'welcome',
  'login',
  'master',
  'system',
  'secret',
  'access',
  'security',
  'secure',
  'football',
  'monkey',
  'dragon',
  'shadow',
  'superman',
  'batman',
  'iloveyou',
  'trust',
  'freedom',
  'hunter',
  'killer',
  'winter',
  'summer',
  'spring',
  'autumn',
  'star',
  'sunshine',
  'princess',
];

/**
 * Calculates Shannon Entropy: H = -sum(p_i * log2(p_i))
 *
 * @param {string} str
 * @returns {{ perSymbol: number, totalBits: number }}
 */
export function calculateShannonEntropy(str) {
  if (!str || typeof str !== 'string') return { perSymbol: 0, totalBits: 0 };
  const chars = Array.from(str);
  const len = chars.length;
  if (len === 0) return { perSymbol: 0, totalBits: 0 };

  const frequencies = {};
  for (const c of chars) {
    frequencies[c] = (frequencies[c] || 0) + 1;
  }

  let entropy = 0;
  for (const c in frequencies) {
    const p = frequencies[c] / len;
    entropy -= p * Math.log2(p);
  }

  return {
    perSymbol: Number(entropy.toFixed(3)),
    totalBits: Number((entropy * len).toFixed(2)),
  };
}

/**
 * Detects keyboard walks across QWERTY and keypad layouts.
 * e.g. 'qwerty', 'asdf', '0987', 'poiu' (length >= 3)
 *
 * @param {string} str
 * @returns {string[]} matched walks
 */
export function detectKeyboardWalks(str) {
  if (!str || typeof str !== 'string' || str.length < 3) return [];
  const matches = new Set();
  const lower = str.toLowerCase();

  for (const row of KEYBOARD_ROWS) {
    const rowLower = row.toLowerCase();
    const rowRev = rowLower.split('').reverse().join('');

    // Check windows of length 3 to 8
    for (let len = 3; len <= Math.min(8, lower.length); len++) {
      for (let i = 0; i <= lower.length - len; i++) {
        const sub = lower.slice(i, i + len);
        if (rowLower.includes(sub) || rowRev.includes(sub)) {
          matches.add(str.slice(i, i + len));
        }
      }
    }
  }

  // Deduplicate substrings that are subsets of longer matches
  const sorted = Array.from(matches).sort((a, b) => b.length - a.length);
  const result = [];
  for (const item of sorted) {
    if (!result.some((existing) => existing.includes(item) && existing !== item)) {
      result.push(item);
    }
  }

  return result;
}

/**
 * Detects sequential alphabet and numeric characters (e.g. 'abc', '123', 'zyx', '987').
 *
 * @param {string} str
 * @returns {string[]} matched sequences
 */
export function detectSequences(str) {
  if (!str || typeof str !== 'string' || str.length < 3) return [];
  const chars = Array.from(str);
  const sequences = [];
  let current = [chars[0]];
  let dir = 0; // 1 for asc, -1 for desc

  for (let i = 1; i < chars.length; i++) {
    const prevCode = chars[i - 1].charCodeAt(0);
    const currCode = chars[i].charCodeAt(0);
    const diff = currCode - prevCode;

    if (diff === 1 || diff === -1) {
      if (dir === 0) {
        dir = diff;
        current.push(chars[i]);
      } else if (dir === diff) {
        current.push(chars[i]);
      } else {
        if (current.length >= 3) {
          sequences.push(current.join(''));
        }
        current = [chars[i - 1], chars[i]];
        dir = diff;
      }
    } else {
      if (current.length >= 3) {
        sequences.push(current.join(''));
      }
      current = [chars[i]];
      dir = 0;
    }
  }

  if (current.length >= 3) {
    sequences.push(current.join(''));
  }

  return sequences;
}

/**
 * Detects repeated characters (e.g. 'aaa', '1111') and repeated multi-character chunks (e.g. 'abcabc', 'passpass').
 *
 * @param {string} str
 * @returns {string[]} matched repetitions
 */
export function detectRepeatedPatterns(str) {
  if (!str || typeof str !== 'string' || str.length < 3) return [];
  const results = new Set();

  // 1. Repeated single characters (length >= 3)
  const singleCharRuns = str.match(/(.)\1{2,}/g) || [];
  singleCharRuns.forEach((run) => results.add(run));

  // 2. Repeated multi-character chunks (e.g. 'abcabc', '1212', up to chunk length 12)
  const maxChunk = Math.min(12, Math.floor(str.length / 2));
  for (let chunkLen = 2; chunkLen <= maxChunk; chunkLen++) {
    for (let i = 0; i <= str.length - chunkLen * 2; i++) {
      const chunk = str.slice(i, i + chunkLen);
      const nextChunk = str.slice(i + chunkLen, i + chunkLen * 2);
      if (chunk.toLowerCase() === nextChunk.toLowerCase()) {
        results.add(str.slice(i, i + chunkLen * 2));
      }
    }
  }

  return Array.from(results);
}

/**
 * Detects years (1900-2099) and common date patterns.
 *
 * @param {string} str
 * @returns {string[]} matched years and dates
 */
export function detectYearsAndDates(str) {
  if (!str || typeof str !== 'string' || str.length < 4) return [];
  const results = new Set();

  // Years: 1900 - 2099
  const yearMatches = str.match(/(?:19[0-9]{2}|20[0-9]{2})/g) || [];
  yearMatches.forEach((y) => results.add(y));

  // Formatted date patterns: DD/MM/YYYY, MM-DD-YY, etc.
  const dateMatches =
    str.match(
      /\b\d{1,2}[-/.](?:0[1-9]|1[0-2]|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[-/.](?:\d{2}|\d{4})\b/gi
    ) || [];
  dateMatches.forEach((d) => results.add(d));

  return Array.from(results);
}

/**
 * Detects leetspeak substitutions of common dictionary words (e.g. 'p@ssw0rd' -> 'password', 'adm!n' -> 'admin').
 *
 * @param {string} str
 * @returns {Array<{ original: string, normalized: string, rootWord: string }>}
 */
export function detectLeetspeak(str) {
  if (!str || typeof str !== 'string' || str.length < 3) return [];

  // Normalize leet chars to lowercase letters
  let normalized = '';
  for (const c of str.toLowerCase()) {
    normalized += LEET_MAP[c] || c;
  }

  const matches = [];
  for (const root of COMMON_ROOT_WORDS) {
    if (normalized.includes(root)) {
      matches.push({
        original: str,
        normalized,
        rootWord: root,
      });
      break;
    }
  }

  return matches;
}

/**
 * Formats a duration in seconds to human-readable format.
 * e.g. 'instant', '3 seconds', '14 hours', '3 centuries', '2.4 million years'
 *
 * @param {number} seconds
 * @returns {string}
 */
export function formatCrackTime(seconds) {
  if (!isFinite(seconds) || seconds <= 0.01) return 'instant';

  const MINUTE = 60;
  const HOUR = 3600;
  const DAY = 86400;
  const MONTH = DAY * 30.4375;
  const YEAR = DAY * 365.25;
  const CENTURY = YEAR * 100;
  const MILLION_YEARS = YEAR * 1000000;
  const BILLION_YEARS = YEAR * 1000000000;

  if (seconds < 1) return '< 1 second';
  if (seconds < MINUTE) return `${Math.round(seconds)} seconds`;
  if (seconds < HOUR) {
    const mins = Math.round(seconds / MINUTE);
    return mins === 1 ? '1 minute' : `${mins} minutes`;
  }
  if (seconds < DAY) {
    const hrs = Math.round(seconds / HOUR);
    return hrs === 1 ? '1 hour' : `${hrs} hours`;
  }
  if (seconds < MONTH) {
    const days = Math.round(seconds / DAY);
    return days === 1 ? '1 day' : `${days} days`;
  }
  if (seconds < YEAR) {
    const months = Math.round(seconds / MONTH);
    return months === 1 ? '1 month' : `${months} months`;
  }
  if (seconds < CENTURY) {
    const yrs = Math.round(seconds / YEAR);
    return yrs === 1 ? '1 year' : `${yrs.toLocaleString()} years`;
  }
  if (seconds < MILLION_YEARS) {
    const cents = Math.round(seconds / CENTURY);
    return cents === 1 ? '1 century' : `${cents.toLocaleString()} centuries`;
  }
  if (seconds < BILLION_YEARS) {
    const my = (seconds / MILLION_YEARS).toFixed(1);
    return `${Number(my).toLocaleString()} million years`;
  }

  const by = (seconds / BILLION_YEARS).toFixed(1);
  return `${Number(by).toLocaleString()} billion years`;
}

/**
 * Synchronous check whether a password is in the common passwords set.
 * Uses loaded cache or fallback set.
 *
 * @param {string} password
 * @param {Set<string>} [customSet]
 * @returns {boolean}
 */
export function isCommonPassword(password, customSet = null) {
  if (!password || typeof password !== 'string') return false;
  const target = password.trim().toLowerCase();
  if (customSet instanceof Set) {
    return customSet.has(target);
  }
  if (commonPasswordsCache instanceof Set) {
    return commonPasswordsCache.has(target);
  }
  return TOP_COMMON_PASSWORDS_FALLBACK.includes(target);
}

/**
 * Main Password Strength & Cryptographic Analyzer Function
 *
 * @param {string} password - The raw password string
 * @param {Object} [options]
 * @param {Set<string>} [options.commonPasswordsSet] - Optional preloaded Set of common passwords
 * @returns {Object} Comprehensive analysis telemetry and score
 */
export function analyzePassword(password, options = {}) {
  // Normalize input
  const rawStr = password == null ? '' : String(password);
  const codePoints = Array.from(rawStr);
  const length = codePoints.length;

  // 1. Length Score & Category
  let lengthCategory = 'empty';
  let lengthScore = 0;

  if (length === 0) {
    lengthCategory = 'empty';
    lengthScore = 0;
  } else if (length < 8) {
    lengthCategory = 'very_short';
    lengthScore = Math.round((length / 8) * 15);
  } else if (length < 12) {
    lengthCategory = 'short';
    lengthScore = 15 + Math.round(((length - 8) / 4) * 20);
  } else if (length < 16) {
    lengthCategory = 'medium';
    lengthScore = 35 + Math.round(((length - 12) / 4) * 25);
  } else if (length < 24) {
    lengthCategory = 'long';
    lengthScore = 60 + Math.round(((length - 16) / 8) * 25);
  } else {
    lengthCategory = 'very_long';
    lengthScore = 85 + Math.min(15, Math.round((length - 24) * 0.5));
  }

  // 2. Character-Class Checks & Pool Size
  const hasLower = /[a-z]/.test(rawStr);
  const hasUpper = /[A-Z]/.test(rawStr);
  const hasDigit = /[0-9]/.test(rawStr);
  const hasSymbol = /[^a-zA-Z0-9\s\p{L}]/u.test(rawStr);
  const hasUnicode = /[\u0080-\u{10FFFF}]/u.test(rawStr);

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasDigit) poolSize += 10;
  if (hasSymbol) poolSize += 33;
  if (hasUnicode) poolSize += 128; // Standard Unicode extension pool cardinality

  const classCount = [hasLower, hasUpper, hasDigit, hasSymbol, hasUnicode].filter(
    Boolean
  ).length;

  // 3. Shannon Entropy & Ideal Bits
  const shannonResult = calculateShannonEntropy(rawStr);
  const idealBits =
    poolSize > 0 && length > 0 ? Number((length * Math.log2(poolSize)).toFixed(2)) : 0;

  // 4. Pattern Detection
  const keyboardWalks = detectKeyboardWalks(rawStr);
  const sequences = detectSequences(rawStr);
  const repeatedPatterns = detectRepeatedPatterns(rawStr);
  const yearsAndDates = detectYearsAndDates(rawStr);
  const leetspeakMatches = detectLeetspeak(rawStr);
  const commonMatch = isCommonPassword(rawStr, options.commonPasswordsSet);

  // 5. Pattern Penalties Calculation
  let penaltyRepeated = 0;
  if (repeatedPatterns.length > 0) {
    penaltyRepeated = Math.min(30, repeatedPatterns.length * 8);
  }

  let penaltySequences = 0;
  if (sequences.length > 0) {
    penaltySequences = Math.min(25, sequences.length * 6);
  }

  let penaltyWalks = 0;
  if (keyboardWalks.length > 0) {
    penaltyWalks = Math.min(30, keyboardWalks.length * 9);
  }

  let penaltyYears = 0;
  if (yearsAndDates.length > 0) {
    penaltyYears = Math.min(20, yearsAndDates.length * 8);
  }

  let penaltyLeetspeak = 0;
  if (leetspeakMatches.length > 0) {
    penaltyLeetspeak = 20;
  }

  let penaltyCommon = 0;
  if (commonMatch) {
    penaltyCommon = 50;
  }

  const totalPenalties =
    penaltyRepeated +
    penaltySequences +
    penaltyWalks +
    penaltyYears +
    penaltyLeetspeak +
    penaltyCommon;

  // Effective entropy bits
  let effectiveBits = Math.max(0, idealBits - totalPenalties);
  if (commonMatch) {
    effectiveBits = Math.min(effectiveBits, 4); // Immediate break if in breach lists
  }
  effectiveBits = Number(effectiveBits.toFixed(2));

  // 6. Estimated Crack Times
  // Candidate search space: 2^effectiveBits (average guesses to find = 2^effectiveBits / 2)
  const candidateGuesses =
    effectiveBits > 0 ? Math.pow(2, Math.min(effectiveBits, 128)) / 2 : 0;

  const onlineGuessesPerSec = 100; // 100 attempts / sec (online rate-limited attack)
  const offlineFastGpuPerSec = 10000000000; // 10B attempts / sec (offline GPU cluster for fast hashes)
  const offlineSlowBcryptPerSec = 10000; // 10,000 attempts / sec (offline slow adaptive bcrypt)

  const crackTime = {
    onlineThrottled: {
      seconds: length === 0 ? 0 : candidateGuesses / onlineGuessesPerSec,
      formatted:
        length === 0
          ? 'instant'
          : formatCrackTime(candidateGuesses / onlineGuessesPerSec),
    },
    offlineFastHash: {
      seconds: length === 0 ? 0 : candidateGuesses / offlineFastGpuPerSec,
      formatted:
        length === 0
          ? 'instant'
          : formatCrackTime(candidateGuesses / offlineFastGpuPerSec),
    },
    offlineSlowHash: {
      seconds: length === 0 ? 0 : candidateGuesses / offlineSlowBcryptPerSec,
      formatted:
        length === 0
          ? 'instant'
          : formatCrackTime(candidateGuesses / offlineSlowBcryptPerSec),
    },
  };

  // 7. Overall Score (0 - 100)
  let rawScore = 0;
  if (length > 0) {
    // 40% Weight on length
    const scoreLen = Math.min(40, (length / 16) * 40);

    // 25% Weight on character diversity (5 points per class, up to 25)
    const scoreDiversity = classCount * 5;

    // 35% Weight on effective entropy (75 bits = 35 pts)
    const scoreEntropy = Math.min(35, (effectiveBits / 75) * 35);

    rawScore = scoreLen + scoreDiversity + scoreEntropy;

    // Deduct for patterns
    if (keyboardWalks.length > 0) rawScore -= 8;
    if (sequences.length > 0) rawScore -= 8;
    if (repeatedPatterns.length > 0) rawScore -= 8;
    if (yearsAndDates.length > 0) rawScore -= 6;
    if (leetspeakMatches.length > 0) rawScore -= 10;
    if (commonMatch) rawScore = Math.min(rawScore, 10);
  }

  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  // 8. Qualitative Strength Label
  let label = 'Very Weak';
  if (score >= 85) {
    label = 'Excellent';
  } else if (score >= 70) {
    label = 'Strong';
  } else if (score >= 50) {
    label = 'Fair';
  } else if (score >= 25) {
    label = 'Weak';
  } else {
    label = 'Very Weak';
  }

  // 9. Actionable Weaknesses & Suggestions
  const weaknesses = [];
  const suggestions = [];

  if (length === 0) {
    weaknesses.push('Password cannot be empty.');
    suggestions.push('Enter a secure passphrase with at least 14-16 characters.');
  } else {
    if (length < 8) {
      weaknesses.push(
        'Critically short: passwords under 8 characters can be broken in seconds.'
      );
      suggestions.push('Increase length to a minimum of 12-16 characters.');
    } else if (length < 12) {
      weaknesses.push(
        'Slightly short: modern security standards recommend at least 12 characters.'
      );
      suggestions.push('Add more words or characters to achieve 14+ character length.');
    }

    if (commonMatch) {
      weaknesses.push(
        'Direct match found in top breached credential lists &mdash; completely unsafe.'
      );
      suggestions.push('Never use common words or leaked passwords.');
    }

    if (keyboardWalks.length > 0) {
      weaknesses.push(
        `Contains keyboard walk pattern (${keyboardWalks
          .slice(0, 2)
          .map((w) => `'${w}'`)
          .join(', ')}).`
      );
      suggestions.push('Avoid spatial keyboard runs like qwerty or asdf.');
    }

    if (sequences.length > 0) {
      weaknesses.push(
        `Contains sequential characters (${sequences
          .slice(0, 2)
          .map((s) => `'${s}'`)
          .join(', ')}).`
      );
      suggestions.push(
        'Replace predictable sequences (123, abc) with non-sequential characters.'
      );
    }

    if (repeatedPatterns.length > 0) {
      weaknesses.push(
        `Contains repeated characters or chunks (${repeatedPatterns
          .slice(0, 2)
          .map((r) => `'${r}'`)
          .join(', ')}).`
      );
      suggestions.push('Avoid repeating identical characters consecutively.');
    }

    if (yearsAndDates.length > 0) {
      weaknesses.push(
        `Contains calendar year or date pattern (${yearsAndDates.slice(0, 2).join(', ')}).`
      );
      suggestions.push(
        'Avoid birth years or memorable dates easily targeted by personal profiling.'
      );
    }

    if (leetspeakMatches.length > 0) {
      weaknesses.push(
        `Contains predictable leetspeak substitution of '${leetspeakMatches[0].rootWord}'.`
      );
      suggestions.push(
        "Simple replacements like '@' for 'a' or '0' for 'o' are easily reversed by dictionary attacks."
      );
    }

    if (!hasUpper) weaknesses.push('Missing uppercase letters.');
    if (!hasLower) weaknesses.push('Missing lowercase letters.');
    if (!hasDigit) weaknesses.push('Missing numeric digits.');
    if (!hasSymbol && !hasUnicode)
      weaknesses.push('Missing special symbols or Unicode characters.');

    if (weaknesses.length === 0 || score >= 85) {
      suggestions.push(
        'Excellent credential. Use a password manager to store it safely.'
      );
    }
  }

  return {
    length: {
      length,
      score: lengthScore,
      category: lengthCategory,
      isAcceptable: length >= 12,
    },
    characterClasses: {
      lower: hasLower,
      upper: hasUpper,
      digit: hasDigit,
      symbol: hasSymbol,
      unicode: hasUnicode,
      count: classCount,
      poolSize,
    },
    entropy: {
      shannon: shannonResult.perSymbol,
      idealBits,
      effectiveBits,
      penalties: {
        repeatedChars: penaltyRepeated,
        sequences: penaltySequences,
        keyboardWalks: penaltyWalks,
        yearsAndDates: penaltyYears,
        leetspeak: penaltyLeetspeak,
        commonPassword: penaltyCommon,
        total: totalPenalties,
      },
    },
    patterns: {
      hasKeyboardWalk: keyboardWalks.length > 0,
      keyboardWalks,
      hasSequence: sequences.length > 0,
      sequences,
      hasRepeatedChars: repeatedPatterns.length > 0,
      repeatedChars: repeatedPatterns,
      hasYearOrDate: yearsAndDates.length > 0,
      yearsOrDates: yearsAndDates,
      hasLeetspeak: leetspeakMatches.length > 0,
      leetspeakMatches,
      isCommonPassword: commonMatch,
    },
    crackTime,
    score,
    label,
    weaknesses,
    suggestions,
  };
}

export default analyzePassword;
