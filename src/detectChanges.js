const { loadProducts, saveProducts } = require("./storage");

function detectChanges(products) {

    const previous = loadProducts();

    const current = {};

    const changes = {
        newProducts: [],
        restocked: [],
        priceDrops: [],
        outOfStock: []
    };

    for (const product of products) {

        current[product.id] = product;

        const old = previous[product.id];

        // Brand new product
        if (!old) {
            changes.newProducts.push(product);
            continue;
        }

        // Restock
        if (old.stock === 0 && product.stock > 0) {
            changes.restocked.push(product);
        }

        // Out of stock
        if (old.stock > 0 && product.stock === 0) {
            changes.outOfStock.push(product);
        }

        // Price drop
        if (product.price < old.price) {

            changes.priceDrops.push({

                product,

                oldPrice: old.price,

                newPrice: product.price

            });

        }

    }

    saveProducts(current);

    return changes;

}

module.exports = detectChanges;