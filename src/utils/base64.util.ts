import { createHash } from 'crypto';

const BASE62_ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function encodeBase62(num: number, minLength = 6): string {
  let encoded = '';
  while (num > 0) {
    encoded = BASE62_ALPHABET[num % 62] + encoded;
    num = Math.floor(num / 62);
  }
  return encoded.padStart(minLength, '0'); // Ensure fixed length
}

export function decodeBase62(str: string): number {
  return str
    .split('')
    .reduce((acc, char) => acc * 62 + BASE62_ALPHABET.indexOf(char), 0);
}

export function hashUrlToBase62(url: string, minLength = 6): string {
  const hash = createHash('sha256').update(url).digest('hex'); // Hash the URL
  console.log('hash:', hash);

  const decimalValue = parseInt(hash.substring(0, 10), 16); // Take first 10 hex chars

  console.log('decimalValue:', decimalValue);
  // Ensure the decimalValue is within the range for a 6-character Base62 string
  const maxValue = Math.pow(62, minLength) - 1;
  const limitedValue = decimalValue % maxValue;

  console.log('limitedValue:', limitedValue);

  return encodeBase62(limitedValue, minLength); // Convert to Base62
}
