const AWS = require('aws-sdk');
const Discord = require('discord.js')

require('dotenv').config();

AWS.config.update({
    region: "us-east-2",
    accessKeyId: process.env.db_key_id,
    secretAccessKey: process.env.db_secret_access_key,
})

module.exports = (client) => {
    client.getNotification = async (userId, guildId) => {
        
        var params = {
            TableName: 'biscus-twitch-infos',
            FilterExpression: `guildId = :guildId AND userId = :userId`,
            ExpressionAttributeValues: {
                ':guildId': guildId,
                ":userId": userId,
            }

        }

        const docClient = new AWS.DynamoDB.DocumentClient();

        var exists = false
        let result = await docClient.scan(params).promise();

        if (result.Count !== 0) {
            return result.Items
        }

        return null

    }
}

