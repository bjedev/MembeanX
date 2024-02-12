export default async function handler(req, res) {
    let {advance, answer, auth_token, barrier, session_id, type, correct, study_type} = req.body;

    let id = advance.split('/')[4];

    let body = undefined;
    let pass = true;

    switch (type) {
        case "spell": {
            const randomPageTime = Math.floor(Math.random() * 10000) + 1000;
            console.log(randomPageTime)

            const spellResponse = await fetch(advance, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': `domain=membean.com; _new_membean_session_id=${session_id}; auth_token=${auth_token};`
                },
                body: `event=spell!&time-on-page=%7B%22time%22%3A${randomPageTime}%7D&id=${id}&barrier=${barrier}&it=1320000&more_ts=ostentatious&answer=${answer}`
            })

            body = await spellResponse.text()

            type = study_type
            id = spellResponse.url.split('/')[4]
            barrier = body.split('barrier" type="hidden" value="')[1].split('"')[0]

            break;
        }
        case "answer": {
            body = "answer"
            pass = correct
            break;
        }
        case "close": {
            body = "close"
            await fetch(advance, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': `domain=membean.com; _new_membean_session_id=${session_id}; auth_token=${auth_token};`
                },
                body: `event=${type}!&id=${id}&barrier=${barrier}&it=0&more_ts=ostentatious`
            })
            return res.status(200).json({success: true})
        }
    }

    if (body === undefined) {
        return res.status(500).json({error: "Backend body error", success: false})
    }

    try {
        const response = await fetch(advance, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `domain=membean.com; _new_membean_session_id=${session_id}; auth_token=${auth_token};`
            },
            body: `event=${type}!&pass=${pass}&id=${id}&barrier=${barrier}&it=0&more_ts=ostentatious`
        })

        const data = await response.text()

        if (!data.includes("Faster than a speeding bullet, more powerful than a locomotive")) {
            return res.status(500).json({error: "Failed to advance", success: false})
        }

        return res.status(200).json({success: true})
    } catch (e) {
        return res.status(500).json({error: e.message, success: false})
    }
}