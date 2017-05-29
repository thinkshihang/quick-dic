const
    request = require('request'),
    config = require('config'),
    pluralize = require('pluralize'),
    utilities = require('./utilities');

const PEARSON_API_KEY = (process.env.DICTIONARY_API_KEY) ?
  process.env.DICTIONARY_API_KEY :
  config.get('appSecret');

const DICTIONARY_SERVER_URL = "https://api.pearson.com/"

const EN_CH_DICT = "ldec" // Longman English-Chinese Dictionary of 100,000 Words (New 2nd Edition)
const LDOCE5 = "ldoce5" // Longman Dictionary of Contemporary English (5th edition)

module.exports = {
    sendTranslationRequest: function(text, callback) {
        request({
            url: DICTIONARY_SERVER_URL + '/v2/dictionaries/entries?headword=' + text + '&apikey=' + PEARSON_API_KEY + '&limit=25',
            method: 'GET',
            headers: {
                'Content_type': 'application/json'
            }
        }, function(error, response, body) {

// console.log(DICTIONARY_SERVER_URL + 'entries?headword=' + text + '&apikey=PEARSON_API_KEY')
console.log('error is ' + error)
console.log('status code is ' + response.statusCode)
            if (!error && response.statusCode == 200) {
                var payloadJSON = {}
                try {
                    payloadJSON = JSON.parse(body)
                } catch (e) {
                    payloadJSON = body
                }

                var results = {}
                for (var i = 0; i < payloadJSON.results.length; i++) {
                    let result = payloadJSON.results[i]
                    var headword = result.headword
                    if (headword.toUpperCase() === text.toUpperCase() ||
                            (headword.indexOf(" ") == -1 && headword.toUpperCase() === pluralize(text, 1).toUpperCase())) {
                        if (result.datasets.includes(EN_CH_DICT) && result.senses.length > 0) {
                            if (results.EN_CH_DICT) {
                                results.EN_CH_DICT[0].content += "\n(" + utilities.getPartOfWord_CN(result.part_of_speech) + ") " + result.senses[0].translation
                            } else {
                                results.EN_CH_DICT = []
                                results.EN_CH_DICT.push({"type": "text", "content": "(" + utilities.getPartOfWord_CN(result.part_of_speech) + ") " + result.senses[0].translation})
                            }
                        } else if (result.datasets.includes(LDOCE5)) {
                            let partOfSpeech = result.part_of_speech ? result.part_of_speech : 'other'
                            if (results.LDOCE5) {
                                results.LDOCE5[0].content += "\n(" + partOfSpeech + ") " + result.senses[0].definition[0]
                            } else {
                                results.LDOCE5 = []
                                results.LDOCE5.push({"type": "text", "content": "(" + partOfSpeech + ") " + result.senses[0].definition[0]})
                            }
                            if (result.pronunciations && result.pronunciations.length > 0) {
                                if (result.pronunciations[1]) {
                                    results.LDOCE5.push({"type": "audio", "content": DICTIONARY_SERVER_URL + result.pronunciations[1].audio[0].url})
                                } else {
                                    results.LDOCE5.push({"type": "audio", "content": DICTIONARY_SERVER_URL + result.pronunciations[0].audio[1].url})
                                }
                            }
                        }
                    }
                }
                if (Object.keys(results).length > 0) {
                    callback(utilities.getValues(results))
                } else {
                    if (payloadJSON.results.length == 0) {
                        callback([[{"type": "text", "content": text + ' is not a word in my dictionary.'}]])
                    } else {
                        callback([[{"type": "text", "content": payloadJSON.results[0].senses[0].translation}]])
                    }
                }
            } else {
                callback([[{"type": "text", "content": 'Sorry, request failed. Please try again. If the problem persists, please contact thinkshihang@gmail.com for support. Thanks for your help '}]])
            }
        })
    }
}
