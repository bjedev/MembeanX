import {load} from "cheerio";

export default function parseWordPage(text) {
    const $ = load(text)
    const word = $('#wordform-container > h1').text()
    const contextParagraph = $('#context-paragraph').text().trim()
    const questions = $('#choice-section > li').map((i, el) => {
        const text = $(el).text().trim()
        const correct = $(el).hasClass('answer')

        return {
            text: text,
            correct: correct
        }
    })

    return {
        word: word,
        context: contextParagraph,
        questions: questions.get()
    }
}