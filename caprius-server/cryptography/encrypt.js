const crypto = require("crypto");

//encrypt with public key incase of data protection
function encryptWithPublicKey(publicKey, message) {
  const bufferMessage = Buffer.from(message, "utf8");
  return crypto.publicEncrypt(publicKey, bufferMessage);
}

//encrypt with private key incase of digital signature
function encryptWithPrivateKey(privateKey, message) {
  const bufferMessage = Buffer.from(message, "utf8");
  return crypto.privateEncrypt(privateKey, bufferMessage);
}

module.exports.encryptWithPublicKey = encryptWithPublicKey;
module.exports.encryptWithPrivateKey = encryptWithPrivateKey;
