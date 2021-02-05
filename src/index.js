require('dotenv').config({path: __dirname + '/../.env'})
const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
const api = require('./api');

const PREFIX = "!cb";
client.login(process.env.DISCORD_TOKEN);

const profileEmbed = (profile) => {
    return new MessageEmbed()
        .setTitle(`${profile.username} ${profile.getCountryFlag()}`)
        .setDescription(profile.getDescription())
        .setColor('#6c9d41')
        .setURL('https://chess.com/member/' + profile.username)
        .addFields(
            { name: profile.bullet.getTitleString(), value: profile.bullet.getRatingString(),  inline: true },
            { name: profile.blitz.getTitleString(), value: profile.blitz.getRatingString(),  inline: true },
            { name: profile.rapid.getTitleString(), value: profile.rapid.getRatingString(),  inline: true },
            { name: `FIDE`, value: profile.getFideRating(),  inline: false },
        )
        .setThumbnail(profile.avatar)
}

const helpEmbed = () => {
    return new MessageEmbed()
        .setTitle(`Help`)
        .setColor('#5bc0de')
        .addFields(
            { name: 'Description', value: "I'm a simple bot that retrieves user profiles from chess.com \n As of this moment only **Bullet**, **Blitz**, **Rapid** and **FIDE** ratings are gathered"},
            { name: 'Commands', value: "Type `!cb profile <username>` to get user profile" }
        )
}

client.on('ready', async () => {
    await client.user.setPresence({ activity: { name: '!cb' }, status: 'online' })
});

client.on('message', async (msg) => {
    if (msg.content === PREFIX) {
        msg.channel.send(helpEmbed());
    }

    if (msg.content.startsWith(`${PREFIX} profile `)) {
        msg.channel.startTyping();
        let username = msg.content.split(' ')[2];
        try {
            let profile = await api.getProfile(username);
            msg.channel.send(profileEmbed(profile));
        } catch (err) {
            if (err.response.status === 404) {
                console.log(err.response.data);
                msg.channel.send(new MessageEmbed()
                    .setTitle(`User with name "${username}" was not found`)
                    .setColor('#ff3333')
                );
            } else {
                console.log(err.response.data);
                msg.channel.send(new MessageEmbed()
                    .setTitle(`Something is not working properly on my side when searching for "${username}"`)
                    .setColor('#ff3333')
                );
            }
        }
        msg.channel.stopTyping();
    }

    if (msg.content.startsWith(`${PREFIX} help`)) {
        msg.channel.send(helpEmbed());
    }

});


