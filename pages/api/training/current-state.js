import {identifyMembeanPageType} from "@/utils/page-identifier";
import parseWordPage from "@/parsers/word-page-parser";
import {parseMultipleChoicePage} from "@/parsers/multiple-choice-parser";
import parseTakeABreakPage from "@/parsers/take-a-break-parser";
import {parseWordTypePage} from "@/parsers/word-type-parser";
import {parseWordMapPage} from "@/parsers/word-map-page-parser";

export default async function handler(req, res) {
    const {session_id, auth_token, blockState} = req.body;

    if (req.method !== 'POST') {
        return res.status(405).json({error: "Method not allowed :1"})
    }

    const userStateUrl = blockState.advance.replace("advance", "user_state")

    const state = await fetch(userStateUrl, {
        headers: {
            'Cookie': `domain=membean.com; _new_membean_session_id=${session_id}; auth_token=${auth_token};`
        }
    }).then(async (res) => {
        const text = await res.text()
        const type = identifyMembeanPageType(text)

        console.log(type)

        let data = undefined;

        switch (type) {
            case 'WORD_TYPE':
                data = parseWordTypePage(text)
                break;
            case 'MULTIPLE_CHOICE':
                data = parseMultipleChoicePage(text)
                break;
            case 'WORD_MAP':
                data = parseWordMapPage(text)
                break;
            case 'LEARN_WORD_OLD':
            case 'LEARN_WORD_NEW':
                data = parseWordPage(text)
                break;
            case 'SESSION_GRACEFULLY_COMPLETED':
                data = parseTakeABreakPage(text)
                break;
            default:
                console.log('Unknown type:', type)
                data = {type: 'UNKNOWN'}
        }

        if (type === "SESSION_EXPIRED") {
            return {
                type: type,
            }
        }

        return {
            type: type,
            data: data,
            barrier: text.split('barrier" type="hidden" value="')[1].split('"')[0],
            advance: blockState.advance
        }
    })

    res.status(200).json(state)
}