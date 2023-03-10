const AWS = require('aws-sdk');
const Discord = require('discord.js')

require('dotenv').config();
require("../twitch/twitchAPICalls")
require("../discord_messages/twitchProfileInfo")

AWS.config.update({
    region: "us-east-2",
    accessKeyId: process.env.db_key_id,
    secretAccessKey: process.env.db_secret_access_key,
})

module.exports = (client) => {
    checkChannelsForUpdates = async () => {

        // scan biscus-channels for all
        // scan biscus-twitch-infos for isStreaming == false for each channel
        // update biscus-twitch-infos if they are streaming
        // send message
    
        const docClient = new AWS.DynamoDB.DocumentClient();
    
        const getChannelsParams = {
            TableName: 'biscus-channels',
        };
        const biscusGuilds = await docClient.scan(getChannelsParams).promise();
        for (const guild of biscusGuilds.Items) {
            const getStreamingParams = {
                TableName: 'biscus-twitch-infos',
                FilterExpression: `guildId = :guildId`,
                ExpressionAttributeValues: {
                    ':guildId': guild.id,
                }
            }
    
            docClient.scan(getStreamingParams).promise().then((streamList) => {
                for (const streamer of streamList.Items) {
                    const userId = streamer.userId
                    getTwitchStream(userId).then((stream) => {
                        const isStreaming = stream !== null
                        const update = isStreaming !== streamer.isStreaming

                        let username = ""
                        if (isStreaming) {
                            username = stream.userName
                        } else {
                            username = streamer.userName
                        }

                        const updateParams = {
                            TableName: 'biscus-twitch-infos',
                            Key: {
                                id: streamer.id
                            },
                            UpdateExpression: "set isStreaming = :isStreaming, userName = :userName",
                            ExpressionAttributeValues: {
                                ':isStreaming': isStreaming,
                                ':userName': username
                            }
                        }
    
                        if (update) {
                            docClient.update(updateParams, function(error, data) {
                                if (error) { console.log(error) }
                            })
                        }
                        if (update && isStreaming) {
                            client.createProfileInfo(username).then((profileInfo) => {
                                const channel = client.channels.cache.get(guild.channelId)

                                let embed = profileInfo["embed"]
                                let pfp = profileInfo["image_attachment"]
                                let button = profileInfo["button"]

                                if (guild.mention === "here" || guild.mention === "everyone") {
                                    channel.send({
                                        content: `@${guild.mention} ${stream.userDisplayName} is now streaming!`,
                                        embeds: [embed],
                                        files: [pfp],
                                        components: [button]
                                    })
                                } else if (guild.mention !== "") {
                                    let current_guild = client.guilds.cache.get(guild.id)
                                    const role = current_guild.roles.cache.find(role => role.name.toLowerCase() === guild.mention.toLowerCase());
                                    channel.send({
                                        content: `${role} ${stream.userDisplayName} is now streaming!`,
                                        embeds: [embed],
                                        files: [pfp],
                                        components: [button]
                                    })
                                } else {
                                    channel.send({
                                        content: `${stream.userDisplayName} is now streaming!`,
                                        embeds: [embed],
                                        files: [pfp],
                                        components: [button]
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    }
}

