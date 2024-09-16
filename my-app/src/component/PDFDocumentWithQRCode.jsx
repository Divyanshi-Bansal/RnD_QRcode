import React, { useRef, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import QRCode from "qrcode";
 
const PDFDocumentWithQRCode = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const qrCanvasRef = useRef(null);
 
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  };
 
  const generateQrCode = async (text) => {
    const canvas = qrCanvasRef.current;
    await QRCode.toCanvas(canvas, text, { width: 100 }); // Generate QR code on canvas
    return canvas.toDataURL(); // Return the base64-encoded data URL of the QR code
  };
 
  const generatePdfWithQr = async () => {
    if (!pdfFile) {
      alert("Please upload a PDF file first.");
      return;
    }
 
    // Load the uploaded PDF file
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
 
    // Generate the QR code dynamically
    const qrCodeDataUrl = await generateQrCode("https://your-dynamic-data.com");
 
    // Embed the QR code image into the PDF
    const qrImageBytes = await fetch(qrCodeDataUrl).then((res) =>
      res.arrayBuffer()
    );
    const qrImageEmbed = await pdfDoc.embedPng(qrImageBytes);
 
    const qrDims = qrImageEmbed.scale(0.5); // Resize the QR code
 
    // Add the QR code to the first page of the uploaded PDF
    const pages = pdfDoc.getPages();
    // Embed the QR code on the footer of every page
    pages.forEach((page) => {
      const { width, height } = page.getSize();
 
      // Place the QR code at the bottom-right corner of each page
      page.drawImage(qrImageEmbed, {
        x: width - qrDims.width - 20, // 20 units from the right edge
        y: 20, // 20 units from the bottom edge (footer area)
        width: qrDims.width,
        height: qrDims.height,
      });
    });
 
    // Serialize the PDFDocument to bytes (Uint8Array)
    const pdfBytes = await pdfDoc.save();
 
    // Download the modified PDF
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pdf_with_qr.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
 
  return (
    <div>
      <h3>Upload a PDF and Embed Dynamic QR Code</h3>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <canvas ref={qrCanvasRef} style={{ display: "none" }} />
      <button onClick={generatePdfWithQr} disabled={!pdfFile} style={{ backgroundColor:"black", color:"white", borderRadius:"10px", pading:"5px", height:"50px", margin:"30px"}}>
        Embed QR and Download PDF
      </button>
    </div>
  );
};
 
export default PDFDocumentWithQRCode;