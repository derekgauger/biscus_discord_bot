module.exports = (client) => {

    client.createInfo = async () => {
        const today = new Date()

        let date = getDateString(today)

        const embed = {
            color: 0xFF0000,
            author: {
                name: 'Biscus',
                icon_url: "https://i.imgur.com/oBwjVfG.png",
                url: 'https://top.gg/bot/1051313886701309953',
            },
            thumbnail: {
                url: "https://i.imgur.com/oBwjVfG.png",
            },
            fields: [
                {
                    name: 'Link to Biscus bot information:',
                    value: 'https://top.gg/bot/1051313886701309953',
                },
            ],
            timestamp: today,
            footer: {
                text: 'Biscus by Dirk',
                icon_url: "https://i.imgur.com/oBwjVfG.png",
            },
        };    

        return embed
    }
}

function getDateString(today) {

    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()

    const date = mm + '/' + dd + '/' + yyyy

    return date;
}
