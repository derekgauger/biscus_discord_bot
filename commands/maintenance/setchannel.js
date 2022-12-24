const { SlashCommandBuilder, PermissionFlagsBits, } = require('discord.js')
require('../../functions/dynamodb/addChannel')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription("Sets the channel for automatic notifications")
        .setDMPermission(true),

        async execute(interaction, client) {
            const name = interaction.guild.name
            const id = interaction.guild.id
            const channel_id = interaction.channel.id
    
            console.log(`'${interaction.user.username}' used /setchannel in '${name}'`)
    
            let reply = ""
            try {
                if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    client.addChannel(name, id, channel_id)
                    reply = "This channel has been successfully set to automatically receive twitch notifications!"
    
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
    