export function identifyMembeanPageType(pageText) {
    console.log(pageText)
    if (pageText.includes('the word that fits best')) return 'WORD_MAP';
    if (pageText.includes('Spell the word you saw. It helps with later questions.')) return 'WORD_SPELL';
    if (pageText.includes('id="wordspell"')) return 'WORD_SPELL';
    if (pageText.includes('rw-defn idx0') && !pageText.includes('new-word-icon')) return 'LEARN_WORD_OLD';
    if (pageText.includes('rw-defn idx0') && pageText.includes('new-word-icon')) return 'LEARN_WORD_NEW';
    if (pageText.includes('<input autocapitalize="off" autocomplete="off" autocorrect="off" autofocus="true" id="choice"')) return 'WORD_TYPE';
    if (pageText.includes("id='single-question'")) return 'MULTIPLE_CHOICE';
    if (pageText.includes(("data-state='take_a_break'"))) return 'SESSION_GRACEFULLY_COMPLETED';

    if ((pageText.includes("your browser isn't currently compatible."))) return 'SESSION_EXPIRED'

    console.log('Page text:', pageText);
}