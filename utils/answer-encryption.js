export function decryptAnswer(encryptedAnswer) {
    const data = decodeStr(encryptedAnswer);
    const data1 = data.substr(10);
    return data1.substr(0, data1.length - 12);
}

const B4 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    decode: function (j) {
        var m = "";
        var d, b, g;
        var v, c, l, k;
        var h = 0;
        j = j.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (h < j.length) {
            v = this._keyStr.indexOf(j.charAt(h++));
            c = this._keyStr.indexOf(j.charAt(h++));
            l = this._keyStr.indexOf(j.charAt(h++));
            k = this._keyStr.indexOf(j.charAt(h++));
            d = v << 2 | c >> 4;
            b = (c & 15) << 4 | l >> 2;
            g = (l & 3) << 6 | k;
            m = m + String.fromCharCode(d);
            if (l !== 64) {
                m = m + String.fromCharCode(b)
            }
            if (k !== 64) {
                m = m + String.fromCharCode(g)
            }
        }
        m = B4._utf8_decode(m);
        return m
    },
    _utf8_decode: function (c) {
        var a = "";
        var d = 0;
        let c1;
        let c2;
        var b = c1 = c2 = 0;
        while (d < c.length) {
            b = c.charCodeAt(d);
            if (b < 128) {
                a += String.fromCharCode(b);
                d++
            } else {
                if (b > 191 && b < 224) {
                    c2 = c.charCodeAt(d + 1);
                    a += String.fromCharCode((b & 31) << 6 | c2 & 63);
                    d += 2
                } else {
                    c2 = c.charCodeAt(d + 1);
                    let c3;
                    c3 = c.charCodeAt(d + 2);
                    a += String.fromCharCode((b & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                    d += 3
                }
            }
        }
        return a
    }
};

function decodeStr(str) {
    let str1 = "";
    for (let i = 0; i < str.length; ++i) {
        str1 += String.fromCharCode(str.charCodeAt(i) ^ 14)
    }
    return B4.decode(str1)
}