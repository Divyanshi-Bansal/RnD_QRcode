import React, { useRef, useEffect, useState } from 'react';
import { toCanvas } from 'qrcode'; // Use 'qrcode' library to generate QR code on canvas

const ImageWithQRCode = () => {
  const canvasRef = useRef(null);
  const [imageWithQRCode, setImageWithQRCode] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleFileChange = (event) =>{
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageToQRCode = () =>{
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Handle CORS issues for external images
    img.src = imageUrl;

    img.onload = () => {
      // Set canvas size to match the image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      const QRData = {
        name:"Divyanhi",
        role:"SDE"
      }

      // Generate QR code and draw it on the canvas
      toCanvas(document.createElement('canvas'), "https://google.com", { width: 50 }, (err, qrCanvas) => {
        if (err) {
          console.error("QR code generation error:", err);
          return;
        }

        // Draw the QR code at the bottom-right corner of the image
        ctx.drawImage(qrCanvas, img.width - 55, img.height - 54);

        // Convert the canvas to a data URL and set it to state to display
        const imageURL = canvas.toDataURL('image/png');
        setImageWithQRCode(imageURL);
      });
    };
  }

  const handleResetImage = () =>{
    setImageUrl(null);
    setImageWithQRCode(null);

  }

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageWithQRCode;
    a.download = 'image_with_qr.png';
    a.click();
  };

  return (
    <div>
      <div>
        <input type="file" accept="image/*" onChange={handleFileChange}/>
        <button onClick={handleImageToQRCode} style={{ backgroundColor:"black", color:"white", borderRadius:"10px", pading:"5px", height:"50px", margin:"10px"}}>Generate Image with QR</button>
        <button onClick={handleResetImage} style={{ backgroundColor:"black", color:"white", borderRadius:"10px", pading:"5px", height:"50px", margin:"10px"}}>Reset Image</button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      {imageWithQRCode && (
        <div style={{height:"100%", width:"100%", display:"flex",flexDirection:"row", justifyContent:"center", alignItems:"center", margin:"30px"}}>
          <div style={{display:"flex",height:"400px", width:"600px"}}>
            <img src={imageWithQRCode} alt="with QR Code" style={{height:"100%", width:"100%"}}/>
          </div>
          <button onClick={handleDownload} style={{ backgroundColor:"black", color:"white", borderRadius:"10px", pading:"5px", height:"50px", margin:"30px"}}>Download Image with QR</button>
        </div>
      )}
    </div>
  );
};

export default ImageWithQRCode;
