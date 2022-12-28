const AWS = require('aws-sdk');
const Discord = require('discord.js')

require('dotenv').config();

AWS.config.update({
    region: "us-east-2",
    accessKeyId: process.env.db_key_id,
    secretAccessKey: process.env.db_secret_access_key,
})

module.exports = (client) => {
    client.addChannel = async (guildName, guildId, channelId, roleName) => {

        const params = {
            TableName: 'biscus-channels',
            Item: {
                id: guildId,
                name: guildName,
                channelId: channelId,
                mention: roleName
            }
        }
        
        const docClient = new AWS.DynamoDB.DocumentClient();

        docClient.put(params, (error) => {
            if (!error) {
                console.log(`Server: '${guildName}' has been added to the database`)
            } else {
                throw "Unable to save record, err: " + error
            }
        })

    }
}

