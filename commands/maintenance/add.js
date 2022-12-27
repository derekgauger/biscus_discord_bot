const { SlashCommandBuilder } = require('discord.js')
const twitchAPICalls = require('../../functions/twitch/twitchAPICalls')
require('../../functions/dynamodb/addNotification')
require('../../functions/twitch/twitchAPICalls')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription("Add a Twitch channel to the monitored list")
        .addStringOption((option) => option.setName('username').setDescription('Twitch account username you are trying to add').setRequired(true))
        .setDMPermission(true),

    async execute(interaction, client) {

        const username = interaction.options.getString('username')
        const guildName = interaction.guild.name
        const guildId = interaction.guild.id

        await interaction.deferReply();

        const userId = await getUserId(username)

        let notification = await client.getNotification(userId, guildId)

        const isTwitchUser = await checkIsUser(username);

        let reply = ""
        if (isTwitchUser) {
            try {
                if (notification !== null) {
                    reply = "That Twitch account is already being monitored by this server!"
                } else {
                    await client.addNotification(userId, username, guildName, guildId)
                    reply = `Twitch Profile: '${username}' is now being monitored!`
                }
            } catch (error) {
                reply = "An error occured :( Contact - Dirk#8540"
                console.log(error)
            }
        } else {
            reply = `'${username}' is not a valid Twitch Profile`
        }


        console.log(`'${interaction.user.username}' used '/add ${username}' in '${guildName}'`)

        await interaction.editReply({
            content: reply,
        }).catch(err => console.log(err))
    }
}