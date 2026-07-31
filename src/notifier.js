const axios = require("axios");
const config = require("./config");

async function sendMessage(message) {

    await axios.post(

        `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`,

        {

            chat_id: config.telegramChatId,

            text: message,

            parse_mode: "HTML"

        }

    );

}

module.exports = {

    sendMessage

};