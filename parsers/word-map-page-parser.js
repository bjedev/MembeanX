import {decryptAnswer} from "@/utils/answer-encryption";
import he from "he";
import {load} from 'cheerio';

export function parseWordMapPage(text) {
    const $ = load(text)
    let question = $('#single-question > p').text().trim().replace("Q:\n", "")

    const encryptedAnswer = $('#google-analytics-mb').attr('data-value')

    const correctAnswerIndex = Number.parseInt(decryptAnswer(encryptedAnswer))

    const answers = $('#choice-section').children().map((i, el) => {
        const text = $(el).text().trim()
        const correct = i === correctAnswerIndex

        if (text === 'I’m not sure') return

        return {
            text: he.decode(text),
            correct: correct
        }
    })

    console.log(answers.get())

    return {
        question: "Choose the word that fits best",
        imageUrl: $('#constellation > img').attr('src'),
        answers: answers.get()
    }
}