const
    request = require('request'),
    config = require('config');

const PEARSON_API_KEY = (process.env.DICTIONARY_API_KEY) ?
  process.env.DICTIONARY_API_KEY :
  config.get('appSecret');

const DICTIONARY_SERVER_URL = "https://api.pearson.com/v2/dictionaries/"

const EN_CH_DICT = "ldec" // Longman English-Chinese Dictionary of 100,000 Words (New 2nd Edition)
const LDOCE5 = "ldoce5" // Longman Dictionary of Contemporary English (5th edition)

module.exports = {
    sendTranslationRequest: function(text, callback) {
        request({
            url: DICTIONARY_SERVER_URL + 'entries?headword=' + text + '&apikey=' + PEARSON_API_KEY,
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

                var resultCh, resultEn
                for (var i = 0; i < payloadJSON.results.length; i++) {
                    let result = payloadJSON.results[i]
                    if (result.headword.toUpperCase() == text.toUpperCase()) {
                        if (result.datasets.includes(EN_CH_DICT)) {
                            resultCh = result.senses[0].translation
                        } else if (result.datasets.includes(LDOCE5)) {
                            resultEn = result.senses[0].definition[0]
                        }
                        if (resultEn && resultCh) {
                            break
                        }
                    }
                }
                if (resultCh || resultEn) {
                    if (resultCh) {
                        callback(resultCh)
                    }
                    if (resultEn) {
                        callback(resultEn)
                    }
                } else {
                    if (payloadJSON.results.length == 0) {
                        callback(text + ' is not a word in my dictionary.')
                    } else {
                        callback(payloadJSON.results[0].senses[0].translation)
                    }
                }
            } else {
                callback('Sorry, request failed. Please try again. If the problem persists, please contact thinkshihang@gmail.com for support. Thanks for your hel ')
            }
        })
    }
}
