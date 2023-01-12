const { SlashCommandBuilder } = require('discord.js')

require('../../functions/discord_messages/twitchProfileInfo')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get')
        .setDescription("Get information about a twitch account")
        .addStringOption((option) => option.setName('username').setDescription('Twitch account username you are trying to look up').setRequired(true))
        .addStringOption((option) => option.setName("message").setDescription('Message you want to include with the command (including mentions)').setRequired(false))
        .setDMPermission(true)
        .setDescriptionLocalizations({
            de: 'Informieren Sie sich über ein Twitch-Konto',
        }),

    async execute(interaction, client) {

        const username = interaction.options.getString('username')
        let message = interaction.options.getString('message')


        let profileInfo = await client.createProfileInfo(username)

        let embed = profileInfo["embed"]
        let pfp = profileInfo["image_attachment"]
        let button = profileInfo["button"]

        console.log(`'${interaction.user.username}' used '/get ${username}' in '${interaction.guild.name}'`)
        // const role = interaction.guild.roles.cache.find(role => role.name.toLowerCase() === message.toLowerCase());

        if (embed === null) {
            await interaction.reply({
                content: `You entered an invalid Twitch username - '${username}'`
            }).catch(err => console.log(err))

        } else if (embed !== null && (message !== null && message !== undefined)) {
            await interaction.reply({
                content: `${message}`,
                embeds: [embed],
                allowedMentions: {
                    parse: ["users", "roles", "everyone"]
                },
                files: [pfp],
                components: [button]
            }).catch(err => console.log(err))

        } else {
            await interaction.reply({
                embeds: [embed],
                files: [pfp],
                components: [button]
            }).catch(err => console.log(err))

        }
    }
}