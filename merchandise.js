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
            price: 25.00,
            originalPrice: 25.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/september.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/september-awareness-rainbow-onesie",
            category: "Baby & Toddler"
        },
        {
            name: "ADHD Awareness Ribbon Baby Tee",
            price: 29.00,
            originalPrice: 29.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/adhd.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/adhd-awareness-ribbon-baby-tee",
            category: "Baby & Toddler"
        },
        {
            name: "Bear Hug Baby Tee",
            price: 28.00,
            originalPrice: 28.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/bear-hug-baby-tee.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/bear-hug-baby-tee",
            category: "Baby & Toddler"
        },
        {
            name: "Autism Mode Puzzle Heart Baby Onesie",
            price: 24.00,
            originalPrice: 24.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/Autism.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/autism-mode-puzzle-heart-baby-onesie",
            category: "Baby & Toddler"
        },
        {
            name: "Autism Awareness All-Over Flag",
            price: 32.00,
            originalPrice: 32.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/autismflag.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/autism-awareness-all-over-flag",
            category: "Outdoor"
        },
        {
            name: "ADHD Awareness Ribbon Baby Onesie",
            price: 25.00,
            originalPrice: 25.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/ribbon.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/adhd-awareness-ribbon-baby-onesie",
            category: "Baby & Toddler"
        },
        {
            name: "HydroStrong Rainbow Baby Tee",
            price: 28.00,
            originalPrice: 28.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/hydro.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/hydrostrong-rainbow-baby-tee",
            category: "Baby & Toddler"
        },
        {
            name: "ADHD Awareness Ribbon Women's Polo",
            price: 84.00,
            originalPrice: 84.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/adhdwomenspolo.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/adhd-awareness-ribbon-womens-polo",
            category: "T-Shirts"
        },
        {
            name: "ADHD Awareness Ribbon Women's Polo",
            price: 84.00,
            originalPrice: 84.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/adhdmenspolo.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/adhd-awareness-ribbon-polo-shirt",
            category: "T-Shirts"
        },
        {
            name: "Inclusive Autism Awareness Polo",
            price: 75.97,
            originalPrice: 75.97, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/inclusiveautism.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/inclusive-autism-awareness-polo",
            category: "T-Shirts"
        },
        {
            name: "Colorful Handprints Autism Support Youth T-Shirt",
            price: 24.00,
            originalPrice: 24.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/colorfulautism.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/colorful-handprints-autism-support-youth-t-shirt",
            category: "T-Shirts"
        },
        {
            name: "Unity Puzzle Piece Cotton T-Shirt",
            price: 27.00,
            originalPrice: 27.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/unitypuzzel.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/unity-puzzle-piece-cotton-t-shirt",
            category: "T-Shirts"
        },
        {
            name: "ADHD Awareness Tie-Dye Dad Hat",
            price: 26.00,
            originalPrice: 26.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/adhdtiedye.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/adhd-awareness-tie-dye-dad-hat",
            category: "Hats"
        },
        {
            name: "Autism Awareness Puzzle Trucker Hat",
            price: 23.00,
            originalPrice: 23.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/autismtrucker.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/autism-awareness-puzzle-trucker-hat",
            category: "Hats"
        },
        {
            name: "Autism Awareness Puzzle Piece Hoodie",
            price: 39.00,
            originalPrice: 39.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/autismhoodie.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/autism-awareness-puzzle-piece-hoodie",
            category: "Hoodies & Sweatshirts"
        },
        {
            name: "Autism Awareness AirPods Case®",
            price: 25.00,
            originalPrice: 25.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/autismairpodscase.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/autism-awareness-airpods-case",
            category: "Accessories"
        },
        {
            name: "ADHD Awareness Ribbon iPhone® Case",
            price: 21.00,
            originalPrice: 21.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/adhdcase.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/adhd-awareness-ribbon-iphone-case",
            category: "Accessories"
        },
        {
            name: "ADHD Awareness Ribbon Pin Set (1.25)",
            price: 14.00,
            originalPrice: 14.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/adhdpin125.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/adhd-awareness-ribbon-pin-set",
            category: "Accessories"
        },
        {
            name: "ADHD Awareness Ribbon Pin Set (2.25)",
            price: 15.00,
            originalPrice: 15.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/adhdpin225.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/adhd-awareness-ribbon-pin-set",
            category: "Accessories"
        },
        {
            name: "Vibrant Puzzle Pieces Autism Awareness Desk Mat",
            price: 23.00,
            originalPrice: 23.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/autismdeskmat.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/vibrant-puzzle-pieces-autism-awareness-desk-mat",
            category: "Accessories"
        },
        {
            name: "Interlocking Hearts Jigsaw Puzzle Mug",
            price: 14.00,
            originalPrice: 14.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/blackmug.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/interlocking-hearts-jigsaw-puzzle-mug",
            category: "Kitchenwear"
        },
        {
            name: "Autism Awareness Puzzle Ceramic Mug",
            price: 14.00,
            originalPrice: 14.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/whitemug.webp",
            link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/autism-awareness-puzzle-ceramic-mug",
            category: "Kitchenwear"
        },
        {
            name: "ALL TIME BEST Basketball Graphic Sweatshirt",
            price: 12.05,
            originalPrice: 12.05, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/alltimebestsweatshirt.webp",
            link: "https://riverkritzar-shop.fourthwall.com/products/all-time-best-basketball-graphic-sweatshirt",
            category: "Hoodies & Sweatshirts"
        },
        {
            name: "Timeless Basketball Graphic Tee",
            price: 26.00,
            originalPrice: 26.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/timelessbasketball.webp",
            link: "https://riverkritzar-shop.fourthwall.com/products/timeless-basketball-graphic-tee",
            category: "T-Shirts"
        },
        {
            name: "Timeless Hoops Foam Trucker Hat",
            price: 23.00,
            originalPrice: 23.00, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/timelesshoophat.webp",
            link: "https://riverkritzar-shop.fourthwall.com/products/timeless-hoops-foam-trucker-hat",
            category: "Hats"
        },
        {
            name: "ALL TIME BEST Basketball-Inspired Baby Bodysuit",
            price: 18.99,
            originalPrice: 18.99, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/alltimebestbodysuit.webp",
            link: "https://busarmydude-shop.fourthwall.com/products/all-time-best-basketball-inspired-baby-bodysuit",
            category: "Baby & Toddler"
        },
        {
            name: "Timeless Hoops Baby Tee",
            price: 17.99,
            originalPrice: 17.99, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/timelesstee.webp",
            link: "https://busarmydude-shop.fourthwall.com/products/timeless-hoops-baby-tee",
            category: "Baby & Toddler"
        },
        {
            name: "ALL TIME BEST Basketball Baby Onesie",
            price: 18.99,
            originalPrice: 18.99, // Same as price, for non-sale
            discount: 0, // No discount
            stock: "in-stock",
            sale: false, // No sale
            image: "product_images/alltimebestbabyonsie.webp",
            link: "https://busarmydude-shop.fourthwall.com/products/all-time-best-basketball-baby-onesie",
            category: "Baby & Toddler"
        },
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

            // Conditional price and discount rendering
            let priceHTML = `<span class="regular-price">$${product.price}</span>`; // Default for no sale
            if (product.sale) {
                priceHTML = `
                    <span class="original-price">$${product.originalPrice}</span>
                    <span class="sale-price">$${product.price}</span>
                    <span class="discount">-${product.discount}% Off</span>
                `;
            }

            // Product content
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                ${saleRibbon}
                ${stockStatusRibbon}
                <h3>${product.name}</h3>
                <p class="price">${priceHTML}</p>
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
