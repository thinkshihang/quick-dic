const
    request = require('request'),
    config = require('config');

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

                var results = []
                // var resultCh, resultEn
                for (var i = 0; i < payloadJSON.results.length; i++) {
                    let result = payloadJSON.results[i]
                    if (result.headword.toUpperCase() == text.toUpperCase()) {
                        if (result.datasets.includes(EN_CH_DICT)) {
                            results.push({"type": "text", "content": result.senses[0].translation})
                        } else if (result.datasets.includes(LDOCE5) && result.pronunciations && result.pronunciations.length > 0) {
                            results.push({"type": "text", "content": result.senses[0].definition[0]})
                            if (result.pronunciations[1]) {
                                results.push({"type": "audio", "content": DICTIONARY_SERVER_URL + result.pronunciations[1].audio[0].url})
                            } else {
                                results.push({"type": "audio", "content": DICTIONARY_SERVER_URL + result.pronunciations[0].audio[1].url})
                            }
                        }
                        if (results.length >= 3) {
                            break
                        }
                    }
                }
console.log("11111")
console.log(results)
                if (results.length > 0) {
                    callback(results)
                } else {
                    if (payloadJSON.results.length == 0) {
                        callback({"type": "text", "content": text + ' is not a word in my dictionary.'})
                    } else {
                        callback({"type": "text", "content": payloadJSON.results[0].senses[0].translation})
                    }
                }
            } else {
                callback({"type": "text", "content": 'Sorry, request failed. Please try again. If the problem persists, please contact thinkshihang@gmail.com for support. Thanks for your help '})
            }
        })
    }
}
