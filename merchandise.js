document.addEventListener("DOMContentLoaded", function() {
    // Set the current year dynamically in the footer
    const currentYear = new Date().getFullYear();
    document.getElementById("year").textContent = currentYear;

    // Example categories
    const categories = ["All Products", "Category 1", "Category 2", "Category 3"];
    const categoryList = document.getElementById("category-list");
    
    categories.forEach(category => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#" onclick="filterCategory('${category}')">${category}</a>`;
        categoryList.appendChild(li);
    });

    // Example products data (this would typically come from your server)
    const products = [
        {
            name: "Product 1",
            price: 30,
            originalPrice: 50,
            discount: 40,
            stock: "in-stock",
            sale: true,
            image: "product1.jpg",
            link: "#"
        },
        {
            name: "Product 2",
            price: 20,
            originalPrice: 40,
            discount: 50,
            stock: "low-stock",
            sale: false,
            image: "product2.jpg",
            link: "#"
        }
    ];

    const productGrid = document.getElementById("product-grid");
    const sectionTitle = document.getElementById("section-title");
    const productCount = document.getElementById("product-count");

    function renderProducts(products) {
        productGrid.innerHTML = "";
        productCount.textContent = `${products.length} products`;
        products.forEach(product => {
            const productItem = document.createElement("div");
            productItem.classList.add("product-item");

            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                ${product.sale ? '<div class="sale-ribbon">Sale</div>' : ''}
                <div class="stock-ribbon ${product.stock}">${product.stock.replace("-", " ")}</div>
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
        // Fetch products based on selected category (this can be done through AJAX or other methods)
        renderProducts(products.filter(product => category === "All Products" || product.category === category));
    };
});

window.addEventListener("load", function() {
    document.body.classList.add("loaded"); // Add the 'loaded' class to body when everything is ready
});
