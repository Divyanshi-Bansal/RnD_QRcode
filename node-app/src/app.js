const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const QRCode = require('qrcode');
const cors = require('cors');
const fs = require('fs');
const ffmpegStatic = require('ffmpeg-static');
const { PDFDocument, rgb } = require('pdf-lib');

// Enable CORS
const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to match the URL of your frontend
    methods: 'GET,POST',
  }));

// Set the path to the ffmpeg-static binary
ffmpeg.setFfmpegPath(ffmpegStatic);

// Use Multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Generate QR code and save it as an image (only generate it once) //for video
const qrCodePath = path.join(__dirname, 'qrcode.png');

QRCode.toFile(qrCodePath, 'https://google.com', (err) => {
  if (err) throw err;
  console.log('QR code saved at:', qrCodePath);
});

// Generate QR code as a base64 string
const generateQRCode = async (url) => {
  return await QRCode.toDataURL(url);
};

// Endpoint to process video and overlay QR code
app.post('/process-video', upload.single('video'), async (req, res) => {
  const videoPath = req.file?.path;

  if (!videoPath) {
    return res.status(400).send('No video file uploaded');
  }

  const outputPath = path.join(__dirname, 'processed', 'output.mp4');
  const qrCodePath = path.join(__dirname, 'qrcode.png'); // Path to the QR code

  // Ensure the processed directory exists
  if (!fs.existsSync(path.join(__dirname, 'processed'))) {
    fs.mkdirSync(path.join(__dirname, 'processed'), { recursive: true });
  }

  ffmpeg(videoPath)
    .input(qrCodePath)  // Input the QR code image
    .complexFilter([
      '[0:v][1:v] overlay=10:10'  // Overlay the QR code at the top-left corner
    ]) 
    .output(outputPath)
    .on('end', () => {

      //send s3 bucket 
      console.log('Video processing finished, sending file...', outputPath);

      // Send the video as a response
      const stat = fs.statSync(outputPath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        
        if (start >= fileSize) {
          res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
          return;
        }

        const chunkSize = (end - start) + 1;
        const file = fs.createReadStream(outputPath, { start, end });
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(outputPath).pipe(res);
      }
    })
    .on('error', (err) => {
      console.error('Error processing video:', err);
      res.status(500).send('Error processing video');
    })
    .run();
});



// Process PDF to add QR code in the footer
app.post('/document', upload.single('document'), async (req, res) => {
  const documentPath = req.file?.path;
  const qrCodePath = path.join(__dirname, 'qrcode.png'); // Path to the QR code

  if (!documentPath) {
    return res.status(400).send('No document uploaded');
  }

  const outputFilePath = path.join(__dirname, 'processed', 'documentWithQRCode.pdf');

  // Ensure the processed directory exists
  if (!fs.existsSync(path.join(__dirname, 'processed'))) {
    fs.mkdirSync(path.join(__dirname, 'processed'), { recursive: true });
  }

  try {
    // Log paths for debugging
    console.log('Document Path:', documentPath);
    console.log('QR Code Path:', qrCodePath);
    console.log('Output File Path:', outputFilePath);

    // Check if files exist
    if (!fs.existsSync(documentPath)) {
      throw new Error('Uploaded document does not exist');
    }
    if (!fs.existsSync(qrCodePath)) {
      throw new Error('QR code image does not exist');
    }

    // Read the uploaded PDF
    const existingPdfBytes = fs.readFileSync(documentPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Read the QR code image file and convert it to a Buffer
    const qrCodeImageBytes = fs.readFileSync(qrCodePath);
    const qrImage = await pdfDoc.embedPng(qrCodeImageBytes);

    // Get all pages and draw the QR code on each one
    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      page.drawImage(qrImage, {
        x: width - 110, // Position it 10px from the right edge
        y: 10, // Position it 10px from the bottom edge
        width: 100,
        height: 100,
      });
    });

    // Save the updated PDF with the QR code
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputFilePath, pdfBytes);

    // Log the file size for debugging
    console.log('Output PDF file size:', fs.statSync(outputFilePath).size);

    // Send the processed PDF back to the client
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="documentWithQRCode.pdf"');
    res.send(pdfBytes);
  } catch (error) {
    console.error('Error processing document:', error.message);
    res.status(500).send(`Error processing document: ${error.message}`);
  }
});




app.listen(3001, () => {
  console.log('Listening on port 3001');
});
