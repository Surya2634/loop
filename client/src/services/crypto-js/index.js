import { AES, enc } from "crypto-js";
const ENCRPYTION_KEY = process.env.REACT_APP_ENCRPYTION_KEY;

export const encryption = (data) => {
  data = JSON.stringify(data);
  return AES.encrypt(data, ENCRPYTION_KEY).toString();
};

export const decryption = (data) => {
  if (data === "Unauthorized") return { message: data };
  const bytes = AES.decrypt(data, ENCRPYTION_KEY);
  return JSON.parse(bytes.toString(enc.Utf8));
};
