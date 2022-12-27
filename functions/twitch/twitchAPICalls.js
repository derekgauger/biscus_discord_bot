const { ApiClient } = require('@twurple/api')
const { ClientCredentialsAuthProvider } = require('@twurple/auth');

require('dotenv').config();

const twitchId = process.env.twitch_id
const twitchToken = process.env.twitch_secret

const authProvider = new ClientCredentialsAuthProvider(twitchId, twitchToken, ['channel_subscriptions']);
const apiClient = new ApiClient({ authProvider });

module.exports = () => {
	getCurrentGame = async (userName) => {
		const user = await apiClient.helix.users.getUserByName(userName)
		if (!user) {
			return null
		}
	
		let channel = await apiClient.helix.channels.getChannelInfo(user)
		return channel.gameName
	},
	
	
	getFollowerCount = async (userName) => {
		const user = await apiClient.helix.users.getUserByName(userName)
		if (!user) {
			return 0
		}
		
		const follows = apiClient.helix.users.getFollowsPaginated({followedUser: user});
		return await follows.getTotalCount();
	
	},

	
	getTwitchStream = async (userName) => {
		const user = await apiClient.helix.users.getUserByName(userName);
		if (!user) {
			return null
		}
	
		return await apiClient.helix.streams.getStreamByUserId(user.id)
	},

	checkIsUser = async (userName) => {
		const user = await apiClient.helix.users.getUserByName(userName)

		return user !== null
	},

	getProfileInfo = async (userName) => {
		let userInfo = {}
		const user = await apiClient.helix.users.getUserByName(userName);
		
		if (!user) {
			return null
		}


		userInfo.name = user.displayName

		const channel = await apiClient.helix.channels.getChannelInfo(user)
		const stream = await apiClient.helix.streams.getStreamByUserId(user.id)
		const follows = await apiClient.helix.users.getFollowsPaginated({followedUser: user});
		userInfo.followerCount = await follows.getTotalCount();

		userInfo.gameName = channel.gameName
		let isStreaming = stream !== null
		userInfo.isStreaming = isStreaming
		let currentViewers = 0
		let tagNames = []

		if (isStreaming) {

			currentViewers = stream.viewers
			userInfo.streamThumbnailURL = stream.thumbnailUrl
			userInfo.language = stream.language
			userInfo.title = stream.title

		}

		userInfo.currentViewers = currentViewers
		const date = new Date(user.creationDate)

		userInfo.creationDate = getDateString(date)
		userInfo.profileDescription = user.description
		userInfo.pfpURL = user.profilePictureUrl

		return userInfo
	},

	searchGameStreams = async (query, language, min, max) => {
		const game = await apiClient.games.getGameByName(query)
		if (!game) {
			return null
		}
	
		let potentialStreams = []
		let finishedScan = false
		const queryResults = await apiClient.streams.getStreamsPaginated({game: game.id, language: language});
		do {
			let currentPage = await queryResults.getNext()
			for (const stream of currentPage) {
				if (min <= stream.viewers && stream.viewers <= max) {
					potentialStreams.push(stream)
				}
				if ((stream.viewers < min)) {
					finishedScan = true
				}
			}
			if (currentPage.length === 0) {
				finishedScan = true
			}
	
		} while (!finishedScan)
	
		return potentialStreams
	}
}

function getDateString(creationDate) {
	
    const dd = String(creationDate.getDate()).padStart(2, '0')
    const mm = String(creationDate.getMonth() + 1).padStart(2, '0')
    const yyyy = creationDate.getFullYear()

    const date = mm + '/' + dd + '/' + yyyy

    return date;
}