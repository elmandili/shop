const CryptoJS = require('crypto-js');
key = "aymane"

function Encrypt(x)
{
    return CryptoJS.AES.encrypt(x, key).toString();
}
function decrypt(x)
{
    const bytes = CryptoJS.AES.decrypt(x, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}