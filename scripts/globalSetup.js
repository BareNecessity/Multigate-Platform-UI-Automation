const { execSync } = require('child_process');

module.exports = async () => {
  execSync('node scripts/generateAuthStates.js', {
    stdio: 'inherit',
  });
};
