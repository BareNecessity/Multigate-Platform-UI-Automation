const { request } = require('@playwright/test');
const fs = require('fs');

console.log('▶️ Global setup (API auth) started');

module.exports = async () => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.API_BASE_URL) {
    throw new Error('❌ Missing API auth environment variables');
  }

  if (!fs.existsSync('storage')) {
    fs.mkdirSync('storage');
  }

  const apiContext = await request.newContext({
    baseURL: process.env.API_BASE_URL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  });

  const response = await apiContext.post('/login', {
    data: {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    },
  });

  if (!response.ok()) {
    throw new Error(`❌ Login API failed: ${response.status()}`);
  }

  const { accessToken } = await response.json();

  if (!accessToken) {
    throw new Error('❌ No accessToken returned from login API');
  }

  // Create a browser storage state manually
  const storageState = {
    cookies: [],
    origins: [
      {
        origin: process.env.BASE_URL,
        localStorage: [
          {
            name: 'accessToken',
            value: accessToken,
          },
        ],
      },
    ],
  };

  fs.writeFileSync('storage/admin.json', JSON.stringify(storageState, null, 2));

  console.log('✅ storage/admin.json created via API auth');
};
