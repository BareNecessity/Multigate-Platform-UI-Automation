const { test, expect } = require('@playwright/test');

test('admin can access transactions without login', async ({ page }) => {
  await page.goto('/transactions');
  await expect(page).toHaveURL(/transactions/);
});
