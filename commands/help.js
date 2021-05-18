module.exports = {
	name: 'help',
	description: 'Need help ? I\'m here for you <3',
	execute(message, args, Discord) {
		message.channel.send('Need Help ? I loading the command.').then(msg => {
            const embed = new Discord.MessageEmbed()
                .addField(`📚 Utilities`, `\`/rr\` : **Create a simple reaction role**`)
                .setFooter(`Made by Alexis by ❤️`)
            msg.edit("", embed)
        });
	},
};