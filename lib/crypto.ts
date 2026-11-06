import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

/**
 * Returns the 32-byte master encryption key buffer.
 * Falls back to a deterministic development key if not configured.
 */
function getMasterKey(): Buffer {
  const secret = process.env.ENCRYPTION_MASTER_KEY;
  if (!secret) {
    return crypto.createHash('sha256').update('rolebeacon-fallback-local-master-key-2026').digest();
  }
  try {
    const buf = Buffer.from(secret, 'hex');
    if (buf.length === 32) return buf;
    return crypto.createHash('sha256').update(secret).digest();
  } catch {
    return crypto.createHash('sha256').update(secret).digest();
  }
}

export interface EncryptedData {
  encrypted: string;
  iv: string;
  tag: string;
}

/**
 * Encrypts sensitive string using AES-256-GCM with authentication tag.
 */
export function encryptToken(text: string): EncryptedData {
  const key = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');

  return {
    encrypted,
    iv: iv.toString('hex'),
    tag,
  };
}

/**
 * Decrypts an AES-256-GCM encrypted payload and verifies authentication tag.
 */
export function decryptToken(encryptedData: EncryptedData): string {
  const key = getMasterKey();
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(encryptedData.iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
