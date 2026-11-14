/**
 * Zero-Knowledge k-Anonymity Breach Checker
 * Uses the Web Cryptography API to compute SHA-1 digests client-side.
 * Sends ONLY the first 5 characters of the hash to the HaveIBeenPwned API,
 * keeping the user's password completely private (k-anonymity guarantee).
 */

const prefixCache = new Map();

/**
 * Computes SHA-1 hexadecimal digest using crypto.subtle in the browser.
 *
 * @param {string} str
 * @returns {Promise<string>} 40-character uppercase hex hash
 */
export async function sha1(str) {
  if (!str) return '';
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

/**
 * Checks whether a password has appeared in known data breaches.
 *
 * @param {string} password
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ isBreached: boolean, breachCount: number, error: string|null }>}
 */
export async function checkPwnedPassword(password, signal = null) {
  if (!password || typeof password !== 'string' || password.length === 0) {
    return { isBreached: false, breachCount: 0, error: null };
  }

  try {
    const fullHash = await sha1(password);
    const prefix = fullHash.slice(0, 5);
    const suffix = fullHash.slice(5);

    let rangeText = prefixCache.get(prefix);

    if (!rangeText) {
      // Fetch matching hash suffixes: Use backend proxy to adhere to k-anonymity, with direct fallback
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      let response;
      try {
        response = await fetch(`/api/breach-check/${prefix}`, {
          signal: signal || controller.signal,
        });
        if (!response.ok) throw new Error('Proxy error');
      } catch {
        // Fallback to direct HIBP Range API
        response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
          headers: { 'Add-Padding': 'true' },
          signal: signal || controller.signal,
        });
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HIBP API returned status ${response.status}`);
      }

      rangeText = await response.text();
      prefixCache.set(prefix, rangeText);
    }

    // Match suffix in returned lines
    // Format per line: SUFFIX:COUNT
    const lines = rangeText.split('\n');
    for (const line of lines) {
      const [hashSuffix, countStr] = line.trim().split(':');
      if (hashSuffix && hashSuffix.toUpperCase() === suffix) {
        const count = parseInt(countStr, 10);
        return {
          isBreached: count > 0,
          breachCount: isNaN(count) ? 1 : count,
          error: null,
        };
      }
    }

    return { isBreached: false, breachCount: 0, error: null };
  } catch (err) {
    return {
      isBreached: false,
      breachCount: 0,
      error: err.name === 'AbortError' ? 'Lookup timed out' : 'Network unavailable',
    };
  }
}
