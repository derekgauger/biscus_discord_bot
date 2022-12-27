const AWS = require('aws-sdk');
const Discord = require('discord.js')
const uuid = require('uuid')

require('dotenv').config();

AWS.config.update({
    region: "us-east-2",
    accessKeyId: process.env.db_key_id,
    secretAccessKey: process.env.db_secret_access_key,
})

module.exports = (client) => {
    client.addNotification = async (userId, username, guildName, guildId) => {

        const params = {
            TableName: 'biscus-twitch-infos',
            Item: {
                id: uuid.v4(),
                url: `https://www.twitch.tv/${username}`,
                name: guildName,
                guildId: guildId,
                userId: userId,
                userName: username,
                isStreaming: false 
            }
        }
        
        const docClient = new AWS.DynamoDB.DocumentClient();

        docClient.put(params, (error) => {
            if (!error) {
                console.log(`Twitch profile: '${username}' has been added to the '${guildName}' database`)
            } else {
                throw "Unable to save record, err: " + error
            }
        })

    }
}
