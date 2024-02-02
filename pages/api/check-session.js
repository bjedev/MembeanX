export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).end('Method Not Allowed');
        return;
    }

    const {token} = req.body;

    if (token) {
        res.status(200).json({message: 'Session is valid'});
    } else {
        res.status(401).json({message: 'Session is invalid'});
    }
}