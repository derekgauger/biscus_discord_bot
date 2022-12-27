const { SlashCommandBuilder } = require('discord.js')
require('../../functions/discord_messages/twitchProfileInfo')
require('../../functions/twitch/twitchAPICalls')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getrandom')
        .setDescription("Get a random Twitch account from a query")
        .addStringOption((option) => option.setName('game').setDescription('Name of game you are searching for').setRequired(true))
        .addIntegerOption((option) => option.setName('min').setDescription('Minimum viewer requirement for random channel lookup').setRequired(false))
        .addIntegerOption((option) => option.setName('max').setDescription('Maximum viewer requirement for random channel lookup').setRequired(false))

        .setDMPermission(true),

    async execute(interaction, client) {

        const query = interaction.options.getString('game')
        let min = interaction.options.getInteger('min')
        let max = interaction.options.getInteger('max')
        let reply = ""

        if (max === null) {
            max = 10000000
        }
    
        if (min ===  null) {
            min = 0
        }

        if (max < min) {
            reply = `Invalid range: ${min}-${max}`
            return null
        }
        
        console.log(`'${interaction.user.username}' used '/getrandom ${query} range: ${min} - ${max}' in '${interaction.guild.name}'`)

        await interaction.deferReply();

        let queryResults = await searchGameStreams(query, interaction.guildLocale.substring(0,2), min, max)

        let embed = null
        if (queryResults === null) {
            reply = `Invalid search: '${query}' is not a searchable game!`

        } else {
            if (queryResults.length === 0) {
                reply = `No one is playing '${query}' with a viewer count between ${min} - ${max}!`

            } else {
                var randomStream = queryResults[Math.floor(Math.random()*queryResults.length)];
                const username = randomStream.userName
    
                embed = await client.createProfileInfo(username)

            }
        }

        if (embed === null) {
            await interaction.editReply({
                content: reply

            }).catch(err => console.log(err))
            
        } else {
            await interaction.editReply({
                embeds: [embed]
            }).catch(err => console.log(err))
        }
    }
}