import QRCode from "qrcode";

export const generateQrcode = async (data) => {
  const result = await QRCode.toDataURL(JSON.stringify(data));
  return result;
};
