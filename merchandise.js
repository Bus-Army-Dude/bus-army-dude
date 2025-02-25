document.addEventListener("DOMContentLoaded", function() {
    // Set the current year dynamically in the footer
    const currentYear = new Date().getFullYear();
    document.getElementById("year").textContent = currentYear;

    // Categories for filtering
    const categories = ["All Products", "Outdoor", "Hats", "Hoodies & Sweatshirts", "T-Shirts", "Baby & Toddler", "Kitchenwear", "Accessories"];
    const categorySelect = document.getElementById("categories");

    // Dynamically create category list in the dropdown
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    // Example products data (with categories)
    const products = [
        {
            name: "Outdoor Jacket",
            price: 30,
            originalPrice: 50,
            discount: 40,
            stock: "in-stock",
            sale: true,
            image: "product1.jpg",
            link: "#", // Change this to the actual product link
            category: "Outdoor" // Category assigned to the product
        },
        {
            name: "Stylish Hat",
            price: 20,
            originalPrice: 40,
            discount: 50,
            stock: "low-stock",
            sale: false,
            image: "product2.jpg",
            link: "#", // Change this to the actual product link
            category: "Hats" // Category assigned to the product
        },
        {
            name: "Cool Hoodie",
            price: 50,
            originalPrice: 70,
            discount: 30,
            stock: "in-stock",
            sale: true,
            image: "product3.jpg",
            link: "#", // Change this to the actual product link
            category: "Hoodies & Sweatshirts" // Category assigned to the product
        },
        {
            name: "Graphic T-Shirt",
            price: 15,
            originalPrice: 25,
            discount: 40,
            stock: "out-of-stock",
            sale: false,
            image: "product4.jpg",
            link: "#", // Change this to the actual product link
            category: "T-Shirts" // Category assigned to the product
        },
        // Add more products with their respective categories
    ];

    const productGrid = document.getElementById("product-grid");
    const sectionTitle = document.getElementById("section-title");
    const productCount = document.getElementById("product-count");

    // Function to render products
    function renderProducts(productsToRender) {
        productGrid.innerHTML = ""; // Clear the grid before rendering
        productCount.textContent = `${productsToRender.length} product${productsToRender.length !== 1 ? 's' : ''}`;
        
        productsToRender.forEach(product => {
            const productItem = document.createElement("div");
            productItem.classList.add("product-item");

            // Sale ribbon if applicable
            const saleRibbon = product.sale ? '<div class="sale-ribbon">Sale</div>' : '';
            const stockStatusRibbon = `<div class="stock-ribbon ${product.stock}">${product.stock.replace("-", " ")}</div>`;

            // Product content
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                ${saleRibbon}
                ${stockStatusRibbon}
                <h3>${product.name}</h3>
                <p class="price">
                    <span class="original-price">$${product.originalPrice}</span>
                    <span class="discount">$${product.price} (${product.discount}% Off)</span>
                </p>
                <a href="${product.link}" class="buy-now">Buy Now</a>
            `;

            productGrid.appendChild(productItem);
        });
    }

    // Initial render
    renderProducts(products);

    // Function to filter products by category
    categorySelect.addEventListener("change", function() {
        const selectedCategory = categorySelect.value;
        sectionTitle.textContent = selectedCategory;

        if (selectedCategory === "All Products") {
            renderProducts(products); // Show all products if "All Products" is selected
        } else {
            const filteredProducts = products.filter(product => product.category === selectedCategory);
            renderProducts(filteredProducts); // Filter by selected category
        }
    });
});

window.addEventListener("load", function() {
    document.body.classList.add("loaded"); // Add the 'loaded' class to body when everything is ready
});
