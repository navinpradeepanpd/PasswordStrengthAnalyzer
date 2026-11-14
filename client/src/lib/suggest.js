/**
 * Stronger Password Alternatives & Cryptographic Generator
 * Strictly utilizes window.crypto.getRandomValues (never Math.random)
 * to produce cryptographically sound, unbiased random selections.
 */

import { WORDLIST } from './data/wordlist';
import { analyzePassword } from './analyzer';

const SYMBOLS_POOL = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const DIGITS_POOL = '0123456789';
const UPPERCASE_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_POOL = 'abcdefghijklmnopqrstuvwxyz';

/**
 * Returns an unbiased cryptographically secure random integer between min and max (inclusive).
 * Avoids modulo bias.
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function getCryptoRandomInt(min, max) {
  if (min >= max) return min;
  const range = max - min + 1;
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % range);
  const buffer = new Uint32Array(1);

  let rand;
  do {
    crypto.getRandomValues(buffer);
    rand = buffer[0];
  } while (rand >= limit);

  return min + (rand % range);
}

/**
 * Picks a random item from an array using crypto.getRandomValues.
 *
 * @template T
 * @param {T[]} array
 * @returns {T}
 */
export function getCryptoRandomItem(array) {
  if (!array || array.length === 0) return null;
  const index = getCryptoRandomInt(0, array.length - 1);
  return array[index];
}

/**
 * Shuffles an array in-place using the Fisher-Yates algorithm powered by crypto.getRandomValues.
 *
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 */
export function cryptoShuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getCryptoRandomInt(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Generates a memorable Diceware-style passphrase using words from the bundled wordlist.
 *
 * @param {Object} [options]
 * @param {number} [options.wordCount=4] - Number of words (4-5 recommended)
 * @param {string} [options.separator='-'] - Word separator (e.g. '-', '.', '_', '!')
 * @param {boolean} [options.capitalize=true] - Capitalize the first letter of each word
 * @param {boolean} [options.includeNumber=true] - Append a random 2-digit number for NIST entropy
 * @returns {string}
 */
export function generatePassphrase(options = {}) {
  const {
    wordCount = 4,
    separator = '-',
    capitalize = true,
    includeNumber = true,
  } = options;

  const selectedWords = [];
  for (let i = 0; i < wordCount; i++) {
    let word = getCryptoRandomItem(WORDLIST);
    if (capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    selectedWords.push(word);
  }

  let phrase = selectedWords.join(separator);

  if (includeNumber) {
    const num = getCryptoRandomInt(10, 99);
    const sym = getCryptoRandomItem(['!', '#', '$', '%', '&', '*']);
    phrase = `${phrase}${separator}${num}${sym}`;
  }

  return phrase;
}

/**
 * Generates a fully random cryptographic password using crypto.getRandomValues.
 *
 * @param {Object} [options]
 * @param {number} [options.length=18] - Desired length (8 to 64)
 * @param {boolean} [options.uppercase=true]
 * @param {boolean} [options.lowercase=true]
 * @param {boolean} [options.numbers=true]
 * @param {boolean} [options.symbols=true]
 * @returns {string}
 */
export function generateRandomPassword(options = {}) {
  const {
    length = 18,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true,
  } = options;

  const validLength = Math.max(8, Math.min(64, length));
  let pool = '';
  const guaranteedChars = [];

  if (uppercase) {
    pool += UPPERCASE_POOL;
    guaranteedChars.push(getCryptoRandomItem(UPPERCASE_POOL.split('')));
  }
  if (lowercase) {
    pool += LOWERCASE_POOL;
    guaranteedChars.push(getCryptoRandomItem(LOWERCASE_POOL.split('')));
  }
  if (numbers) {
    pool += DIGITS_POOL;
    guaranteedChars.push(getCryptoRandomItem(DIGITS_POOL.split('')));
  }
  if (symbols) {
    pool += SYMBOLS_POOL;
    guaranteedChars.push(getCryptoRandomItem(SYMBOLS_POOL.split('')));
  }

  // Fallback if all toggles were somehow unchecked
  if (pool.length === 0) {
    pool = LOWERCASE_POOL + DIGITS_POOL;
    guaranteedChars.push(getCryptoRandomItem(LOWERCASE_POOL.split('')));
  }

  const poolChars = pool.split('');
  const passwordChars = [...guaranteedChars];

  // Fill remaining slots
  while (passwordChars.length < validLength) {
    passwordChars.push(getCryptoRandomItem(poolChars));
  }

  // Shuffle to prevent predictable first-position class placement
  return cryptoShuffle(passwordChars).join('');
}

/**
 * Generates 3 intelligent improved versions of a user's current password.
 * Keeps it memorable while eliminating vulnerabilities through:
 * 1. Strategic case inversions & bookend symbol wrapping
 * 2. Syllable-level token interleaving with numbers and symbols
 * 3. Mnemonic hybrid expansion (pairing with a memorable word)
 *
 * @param {string} currentPassword - The base password
 * @returns {string[]} Array of 3 improved variants
 */
export function generateImprovedVariants(currentPassword) {
  const base = (currentPassword || '').trim();

  // If base is empty or very short, produce strong defaults
  if (!base || base.length < 3) {
    return [
      generatePassphrase({ wordCount: 4, separator: '-' }),
      generateRandomPassword({ length: 16 }),
      generatePassphrase({ wordCount: 3, separator: '.', includeNumber: true }),
    ];
  }

  const randomSym1 = getCryptoRandomItem(['!', '#', '$', '%', '&', '*', '@']);
  const randomSym2 = getCryptoRandomItem(['^', '_', '+', '=', '?', '~']);
  const randomDigits = `${getCryptoRandomInt(10, 99)}`;
  const extraWord = getCryptoRandomItem(WORDLIST);
  const capitalizedExtra = extraWord.charAt(0).toUpperCase() + extraWord.slice(1);

  // Variant 1: "Entropy Fortified"
  // Wraps base with cryptographic symbols, toggles case on first/last letter, appends random digits
  const toggledBase =
    base.charAt(0).toUpperCase() +
    base.slice(1, -1) +
    (base.length > 1 ? base.slice(-1).toUpperCase() : '');
  const variant1 = `${randomSym1}${toggledBase}${randomSym2}${randomDigits}`;

  // Variant 2: "Mnemonic Hybrid Expansion"
  // Combines user's base with a random memorable dictionary word and symbol
  const variant2 = `${base}-${capitalizedExtra}#${randomDigits}`;

  // Variant 3: "Syllable Interleaved Token"
  // Inserts a high-entropy 3-character token in the middle of the base
  const midPoint = Math.floor(base.length / 2);
  const midToken = `${randomSym1}${getCryptoRandomInt(1, 9)}${randomSym2}`;
  const variant3 = `${base.slice(0, midPoint)}${midToken}${base.slice(midPoint)}`;

  return [variant1, variant2, variant3];
}

/**
 * Returns a comprehensive suite of suggestions:
 * 3 improved versions of current password + 1 Diceware passphrase + 1 fully random option.
 * Automatically runs analyzePassword on each so scores are immediately available.
 *
 * @param {string} currentPassword
 * @param {Object} [generatorOptions] - Options for the random generator
 * @returns {Array<Object>}
 */
export function getStrongerAlternatives(currentPassword, generatorOptions = {}) {
  const improved = generateImprovedVariants(currentPassword);
  const passphrase = generatePassphrase({ wordCount: 4, separator: '-' });
  const randomToken = generateRandomPassword({
    length: generatorOptions.length || 18,
    uppercase: generatorOptions.uppercase !== false,
    lowercase: generatorOptions.lowercase !== false,
    numbers: generatorOptions.numbers !== false,
    symbols: generatorOptions.symbols !== false,
  });

  const candidates = [
    {
      id: 'enhanced-1',
      type: 'Entropy Fortified',
      password: improved[0],
      description: 'Preserves your base phrase with cryptographic bookends and numbers.',
    },
    {
      id: 'enhanced-2',
      type: 'Mnemonic Hybrid',
      password: improved[1],
      description: 'Pairs your password with a memorable Diceware dictionary word.',
    },
    {
      id: 'enhanced-3',
      type: 'Interleaved Token',
      password: improved[2],
      description: 'Splits syllable boundaries with high-entropy symbols.',
    },
    {
      id: 'passphrase',
      type: 'Diceware Passphrase',
      password: passphrase,
      description: 'Easy for humans to remember, astronomical search space for machines.',
    },
    {
      id: 'random',
      type: 'Quantum Random Token',
      password: randomToken,
      description: 'Maximum mathematical entropy generated via crypto.getRandomValues.',
    },
  ];

  // Re-run analyzePassword on each candidate
  return candidates.map((item) => {
    const analysis = analyzePassword(item.password);
    return {
      ...item,
      analysis,
      score: analysis.score,
      label: analysis.label,
      effectiveBits: analysis.entropy.effectiveBits,
      crackTimeFormatted: analysis.crackTime.offlineFastHash.formatted,
    };
  });
}
