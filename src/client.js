require('dotenv').config({path: __dirname + '/../.env'})
const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
const run = require('./bot');

client.login(process.env.DISCORD_TOKEN);

client.on('message', async (msg) => {
    if (msg.content.startsWith('!rating')) {
        let split = msg.content.split(' ')
        let username = split[1];

        let user = await run(username);

        const embed = new MessageEmbed()
            .setTitle(username)
            .setColor('#6c9d41')
            .addFields(
                { name: `Bullet`, value: user.getRatingString('bullet'),  inline: true },
                { name: `Blitz`, value: user.getRatingString('lightning'),  inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: `Rapid`, value: user.getRatingString('rapid'),  inline: true },
                { name: `FIDE`, value: user.getFideRating(),  inline: true },
            )

        msg.channel.send(embed);
    }
});


