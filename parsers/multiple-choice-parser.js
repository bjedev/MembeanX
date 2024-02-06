import {decryptAnswer} from "@/utils/answer-encryption";
import he from "he";
import {load} from 'cheerio';

export function parseMultipleChoice(text) {
    const $ = load(text)
    const question = text.split('<strong>Q:</strong>')[1].split("</h3>")[0].trim()
    const encryptedAnswer = $('#google-analytics-mb').attr('data-value')

    const correctAnswerIndex = Number.parseInt(decryptAnswer(encryptedAnswer))

    const choices = []

    for (let i = 0; i !== 3; i++) {
        const choice = text.split(`<li class='choice' data-value='${i}'>
<span class='result'></span>`)[1].split('</li>')[0].trim()

        choices.push({
            text: he.decode(choice.replace(/(<([^>]+)>)/gi, "")),
            correct: correctAnswerIndex === i
        })
    }

    return {
        question: question.replace(/(<([^>]+)>)/gi, ""),
        answers: choices
    }
}