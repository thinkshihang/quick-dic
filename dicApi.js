const
    request = require('request'),
    config = require('config');

const PEARSON_API_KEY = (process.env.DICTIONARY_API_KEY) ?
  process.env.DICTIONARY_API_KEY :
  config.get('appSecret');

const DICTIONARY_SERVER_URL = "https://api.pearson.com/v2/dictionaries/ldec/"

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
                for (var i = 0; i < payloadJSON.results.length; i++) {
                    if (payloadJSON.results[i].headword.toUpperCase() == text.toUpperCase()) {
                        callback(payloadJSON.results[i].senses[0].translation)
                        return
                    }
                }
                callback(payloadJSON.results[0].senses[0].translation)
            } else {
                callback('Sorry, request failed. Please try again. If the problem persists, please contact thinkshihang@gmail.com for support. Thanks for your hel ')
            }
        })
    }
}
