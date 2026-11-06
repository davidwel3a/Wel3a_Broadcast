import { test, expect } from '@playwright/test';

test.describe('PodcastBot E2E Flow Specs', () => {
  test.beforeEach(async ({ page }) => {
    // Fail immediately on any unhandled console errors or 5xx server exceptions
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        throw new Error(`Unhandled browser console error: ${msg.text()}`);
      }
    });
    page.on('response', (res) => {
      if (res.status() >= 500) {
        throw new Error(`Server returned ${res.status()} on ${res.url()}`);
      }
    });
    await page.goto('/');
  });

  // Flow F01: Bot Connection & Profile
  test('F01-H1: Connect Bot Token and View Profile', async ({ page }) => {
    await expect(page.getByText(/متصل بالبوت|Bot Connected/i)).toBeVisible();
    await expect(page.getByText('PodcastBroadcastBot')).toBeVisible();
  });

  // Flow F02: Compose & Preview Discord Message
  test('F02-H1: Draft Rich Embed and Open Live Discord Preview Modal', async ({ page }) => {
    // Switch to Embed tab
    await page.getByRole('button', { name: /رسالة مضمنة|Rich Embed/i }).click();

    // Verify inputs are available
    const titleInput = page.getByPlaceholder(/العنوان الرئيسي|Embed main title/i);
    await expect(titleInput).toBeVisible();

    // Open Discord Message Preview Modal
    await page.getByRole('button', { name: /معاينة الرسالة|Preview Message/i }).click();
    await expect(page.getByRole('dialog', { name: /معاينة الرسالة|Preview as displayed in Discord/i })).toBeVisible();
    await expect(page.getByText('BOT')).toBeVisible();

    // Close preview modal
    await page.getByLabel(/Close preview/i).click();
  });

  // Flow F03: Save and Apply Templates
  test('F03-H1: Apply saved message template to composer', async ({ page }) => {
    const templateItem = page.getByText(/إعلان مسابقة أسبوعية/i).first();
    await expect(templateItem).toBeVisible();

    // Click Apply
    await page.getByRole('button', { name: /استخدام|Use/i }).first().click();

    // Verify toast notification
    await expect(page.getByText(/تم تطبيق قالب|Applied template/i)).toBeVisible();
  });

  // Flow F04: Role-Filtered Audience Selection
  test('F04-H1: Toggle role filter and verify recipient count', async ({ page }) => {
    const roleChip = page.getByRole('checkbox', { name: /VIP Members/i });
    await expect(roleChip).toBeVisible();

    // Toggle Send to all checkbox
    const sendToAllBox = page.getByRole('checkbox', { name: /إرسال لجميع أعضاء السيرفر|Broadcast to all server members/i });
    await sendToAllBox.check();
    await expect(page.getByText(/1420/)).toBeVisible();
  });

  // Flow F05: Scheduled Campaign Queue
  test('F05-H1: Enable schedule mode and configure future execution', async ({ page }) => {
    const scheduleBox = page.getByRole('checkbox', { name: /جدولة البث لوقت لاحق|Schedule broadcast for later/i });
    await scheduleBox.check();

    // Preset hours button
    await page.getByRole('button', { name: '6h' }).click();
    await expect(page.getByText(/\+6 hours/i)).toBeVisible();
  });

  // Flow F06: Emergency Anti-Ban Modal Tripwire
  test('F06-H1: Trigger emergency ban tripwire and verify overlay', async ({ page }) => {
    // Start Broadcast
    await page.getByRole('button', { name: /بدء إرسال البرودكاست|Start Broadcast/i }).click();

    // Trigger simulation button
    await page.getByRole('button', { name: /Simulate Ban Tripwire/i }).click();

    // Verify Emergency Alert Dialog
    const alertModal = page.getByRole('alertdialog');
    await expect(alertModal).toBeVisible();
    await expect(page.getByText(/تنبيه أمني عاجل|Security Alert/i)).toBeVisible();

    // Acknowledge and dismiss
    await page.getByRole('button', { name: /فهمت|Understood/i }).click();
    await expect(alertModal).not.toBeVisible();
  });
});
