const crypto = require('crypto');

// Generate a 32-byte key (256 bits)
const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);