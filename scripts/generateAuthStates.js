const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

const { chromium } = require('@playwright/test');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL;
const API_BASE_URL = process.env.API_BASE_URL;

if (!BASE_URL || !API_BASE_URL) {
  throw new Error('BASE_URL or API_BASE_URL missing');
}

const roles = [
  {
    name: 'admin',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  {
    name: 'admin2',
    email: process.env.ADMIN2_EMAIL,
    password: process.env.ADMIN2_PASSWORD,
  },
  {
    name: 'fxuser',
    email: process.env.FXUSER_EMAIL,
    password: process.env.FXUSER_PASSWORD,
  },
];

(async () => {
  console.log('🔐 Generating auth states...');

  for (const role of roles) {
    if (!role.email || !role.password) {
      console.warn(`⚠️ Skipping ${role.name} (missing credentials)`);
      continue;
    }

    console.log(`➡️ Logging in as ${role.name}`);

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: role.email,
        password: role.password,
      }),
    });

    if (!response.ok) {
  const text = await response.text();

  // In CI, only admin is mandatory
  if (process.env.CI && role.name !== 'admin') {
    console.warn(`⚠️ Skipping ${role.name} in CI: ${text}`);
    continue;
  }

  throw new Error(`Login failed for ${role.name}: ${text}`);
}


    const loginData = await response.json();

    const currentUser = {
      token: loginData.accessToken,
      refreshToken: loginData.refreshToken,
      isAuthenticated: true,
      user: loginData.user,
    };

    fs.writeFileSync(
      `storage/${role.name}.currentUser.json`,
      JSON.stringify(currentUser, null, 2)
    );

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(BASE_URL);
    await page.evaluate(user => {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }, currentUser);

    await context.storageState({
      path: `storage/${role.name}.json`,
    });

    await browser.close();

    console.log(`✅ Auth state created for ${role.name}`);
  }

  console.log('🎉 All auth states generated');
})();
