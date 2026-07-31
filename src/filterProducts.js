const wishlist = [

    "Porsche",
    "Skyline",
    "Supra",
    "GT-R",
    "Honda",
    "Civic",
    "NSX",
    "Integra",
    "Miata",
    "RX-7",
    "RX7",
    "Mazda",
    "Subaru",
    "WRX",
    "Evo",
    "Lancer",
    "Silvia",
    "S15",
    "S14",
    "Fairlady",
    "240Z",
    "Escort",
    "Mustang",
    "Corvette",
    "Camaro",
    "Ferrari",
    "McLaren",
    "Pagani",
    "Koenigsegg",
    "Bugatti",
    "Morgan Super 3"

];

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