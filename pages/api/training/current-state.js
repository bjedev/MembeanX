import {identifyMembeanPageType} from "@/utils/page-identifier";
import parseWordPage from "@/parsers/word-page-parser";
import {parseMultipleChoice} from "@/parsers/multiple-choice-parser";
import parseTakeABreakPage from "@/parsers/take-a-break-parser";

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

        let data = undefined;

        switch (type) {
            case 'MULTIPLE_CHOICE':
                data = parseMultipleChoice(text)
                break;
            case 'LEARN_WORD_NEW':
                data = parseWordPage(text)
                break;
            case 'SESSION_GRACEFULLY_COMPLETED':
                data = parseTakeABreakPage(text)
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