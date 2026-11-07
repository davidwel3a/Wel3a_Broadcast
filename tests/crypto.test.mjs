import test from 'node:test';
import assert from 'node:assert/strict';
import { encryptToken, decryptToken } from '../lib/crypto.ts';

test('Cryptography Module - AES-256-GCM', async (t) => {
  await t.test('encrypts and decrypts token losslessly', () => {
    const originalToken = 'mock_test_token_aes_256_sample_value_xyz_123456';
    const encrypted = encryptToken(originalToken);

    assert.notEqual(encrypted.encrypted, originalToken);
    assert.equal(typeof encrypted.iv, 'string');
    assert.equal(typeof encrypted.tag, 'string');

    const decrypted = decryptToken(encrypted);
    assert.equal(decrypted, originalToken);
  });

  await t.test('fails to decrypt if payload has been tampered with', () => {
    const encrypted = encryptToken('secret-token');
    // Tamper with the encrypted string
    const tampered = {
      ...encrypted,
      encrypted: '00' + encrypted.encrypted.substring(2),
    };

    assert.throws(() => {
      decryptToken(tampered);
    }, /Unsupported state or unable to authenticate data/);
  });
});
