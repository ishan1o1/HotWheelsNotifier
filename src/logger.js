const axios = require("axios");
const os = require("os");
require("dotenv").config();

class Logger {
    constructor() {
        this.client = axios.create({
            baseURL: process.env.LOGGER_URL,
            headers: {
                "x-api-key": process.env.LOGGER_API_KEY,
                "Content-Type": "application/json",
            },
            timeout: 3000,
        });
    }

    async log(level, message, meta = {}) {
        try {
            await this.client.post("/log", {
                level: level.toUpperCase(),
                message,
                service: "hotwheels-monitor",
                timestamp: new Date().toISOString(),
                meta: {
                    host: os.hostname(),
                    ...meta,
                },
            });
        } catch (err) {
            console.error("Logger failed:", err.message);
        }
    }

    info(message, meta = {}) {
        return this.log("INFO", message, meta);
    }

    warn(message, meta = {}) {
        return this.log("WARN", message, meta);
    }

    error(message, meta = {}) {
        return this.log("ERROR", message, meta);
    }

    debug(message, meta = {}) {
        return this.log("DEBUG", message, meta);
    }
}

module.exports = new Logger();