require('dotenv').config();

console.log('✅ Playwright config loaded');

module.exports = {
  globalSetup: require.resolve('./tests/global-setup'),

  use: {
    baseURL: process.env.BASE_URL,
    storageState: 'storage/admin.json',
  },
};

