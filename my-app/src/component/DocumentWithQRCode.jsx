import React, { useState } from 'react';
import axios from 'axios';

const DocumentWithQRCode = () => {
  const [documentFile, setDocumentFile] = useState(null);
  const [processedDocumentUrl, setProcessedDocumentUrl] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setDocumentFile(file);
  };

  const handleDocumentUpload = async () => {
    if (documentFile) {
      const formData = new FormData();
      formData.append('document', documentFile);

      try {
        const response = await axios.post('http://localhost:3001/document', formData, {
          responseType: 'blob', // Expect the document as a blob
        });

        const documentBlob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(documentBlob);
      setProcessedDocumentUrl(url);
      } catch (error) {
        console.error('Error processing document:', error);
      }
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      <button onClick={handleDocumentUpload} style={{ backgroundColor:"black", color:"white", borderRadius:"10px", pading:"5px", height:"50px", margin:"30px"}}>Upload Document</button>
      {processedDocumentUrl && (
        <a href={processedDocumentUrl} download="processed-document.pdf">
          Download Processed Document
        </a>
      )}
    </div>
  );
};

export default DocumentWithQRCode;
