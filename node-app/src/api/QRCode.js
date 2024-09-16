const QRCode = require('qrcode');
const fs = require('fs');

// Generate QR code and save it as an image
QRCode.toFile('qrcode.png', 'https://example.com', (err) => {
  if (err) throw err;
  console.log('QR code saved!');
});
