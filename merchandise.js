document.addEventListener("DOMContentLoaded", function () {
    const categories = [
        "All Products", 
        "Outdoor", 
        "Hats", 
        "Hoodies & Sweatshirts", 
        "T-Shirts", 
        "Baby & Toddler", 
        "Kitchenware", 
        "Accessories"
    ];

    const products = [
        {
            id: 1,
            title: "Outdoor Hat",
            category: "Hats",
            price: "$25.00",
            stockStatus: "In Stock",
            image: "path-to-hat-image.jpg", // Update with actual image path
            link: "https://example.com/product/outdoor-hat" // Product link
        },
        {
            id: 2,
            title: "Bus Army Hoodie",
            category: "Hoodies & Sweatshirts",
            price: "$45.00",
            stockStatus: "Low Stock",
            image: "path-to-hoodie-image.jpg", // Update with actual image path
            link: "https://example.com/product/bus-army-hoodie" // Product link
        },
        {
            id: 3,
            title: "Graphic T-Shirt",
            category: "T-Shirts",
            price: "$30.00",
            stockStatus: "In Stock",
            image: "path-to-tshirt-image.jpg", // Update with actual image path
            link: "https://example.com/product/graphic-tshirt" // Product link
        },
        {
            id: 4,
            title: "Baby Onesie",
            category: "Baby & Toddler",
            price: "$20.00",
            stockStatus: "Out of Stock",
            image: "path-to-onesie-image.jpg", // Update with actual image path
            link: "https://example.com/product/baby-onesie" // Product link
        },
        {
            id: 5,
            title: "Custom Mug",
            category: "Kitchenware",
            price: "$15.00",
            stockStatus: "In Stock",
            image: "path-to-mug-image.jpg", // Update with actual image path
            link: "https://example.com/product/custom-mug" // Product link
        },
        {
            id: 6,
            title: "Keychain",
            category: "Accessories",
            price: "$10.00",
            stockStatus: "In Stock",
            image: "path-to-keychain-image.jpg", // Update with actual image path
            link: "https://example.com/product/keychain" // Product link
        }
    ];

    // Populate categories dropdown
    const categoryDropdown = document.getElementById('categories');
    categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryDropdown.appendChild(option);
    });

    // Render all products by default
    renderProducts(products);

    // Filter products based on category selection
    categoryDropdown.addEventListener('change', function () {
        const selectedCategory = this.value;
        if (selectedCategory === "All Products") {
            renderProducts(products);
        } else {
            const filteredProducts = products.filter(product => product.category === selectedCategory);
            renderProducts(filteredProducts);
        }
    });

    // Function to render products
    function renderProducts(productsToRender) {
        const productGrid = document.getElementById('product-grid');
        productGrid.innerHTML = ''; // Clear the grid before rendering

        productsToRender.forEach((product) => {
            const productContainer = document.createElement('div');
            productContainer.classList.add('product-container');

            // Product image (wrap it in a link)
            const productLink = document.createElement('a');
            productLink.href = product.link; // Use product link
            productLink.target = '_blank'; // Open in a new tab

            const productImage = document.createElement('img');
            productImage.src = product.image; // Ensure product.image is a valid URL
            productImage.alt = product.title;

            productLink.appendChild(productImage);

            // Product details
            const productTitle = document.createElement('h3');
            productTitle.textContent = product.title;

            const productPrice = document.createElement('p');
            productPrice.textContent = product.price;

            const stockStatus = document.createElement('span');
            stockStatus.classList.add('stock-status');
            stockStatus.textContent = product.stockStatus;

            // Append everything to the container
            productContainer.appendChild(productLink);
            productContainer.appendChild(productTitle);
            productContainer.appendChild(productPrice);
            productContainer.appendChild(stockStatus);

            // Add the product container to the grid
            productGrid.appendChild(productContainer);
        });

        // Update product count
        document.getElementById('product-count').textContent = `${productsToRender.length} products`;
    }

});

document.addEventListener("DOMContentLoaded", function () {
    const currentYear = new Date().getFullYear();
    document.getElementById('year').textContent = currentYear;
});
