const {
    client_id,
    client_secret
} = require('./credentials.json').installed
const fetch = require('node-fetch')
const express = require('express')
const app = new express()

const FormData = require('form-data');
app.get('/', (req, res) => {
    if (req.query.code != null) {
        var form = new FormData();
        form.append('code', req.query.code)
        form.append('redirect_uri', "http://localhost:3000")
        form.append('client_id', client_id),
            form.append('client_secret', client_secret)
        form.append('grant_type', "authorization_code")
        fetch(`https://www.googleapis.com/oauth2/v4/token`, {
                method: "POST",
                body: `grant_type=authorization_code&code=${req.query.code}&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=http://localhost:3000`,
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                }
            })
            .then(data => data.json())
            .then(data => res.send(data.refresh_token))
            .catch(err => {
                console.error(err)
                res.send("Error has ocurred " + err)
            })
        return

    }
    var link = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:3000&prompt=consent&response_type=code&client_id=${client_id}&scope=https://www.googleapis.com/auth/youtube+https://www.googleapis.com/auth/youtube.readonly&access_type=offline`
    res.write(`
        <a href="${link}">Get your token</a>
    `)
})
app.get('/{token}', (req, res) => {

})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

// Return url where people can give consent
// => people fill in code
//   => fetch refresh token with said code and return to user
// User can use refresh token to use with bots!