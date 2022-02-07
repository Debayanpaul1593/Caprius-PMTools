const crypto = require("crypto");
const fs = require("fs");

function generateKeypair() {
  //generates an object where keys are stored in properties 'privateKey' and 'publicKey'
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1", //public key crytography stand 1
      format: "pem", //most common formatting choice
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  fs.writeFileSync(__dirname + '/id_rsa_pub.pem', keyPair.publicKey);
  fs.writeFileSync(__dirname + '/id_rsa_priv.pem', keyPair.privateKey);
}


generateKeypair();