import {decrypt as d, encrypt as e} from 'crypto-js/aes';
import hex from 'crypto-js/enc-hex';
import md5 from 'crypto-js/md5';
import sha256 from 'crypto-js/sha256';
import utf8 from 'crypto-js/enc-utf8';

function getHexIv(iv) {
    return hex.parse(md5(iv).toString());
}

function getHexKey() {
    const key = 'mbtest';
    return hex.parse(sha256(key).toString());
}

export function decrypt(cipher, iv) {
    const hexKey = getHexKey();
    const hexIv = getHexIv(iv);
    const data = d(cipher, hexKey, {iv: hexIv});
    return JSON.parse(data.toString(utf8));
}

export function encrypt(data, iv) {
    const hexKey = getHexKey();
    const hexIv = getHexIv(iv);
    const cipher = e(data, hexKey, {iv: hexIv});
    return cipher.toString();
}

export function encryptJson(data, iv) {
    return encrypt(JSON.stringify(data), iv);
}