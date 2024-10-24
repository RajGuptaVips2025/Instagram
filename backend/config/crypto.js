const crypto = require('crypto');
require('dotenv').config();

// Encryption
function encrypt(text, iv) {
    // let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY), iv);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Decryption
function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    // let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY), iv);
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = { encrypt, decrypt };




// const crypto = require('crypto');

// // Algorithm and secret key
// const algorithm = 'aes-256-cbc';
// const secretKey = process.env.ENCRYPTION_KEY; // Store this securely in environment variable

// // Encrypt the message
// const encryptMessage = (message) => {
//   const iv = crypto.randomBytes(16); // Generate a random initialization vector (IV)
//   const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  
//   let encrypted = cipher.update(message, 'utf-8', 'hex');
//   encrypted += cipher.final('hex');
  
//   return {
//     iv: iv.toString('hex'),  // Return IV as a hex string
//     encryptedData: encrypted  // Return encrypted message
//   };
// };

// // Decrypt the message
// const decryptMessage = (encryptedMessage, iv) => {
//   const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(iv, 'hex'));
  
//   let decrypted = decipher.update(encryptedMessage, 'hex', 'utf-8');
//   decrypted += decipher.final('utf-8');
  
//   return decrypted;  // Return the decrypted message
// };

// module.exports = { encryptMessage, decryptMessage };



