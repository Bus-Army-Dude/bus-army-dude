document.addEventListener('DOMContentLoaded', function () {
    // Prevent right-click and certain keyboard shortcuts for dev tools
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    // Prevent image dragging and right-click
    const images = document.querySelectorAll('img');
    images.forEach(image => {
        image.addEventListener('dragstart', function (e) {
            e.preventDefault();
        });
        image.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
    });

    // Prevent text selection (for copy-pasting protection)
    document.body.addEventListener('selectstart', function (e) {
        e.preventDefault(); // Disable text selection
    });

    // Disable copy and paste actions
    document.body.addEventListener('copy', function (e) {
        e.preventDefault(); // Disable copy
    });

    document.body.addEventListener('paste', function (e) {
        e.preventDefault(); // Disable paste
    });

    // Prevent F12 and Ctrl+Shift+I/J to disable dev tools access
    document.addEventListener('keydown', function (e) {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J'))) {
            e.preventDefault();
        }
    });

    // Product data (replace with your actual product data)
    const newProductData = [
        { 
            name: 'Clear Case (Samsung & Apple)', 
            price: '$14.82', 
            imgSrc: 'product_images/clear-cases.jpg', // Path to image in product_images folder
            description: 'Clear phone case protects phone surface and aesthetics. Made of durable polycarbonate with TPU cushioned edges.', 
            category: 'Accessories', 
            onSale: false,
            link: 'https://rivers-merch-store.printify.me/product/13136298/clear-cases?category=accessories' 
        },
        { 
            name: 'Impact-Resistant Cases (ADHD Awareness)', 
            price: '$19.75 - $17.77', 
            imgSrc: 'product_images/impact-resistant-cases.jpg', 
            description: 'Dual-layer polycarbonate phone cases with full-wrap print, wireless charging support.', 
            category: 'Accessories', 
            onSale: false,
            link: 'https://rivers-merch-store.printify.me/product/13888139/impact-resistant-cases?category=accessories' 
        },
        { 
            name: 'Toddler Long Sleeve Tee', 
            price: '$20.62', 
            imgSrc: 'product_images/toddler-long-sleeve-tee.jpg', 
            description: 'Custom toddler long-sleeve tee made from 100% cotton.', 
            category: 'Kids', 
            onSale: false,
            link: 'https://rivers-merch-store.printify.me/product/13392485/toddler-long-sleeve-tee?category=kids-clothing' 
        }
    ];

    // Category sections
    const categories = document.querySelectorAll('.categories-list li a');
    const productsGrid = document.querySelector('.products-grid');
    const saleGrid = document.querySelector('.sale-grid');

    // Generate product cards dynamically for both sale and products
    function displayProducts(products, container) {
        container.innerHTML = ''; // Clear the container before adding new products
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.setAttribute('data-category', product.category); // Add category as data attribute

            productCard.innerHTML = `
                <img src="${product.imgSrc}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span>${product.price}</span>
                    <a href="${product.link}" class="buy-btn" target="_blank">Buy Now</a>
                </div>
            `;
            container.appendChild(productCard); // Append product card to respective container (Sale or Products)
        });
    }

    // Initially display all products, split into Products and On Sale
    function displayAllProducts() {
        const onSaleProducts = newProductData.filter(product => product.onSale);
        const products = newProductData.filter(product => !product.onSale);

        // Display products in their respective sections
        displayProducts(onSaleProducts, saleGrid);
        displayProducts(products, productsGrid);
    }

    // Call the function to display all products initially
    displayAllProducts();

    // Handle category click and filter products
    categories.forEach(category => {
        category.addEventListener('click', function (e) {
            e.preventDefault();
            const categoryName = category.textContent.trim();

            // Filter products based on selected category
            const filteredOnSaleProducts = newProductData.filter(product => product.onSale && (categoryName === "All Products" || product.category === categoryName));
            const filteredProducts = newProductData.filter(product => !product.onSale && (categoryName === "All Products" || product.category === categoryName));

            // Display filtered products in their respective sections
            displayProducts(filteredOnSaleProducts, saleGrid);
            displayProducts(filteredProducts, productsGrid);
        });
    });

    // Function to force the layout to adjust after dynamic content load
    function updateCategoryLayout() {
        const categoryCards = document.querySelectorAll('.category-card');
        const categoriesGrid = document.querySelector('.categories-grid');
        
        // This will trigger reflow, ensuring the grid adjusts properly
        categoriesGrid.style.display = 'none';
        categoriesGrid.offsetHeight; // Trigger reflow
        categoriesGrid.style.display = 'flex';
    }

    // Ensure categories grid adjusts properly after page load
    updateCategoryLayout();  // Initial layout adjustment on load

    // Re-adjust layout if the window is resized
    window.addEventListener('resize', function() {
        updateCategoryLayout();
    });
});
