module.exports = {
	name: 'rr',
	description: 'Adds a custom reaction role to your server',
	execute(message, args, Discord) {
        message.channel.send("In wich channel ? (Text Channels only, #channel)").then(msg => {
            message.channel.awaitMessages(m => m.author.id == message.author.id,{max: 1, time: 30000}).then(collected => {
                const channel = collected.first().content.toLowerCase();
                var channel_part1 = channel.substring(2);
                var def_channel = channel_part1.substring(0, channel_part1.length - 1);

                if(!message.guild.channels.cache.get(def_channel)) {
                    return message.channel.send("Stopped. Invalid Channel.")
                }

                message.delete();
                msg.edit("Wich message (Message ID) ?").then(msg => {
                    message.channel.awaitMessages(m => m.author.id == message.author.id,{max: 1, time: 30000}).then(collected => {
                        const message = collected.first().content.toLowerCase();


                    });
                })
            });
        })
	},
};