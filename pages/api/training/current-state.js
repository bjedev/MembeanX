import {identifyMembeanPageType} from "@/utils/page-identifier";
import parseWordPage from "@/parsers/word-page-parser";

export default async function handler(req, res) {
    const {session_id, auth_token, blockState} = req.body;

    const userStateUrl = blockState.advance.replace("advance", "user_state")

    const state = await fetch(userStateUrl, {
        headers: {
            'Cookie': `domain=membean.com; _new_membean_session_id=${session_id}; auth_token=${auth_token};`
        }
    }).then(async (res) => {
        const text = await res.text()
        const type = identifyMembeanPageType(text)

        switch (type) {
            case 'MULTIPLE_CHOICE':
                return {
                    type: 'MULTIPLE_CHOICE',
                    barrier: text.split('barrier" type="hidden" value="')[1].split('"')[0]
                }
            case 'LEARN_WORD_NEW':
                return {type: type, data: parseWordPage(text)}
            case 'SESSION_EXPIRED':
                return { type: 'SESSION_EXPIRED' }
            default:
                console.log(type)
        }
    })

    res.status(200).json(state)
}