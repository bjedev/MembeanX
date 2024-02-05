import {decryptAnswer} from "@/utils/answer-encryption";

export function parseMultipleChoice(text) {
    const question = text.split('<strong>Q:</strong>')[1].split("</h3>")[0].trim()
    const encryptedAnswer = text.split("' id='google-analytics-mb'>")[0].split("<div data-value='")[1]

    const correctAnswerIndex = Number.parseInt(decryptAnswer(encryptedAnswer))

    const choices = []

    for (let i = 0; i !== 3; i++) {
        const choice = text.split(`<li class='choice' data-value='${i}'>
<span class='result'></span>`)[1].split('</li>')[0].trim()
        console.log(choice)
        choices.push({
            text: choice,
            answer: correctAnswerIndex === i
        })
    }

    return {
        question: question,
        answers: choices
    }
}