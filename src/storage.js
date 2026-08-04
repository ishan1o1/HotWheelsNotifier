const fs = require("fs");
const path = require("path");
const config = require("./config");

const dataDirectory = config.dataDir || path.join(__dirname, "../data");
const FILE = path.join(dataDirectory, "products.json");

function ensureDirectoryExists() {
    const dir = path.dirname(FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function loadProducts() {
    try {
        ensureDirectoryExists();
        if (!fs.existsSync(FILE)) {
            return {};
        }
        const data = fs.readFileSync(FILE, "utf8");
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error("Error reading products storage file:", error.message);
        return {};
    }
}

function saveProducts(products) {
    try {
        ensureDirectoryExists();
        fs.writeFileSync(FILE, JSON.stringify(products, null, 2), "utf8");
    } catch (error) {
        console.error("Error writing products storage file:", error.message);
    }
}

module.exports = {
    loadProducts,
    saveProducts,
};