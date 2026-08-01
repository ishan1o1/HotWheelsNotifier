const cron = require("node-cron");

const wishlist = require("./wishlist");
const logger = require("./logger");

const fetchProducts = require("./fetchProducts");
const normalizeProducts = require("./normalizeProducts");
const detectChanges = require("./detectChanges");

const { sendMessage } = require("./notifier");
const { buildWishlistMessage } = require("./templates");

async function checkForNewProducts() {
  await logger.info("Scheduled product check started");

  const rawProducts = await fetchProducts();
  const products = normalizeProducts(rawProducts);

  const changes = detectChanges(products);
  const notifyProducts = [...changes.newProducts, ...changes.restocked];

  const wishlistProducts = notifyProducts.filter((product) =>
    wishlist.some((car) =>
      product.name.toLowerCase().includes(car.toLowerCase())
    )
  );

  if (wishlistProducts.length > 0) {
    await sendMessage(buildWishlistMessage(wishlistProducts));

    await logger.info("Wishlist notification sent", {
      products: wishlistProducts.map((p) => p.name),
      count: wishlistProducts.length,
    });
  }

  await logger.info("Scheduled product check completed", {
    newProducts: changes.newProducts.length,
    restocked: changes.restocked.length,
    wishlistMatches: wishlistProducts.length,
  });
}

cron.schedule("* * * * *", async () => {
  try {
    await checkForNewProducts();
  } catch (err) {
    await logger.error("Scheduled product check failed", {
      error: err.message,
      stack: err.stack,
    });
  }
});

(async () => {
  try {
    await logger.info("FirstCry Monitor Started");

    await checkForNewProducts();
  } catch (err) {
    await logger.error("Startup failed", {
      error: err.message,
      stack: err.stack,
    });
  }
})();