export default function parseWordPage(text) {
    const word = text.split("'wordform'>")[1].split('<')[0]

    return {
        word: word
    }
}