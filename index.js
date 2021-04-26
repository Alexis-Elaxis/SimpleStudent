const Discord = require('discord.js');
const config = require('../config.json');
const client = new Discord.Client();

const guildId = "755744734974050335";

const getApp = (guildId) => {
    const app = client.api.applications(client.user.id)
    if(guildId) {
        app.guilds(guildId);
    }
    return app;
}

client.on('ready', async () => {
    console.log('The bot is ready');

    const commands = await getApp(guildId).commands.get();

    await getApp(guildId).commands.post({
        data: {
            name: "ping",
            description: "pong !",
        }
    });

    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        const command = interaction.data.name.toLowerCase();

        if(command === "ping") {
            var ping = Date.now() - interaction.timestamp;
            if(!ping) {
                return errortomember(interaction, ':x: Une erreur s\'est produite.')
            }
            reply(interaction, ':ping_pong: **Pong** ! \nActuellement: '+ping+' ms')
        }
    })
});

const reply = (interaction, response) => {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: {
                content: response,
            }
        }
    })
}

const errortomember = (interaction, response) => {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 3,
            data: {
                flags: 64,
                content: response,
            }
        }
    })
}

client.login(config.token);
