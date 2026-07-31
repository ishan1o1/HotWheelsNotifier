const cron = require("node-cron");

const wishlist = require("./wishlist");

const fetchProducts = require("./fetchProducts");
const normalizeProducts = require("./normalizeProducts");
const detectChanges = require("./detectChanges");

const { sendMessage } = require("./notifier");
const { buildWishlistMessage } = require("./templates");

async function checkForNewProducts() {

    console.log(`Checking at ${new Date().toLocaleTimeString()}`);

    const response = await fetchProducts();

    const parsed = JSON.parse(response.ProductResponse);

    const products = normalizeProducts(parsed.Products);

    const changes = detectChanges(products);

    const wishlistProducts = changes.newProducts.filter(product =>
        wishlist.some(car =>
            product.name.toLowerCase().includes(car.toLowerCase())
        )
    );

    if (wishlistProducts.length > 0) {
        await sendMessage(buildWishlistMessage(wishlistProducts));
    }

    console.log("Finished");
}

cron.schedule("* * * * *", async () => {

    try {
        await checkForNewProducts();
    } catch (err) {
        console.error(err);
    }

});

console.log("🚗 FirstCry monitor started...");