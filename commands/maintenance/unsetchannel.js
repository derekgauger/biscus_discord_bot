const { SlashCommandBuilder, PermissionFlagsBits, BaseGuildTextChannel, } = require('discord.js')
require('../../functions/dynamodb/removeChannel')
require('../../functions/dynamodb/getChannel')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unsetchannel')
        .setDescription("Turns off automatic Twitch notifications for your server")
        .setDMPermission(false),

    async execute(interaction, client) {
        const name = interaction.guild.name
        const id = interaction.guild.id
        const channel_id = interaction.channel.id

        console.log(`'${interaction.user.username}' used /unsetchannel in '${name}'`)

        let reply = ""

        try {
            if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                let channel = await client.getChannel(id)

                if (channel === true) {
                    await client.removeChannel(id, name)
                    reply = "Removed Twitch notifications from this server!"

                } else {
                    reply = "Your server is not setup to receive Twitch notifications!"

                }

            } else {
                reply = "You do not have permission to use this command. You need the **'Manage Server'** permission to proceed."
                
            }

        } catch (error) {
            reply = "There was an error :( - Contact: Dirk#8540"
            console.log(error)
        }

        await interaction.reply({
            content: reply
        }).catch(err => console.log(err))
    }
}
