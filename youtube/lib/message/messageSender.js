const fetch = require('node-fetch')
const parseMessage = require('./messageParser')

class messageSender {
    constructor({apiKey, chatID, accessTokenManager}) {
        this.apiKey = apiKey
        this.chatID = chatID
        this.atm = accessTokenManager
    }
    async sendMessage(message) {
        let postData = {
            snippet: {
                type: "textMessageEvent",
                liveChatId: this.chatID,
                textMessageDetails: {
                    messageText: message
                }
            }
        }

        return fetch(`https://www.googleapis.com/youtube/v3/liveChat/messages?part=id,snippet,authorDetails&key=${this.apiKey}`, {
            method: 'POST',
            body: JSON.stringify(postData), 
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${await this.atm.getAccessToken()}`
            }
        })
        .then(res => res.json())
        .then(parseMessage)
    }
}
module.exports = messageSender