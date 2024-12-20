// 引入crypto-js库
const CryptoJS = require('crypto-js');

/**
 * @description AES 加密 mode为ECB
 * 
 * @param {string} message - 要加密的内容
 * @param {string} secret - 加密的密钥
 * 
 */
function encrypt(message, secret) {
  // 使用CryptoJS.enc.Utf8.parse将密钥转换为字节数组
  const keyBytes = CryptoJS.enc.Utf8.parse(secret);

  // 使用AES的ECB模式加密，PKCS7填充
  const ciphertext = CryptoJS.AES.encrypt(message, keyBytes, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });

  // 返回Base64编码的密文
  return ciphertext.toString();
}


/**
 * @description AES 解密 mode为ECB
 * 
 * @param {string} ciphertext - 要解密的内容
 * @param {string} secret - 解密的密钥
 * 
 */
function decrypt(ciphertext, secret) {
  // 使用CryptoJS.enc.Utf8.parse将密钥转换为字节数组
  const keyBytes = CryptoJS.enc.Utf8.parse(secret);

  // 使用AES的ECB模式解密，PKCS7填充
  const decrypted = CryptoJS.AES.decrypt(ciphertext, keyBytes, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });

  // 返回解密后的文本
  return CryptoJS.enc.Utf8.stringify(decrypted);
}


export {
  encrypt,
  decrypt
}