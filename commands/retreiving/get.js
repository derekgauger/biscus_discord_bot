const { SlashCommandBuilder } = require('discord.js')
require('../../functions/discord_messages/twitchProfileInfo')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get')
        .setDescription("Get information about a twitch account")
        .addStringOption((option) => option.setName('username').setDescription('Twitch account username you are trying to look up').setRequired(true))
        .setDMPermission(true)
        .setDescriptionLocalizations({
            de: 'Informieren Sie sich über ein Twitch-Konto',
        }),

    async execute(interaction, client) {

        const username = interaction.options.getString('username')

        await interaction.deferReply();

        let embed = await client.createProfileInfo(username)

        console.log(`'${interaction.user.username}' used '/get ${username}' in '${interaction.guild.name}'`)


        if (embed === null) {
            await interaction.editReply({
                content: `You entered an invalid Twitch username - '${username}'`
            }).catch(err => console.log(err))

        } else {
            await interaction.editReply({
                embeds: [embed]
            }).catch(err => console.log(err))
        }

        
    }
}