import {makeEncryptedJsonRequestBody} from "@/utils/request";
import {decrypt} from "@/utils/encryption";
import {MEMBEAN_ACCESS_URL} from "@/utils/constants";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).end('Method Not Allowed');
        return;
    }

    const {operationName, variables, query} = req.body;

    const encryptedRequest = makeEncryptedJsonRequestBody({operationName, variables, query});
    const sessionToken = req.headers['x-session'];

    const gqlResponse = await fetch(`${MEMBEAN_ACCESS_URL}/graphql.json`, {
        method: 'POST',
        rejectUnauthorized: false,
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