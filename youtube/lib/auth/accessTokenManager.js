const fetch = require('node-fetch')
class accessTokenManager {
    constructor(credentials, refreshToken) {
        this.credentials = credentials
        this.refreshToken = refreshToken
        this.accessToken = null
        this.accessTokenExpiry = 0

        this._refreshAccessToken()
    }
    getAccessToken() {
        return new Promise(resolve => {
            if (Date.now() >= this.accessTokenExpiry) {
                return this._refreshAccessToken(resolve)
            }
            resolve(this.accessToken)
        })
    }

    _refreshAccessToken(resolve) {
        let self = this
        fetch(`https://www.googleapis.com/oauth2/v4/token`, {
                method: "POST",
                body: `grant_type=refresh_token&refresh_token=${this.refreshToken}&client_id=${this.credentials.client_id}&client_secret=${this.credentials.client_secret}&redirect_uri=http://localhost:3000`,
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                }
            })
            .then(data => data.json())
            .then(data => {
                self.accessToken = data.access_token,
                    self.accessTokenExpiry = Date.now() + 3600
                if (resolve != null) resolve(data.access_token)
            })
            .catch(console.error)
        return self.accessToken
    }

}

module.exports = accessTokenManager