const { chromium } = require('@playwright/test');

module.exports = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(process.env.BASE_URL + '/login');

  await page.fill('#email', process.env.ADMIN_EMAIL);
  await page.fill('#password', process.env.ADMIN_PASSWORD);
  await page.click('button[type="submit"]');

  await page.waitForURL(/dashboard/);

  await page.context().storageState({
    path: 'storage/admin.json',
  });

  await browser.close();
};

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  throw new Error('❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment');
}