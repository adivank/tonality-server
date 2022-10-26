exports.generateUserLink = function(email) {
  const atIndex = email.indexOf('@');
  if (!atIndex) {
    return;
  }

  return email.slice(0, atIndex);
}