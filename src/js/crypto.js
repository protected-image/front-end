/* global Uint8Array */

function convertStringToArrayBufferView(str) {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }

  return bytes;
}

function convertArrayBufferViewtoString(buffer) {
  let str = '';
  for (let i = 0; i < buffer.byteLength; i++) {
    str += String.fromCharCode(buffer[i]);
  }

  return str;
}

const vector = crypto.getRandomValues(new Uint8Array(12));

class CryptoData {
  constructor() {
    this.keys = this.generateKey();
    this.options = { name: 'RSA-OAEP', iv: vector };
  }
  generateKey() {
    return crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: 'SHA-256' },
      },
      false,
      ['encrypt', 'decrypt'],
    );
  }

  async encryptData(data) {
    const { publicKey } = await this.keys;

    const result = await crypto.subtle.encrypt(this.options, publicKey, convertStringToArrayBufferView(data));
    return convertArrayBufferViewtoString(new Uint8Array(result));
  }

  async decryptData(data) {
    const buffer = convertStringToArrayBufferView(data);
    const { privateKey } = await this.keys;
    const result = await crypto.subtle.decrypt(this.options, privateKey, buffer);
    return convertArrayBufferViewtoString(new Uint8Array(result));
  }

  async exportKey() {
    const { publicKey } = await this.keys;
    const result = await crypto.subtle.exportKey('spki', publicKey);
    return convertArrayBufferViewtoString(new Uint8Array(result));
  }
}

const cryptoData = new CryptoData();

cryptoData
  .encryptData('QNimate')
  .then(data => {
    console.log(data, 'encrypt');
    return data;
  })
  .then(data => cryptoData.decryptData(data))
  .then(data => console.log(data, 'decrypt'));

cryptoData.exportKey().then(data => console.log(data, 'key'));
export default () => {};
