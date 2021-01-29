require('dotenv').config({path: __dirname + '/../.env'})
const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
const ChessUser = require('./bot');

const PREFIX = '!';
client.login(process.env.DISCORD_TOKEN);

client.on('message', async (msg) => {
    // console.log(msg.content);

    if (msg.content.startsWith('!rating')) {
        let split = msg.content.split(' ')
        let username = split[1];

        let user = await ChessUser(username);

        const embed = new MessageEmbed()
            .setTitle(username)
            .setColor('#6c9d41')
            .addFields(
                { name: `:gun: Bullet`, value: user.ratingString('bullet'),  inline: true },
                { name: `:cloud_lightning: Blitz`, value: user.ratingString('lightning'),  inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: `:rabbit2: Rapid`, value: user.ratingString('rapid'),  inline: true },
                { name: `:chess_pawn: FIDE`, value: user.ratingFIDE(),  inline: true },
            )

        msg.channel.send(embed);
    }
});


