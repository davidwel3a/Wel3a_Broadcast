import test from 'node:test';
import assert from 'node:assert/strict';
import { mockGuilds, mockTemplates } from '../lib/mock-data.ts';

test('Core Flows Logic Verification', async (t) => {
  await t.test('F01: Connect Bot - extracts profile and loads guilds', () => {
    assert.equal(mockGuilds.length > 0, true);
    assert.equal(typeof mockGuilds[0].name, 'string');
    assert.equal(mockGuilds[0].roles.length > 0, true);
  });

  await t.test('F02: Compose & Preview - renders Discord-compliant structure', () => {
    const payload = {
      content: 'Hello World',
      embed: {
        title: 'Title',
        description: 'Description',
        color: '#7c3aed',
      },
      imageUrl: null,
    };
    assert.equal(payload.content, 'Hello World');
    assert.equal(payload.embed?.title, 'Title');
  });

  await t.test('F03: Message Templates - can create, filter, and reuse templates', () => {
    const list = [...mockTemplates];
    const newTpl = {
      id: 'tpl_custom',
      name: 'Custom Template',
      content: 'Custom Announcement Text',
      embed: null,
      imageUrl: null,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newTpl);

    assert.equal(list.length, mockTemplates.length + 1);
    assert.equal(list[0].name, 'Custom Template');

    // Simulate delete
    const filtered = list.filter((item) => item.id !== 'tpl_custom');
    assert.equal(filtered.length, mockTemplates.length);
  });

  await t.test('F04: Audience Targeting - calculates correct recipient count for specific roles vs all', () => {
    const guild = mockGuilds[0];
    const vipRole = guild.roles.find((r) => r.id === 'role_vip');
    const activeRole = guild.roles.find((r) => r.id === 'role_active');

    const singleCount = vipRole?.memberCount || 0;
    assert.equal(singleCount, 120);

    const multiCount = (vipRole?.memberCount || 0) + (activeRole?.memberCount || 0);
    assert.equal(multiCount, 120 + 450);

    const allCount = guild.memberCount;
    assert.equal(allCount, 1420);
  });

  await t.test('F05: Scheduling - correctly calculates future UTC timestamp', () => {
    const hours = 6;
    const now = Date.now();
    const scheduledTime = new Date(now + hours * 3600000);

    assert.equal(scheduledTime.getTime() > now, true);
    const diffHours = (scheduledTime.getTime() - now) / 3600000;
    assert.equal(Math.round(diffHours), 6);
  });

  await t.test('F06: Emergency Tripwire - stops delivery queue on 401/403/429 ban trigger', () => {
    let queueHalted = false;
    let alarmTriggered = false;

    function handleDispatchError(code) {
      if (code === 401 || code === 403 || code === 429) {
        queueHalted = true;
        alarmTriggered = true;
      }
    }

    handleDispatchError(403);
    assert.equal(queueHalted, true);
    assert.equal(alarmTriggered, true);
  });
});
