
const axios = require("axios");
const config = require("./config");

const PUBLIC_GROUP = "@CyrusHwAlert";

async function sendMessage(message, chatId = config.telegramChatId) {
    try {
        await axios.post(
            `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`,
            {
                chat_id: chatId,
                text: message,
                parse_mode: "HTML"
            }
        );
    } catch (error) {
        console.error(
            "Telegram notification failed:",
            error.response?.data || error.message
        );
    }
}

async function sendPublicMessage(message) {
    return sendMessage(message, PUBLIC_GROUP);
}

module.exports = {
    sendMessage,
    sendPublicMessage
};
