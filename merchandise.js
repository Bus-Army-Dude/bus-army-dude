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
            name: "September Awareness Rainbow Onesie",
            price: 25,
            stock: "in-stock",
            sale: false,
            image: "product_images/september.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/september-awareness-rainbow-onesie", // Change this to the actual product link
            category: "Baby & Toddler" // Category assigned to the product
        },
        {
            name: "ADHD Awareness Ribbon Baby Tee",
            price: 29,
            stock: "in-stock",
            sale: false,
            image: "product_images/adhd.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/adhd-awareness-ribbon-baby-tee", // Change this to the actual product link
            category: "Baby & Toddler" // Category assigned to the product
        },
        {
            name: "Bear Hug Baby Tee",
            price: 28,
            stock: "in-stock",
            sale: false,
            image: "product_images/bear-hug-baby-tee.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/bear-hug-baby-tee", // Change this to the actual product link
            category: "Baby & Toddler" // Category assigned to the product
        },
        {
            name: "Autism Mode Puzzle Heart Baby Onesie",
            price: 24,
            stock: "in-stock",
            sale: false,
            image: "product_images/Autism.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/autism-mode-puzzle-heart-baby-onesie", // Change this to the actual product link
            category: "Baby & Toddler" // Category assigned to the product
        }
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
