import {load} from "cheerio";
import {decryptAnswer} from "@/utils/answer-encryption";

export function parseWordTypePage(text) {
    const $ = load(text)
    const encryptedAnswer = $('#google-analytics-mb').attr('data-value')

    const correctAnswer = decryptAnswer(encryptedAnswer)

    return {
        hint: $('#word-hint > p > span').text(),
        imageUrl: $('#cloze-background').attr('src'),
        answer: correctAnswer
    }
}