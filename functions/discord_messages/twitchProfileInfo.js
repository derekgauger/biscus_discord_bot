const { EmbedBuilder } = require("discord.js")
const twitch = require("../twitch/twitchAPICalls")

module.exports = (client) => {
    client.createProfileInfo = async (username) => {

        let profileInfo = await getProfileInfo(username)
        if (profileInfo === null) {
            return null
        }

        const today = new Date()

        let statusColor = 0xFF0000
        let thumbnail = profileInfo.pfpURL
        let status = "Offline"
        let title = "N/A"
        let game = "N/A"
        let language = "N/A"
        if (profileInfo.isStreaming) {
            statusColor = 0x15bd42
            thumbnail = profileInfo.streamThumbnailURL
            status = "Online"
            title = profileInfo.title
            game = profileInfo.gameName
            language = profileInfo.language
        }

        if (profileInfo.profileDescription === null) {
            profileDescription = `${profileInfo.name} has not setup a profile description yet`
        }

        thumbnail = thumbnail.replace('\{width\}', 500).replace('\{height\}', 500)


        const embed = new EmbedBuilder()
            .setColor(statusColor)
            .setTitle(`${profileInfo.name}'s Twitch Profile`)
            .setAuthor({
                name: `Twitch Profile by Biscus`,
                iconURL: `${profileInfo.pfpURL}`,
                url: `https://www.twitch.tv/${profileInfo.name}`,
            })
            .setDescription(profileInfo.profileDescription)
            .setThumbnail(`${thumbnail}`)
            .addFields(
                { name: `Profile Info:`, value: `Status: ${status} \n Link: https://www.twitch.tv/${profileInfo.name} \n Language: ${language}`},
                { name: "Joined", value: `${profileInfo.creationDate}`, inline: true },
                { name: "Followers", value: `${profileInfo.followerCount}`, inline: true},
                { name: "Viewers", value: `${profileInfo.currentViewers}`, inline: true },
                { name: `Current Stream Title`, value: `${title}`},
                { name: `Current Stream Game`, value: `${game}`},

            )
            .setTimestamp()
            .setFooter({ text: 'Biscus by Dirk', iconURL: 'https://i.imgur.com/6NtiiP4.png' })
        
        return embed
    }
}