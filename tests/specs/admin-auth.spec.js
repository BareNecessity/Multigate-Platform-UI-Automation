const { test, expect } = require('@playwright/test');
const fs = require('fs');

// Load the sessionStorage payload directly
const currentUser = JSON.parse(
  fs.readFileSync('storage/admin.currentUser.json', 'utf-8')
);

test.use({
  storageState: 'storage/admin.json'
});

test('admin can access transactions without login', async ({ page, context }) => {
  // Inject sessionStorage BEFORE app loads
  await context.addInitScript(user => {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }, currentUser);

  await page.goto('/transactions');
  await expect(page).toHaveURL(/transactions/);
});
