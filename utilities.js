module.exports = {
    getValues: function (obj) {
        let values = []
        Object.keys(obj).forEach(function (key) {
            values.push(obj[key])
        })
        return values
    },

    getPartOfWord_CN: function (partOfSpeech) {
        switch (partOfSpeech) {
            case 'noun':
                return '名'
            case 'verb':
                return '动'
            case 'adjective':
                return '形'
            case 'adverb':
                return '副'
            case 'num':
            case 'number':
                return '数'
            case 'pronoun':
                return '代'
            case 'interj':
            case 'interjection':
                return '感'
            default:
                return partOfSpeech ? partOfSpeech : '其他'
        }
    }
}
