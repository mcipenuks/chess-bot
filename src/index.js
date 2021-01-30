require('dotenv').config({path: __dirname + '/../.env'})
const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
const api = require('./api');

const PREFIX = "!cb";
client.login(process.env.DISCORD_TOKEN);

const successEmbed = (profile) => {
    return new MessageEmbed()
        .setTitle(`${profile.name} (see profile)`)
        .setColor('#6c9d41')
        .setURL('https://chess.com/member/' + profile.name)
        .addFields(
            { name: profile.bullet.getTitleString(), value: profile.bullet.getRatingString(),  inline: true },
            { name: profile.blitz.getTitleString(), value: profile.blitz.getRatingString(),  inline: true },
            { name: profile.rapid.getTitleString(), value: profile.rapid.getRatingString(),  inline: true },
            { name: `FIDE`, value: profile.getFideRating(),  inline: false },
        )
        .setThumbnail(profile.avatar)
}

const errorEmbed = (username) => {
    return new MessageEmbed()
        .setTitle(`User with name "${username}" was not found.`)
        .setColor('#ff3333')
}

const helpEmbed = () => {
    return new MessageEmbed()
        .setTitle(`Help`)
        .setColor('#5bc0de')
        .addFields(
            { name: 'Description', value: "I'm a simple bot that retrieves user profiles from chess.com \n Maybe in the future I will be capable of more things :("},
            { name: 'Commands', value: "Type !cb profile <username> to get user profile" }
        )
}

client.on('message', async (msg) => {
    if (msg.content === PREFIX) {
        msg.channel.send(helpEmbed());
    }

    if (msg.content.startsWith(`${PREFIX} profile `)) {
        msg.channel.startTyping();
        let username = msg.content.split(' ')[2];
        try {
            let profile = await api.getProfile(username);
            msg.channel.send(successEmbed(profile));
        } catch (e) {
            msg.channel.send(errorEmbed(username));
        }
        msg.channel.stopTyping();
    }

    if (msg.content.startsWith(`${PREFIX} help`)) {
        msg.channel.send(helpEmbed());
    }

});


