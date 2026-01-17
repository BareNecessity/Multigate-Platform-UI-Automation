const { execSync } = require('child_process');

module.exports = async () => {
  console.log('🔐 Global setup: regenerating auth states');

  execSync('node scripts/generateAuthStates.js', {
    stdio: 'inherit',
  });

  console.log('✅ Auth states ready');
};
