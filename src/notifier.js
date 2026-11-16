
const axios = require("axios");
const config = require("./config");

const PUBLIC_GROUP = "@CyrusHwAlert";

async function sendToChat(message, chatId) {
    try {
        await axios.post(
            `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`,
            {
                chat_id: chatId,
                text: message,
                parse_mode: "HTML"
            }
        );

        console.log(`Telegram message sent to ${chatId}`);

    } catch (error) {
        console.error(
            `Failed to send to ${chatId}:`,
            error.response?.data || error.message
        );
    }
}

async function sendMessage(message) {
    await Promise.all([
        sendToChat(message, config.telegramChatId),
        sendToChat(message, PUBLIC_GROUP)
    ]);
}

module.exports = {
    sendMessage
};
