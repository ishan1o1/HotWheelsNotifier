const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../data/products.json");

function loadProducts() {

    if (!fs.existsSync(FILE))
        return {};

    return JSON.parse(fs.readFileSync(FILE, "utf8"));

}

function saveProducts(products) {

    fs.writeFileSync(
        FILE,
        JSON.stringify(products, null, 2)
    );

}

module.exports = {
    loadProducts,
    saveProducts
};