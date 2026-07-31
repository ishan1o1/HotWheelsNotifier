const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../data/seen.json");

function getSeenProducts() {

    if (!fs.existsSync(FILE))
        return [];

    return JSON.parse(fs.readFileSync(FILE));
}

function saveSeenProducts(products) {

    fs.writeFileSync(FILE, JSON.stringify(products, null, 2));

}

module.exports = {

    getSeenProducts,

    saveSeenProducts

};