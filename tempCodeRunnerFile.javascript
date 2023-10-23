const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex'); // Generates a 32-byte (256-bit) random key
console.log(secretKey);