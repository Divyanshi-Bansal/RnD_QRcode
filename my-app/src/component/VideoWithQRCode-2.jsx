import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VideoWithQRCode2 = () => {
    const [videoFile, setVideoFile] = useState(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState('');

  const handleFileChange = (event) => {
    setProcessedVideoUrl("");
    const file = event.target.files[0]; // Get the uploaded file
    setVideoFile(file);
    // handleVideoUpload(file);
  };

  const handleVideoUpload = async (Vfile) => {
    if (Vfile) {
      const formData = new FormData();
      formData.append('video', Vfile); // Ensure this matches multer config

      try {
        const response = await axios.post('http://localhost:3001/process-video', formData, {
          responseType: 'blob',
        });
        console.log("response----", response);
        // const videoBlob = new Blob([response.data], { type: 'video/mp4' });
        const url = URL.createObjectURL(response.data);
        setProcessedVideoUrl(url);
      } catch (error) {
        console.error('Error processing video:', error);
      }
    }
  };

//   useEffect(() => {
//     handleVideoUpload();
//   }, [videoFile]);

  return (
    <div>
      <div>
    <input type="file" accept="video/*" onChange={handleFileChange} />
    <button onClick={()=>{
      handleVideoUpload(videoFile);
    }} style={{ backgroundColor:"black", color:"white", borderRadius:"10px", pading:"5px", height:"50px", margin:"30px"}}>Submit to embedd QR code</button>
    </div>
      {processedVideoUrl && (
        <video width="600" controls>
          <source src={processedVideoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoWithQRCode2;
