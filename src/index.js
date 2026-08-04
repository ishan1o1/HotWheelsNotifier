const http = require("http");
const cron = require("node-cron");

const config = require("./config");
const wishlist = require("./wishlist");
const logger = require("./logger");

const fetchProducts = require("./fetchProducts");
const normalizeProducts = require("./normalizeProducts");
const detectChanges = require("./detectChanges");

const { sendMessage } = require("./notifier");
const { buildWishlistMessage } = require("./templates");

// Lightweight HTTP server for Railway health checks
const server = http.createServer((req, res) => {
  if (req.url === "/health" || req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        service: "HotWheels Notifier",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      })
    );
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(config.port, () => {
  console.log(`Health check HTTP server listening on port ${config.port}`);
});

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

const cronSchedule = config.cronSchedule || "* * * * *";

cron.schedule(cronSchedule, async () => {
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
    await logger.info(`FirstCry Monitor Started (Cron: ${cronSchedule})`);
    await checkForNewProducts();
  } catch (err) {
    await logger.error("Startup failed", {
      error: err.message,
      stack: err.stack,
    });
  }
})();