export function identifyMembeanPageType(pageText) {
    if (pageText.includes('id="wordspell"')) return 'WORD_SPELL';
    if (pageText.includes('rw-defn idx0') && !pageText.includes('new-word-icon')) return 'LEARN_WORD_OLD';
    if (pageText.includes('rw-defn idx0') && pageText.includes('new-word-icon')) return 'LEARN_WORD_NEW';
    if (pageText.includes("id='single-question'")) return 'MULTIPLE_CHOICE';

    if ((pageText.includes("your browser isn't currently compatible."))) return 'SESSION_EXPIRED'

    console.log('Page text:', pageText);
}