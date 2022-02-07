const crypto = require("crypto");
/**
 * 'Password Based Key Derivation Function' is a password hashing technique
 * it applies a pseudorandom function such as HMAC and applies it to the 
 * input password or passphrase along with a salt and repeats the process
 * many times to produce a derived key
 * the added computational work makes password cracking much more difficult
 * salt  - used to introduce randomness to protect against brute force attacks
 * using pre-genereated hash rainbow tables. Recommended min byte size for 16 bytes 
 * 
 * 10000 - no. of iterations.
 * a higher no. of iterations is recommended. The higher the iterations are the 
 * more secured the derived key will but it will be computationally longer
 *  
 * 64 - the derived key length that we want to be returned
 * 
 * sha512 - the HMAC digest algorithm
 * 
 * alternatives to PBKDF2 are bcrypt and scrypt
 */
function validatePassword(password, hash, salt) {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hashVerify === hash;
}
function genPassword(password) {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return {
    salt,
    hash,
  };
}

module.exports.validatePassword = validatePassword;
module.exports.genPassword = genPassword;
