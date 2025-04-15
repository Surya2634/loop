const CryptoJS = require("crypto-js");
const { ENCRPYTION_KEY } = require("../../config");

const encryption = (data) => {
  data = JSON.stringify(data);
  return CryptoJS.AES.encrypt(data, ENCRPYTION_KEY).toString();
};

const decryption = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, ENCRPYTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

module.exports = {
  encryption,
  decryption,
};
