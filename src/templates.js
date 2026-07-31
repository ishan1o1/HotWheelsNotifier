function buildNewProductMessage(product) {

    return `
🚨 <b>NEW HOT WHEELS FOUND!</b>

🏎 <b>${product.name}</b>

💰 Price : ₹${product.price}

📦 Stock : ${product.stock}

🚚 Ships : ${product.shippingDate}

🔗 ${product.url}
`;

}

function buildWishlistMessage(products) {

    let message =
`🚨 <b>${products.length} Wishlist Hot Wheels Found!</b>\n\n`;

    for (const product of products) {

        message +=
`🏎 <a href="${product.url}">${product.name}</a>
💰 ₹${product.price}
📦 Stock: ${product.stock}

`;

    }

    return message;

}

module.exports = {
    buildNewProductMessage,
    buildWishlistMessage
};