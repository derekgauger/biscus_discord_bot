const { SlashCommandBuilder } = require('discord.js')
require('../../functions/discord_messages/twitchProfileInfo')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getrandom')
        .setDescription("Get a random Twitch account this bot is monitoring on any server")
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