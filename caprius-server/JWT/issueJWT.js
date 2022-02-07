const base64url = require("base64url");
const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const JWTparts = JWT.split(".");

const header = JWTparts[0];

const payload = JWTparts[1];

const signature = JWTparts[2];

const dheader = base64url.decode(header);
const dpayload = base64url.decode(payload);
const dsignature = base64url.decode(signature);

console.log(dheader, dpayload, dsignature);

//================================================

const algo = { alg: "HS256", typ: "JWT" };
const p = { sub: "1234567890", name: "John Doe", iat: 1516239022 };

const algobase64 = base64url(JSON.stringify(algo));
const pbase64 = base64url(JSON.stringify(p));

console.log(algobase64); //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
console.log(pbase64); //eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
//matches with the original jwt token
const crypto = require('crypto');
const signatureFunction = crypto.createSign('RS256');
const sign = signatureFunction.sign(__dirname + '/id_rsa_priv.pem', 'base64');
const signBase64 = base64url.fromBase64(sign);
console.log(signBase64);
