const { chromium } = require('@playwright/test');
const path = require('path');

module.exports = async function Admin() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    storageState: path.resolve(__dirname, '../../storage/admin.json'),
  });

  const page = await context.newPage();

  return {
    browser,
    context,
    page,
  };
};
