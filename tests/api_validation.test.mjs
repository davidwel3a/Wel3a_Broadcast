import test from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';

test('API & Schema Validation Rules', async (t) => {
  const messageSchema = z.object({
    content: z.string().max(2000, 'Content exceeds 2000 characters').nullable().optional(),
    embed: z.object({
      title: z.string().max(256, 'Title exceeds 256 characters').optional(),
      description: z.string().max(4096, 'Description exceeds 4096 characters').optional(),
      color: z.string().regex(/^#([A-Fa-f0-9]{6})$/, 'Invalid hex color').optional(),
      image: z.string().url().optional(),
    }).nullable().optional(),
    imageUrl: z.string().url().nullable().optional(),
  });

  await t.test('passes valid plain text message under 2000 characters', () => {
    const valid = { content: 'Announcement message here', embed: null, imageUrl: null };
    assert.doesNotThrow(() => messageSchema.parse(valid));
  });

  await t.test('rejects message exceeding 2000 characters', () => {
    const tooLong = { content: 'a'.repeat(2001), embed: null, imageUrl: null };
    assert.throws(() => messageSchema.parse(tooLong));
  });

  await t.test('passes valid embed with hex color and title', () => {
    const embedValid = {
      content: null,
      embed: {
        title: 'Weekly Community Meetup',
        description: 'Join us tonight at 8 PM UTC in the voice lounge.',
        color: '#7c3aed',
      },
      imageUrl: null,
    };
    assert.doesNotThrow(() => messageSchema.parse(embedValid));
  });

  await t.test('rejects embed title exceeding 256 characters', () => {
    const embedTooLong = {
      content: null,
      embed: {
        title: 'x'.repeat(257),
        description: 'Valid description',
        color: '#7c3aed',
      },
      imageUrl: null,
    };
    assert.throws(() => messageSchema.parse(embedTooLong));
  });

  await t.test('rejects invalid embed hex color', () => {
    const invalidColor = {
      content: null,
      embed: {
        title: 'Title',
        description: 'Desc',
        color: 'red-not-hex',
      },
      imageUrl: null,
    };
    assert.throws(() => messageSchema.parse(invalidColor));
  });
});
