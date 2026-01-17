const fs = require('fs');

async function applySessionAuth(context, role) {
  const filePath = `storage/${role}.currentUser.json`;

  if (!fs.existsSync(filePath)) {
    throw new Error(`Auth file not found for role: ${role}`);
  }

  const currentUser = JSON.parse(
    fs.readFileSync(filePath, 'utf-8')
  );

  await context.addInitScript(user => {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }, currentUser);
}

module.exports = { applySessionAuth };
