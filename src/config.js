require("dotenv").config();

module.exports = {
    apiUrl: process.env.FIRSTCRY_API,
    cronSchedule: process.env.CRON_SCHEDULE || "* * * * *",
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.TELEGRAM_CHAT_ID,
    port: process.env.PORT || 3000,
    dataDir: process.env.DATA_DIR || null,
};