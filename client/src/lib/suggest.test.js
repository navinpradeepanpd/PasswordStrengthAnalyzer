import { describe, it, expect } from 'vitest';
import {
  getCryptoRandomInt,
  getCryptoRandomItem,
  generatePassphrase,
  generateRandomPassword,
  generateImprovedVariants,
  getStrongerAlternatives,
} from './suggest';

describe('Stronger Alternatives & Generator Module', () => {
  it('1. getCryptoRandomInt generates numbers strictly within [min, max]', () => {
    for (let i = 0; i < 50; i++) {
      const val = getCryptoRandomInt(10, 20);
      expect(val).toBeGreaterThanOrEqual(10);
      expect(val).toBeLessThanOrEqual(20);
    }
  });

  it('2. getCryptoRandomItem picks an element from an array', () => {
    const arr = ['alpha', 'beta', 'gamma'];
    const item = getCryptoRandomItem(arr);
    expect(arr).toContain(item);
  });

  it('3. generatePassphrase produces 4-word phrase separated by hyphens', () => {
    const phrase = generatePassphrase({
      wordCount: 4,
      separator: '-',
      includeNumber: true,
    });
    expect(typeof phrase).toBe('string');
    const parts = phrase.split('-');
    // 4 words + 1 number/symbol token = 5 parts
    expect(parts.length).toBeGreaterThanOrEqual(4);
  });

  it('4. generateRandomPassword respects length constraint (8-64)', () => {
    const pw16 = generateRandomPassword({ length: 16 });
    expect(pw16.length).toBe(16);

    const pw32 = generateRandomPassword({ length: 32 });
    expect(pw32.length).toBe(32);

    const pwClamped = generateRandomPassword({ length: 4 }); // should clamp to 8
    expect(pwClamped.length).toBe(8);
  });

  it('5. generateRandomPassword respects character class toggles', () => {
    const onlyDigits = generateRandomPassword({
      length: 12,
      uppercase: false,
      lowercase: false,
      numbers: true,
      symbols: false,
    });
    expect(/^[0-9]+$/.test(onlyDigits)).toBe(true);
  });

  it('6. generateImprovedVariants generates 3 distinct enhanced variants', () => {
    const variants = generateImprovedVariants('london2024');
    expect(variants.length).toBe(3);
    variants.forEach((v) => {
      expect(v).not.toBe('london2024');
      expect(v.length).toBeGreaterThan('london2024'.length);
    });
  });

  it('7. getStrongerAlternatives returns candidates with re-run analyzePassword scores', () => {
    const alternatives = getStrongerAlternatives('password123');
    expect(alternatives.length).toBe(5);

    alternatives.forEach((alt) => {
      expect(alt.password).toBeDefined();
      expect(typeof alt.score).toBe('number');
      expect(alt.label).toBeDefined();
      expect(alt.analysis).toBeDefined();
      // All suggestions must improve over raw 'password123'
      expect(alt.score).toBeGreaterThan(15);
    });
  });

  it('8. passphrase and random tokens achieve high or excellent scores', () => {
    const alternatives = getStrongerAlternatives('weak');
    const passphrase = alternatives.find((a) => a.id === 'passphrase');
    const random = alternatives.find((a) => a.id === 'random');

    expect(passphrase.score).toBeGreaterThanOrEqual(70);
    expect(random.score).toBeGreaterThanOrEqual(80);
  });
});
