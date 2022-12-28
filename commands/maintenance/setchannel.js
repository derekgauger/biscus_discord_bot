const { SlashCommandBuilder, PermissionFlagsBits, } = require('discord.js')
require('../../functions/dynamodb/addChannel')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription("Sets the channel for automatic notifications")
        .addStringOption((option) => option.setName('role-name').setDescription('Name of the role you want to ping when someone goes live. Default: None').setRequired(false))
        .setDMPermission(true),

        async execute(interaction, client) {
            const name = interaction.guild.name
            const id = interaction.guild.id
            const channel_id = interaction.channel.id
            const roleName = interaction.options.getString("role-name")

            let reply = ""
            let mention = ""
            let role = undefined
            let usingRole = false
            if (roleName !== null) {
                usingRole = true

            }

            if (usingRole) {
                if (roleName.toLowerCase() !== "here" && roleName.toLowerCase() !== "everyone") {
                    role = interaction.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
                    if (role !== undefined) {
                        mention = role.name
                    } else {
                        reply = `Invalid role name: '${roleName}'`

                    }
                } else {
                    mention = roleName
                }
            }

            if (!usingRole || mention !== "") {

                console.log(`'${interaction.user.username}' used /setchannel in '${name}'`)
                
                try {
                    if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                        client.addChannel(name, id, channel_id, mention)
                        reply = "This channel has been successfully set to automatically receive twitch notifications!"
                    
                    } else {
                        reply = "You do not have permission to use this command. You need the **'Manage Server'** permission to proceed."

                    }
                
                } catch (error) {
                    reply = "There was an error :( - Contact: Dirk#8540"
                    console.log(error)
                }
            }
            
    
            await interaction.reply({
                content: reply
            }).catch(err => console.log(err))
        }
    }
    