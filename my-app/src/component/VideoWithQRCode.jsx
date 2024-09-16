import React, { useState, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import QRCode from 'qrcode';

const VideoWithQRCode = ({videoFile, qrCodeData}) => {
  // 1 approach-start
  //   const [qrCodeUrl, setQrCodeUrl] = useState('');

//   useEffect(() => {
//     // Generate the QR code when the qrCodeData changes
//     QRCode.toDataURL(qrCodeData)
//       .then((url) => setQrCodeUrl(url))
//       .catch((err) => console.error(err));
//   }, [qrCodeData]);
// 1 approach-end

  // const [videoFile, setVideoFile] = useState(null);
  const [qrCodeImage, setQRCodeImage] = useState(null);
  const [outputUrl, setOutputUrl] = useState('');
  const ffmpeg = new FFmpeg({ log: true });
  
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrCodeDataURL = await QRCode.toDataURL('https://google.com'); // URL to encode in QR
        setQRCodeImage(qrCodeDataURL);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    generateQRCode();
  }, []);

  const processVideo = async () => {
    // if (!ffmpeg.loaded()) {
      await ffmpeg.load();
    // }

    // Write files to ffmpeg.wasm filesystem
    ffmpeg.writeFile('input.mp4', await fetch(videoFile).then(res => res.arrayBuffer()));
    ffmpeg.writeFile( 'qrcode.png', await fetch(qrCodeImage).then(res => res.arrayBuffer()));

    // Run FFmpeg command to overlay QR code
    await ffmpeg.exec(
      '-i', 'input.mp4',
      '-i', 'qrcode.png',
      '-filter_complex', '[0:v][1:v] overlay=10:10"',
      '-c:a', 'copy',
      'output.mp4'
    )

    // Read the result
    // const data = ffmpeg.FS('readFile', 'output.mp4');
    const data = ffmpeg.readFile('output.mp4');
      
    // Create a URL for the result
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    setOutputUrl(url);
  };

  return (
    // 1 approach-start
    // <div className="video-container">
//       <video width="600" controls>
//         <source src={videoUrl} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//       {qrCodeUrl && (
//         <div className="qr-code-overlay">
//           <img src={qrCodeUrl} alt="QR Code" />
//         </div>
//       )}
//     </div>
// 1 approach-end
    <div>
      {/* <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files[0])}
      /> */}
      <button onClick={processVideo} disabled={!videoFile || !qrCodeImage}>
        Process Video
      </button>
      {outputUrl && (
        <div>
          <video width="600" controls>
            <source src={outputUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default VideoWithQRCode;
