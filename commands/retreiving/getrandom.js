const { SlashCommandBuilder } = require('discord.js')
require('../../functions/discord_messages/twitchProfileInfo')
require('../../functions/twitch/twitchAPICalls')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getrandom')
        .setDescription("Get a random Twitch account from a query")
        .addStringOption((option) => option.setName('game').setDescription('Name of game you are searching for').setRequired(true))
        .setDMPermission(true),

    async execute(interaction, client) {

        const query = interaction.options.getString('game')
        console.log(interaction)

        console.log(`'${interaction.user.username}' used '/getrandom ${query}' in '${interaction.guild.name}'`)

        let queryResults = await searchGameStreams(query, interaction.guildLocale.substring(0,2))

        let reply = ""
        let embed = null
        if (queryResults === null) {
            reply = `Invalid search: '${query}' is not a searchable game!`

        } else {
            if (queryResults.length === 0) {
                reply = `No one is playing '${query}!`

            } else {
                var randomStream = queryResults[Math.floor(Math.random()*queryResults.length)];
                const username = randomStream.userName
    
                embed = await client.createProfileInfo(username)

            }
        }

        if (embed === null) {
            await interaction.reply({
                content: reply

            }).catch(err => console.log(err))
            
        } else {
            await interaction.reply({
                embeds: [embed]
            }).catch(err => console.log(err))
        }
    }
}