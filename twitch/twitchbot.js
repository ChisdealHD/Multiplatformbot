exports.twitchbot = function() {
    var tmi = require("tmi.js");
    var request = require('request');
    var config = require('./../config.json');
    var chalk = require('chalk');
    var clear = require('clear');
    var getJSON = require("get-json");
    var fs = require('fs');

    var options = {
        options: {
            debug: true
        },
        connection: {
            reconnect: true
        },
        identity: {
            username: config.twitch.TBUsername,
            password: config.twitch.TBOAuth
        },
        channels: config.twitch.Channels
    };

    var client = new tmi.client(options);

    console.log(`
${chalk.grey('--------------------------------------------------')}
${chalk.magenta('Twitch ') + chalk.green(' Loaded, Loading Modules for ') + chalk.magenta('Twitch ')}
${chalk.grey('--------------------------------------------------')}
`);
    // Connect the client to the server..
    client.connect();

    //connect client to the server...
    client.connect().then(function(data) {
        client.action(channel, "Hello World!").then(function(data) {
            //data returns [channel]
        }).catch(function(err) {
            //
        });
    }).catch(function(er) {

    });

    /*client.on("join", function(channel, username, self, message) {
        if (username.mod != true) {
            client.say(channel, '[Moderator]' + username + ' is ONLINE!');
        }
    });*/

    client.on("chat", function(channel, userstate, message, self) {

        if (self) return;

        const prefix = "!"
        console.log(message);
        if (message.toLowerCase().indexOf(prefix.toLowerCase()) !== 0) return;
        const args = message.toLowerCase().slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase()
            //commands go here
        if (command == "help") {
            client.say(channel, 'EYA');
        };

        if (command == "mcstats") {
            if (!args || args[0] == null || args[0] == "") return client.chatMessage(steamID, "Do !mcstats <IP:PORT> for Checking Server is Online for Minecraft!");
            console.log(`IP to search: ${args[0].replace("http://", "")}`);
            request("https://eu.mc-api.net/v3/server/ping/" + args[0].replace("http://", ""),
                function(err, res, body) {
                    var data = JSON.parse(body);
                    if (data.online) {
                        client.say(channel, "MC Status \n\n IP: " + args[0].replace("http://", "") + "\n \nOnline Players " + data.players.online + "\n Max Players " + data.players.max + "\n Version " + data.version.name);
                    } else {
                        client.say(channel, "MC Status \n\n Server is OFFLINE! ");
                    }
                })
        };
    });
}