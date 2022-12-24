const AWS = require('aws-sdk');
const Discord = require('discord.js')

require('dotenv').config();

AWS.config.update({
    region: "us-east-2",
    accessKeyId: process.env.db_key_id,
    secretAccessKey: process.env.db_secret_access_key,
})

module.exports = (client) => {
    client.getChannel = async (guildId) => {

        const params = {
            Key: {
                id: `${guildId}`
            },
            TableName: 'biscus-channels'
        }
        
        const docClient = new AWS.DynamoDB.DocumentClient();

        var exists = false

        let result = await docClient.get(params).promise();
        if (result.Item !== undefined && result.Item !== null) {
            exists = true
        }

        return (exists)

    }
}

