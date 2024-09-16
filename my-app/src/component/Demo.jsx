import React from 'react';
import ImageWithQRCode from './ImageWithQRCode';
import { IMAGE_URL } from '../static/images/ImageURL';
import video from '../static/videos/dummy-video.mp4';
// import VideoWithQRCode from './VideoWithQRCode';
import VideoWithQRCode2 from './VideoWithQRCode-2';
import DocumentWithQRCode from './DocumentWithQRCode';
import PDFDocumentWithQRCode from './PDFDocumentWithQRCode';



const Demo = () => {
  const qrData = "random qr code data";
  const imageUrl = IMAGE_URL;
  const videoFile = video;

  return (
    <div>
      <h1>Image with QR Code</h1>
      <ImageWithQRCode imageUrl={imageUrl} qrData={qrData} />
      <div>
        <h1>Video with QR Code Overlay</h1>
        {/* <VideoWithQRCode videoFile={videoFile} qrCodeData={qrData} /> */}
        <VideoWithQRCode2/>
      </div>
      <div>
        <h1>Document with QR Code Overlay</h1>
        {/* <VideoWithQRCode videoFile={videoFile} qrCodeData={qrData} /> */}
        <DocumentWithQRCode/>
      </div>
      <div>
        <h1>PDF Document with QR Code Overlay</h1>
        {/* <VideoWithQRCode videoFile={videoFile} qrCodeData={qrData} /> */}
        <PDFDocumentWithQRCode/>
      </div>
    </div>
  )
}

export default Demo
