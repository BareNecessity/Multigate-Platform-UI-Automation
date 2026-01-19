require('dotenv').config();

console.log('✅ Playwright config loaded');

module.exports = {
  globalSetup: require.resolve('./scripts/globalSetup.js'),

  use: {
    baseURL: process.env.BASE_URL,
    storageState: 'storage/admin.json',
  },
};
