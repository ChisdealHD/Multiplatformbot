const EventEmitter = require('events')
const fetch = require('node-fetch')
const parseMessage = require('./messageParser')

class messageListener extends EventEmitter {
    constructor(apiKey, chatID) {
        super()
        this.apiKey = apiKey
        this.chatID = chatID
        this.lastFetch = Date.now()
        this.startFetchingMessages()
    }

    startFetchingMessages() {
        setTimeout(() => {
            this.fetchMessages()    
        }, 1000)
    }
    fetchMessages() {
        fetch(`https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${this.chatID}&part=id,snippet,authorDetails&key=${this.apiKey}`)
        .then(data => data.json())
        .then(data => this.processData(data))
        .catch(console.error)
    }
    processData(data) {
        let messages = []
        for(var i in data.items) {
            let item = data.items[i]
            if((new Date(item.snippet.publishedAt)) > this.lastFetch) {
                if(item.kind == "youtube#liveChatMessage") {
                    messages.push(parseMessage(item))
                }
            }
        }
        if(messages.length > 0) {
            this.emit('message', ...messages)
            this.lastFetch = Date.now()
        }
        setTimeout(this.fetchMessages.bind(this), data.pollingIntervalMillis)
    }
}
module.exports = messageListener