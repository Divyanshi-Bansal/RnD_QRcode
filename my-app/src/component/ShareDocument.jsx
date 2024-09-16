import { QRCode } from 'qrcode.react';

export const ShareDocument = ({ docUrl, qrData }) => (
    <div>
      <iframe src={docUrl} style={{ width: '100%', height: '500px' }} title='qrcode'/>
      <QRCode value={qrData} size={128} />
    </div>
  );