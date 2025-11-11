import QRCode from 'qrcode';

export default async function handler(req, res) {
  try {
    const url = 'https://tripkies.vercel.app/';
    const qr = await QRCode.toDataURL(url);
    const img = Buffer.from(qr.split(',')[1], 'base64');
    res.setHeader('Content-Type', 'image/png');
    res.send(img);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar QR Code' });
  }
}
