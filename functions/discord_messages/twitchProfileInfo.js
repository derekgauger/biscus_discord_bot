const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")
const twitch = require("../twitch/twitchAPICalls")
const Canvas = require('@napi-rs/canvas');

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

        if (profileInfo.profileDescription === '') {
            profileInfo.profileDescription = `${profileInfo.name} has not setup a profile description yet`
        }

        thumbnail = thumbnail.replace('\{width\}', 1000).replace('\{height\}', 1000)

		const canvas = Canvas.createCanvas(500, 400);
		const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(`${profileInfo.pfpURL}`);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("Go to Twitch!")
              .setStyle(5)
              .setURL(`https://www.twitch.tv/${profileInfo.name}`),
          );
    
        const embed = new EmbedBuilder()
            .setColor(statusColor)
            .setTitle(`${profileInfo.name}'s Twitch Profile`)
            .setAuthor({
                name: `Click here to go to this Twitch profile!`,
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
                { name: `Current Stream Game`, value: `${game}`}
            )
            .setImage('attachment://profile-image.png')
            .setTimestamp()
            .setFooter({ text: 'Biscus by Dirk', iconURL: 'https://i.imgur.com/oBwjVfG.png' })
        
        return { 
                embed: embed,
                image_attachment: attachment,
                button: button,
        }
    }
}