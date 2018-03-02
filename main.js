var fs = require('fs');
var config = require('./config.json');
var mixer = require('./mixer/mixerbot');
var twitch = require('./twitch/twitchbot');
var discord = require('./discord/discordbot');
var youtube = require('./youtube/youtubebot');
var chalk = require('chalk');
var clear = require('clear');

console.log("Starting UP!");
clear();
console.log(`
${chalk.grey('--------------------------------------------------')}
ChisBot, an open-source, multi-platform bot.
${chalk.red('PLEASE DO NOT SELL THIS BOT/SOURCE TO OTHER PEOPLE')}
${chalk.red('PLEASE DO NOT SELL THE BOT FOR SERVICE.')}
Platforms: ${chalk.magenta('Twitch')}, ${chalk.cyan('Mixer')}, ${chalk.white('You') + chalk.red('Tube')}, ${chalk.blue('Discord')}
${chalk.grey('--------------------------------------------------')}
`);

//Loading BOTS HERE!
discord.discordbot();
youtube.youtubebot();
mixer.mixerbot();
twitch.twitchbot();