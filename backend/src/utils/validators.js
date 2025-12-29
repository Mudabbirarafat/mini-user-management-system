function isValidEmail(email){
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function isStrongPassword(pw){
  // min 8 chars, at least one letter and one number
  return typeof pw === 'string' && pw.length >= 8 && /[a-zA-Z]/.test(pw) && /[0-9]/.test(pw);
}

module.exports = {isValidEmail,isStrongPassword};
