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

    fallbackToConsole(level, message, meta = {}) {
        const consoleMethod = console[level.toLowerCase()] || console.log;
        const payload = Object.keys(meta).length > 0 ? meta : undefined;

        if (payload) {
            consoleMethod(message, payload);
            return;
        }

        consoleMethod(message);
    }

    async log(level, message, meta = {}) {
        const normalizedLevel = level.toUpperCase();

        if (!process.env.LOGGER_URL) {
            this.fallbackToConsole(level, message, meta);
            // console.warn("Logger fallback: LOGGER_URL is not configured.");
            return;
        }

        try {
            await this.client.post("/log", {
                level: normalizedLevel,
                message,
                service: "hotwheels-monitor",
                timestamp: new Date().toISOString(),
                meta: {
                    host: os.hostname(),
                    ...meta,
                },
            });
        } catch (err) {
            this.fallbackToConsole(level, message, meta);
            // console.error("Logger failed:", {
            //     message: err.message,
            //     code: err.code,
            //     status: err.response?.status,
            //     data: err.response?.data,
            // });
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
