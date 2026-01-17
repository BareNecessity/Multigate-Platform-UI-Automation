const { test, expect } = require('@playwright/test');
const { applySessionAuth } = require('../utils/auth/sessionAuth');

test.use({
  storageState: 'storage/admin.json'
});

test('admin can access transactions without login', async ({ page, context }) => {
  await applySessionAuth(context, 'admin');

  await page.goto('/transactions');
  await expect(page).toHaveURL(/transactions/);
});
