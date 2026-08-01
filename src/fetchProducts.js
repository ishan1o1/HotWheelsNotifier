const axios = require("axios");
const logger = require("./logger");

const client = axios.create({
    baseURL: "https://www.firstcry.com",
    headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "x-requested-with": "XMLHttpRequest",
        "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150.0.0.0 Safari/537.36",
        referer: "https://www.firstcry.com/hotwheels/5/0/113",
    },
    timeout: 60000,
});

async function fetchPage(page) {
    const response = await client.get(
        "/svcs/SearchResult.svc/GetSearchResultProductsFilters",
        {
            params: {
                PageNo: page,
                PageSize: 20,
                SortExpression: "PriceLowToHigh",
                OnSale: 5,
                SearchString: "brand",
                MasterBrand: 113,
                pcode: 211004,
                isclub: 0,
            },
        }
    );

    return JSON.parse(response.data.ProductResponse);
}

async function fetchProducts() {
    const startTime = Date.now();

    try {
        await logger.info("Starting product fetch");

        const firstPage = await fetchPage(1);

        const totalProducts = firstPage.Count[0];
        const totalPages = Math.ceil(totalProducts / 20);

        await logger.info("Pagination calculated", {
            totalProducts,
            totalPages,
        });

        const requests = [];

        for (let page = 2; page <= totalPages; page++) {
            requests.push(fetchPage(page));
        }

        const remainingPages = await Promise.all(requests);

        const allProducts = [
            ...firstPage.Products.filter(
                (product) => Number(product.CrntStock) > 0
            ),
        ];

        // Use debug here instead of info if your logger supports it.
        if (logger.debug) {
            await logger.debug("Fetched page", {
                page: 1,
                totalPages,
                productsFetched: firstPage.Products.length,
            });
        }

        for (let index = 0; index < remainingPages.length; index++) {
            const pageData = remainingPages[index];

            if (logger.debug) {
                await logger.debug("Fetched page", {
                    page: index + 2,
                    totalPages,
                    productsFetched: pageData.Products.length,
                });
            }

            allProducts.push(
                ...pageData.Products.filter(
                    (product) => Number(product.CrntStock) > 0
                )
            );
        }

        await logger.info("Product fetch completed", {
            totalProducts,
            totalPages,
            inStockProducts: allProducts.length,
            durationMs: Date.now() - startTime,
        });

        return allProducts;
    } catch (error) {
        await logger.error("Failed to fetch products", {
            error: error.message,
            statusCode: error.response?.status,
            response: error.response?.data,
            durationMs: Date.now() - startTime,
            stack: error.stack,
        });

        throw error;
    }
}

module.exports = fetchProducts;