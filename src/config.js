require("dotenv").config();

module.exports = {

    apiUrl: process.env.FIRSTCRY_API,

    interval: process.env.CHECK_INTERVAL,

    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,

    telegramChatId: process.env.TELEGRAM_CHAT_ID

};