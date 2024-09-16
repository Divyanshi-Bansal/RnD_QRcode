POC on QR Code on these three types of content:
1. Image
2. Video
3. Document

For images, We need to upload an image, and then we use the package “qrcode” and canvas to generate the QR code and embed it on the original image.
For videos, We upload a video, then we make a request to the backend application based on nodejs, using fluent-ffmpeg library to embed the QRcode in the video itself.
For PDF Documents, we use the pdf-lib library to add the QRCode to every page of the document.

Here I am attaching the POC docs for reference:
https://docs.google.com/document/d/1RqjtBBrLkvM_uv246CcISs5PrG0X9W8kVw6r6bfXOlg/edit?usp=sharing
