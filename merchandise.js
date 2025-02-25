document.addEventListener("DOMContentLoaded", function() {
    // Set the current year dynamically in the footer
    const currentYear = new Date().getFullYear();
    document.getElementById("year").textContent = currentYear;

    // Categories for filtering
    const categories = ["All Products", "Outdoor", "Hats", "Hoodies & Sweatshirts", "T-shirts", "Baby & Toddler", "Kitchenwear", "Accessories"];
    const categoryList = document.getElementById("category-list");

    // Dynamically create category list in the navigation
    categories.forEach(category => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#" onclick="filterCategory('${category}')">${category}</a>`;
        categoryList.appendChild(li);
    });

    // Example products data (with categories)
    const products = [
        {
            name: "Product 1",
            price: 30,
            originalPrice: 50,
            discount: 40,
            stock: "in-stock",
            sale: true,
            image: "product1.jpg",
            link: "#",
            category: "Outdoor" // Category assigned to the product
        },
        {
            name: "Product 2",
            price: 20,
            originalPrice: 40,
            discount: 50,
            stock: "low-stock",
            sale: false,
            image: "product2.jpg",
            link: "#",
            category: "Hats" // Category assigned to the product
        },
        {
            name: "Product 3",
            price: 15,
            originalPrice: 25,
            discount: 40,
            stock: "out-of-stock",
            sale: false,
            image: "product3.jpg",
            link: "#",
            category: "T-shirts" // Category assigned to the product
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
    window.filterCategory = function(category) {
        sectionTitle.textContent = category;
        // Filter products based on selected category
        if (category === "All Products") {
            renderProducts(products); // Show all products if "All Products" is selected
        } else {
            renderProducts(products.filter(product => product.category === category)); // Filter by selected category
        }
    };
});

window.addEventListener("load", function() {
    document.body.classList.add("loaded"); // Add the 'loaded' class to body when everything is ready
});
