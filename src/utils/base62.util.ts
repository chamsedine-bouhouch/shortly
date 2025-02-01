import { createHash } from 'crypto';

const BASE62_ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SHORT_CODE_LENGTH = 6;
const HASH_SNIPPET_LENGTH = 10;

/**
 * Encodes a number into a Base62 string.
 * @param num - The number to encode.
 * @param minLength - The minimum length of the encoded string.
 * @returns Base62 encoded string.
 */
export function encodeBase62(
  num: number,
  minLength = SHORT_CODE_LENGTH,
): string {
  if (num < 0) throw new Error('Number must be non-negative');

  let encoded = '';
  while (num > 0) {
    encoded = BASE62_ALPHABET[num % 62] + encoded;
    num = Math.floor(num / 62);
  }
  return encoded.padStart(minLength, '0');
}

/**
 * Decodes a Base62 string back to a number.
 * @param str - The Base62 string to decode.
 * @returns The decoded number.
 */
export function decodeBase62(str: string): number {
  if (!/^[0-9a-zA-Z]+$/.test(str)) throw new Error('Invalid Base62 string');

  return str
    .split('')
    .reduce((acc, char) => acc * 62 + BASE62_ALPHABET.indexOf(char), 0);
}

/**
 * Generates a Base62 short code from a URL hash.
 * @param url - The URL to hash.
 * @param minLength - The minimum length of the short code.
 * @returns A Base62 short code.
 */
export function hashUrlToBase62(
  url: string,
  minLength = SHORT_CODE_LENGTH,
): string {

  const hash = createHash('sha256').update(url).digest('hex');
  const hexSnippet = hash.substring(0, HASH_SNIPPET_LENGTH);

  // Handle potential parse errors
  const decimalValue = parseInt(hexSnippet, 16);
  if (isNaN(decimalValue)) throw new Error('Failed to generate hash from URL');

  const maxValue = Math.pow(62, minLength) - 1;
  const limitedValue = decimalValue % maxValue;

  return encodeBase62(limitedValue, minLength);
}
