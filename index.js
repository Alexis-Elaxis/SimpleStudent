const Discord = require('discord.js');
const config = require('./config.json');
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
    client.user.setActivity('Chargement des composants')
    console.log('The bot is ready');

    setInterval(function(){
        const date = new Date(); const hour = date.getUTCHours(); const d = date.getUTCDay();
        const h = hour+2;
        if(d < 5) {
            console.log(h);
            if (h < 7) {
                client.user.setActivity('🛏️ Dormir')
            } else if(h <= 8) {
                client.user.setActivity('👀 Se préparer pour les cours')
            } else if (h <= 12) {
                client.user.setActivity('📚 Travailler')
            } else if (h <= 14) {
                client.user.setActivity('🍽️ Manger')
            } else if (h <= 21) {
                client.user.setActivity('📚 Travailler')
            } else if (h <= 00) {
                client.user.setActivity('🛏️ Dormir')
            }
        } else {
            client.user.setActivity('🎉 C\' est le week-end !')
        }
    }, 60000);

    const commands = await getApp(guildId).commands.get();

    await getApp(guildId).commands.post({
        data: {
            name: "ping",
            description: "Pong !",
        }
    });

    // Delete command :
    // await getApp(guildId).commands('ID').delete()

    await getApp(guildId).commands.post({
        data: {
            name: 'annonce',
            description: 'Envoyez un message en mentionnant tout les utilisateurs du serveur !',
            options: [
                {
                    name: 'contenu',
                    description: 'Contenu de l\'annonce',
                    required: true,
                    type: 3
                }
            ]
        }
    })

    await getApp(guildId).commands.post({
        data: {
            name: 'translate',
            description: 'Traduisez un mot en utilisant WordReference',
            options: [
                {
                    name: 'mot',
                    description: 'Mot à traduire',
                    required: true,
                    type: 3
                }
            ]
        }
    })

    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        const { contenu, options } = interaction.data

        const command = interaction.data.name.toLowerCase();

        const args = {}

        if(options) {
            for (const option of options) {
                const { name, value } = option
                args[name] = value
            }
        }

        if(command === "ping") {

            var ping = Date.now() - interaction.timestamp;
            if(!ping) {
                return errortomember(interaction, '❌ Une erreur s\'est produite.')
            }
            reply(interaction, ':ping_pong: **Pong** ! \nActuellement: '+ping+' ms')
        } else if(command === "annonce") {

            const roles = interaction.member.roles
            if(roles.includes("756485927592787969") || roles.includes("757649239789797407")) {
                const embed = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setTimestamp()
                    .setFooter("Made by Alexis with ❤️")

                for (const arg in args){
                    const value = args[arg]
                    embed.addField(`Nouvelle annonce de __${interaction.member.user.username}__ :`, `${value}`)
                }

                replyembed(interaction, embed)
                client.channels.resolve(interaction.channel_id).send("<@229178398893801472>").then(msg => {
                    msg.delete()
                })
            } else {
                return errortomember(interaction, '❌ Vous n\'êtes pas un professeur ou un délégué.')
            }
        } else if(command === "translate") {
            for (const arg in args){
                const value = args[arg]
            }
        }
    })
});

const messagereply = (interaction, response) => {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 3,
            data : {
                content: response
            }
        }
    })
}

const replyembed = async (interaction, response) => {
    let data = {
        content: response
    }

    if(typeof response === 'object') {
        data = await createAPIMessage(interaction, response)
    }

    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data
        }
    })
}

const reply = (interaction, response) => {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data : {
                content: response
            }
        }
    })
}

const errortomember = (interaction, response) => {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 3,
            data : {
                content: response,
                flags: 64
            }
        }
    })
}

const createAPIMessage = async(interaction, content) => {
    const { data, files } = await Discord.APIMessage.create(
        client.channels.resolve(interaction.channel_id),
        content
    )
    .resolveData()
    .resolveFiles()

    return { ...data, files }
} 

client.login(config.token);