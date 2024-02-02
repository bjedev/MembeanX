import {makeEncryptedJsonRequestBody} from "@/utils/request";
import {decrypt} from "@/utils/encryption";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).end('Method Not Allowed');
        return;
    }

    const {operationName, variables, query} = req.body;

    const encryptedRequest = makeEncryptedJsonRequestBody({operationName, variables, query});
    const sessionToken = req.headers['x-session'];

    const gqlResponse = await fetch('https://membean.com/graphql.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `domain=membean.com; _new_membean_session_id=${sessionToken}`,
        },
        body: JSON.stringify(encryptedRequest),
    }).then(async (r) => {
        const {cipher, token} = await r.json();

        return decrypt(cipher, token);
    });

    res.status(200).json(gqlResponse);
}