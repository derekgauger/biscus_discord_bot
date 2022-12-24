const { SlashCommandBuilder } = require('discord.js')
require('../../functions/discord_messages/twitchProfileInfo')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription("Get information about a twitch account")
        .addStringOption((option) => option.setName('username').setDescription('Twitch account username you are trying to look up').setRequired(true))
        .setDMPermission(true)
        .setDescriptionLocalizations({
            de: 'Informieren Sie sich über ein Twitch-Konto',
        }),

    async execute(interaction, client) {

        const username = interaction.options.getString('username')

        let embed = await client.createProfileInfo(username)

        console.log(`'${interaction.user.username}' used '/get ${username}' in '${interaction.guild.name}'`)

        await interaction.reply({
            content: "Testing",
            // embeds: [embed]
        }).catch(err => console.log(err))
    }
}