const crypto = require("crypto");
const fs = require("fs");
const decrypt = require("./decrypt");

const receivedData = require("./signMessage").packageOfDataToSend;

/**
 * the person verifying will require the sender's public key
 * anyone can see the puclic key but cannot figure out the private key
 */

//use the senders algorithm to create hash function
const hash = crypto.createHash(receivedData.algorithm);

const receiverPublicKey = fs.readFileSync(
  __dirname + "/id_rsa_pub.pem",
  "utf8"
);

//we will get the hash message here
const decryptedMessage = decrypt.decryptWithPublicKey(
  receiverPublicKey,
  receivedData.signedAndEncryptedData
);

/**
 * if the decrypted message === hashed original data received
 * in senders message body then data has not been tampered with and
 * has been signed by the person who is the owner of private key
 */

const decryptedMessageString = decryptedMessage.toString();
const hashOfOriginal = hash.update(JSON.stringify(receivedData.originalData));
const hashOfOriginalHex = hashOfOriginal.digest("hex");

if (hashOfOriginalHex === decryptedMessageString) {
  console.log("The data has not been tampered with and the sender is valid!");
} else {
  console.log("Someone has tampered with the data or the sender is invalid!");
}
