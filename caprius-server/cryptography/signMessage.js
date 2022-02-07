/**
 * DIGITAL SIGNATURE
 * some sort of data we want to put our signature on
 * we want to sign our data so that the receiver of the
 * data is assured that the data has not been tampered with
 * and we want to make sure the person who signed the document
 * actually signed it
 */

const crypto = require("crypto");
const fs = require("fs");
const encrypt = require("./encrypt");
const decrypt = require("./decrypt");

//the data to be signed
const myData = {
  firstname: "Debayan",
  lastname: "Paul",
  panNo: "DDDDD0000D", //some secure information
};

/**
 * hash function is a trapdoor function meaning there
 * is no way to get back the initial message
 * it is deterministic meaning it will always produce
 * the same result and is alwatys 64 characters long
 * each character is 4 bits so 64 * 4 = 256 bits
 */
const hash = crypto.createHash("sha256");

/**
 * we dont want to put any confidential information
 * in the data to be signed because it can be intercepted
 */

//strigify versin of our data that can be hashed
const myDataString = JSON.stringify(myData);

//set the data to the hash object
hash.update(myDataString);

//convert hashed data to hexadecimal format
const hashedData = hash.digest("hex");

const senderPrivateKey = fs.readFileSync(
  __dirname + "/id_rsa_priv.pem",
  "utf8"
);

//sign the hashed message with your private key
const signedMessage = encrypt.encryptWithPrivateKey(
  senderPrivateKey,
  hashedData
);
/**
 * we need tell the receiver of the data how to verify the signed message
 * 1. tell the receiver which algorith we are using for secret message
 * 2. verify the message signing by public key decryption, if successfully decrypts
 * it means the sender is who he says he is i.e., owner of the pairs private key
 * 3. take the original data and the hash algorithm and compare with the public key 
 * decrypted hash message. If the 2 are equal it means that the message has not been tampered
 */
const packageOfDataToSend = {
  algorithm: "sha256",
  originalData: myData,
  signedAndEncryptedData: signedMessage,
};

module.exports.packageOfDataToSend = packageOfDataToSend;
