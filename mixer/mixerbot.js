exports.mixerbot = function() {

    const Mixer = require('beam-client-node');
    const ws = require('ws');
    const request = require('request');
    const config = require('./../config.json');
    const chalk = require('chalk');
    const clear = require('clear');

    let userInfo;

    const client = new Mixer.Client(new Mixer.DefaultRequestRunner());

    // With OAuth we don't need to log in. The OAuth Provider will attach
    // the required information to all of our requests after this call.
    client.use(new Mixer.OAuthProvider(client, {
        tokens: {
            access: config.mixer.Token,
            expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
        },
    }));

    // Gets the user that the Access Token we provided above belongs to.
    client.request('GET', 'users/current')
        .then(response => {
            userInfo = response.body;
            return new Mixer.ChatService(client).join(response.body.channel.id);
        })
        .then(response => {
            const body = response.body;
            return createChatSocket(userInfo.id, userInfo.channel.id, body.endpoints, body.authkey);
        })
        .catch(error => {
            console.error('Something went wrong.');
            console.error(error);
        });

    /**
     * Creates a Mixer chat socket and sets up listeners to various chat events.
     * @param {number} userId The user to authenticate as
     * @param {number} channelId The channel id to join
     * @param {string[]} endpoints An array of endpoints to connect to
     * @param {string} authkey An authentication key to connect with
     * @returns {Promise.<>}
     */
    function createChatSocket(userId, channelId, endpoints, authkey) {
        // Chat connection
        const socket = new Mixer.Socket(ws, endpoints).boot();

        // Greet a joined user
        socket.on('UserJoin', data => {
            if (data.roles.indexOf('Mod')) {
                socket.call('msg', [`[Moderator]${data.username} is Online!`]);
            }
        });

        /*socket.on('UserLeave', data => {
            if (data.roles !== -1) {
                socket.call('msg', [`[Moderator]${data.username} is Offline!`]);
            }
        });*/

        // React to our !pong command
        socket.on('ChatMessage', data => {
            const prefix = "!"
            if (data.message.message[0].data.toLowerCase().indexOf(prefix.toLowerCase()) !== 0) return;
            const args = data.message.message[0].data.toLowerCase().slice(prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase()
            if (command == "help") {
                socket.call('msg', [`Help command SOON!`]);
                console.log(`${data.user_name} Run Help!`);
            }
        });

        // Handle errors
        socket.on('error', error => {
            //console.error('Socket error');
            //console.error(error);
        });


        return socket.auth(channelId, userId, authkey)
            .then(() => {
                console.log(`
${chalk.grey('--------------------------------------------------')}
${chalk.cyan('Mixer ') + chalk.green(' Loaded, Loading Modules for ') + chalk.cyan('Mixer ')}
${chalk.grey('--------------------------------------------------')}
${chalk.green('Logged IN!')}
${chalk.grey('--------------------------------------------------')}
`);
                return socket.call('msg', ['Hi! I\'m Here now, please use !help for more commands.']);
            });
    }
};