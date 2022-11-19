const { Client, ActivityType } = require("discord.js")
const ms = require("ms")
const axios = require("axios")
require("dotenv").config()

module.exports = {
    name: "ready",

    /**
     * @param {Client} client
     */
    async execute(client) {

        const { user, ws } = client

        console.log(`${user.tag} is now online!`)

        var price
        var change24

        function callPrice() {
            axios.get("https://api.coingecko.com/api/v3/coins/" + process.env.TOKEN_ID)
                .then((res) => {
                    price = res.data.market_data.current_price.usd
                    change24 = res.data.market_data.price_change_percentage_24h_in_currency.usd.toFixed(2)
                })
                .catch(() => { })
        }

        setInterval(async () => {
            const ping = ws.ping
            callPrice()
            user.setActivity({
                name: `$${price} | ${change24}%`,
                type: 3
            })

        }, ms("10s"))

    }

}

