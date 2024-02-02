import {decrypt} from "@/utils/encryption";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).end('Method Not Allowed');
        return;
    }

    const {cipher, token} = await req.body;
    const loginResultText = decrypt(cipher, token)

    res.status(200).json(loginResultText);
}