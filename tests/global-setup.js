const { chromium } = require('@playwright/test');
const fs = require('fs');

console.log('▶️ Global setup started');

module.exports = async () => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD');
  }

  if (!fs.existsSync('storage')) {
    fs.mkdirSync('storage');
    console.log('📁 storage folder created');
  }

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

  console.log('✅ storage/admin.json created');

  await browser.close();
};

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  throw new Error('❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment');
}