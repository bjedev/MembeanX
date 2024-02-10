import {identifyMembeanPageType} from "@/utils/page-identifier";
import {MEMBEAN_ACCESS_URL} from "@/utils/constants";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({success: false, error: 'Method not allowed'});
    }

    const {auth_token, session_id, minutes} = req.body;

    if (!session_id || session_id === 'undefined') {
        return res.status(401).json({success: false, error: 'Unauthorized'});
    }

    if (!minutes) {
        return res.status(400).json({success: false, error: 'Minutes not provided'});
    }

    const barriers = await fetch(`${MEMBEAN_ACCESS_URL}/training_sessions/new`, {
        rejectUnauthorized: false,
        headers: {
            'Cookie': `domain=membean.com; _new_membean_session_id=${session_id}; auth_token=${auth_token}`,
        },
    }).then(async (r) => {
        // Now, lots of parsing is up ahead...
        const text = await r.text();

        if (!text.includes('35 min."')) {
            console.log(text)

            return {
                advance: text.split('<form action="')[1].split('"')[0],
                barrier: text.split('"barrier" type="hidden" value="')[1].split('"')[0],
                type: identifyMembeanPageType(text),
            }
        }

        return {
            5: text.split('5 min." /><input name="barrier" type="hidden" value="')[1].split('"')[0],
            10: text.split('10 min." /><input name="barrier" type="hidden" value="')[1].split('"')[0],
            15: text.split('15 min." /><input name="barrier" type="hidden" value="')[1].split('"')[0],
            20: text.split('20 min." /><input name="barrier" type="hidden" value="')[1].split('"')[0],
            25: text.split('25 min." /><input name="barrier" type="hidden" value="')[1].split('"')[0],
            30: text.split('30 min." /><input name="barrier" type="hidden" value="')[1].split('"')[0],
            35: text.split('35 min." /><input name="barrier" type="hidden" value="')[1].split('"')[0],
            45: text.split('45 min." /><input name="barrier" type="hidden" value="')[1].split('"')[0],
            60: text.split('60 min." /><input name="barrier" type="hidden" value="')[1].split('"')[0],
        }
    })

    if (barriers.barrier) {
        // This means the session has already begun
        return res.status(200).json({success: true, type: "ALREADY_BEGUN", initialState: barriers});
    }

    const initialState = await fetch(`${MEMBEAN_ACCESS_URL}/training_sessions?t=${minutes}`, {
        method: 'POST',
        rejectUnauthorized: false,
        headers: {
            'Cookie': `domain=membean.com; _new_membean_session_id=${session_id}; auth_token=${auth_token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `barrier=${barriers[minutes]}`,
    }).then(async (r) => {
        const text = await r.text();

        return {
            advance: text.split('<form action="')[1].split('"')[0],
            barrier: text.split('"barrier" type="hidden" value="')[1].split('"')[0],
            type: identifyMembeanPageType(text),
        }
    });

    res.status(200).json({
        success: true,
        type: "FRESH",
        initialState: initialState,
    });
}