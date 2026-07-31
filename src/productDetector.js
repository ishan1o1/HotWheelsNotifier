const {
    loadProducts,
    saveProducts
} = require("./storage");

function detectChanges(products) {

    const previousProducts = loadProducts();

    const currentProducts = {};

    const newProducts = [];

    const restockedProducts = [];

    const priceDrops = [];

    for (const product of products) {

        currentProducts[product.PId] = {

            id: product.PId,

            name: product.PNm,

            price: Number(product.discprice),

            stock: Number(product.CrntStock),

            mrp: Number(product.MRP)

        };

        const old = previousProducts[product.PId];

        if (!old) {

            newProducts.push(product);

            continue;

        }

        if (
            old.stock === 0 &&
            Number(product.CrntStock) > 0
        ) {

            restockedProducts.push(product);

        }

        if (
            Number(product.discprice) < old.price
        ) {

            priceDrops.push({

                oldPrice: old.price,

                newPrice: Number(product.discprice),

                product

            });

        }

    }

    saveProducts(currentProducts);

    return {

        newProducts,

        restockedProducts,

        priceDrops

    };

}

module.exports = detectChanges;