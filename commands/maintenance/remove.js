const { SlashCommandBuilder, PermissionFlagsBits, BaseGuildTextChannel, } = require('discord.js')
require('../../functions/dynamodb/removeNotification')
require('../../functions/dynamodb/getNotification')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription("Remove a Twitch channel to the monitored list")
        .addStringOption((option) => option.setName('username').setDescription('Twitch account username you are trying to remove').setRequired(true))
        .setDMPermission(true),

    async execute(interaction, client) {

        const username = interaction.options.getString('username').toLowerCase()
        const name = interaction.guild.name
        const id = interaction.guild.id

        console.log(`'${interaction.user.username}' used '/remove ${username}' in '${name}'`)

        let reply = ""

        try {
            if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                let notification = await client.getNotification(username, id)

                if (notification !== null) {
                    await client.removeNotification(username, id, name)
                    reply = `Removed '${username}'s Twitch channel notifications!`

                } else {
                    reply = `Your server is not currently monitoring '${username}'s Twitch channel!`

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
