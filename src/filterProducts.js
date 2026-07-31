const wishlist = require("./wishlist");

function filterProducts(products) {

    return products.filter(product =>

        wishlist.some(car =>

            product.name
                .toLowerCase()
                .includes(car.toLowerCase())

        )

    );

}

module.exports = filterProducts;