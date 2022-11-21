const { Client } = require("discord.js")
const ms = require("ms")
const axios = require("axios")
require("dotenv").config()

module.exports = {
    name: "ready",

    /**
     * @param {Client} client
     */
    async execute(client) {
        try {

            const { user } = client

            console.log(`${user.tag} is now online!`)

            var price
            var change24 = ""
            var emoji = "🟢"

            function callPrice() {
                axios.get("https://api.coingecko.com/api/v3/coins/" + process.env.TOKEN_ID)
                    .then((res) => {
                        price = res.data.market_data.current_price.usd
                        change24 = res.data.market_data.price_change_percentage_24h_in_currency.usd.toFixed(2)
                    })
                    .catch(() => { })
            }

            setInterval(async () => {

                if (change24.substring(0, 1) == "-") {
                    emoji = "🔴"
                }
                callPrice()
                user.setActivity({
                    name: emoji + ` ${change24}%`,
                    type: 3
                })

                await client.guilds.cache.forEach(guild => {
                    client.guilds.cache.get(guild.id).members.me.setNickname(`$${price}`);
                });

            }, ms("10s"))
        }
        catch (e) {
            console.log(e)
        }

    }

}

