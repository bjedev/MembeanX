export default function parseTakeABreakPage(text) {
    const timeSpent = text.split(`You’ve been in this study session for
<strong>`)[1].split(`</strong>`)[0]

    return {
        timeSpent: timeSpent
    }
}