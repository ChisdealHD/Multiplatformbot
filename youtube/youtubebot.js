exports.youtubebot = function() {
    var chalk = require('chalk');
    var clear = require('clear');

    const messageListener = require('./lib/message/messageListener')
    const messageSender = require('./lib/message/messageSender')
    const accessTokenManager = require('./lib/auth/accessTokenManager')
    const config = require('./../config.json');
	var getJSON = require("get-json");
	var request = require('request');


    const atm = new accessTokenManager(require('./credentials.json').installed, config.refresh_token)

    const listener = new messageListener(config.apiKey, config.chatID)
    const sender = new messageSender({
        apiKey: config.apiKey,
        chatID: config.chatID,
        accessTokenManager: atm
    })
	console.log(`
${chalk.grey('--------------------------------------------------')}
${chalk.white('You') + chalk.red('Tube') + chalk.green(' Loaded, Loading Modules for ') + chalk.white('You') + chalk.red('Tube')}
${chalk.grey('--------------------------------------------------')}
`);
    listener.on('message', message => {
        /*if (message.snippet.content.startsWith("!hello")) {
            sender.sendMessage("Heya!")
        }*/
		const prefix = "!"
        if (message.snippet.content.toLowerCase().indexOf(prefix.toLowerCase()) !== 0) return;
        const args = message.snippet.content.toLowerCase().slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase()

        if (command == "help") {
            sender.sendMessage("Help commands SOON!");
        }
		if (command == "mcstats") {
            if (!args || args[0] == null || args[0] == "") return sender.sendMessage("Do !mcstats <IP:PORT> for Checking Server is Online for Minecraft!");
            console.log(`IP to search: ${args[0].replace("http://", "")}`);
            request("https://eu.mc-api.net/v3/server/ping/" + args[0].replace("http://", ""),
                //request("https://eu.mc-api.net/v3/server/info/mc.hypixel.net/json",
                function(err, res, body) {
                    var data = JSON.parse(body);
                    if (data.online) {
                        //client.chatMessage(steamID, "MC Status \n\nIP: "+args[0]+"\nOnline Players "+data.players.online+"\nMax Players "+data.players.max+"\nVersion "+data.version.name);
                        sender.sendMessage("MC Status \n\nIP: " + args[0].replace("http://", "") + "\nOnline Players " + data.players.online + "\nMax Players " + data.players.max + "\nVersion " + data.version.name);
                    } else {
                        sender.sendMessage("MC Status \n\nServer is OFFLINE! ");
                    }
                })
        }
    })

}