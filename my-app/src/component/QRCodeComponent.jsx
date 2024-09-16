import { QRCode } from 'qrcode.react';

const QRCodeComponent = ({ data }) => (
  <div>
    <QRCode value={data} size={128} />
  </div>
);

export default QRCodeComponent