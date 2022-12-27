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
    client.removeNotification = async (userId, username, guildId, guildName) => {

        const docClient = new AWS.DynamoDB.DocumentClient();

        var scanParams = {
            TableName: 'biscus-twitch-infos',
            FilterExpression: `guildId = :guildId AND userId = :userId`,
            ExpressionAttributeValues: {
                ':guildId': guildId,
                ":userId": userId,
            }

        }

        let result = await docClient.scan(scanParams).promise();

        if (result.Count > 0){
            
            const deleteParams = {
                Key: {
                    id: result.Items[0].id,
                },
                TableName: 'biscus-twitch-infos'
            }
                        
            docClient.delete(deleteParams, (error) => {
                if (!error) {
                    console.log(`Twitch profile: '${username}' has been removed to the '${guildName}' database`)
                } else {
                    throw "Unable to save record, err: " + error
                }
            })   
        }
    }
}
