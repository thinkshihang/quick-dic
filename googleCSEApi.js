const
    request = require('request'),
    config = require('config');

const CSE_ID = (process.env.CSE_ID) ?
    process.env.CSE_ID :
    config.get('appSecret');

const CSE_API_KEY = (process.env.CSE_API_KEY) ?
    process.env.CSE_API_KEY :
    config.get('appSecret');

const CSE_SERVER_URL = "https://www.googleapis.com/customsearch/v1"

module.exports = {
    sendFetchImagesRequest: function(text, callback) {
        request({
            url: CSE_SERVER_URL + "?q=" + text + "&cx=" + encodeURIComponent(CSE_ID) + "&key=" + CSE_API_KEY + "&searchType=image",
            method: 'GET',
            headers: {
                'Content_type': 'application/json'
            }
        }, function(error, response, body) {
            console.log('error is ' + error)
            console.log('status code is ' + response.statusCode)
            if (!error && response.statusCode == 200) {
                var payloadJSON = {}
                try {
                    payloadJSON = JSON.parse(body)
                } catch (e) {
                    payloadJSON = body
                }
                var images = []
                payloadJSON.items.forEach(function(item) {
                    images.push(item.link)
                })
                callback(images)
            } else {
                callback([])
            }
        })
    }
}
