import { describe, it, expect, beforeAll } from 'vitest';
import {
  analyzePassword,
  calculateShannonEntropy,
  detectKeyboardWalks,
  detectSequences,
  detectRepeatedPatterns,
  detectYearsAndDates,
  detectLeetspeak,
  formatCrackTime,
  isCommonPassword,
  loadCommonPasswords,
} from './analyzer';

describe('Password Analyzer Pure Module', () => {
  beforeAll(async () => {
    // Ensure the top 10k dataset is loaded for testing
    await loadCommonPasswords();
  });

  // 1. Edge Case: Empty string
  it('1. correctly handles empty string input', () => {
    const res = analyzePassword('');
    expect(res.length.length).toBe(0);
    expect(res.length.category).toBe('empty');
    expect(res.score).toBe(0);
    expect(res.label).toBe('Very Weak');
    expect(res.weaknesses).toContain('Password cannot be empty.');
    expect(res.crackTime.onlineThrottled.formatted).toBe('instant');
  });

  // 2. Edge Case: Null and undefined input
  it('2. safely handles null and undefined inputs without throwing', () => {
    const resNull = analyzePassword(null);
    const resUndef = analyzePassword(undefined);
    expect(resNull.length.length).toBe(0);
    expect(resUndef.length.length).toBe(0);
    expect(resNull.score).toBe(0);
    expect(resUndef.score).toBe(0);
  });

  // 3. Edge Case: Non-string input (numbers, objects)
  it('3. safely coerces numbers or objects to string', () => {
    const resNum = analyzePassword(12345678);
    expect(resNum.length.length).toBe(8);
    expect(resNum.characterClasses.digit).toBe(true);
    expect(resNum.characterClasses.lower).toBe(false);
  });

  // 4. Edge Case: Very long input (1,000 characters) without performance degradation
  it('4. efficiently handles very long input (1000 chars)', () => {
    const longPw = 'A1!'.repeat(334); // 1002 chars
    const start = performance.now();
    const res = analyzePassword(longPw);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(100); // Must be under 100ms
    expect(res.length.length).toBeGreaterThan(1000);
    expect(res.length.category).toBe('very_long');
    expect(res.score).toBeGreaterThanOrEqual(70);
  });

  // 5. Edge Case: Emojis and multibyte Unicode
  it('5. accurately counts multibyte Unicode and emojis as single code points', () => {
    const emojiPw = '🔒P@ssword123!🚀';
    const res = analyzePassword(emojiPw);
    // 🔒 (1) + P@ssword123! (12) + 🚀 (1) = 14 code points
    expect(res.length.length).toBe(14);
    expect(res.characterClasses.unicode).toBe(true);
    expect(res.characterClasses.symbol).toBe(true);
    expect(res.characterClasses.upper).toBe(true);
    expect(res.characterClasses.lower).toBe(true);
    expect(res.characterClasses.digit).toBe(true);
  });

  // 6. Edge Case: Non-Latin Unicode characters (Japanese, Cyrillic)
  it('6. detects non-Latin Unicode characters properly', () => {
    const res = analyzePassword('日本語パスワード2024!');
    expect(res.characterClasses.unicode).toBe(true);
    expect(res.characterClasses.digit).toBe(true);
    expect(res.characterClasses.symbol).toBe(true);
  });

  // 7. Edge Case: Single character
  it('7. evaluates single-character passwords as Very Weak', () => {
    const res = analyzePassword('x');
    expect(res.length.length).toBe(1);
    expect(res.score).toBeLessThan(25);
    expect(res.label).toBe('Very Weak');
    expect(res.weaknesses).toContain(
      'Critically short: passwords under 8 characters can be broken in seconds.'
    );
  });

  // 8. Edge Case: Whitespace only
  it('8. handles whitespace-only strings', () => {
    const res = analyzePassword('     ');
    expect(res.length.length).toBe(5);
    expect(res.characterClasses.lower).toBe(false);
    expect(res.characterClasses.upper).toBe(false);
    expect(res.score).toBeLessThan(25);
  });

  // 9. Character Class Check: All lowercase
  it('9. flags missing uppercase, numbers, and symbols in lowercase-only', () => {
    const res = analyzePassword('onlylowercasehere');
    expect(res.characterClasses.lower).toBe(true);
    expect(res.characterClasses.upper).toBe(false);
    expect(res.characterClasses.digit).toBe(false);
    expect(res.characterClasses.symbol).toBe(false);
    expect(res.weaknesses).toContain('Missing uppercase letters.');
    expect(res.weaknesses).toContain('Missing numeric digits.');
    expect(res.weaknesses).toContain('Missing special symbols or Unicode characters.');
  });

  // 10. Character Class Check: All digits
  it('10. flags missing letters and symbols in digits-only input', () => {
    const res = analyzePassword('984719283741');
    expect(res.characterClasses.digit).toBe(true);
    expect(res.characterClasses.lower).toBe(false);
    expect(res.characterClasses.upper).toBe(false);
    expect(res.characterClasses.count).toBe(1);
    expect(res.characterClasses.poolSize).toBe(10);
  });

  // 11. Common Password Detection: Top list breach
  it('11. identifies common passwords from the top 10,000 dataset', () => {
    expect(isCommonPassword('password')).toBe(true);
    expect(isCommonPassword('123456')).toBe(true);
    expect(isCommonPassword('admin123')).toBe(true);

    const res = analyzePassword('password123');
    expect(res.patterns.isCommonPassword).toBe(true);
    expect(res.score).toBeLessThanOrEqual(15);
    expect(res.label).toBe('Very Weak');
    expect(res.weaknesses.some((w) => w.includes('breached credential'))).toBe(true);
  });

  // 12. Pattern Detection: Keyboard walks (forward & reverse)
  it('12. detects QWERTY and keypad keyboard walks', () => {
    const walks1 = detectKeyboardWalks('qwerty123');
    expect(walks1).toContain('qwerty');

    const walks2 = detectKeyboardWalks('myasdfghpass');
    expect(walks2).toContain('asdfgh');

    const walksRev = detectKeyboardWalks('poiu_reverse');
    expect(walksRev).toContain('poiu');

    const res = analyzePassword('MySuperqwertyKey!');
    expect(res.patterns.hasKeyboardWalk).toBe(true);
    expect(res.entropy.penalties.keyboardWalks).toBeGreaterThan(0);
  });

  // 13. Pattern Detection: Numeric and alphabetical sequences
  it('13. detects numeric and alphabetical sequences', () => {
    const seqAlpha = detectSequences('abcSecret');
    expect(seqAlpha).toContain('abc');

    const seqNum = detectSequences('Pass12345');
    expect(seqNum).toContain('12345');

    const seqRev = detectSequences('Key98765');
    expect(seqRev).toContain('98765');

    const res = analyzePassword('Testing12345!');
    expect(res.patterns.hasSequence).toBe(true);
    expect(res.entropy.penalties.sequences).toBeGreaterThan(0);
  });

  // 14. Pattern Detection: Repeated single characters and chunks
  it('14. detects repeated characters and multi-character chunks', () => {
    const repSingle = detectRepeatedPatterns('passaaa111');
    expect(repSingle).toContain('aaa');
    expect(repSingle).toContain('111');

    const repChunk = detectRepeatedPatterns('abcabcabc');
    expect(repChunk.length).toBeGreaterThan(0);

    const res = analyzePassword('Passssssword');
    expect(res.patterns.hasRepeatedChars).toBe(true);
    expect(res.entropy.penalties.repeatedChars).toBeGreaterThan(0);
  });

  // 15. Pattern Detection: Years and calendar dates
  it('15. detects 4-digit years and common date patterns', () => {
    const years = detectYearsAndDates('SecretSummer1998!');
    expect(years).toContain('1998');

    const modernYear = detectYearsAndDates('Pass2025!');
    expect(modernYear).toContain('2025');

    const res = analyzePassword('Berlin2024Summer');
    expect(res.patterns.hasYearOrDate).toBe(true);
    expect(res.entropy.penalties.yearsAndDates).toBeGreaterThan(0);
  });

  // 16. Pattern Detection: Leetspeak versions of common words
  it('16. detects leetspeak substitutions of common roots (e.g. p@ssw0rd, 4dm1n)', () => {
    const leet1 = detectLeetspeak('p@ssw0rd!');
    expect(leet1.length).toBeGreaterThan(0);
    expect(leet1[0].rootWord).toBe('password');

    const leet2 = detectLeetspeak('4dm1n');
    expect(leet2.length).toBeGreaterThan(0);
    expect(leet2[0].rootWord).toBe('admin');

    const res = analyzePassword('P@ssw0rd123!');
    expect(res.patterns.hasLeetspeak).toBe(true);
    expect(res.entropy.penalties.leetspeak).toBeGreaterThan(0);
  });

  // 17. Shannon Entropy Math: Symbol distribution
  it('17. calculates correct Shannon entropy per symbol and total bits', () => {
    // All identical characters: entropy must be 0
    const zeroEntropy = calculateShannonEntropy('aaaaaa');
    expect(zeroEntropy.perSymbol).toBe(0);
    expect(zeroEntropy.totalBits).toBe(0);

    // Two distinct characters equally distributed: entropy = 1.0 bit/char
    const binaryEntropy = calculateShannonEntropy('abababab');
    expect(binaryEntropy.perSymbol).toBe(1.0);
    expect(binaryEntropy.totalBits).toBe(8.0);

    // High diversity string
    const highEntropy = calculateShannonEntropy('abcdefgh');
    expect(highEntropy.perSymbol).toBe(3.0);
  });

  // 18. Ideal vs Effective Entropy: Pattern penalties impact
  it('18. applies realistic deductions to effective entropy when patterns exist', () => {
    const plain = analyzePassword('abcdef123456');
    expect(plain.entropy.penalties.sequences).toBeGreaterThan(0);
    expect(plain.entropy.effectiveBits).toBeLessThan(plain.entropy.idealBits);
  });

  // 19. Crack Time Estimation: 3 Attack Scenarios
  it('19. calculates crack time across online, fast GPU, and slow bcrypt scenarios', () => {
    const res = analyzePassword('Tr0ub4dor&3');
    expect(res.crackTime.onlineThrottled.seconds).toBeGreaterThan(0);
    expect(res.crackTime.offlineFastHash.seconds).toBeGreaterThanOrEqual(0);
    expect(res.crackTime.offlineSlowHash.seconds).toBeGreaterThan(0);

    // Online throttled should take much longer than offline fast GPU
    expect(res.crackTime.onlineThrottled.seconds).toBeGreaterThan(
      res.crackTime.offlineFastHash.seconds
    );
  });

  // 20. Crack Time Formatting
  it('20. formats crack times into human-readable strings correctly', () => {
    expect(formatCrackTime(0)).toBe('instant');
    expect(formatCrackTime(0.5)).toBe('< 1 second');
    expect(formatCrackTime(25)).toBe('25 seconds');
    expect(formatCrackTime(300)).toBe('5 minutes');
    expect(formatCrackTime(7200)).toBe('2 hours');
    expect(formatCrackTime(86400 * 5)).toBe('5 days');
    expect(formatCrackTime(86400 * 45)).toBe('1 month');
    expect(formatCrackTime(86400 * 365.25 * 10)).toBe('10 years');
    expect(formatCrackTime(86400 * 365.25 * 300)).toBe('3 centuries');
    expect(formatCrackTime(86400 * 365.25 * 2500000)).toBe('2.5 million years');
  });

  // 21. High-Entropy XKCD Passphrase Evaluation
  it('21. rates strong multi-word passphrases with high score', () => {
    const res = analyzePassword('correct-horse-battery-staple');
    expect(res.length.length).toBe(28);
    expect(res.score).toBeGreaterThanOrEqual(75);
    expect(['Strong', 'Excellent']).toContain(res.label);
    expect(res.crackTime.offlineFastHash.formatted).not.toBe('instant');
  });

  // 22. High-Entropy Cryptographic Token Evaluation
  it('22. rates cryptographically pseudorandom strings as Excellent', () => {
    const res = analyzePassword('X9#kQ!7$zW2@vL8&mP');
    expect(res.length.length).toBe(18);
    expect(res.characterClasses.count).toBe(4);
    expect(res.score).toBeGreaterThanOrEqual(85);
    expect(res.label).toBe('Excellent');
    expect(res.weaknesses.length).toBe(0);
  });

  // 23. Weak Credential Evaluation
  it('23. rates weak credentials as Weak or Very Weak with clear feedback', () => {
    const res = analyzePassword('iloveyou1');
    expect(['Weak', 'Very Weak']).toContain(res.label);
    expect(res.weaknesses.length).toBeGreaterThan(0);
  });

  // 24. Fair Credential Evaluation
  it('24. correctly classifies intermediate passwords as Fair', () => {
    const res = analyzePassword('AutumnK1te$');
    expect(res.length.length).toBe(11);
    expect(res.characterClasses.count).toBe(4);
    expect(['Fair', 'Strong']).toContain(res.label);
  });

  // 25. Actionable Suggestions: Helpful guidance provided
  it('25. provides specific, constructive guidance for improving credentials', () => {
    const res = analyzePassword('nouppercase123!');
    expect(res.weaknesses).toContain('Missing uppercase letters.');

    const resNoNum = analyzePassword('NoNumbersHere!');
    expect(resNoNum.weaknesses).toContain('Missing numeric digits.');

    const resNoSym = analyzePassword('NoSymbolsHere123');
    expect(resNoSym.weaknesses).toContain(
      'Missing special symbols or Unicode characters.'
    );
  });

  // 26. Edge Case: 5,000 characters extreme input
  it('26. handles extreme input length (5000 chars) under 20ms', () => {
    const extreme = 'aB9#'.repeat(1250);
    const start = performance.now();
    const res = analyzePassword(extreme);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(50);
    expect(res.length.length).toBe(5000);
    expect(res.length.category).toBe('very_long');
    expect(res.score).toBeGreaterThanOrEqual(85);
  });

  // 27. Complex Emojis with ZWJ and skin-tone modifiers
  it('27. handles complex emojis without crashing or splitting', () => {
    const complexEmoji = '👨‍👩‍👧‍👦Password2024!';
    const res = analyzePassword(complexEmoji);
    expect(res.characterClasses.unicode).toBe(true);
    expect(res.characterClasses.upper).toBe(true);
    expect(res.characterClasses.lower).toBe(true);
    expect(res.characterClasses.digit).toBe(true);
  });

  // 28. All symbols without any alphanumeric
  it('28. accurately scores symbols-only input', () => {
    const res = analyzePassword('!@#$%^&*()_+~`');
    expect(res.characterClasses.symbol).toBe(true);
    expect(res.characterClasses.lower).toBe(false);
    expect(res.characterClasses.upper).toBe(false);
    expect(res.characterClasses.digit).toBe(false);
    expect(res.weaknesses).toContain('Missing lowercase letters.');
    expect(res.weaknesses).toContain('Missing uppercase letters.');
    expect(res.weaknesses).toContain('Missing numeric digits.');
  });

  // 29. Multi-Pattern Combination Penalties
  it('29. accumulates penalties for multi-pattern combinations (walk + sequence + year)', () => {
    const res = analyzePassword('qwerty1232024');
    expect(res.patterns.hasKeyboardWalk).toBe(true);
    expect(res.patterns.hasSequence).toBe(true);
    expect(res.patterns.hasYearOrDate).toBe(true);
    expect(res.entropy.penalties.total).toBeGreaterThan(20);
    expect(['Weak', 'Very Weak']).toContain(res.label);
    expect(res.score).toBeLessThan(45);
  });

  // 30. Custom Common Password Set Override
  it('30. supports custom common password Set overrides via options', () => {
    const customSet = new Set(['mycompanycustomsecret']);
    const res = analyzePassword('mycompanycustomsecret', {
      commonPasswordsSet: customSet,
    });
    expect(res.patterns.isCommonPassword).toBe(true);
    expect(res.score).toBeLessThanOrEqual(15);
  });
});
