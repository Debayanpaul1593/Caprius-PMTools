const crypto = require("crypto");
const salt = crypto.randomBytes(128).toString("hex");
console.log(salt);
