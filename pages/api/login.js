import {makeEncryptedJsonRequestBody} from "@/utils/request";
import {decrypt} from "@/utils/encryption";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).end('Method Not Allowed');
        return;
    }

    const {username, password} = req.body;

    const unencryptedData = {
        "user": {
            "username": username,
            "password": password,
            "remember_me": false
        }
    }

    const encryptedRequest = makeEncryptedJsonRequestBody(unencryptedData);

    let {sessionCookie, csrfToken} = await fetch('https://membean.com/login', {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
        },
    }).then(async r => {
        const cookie = r.headers.get('set-cookie')
        const csrfToken = await r.text().then(text => {
            return text.split('csrf-token" content="')[1].split('"')[0]
        })
        return {sessionCookie: cookie.split("_new_membean_session_id=")[1].split(";")[0], csrfToken: csrfToken}
    });


    const loginResult = await fetch('https://membean.com/login', {
        method: 'POST',
        headers: {
            'Cookie': `domain=membean.com; _new_membean_session_id=${sessionCookie}`,
            'X-Csrf-Token': csrfToken,
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(encryptedRequest),
    });

    const {cipher, token} = JSON.parse(await loginResult.text());
    const loginResultText = decrypt(cipher, token)

    if (loginResultText.errors) {
        res.status(401).json(decrypt(cipher, token))
        return;
    }

    res.status(200).json({
        token: loginResult.headers.get('set-cookie').split("_new_membean_session_id=")[1].split(";")[0],
    });
}