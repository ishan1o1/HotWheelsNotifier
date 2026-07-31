const axios = require("axios");

const client = axios.create({
    baseURL: "https://www.firstcry.com",
    headers: {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "x-requested-with": "XMLHttpRequest",
        "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150.0.0.0 Safari/537.36",
        "referer":
            "https://www.firstcry.com/hotwheels/5/0/113",
    },
    timeout: 10000,
});

async function fetchProducts() {

    const response = await client.get(
        "/svcs/SearchResult.svc/GetSearchResultProductsFilters",
        {
            params: {
                PageNo: 1,
                PageSize: 40,
                SortExpression: "PriceLowToHigh",
                OnSale: 5,
                SearchString: "brand",

                MasterBrand: 113,

                pcode: 211004,

                isclub: 0,
            },
        }
    );

    return response.data;
}

module.exports = fetchProducts;