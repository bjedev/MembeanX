export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).end('Method Not Allowed');
        return;
    }

    const {session_id} = req.body;

    const validSession = await fetch("https://membean.com/graphql.json", {
        method: "POST",
        headers: {
            'Cookie': `domain=membean.com; _new_membean_session_id=${session_id}`,
            "Content-Type": "application/json"
        },
    }).then(async (res) => {
        const data = await res.json();
        return !data.error;
    })

    if (validSession) {
        res.status(200).json({message: 'Session is valid'});
    } else {
        res.status(401).json({message: 'Session is invalid'});
    }
}