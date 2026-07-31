function slugify(name) {
    return name
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

function normalizeProducts(products) {

    return products.map(product => ({

        id: product.PId,

        name: product.PNm,

        price: Number(product.discprice),

        mrp: Number(product.MRP),

        stock: Number(product.CrntStock),

        brand: product.BNm,

        shippingDate: product.shippingdate,

        image:
    `https://cdn.fcglcdn.com/brainbees/images/products/438x531/${product.Images.split(";")[0]}`,

        url: `https://www.firstcry.com/hot-wheels/${slugify(product.PNm)}/${product.PId}/product-detail`

    }));

}

module.exports = normalizeProducts;