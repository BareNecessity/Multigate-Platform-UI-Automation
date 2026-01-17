function createSession(role) {
  return {
    storageState: `storage/${role}.json`,
    role,
  };
}
