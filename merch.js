document.addEventListener('DOMContentLoaded', function () {
    // Prevent right-click and certain keyboard shortcuts for dev tools
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    // Prevent image dragging and right-click
    const images = document.querySelectorAll('img');
    images.forEach(image => {
        image.addEventListener('dragstart', function (e) {
            e.preventDefault(); // Disable drag
        });
        image.addEventListener('contextmenu', function (e) {
            e.preventDefault(); // Disable right-click context menu
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

    // Prevent F12, Ctrl+Shift+I/J, and other dev tool access for all OS versions
    document.addEventListener('keydown', function (e) {
        // Disable F12 and Ctrl+Shift+I/J on any OS (macOS, Linux, Windows)
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || 
            (e.metaKey && e.shiftKey && (e.key === 'I' || e.key === 'J'))) {
            e.preventDefault();
        }
        // Disable common keyboard shortcuts for copy/cut/paste
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || 
                e.key === 'v' || e.key === 'V' || e.key === 'a' || e.key === 'A') {
                e.preventDefault();
            }
        }
    });

    // Prevent saving images via drag, right-click, or saving
    images.forEach(image => {
        image.addEventListener('dragstart', function (e) {
            e.preventDefault(); // Disable image drag
        });

        image.addEventListener('contextmenu', function (e) {
            e.preventDefault(); // Disable right-click context menu on images
        });
    });

    // Disable all text selection and prevent any other default actions (copy/paste)
    document.body.addEventListener('keydown', function (e) {
        // Disable select-all on macOS/Linux/Windows
        if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
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

    // Category dropdown element
    const categorySelect = document.getElementById('categorySelect');
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

    // Get unique categories from product data and populate the dropdown
    function populateCategoryDropdown() {
        const categories = new Set();
        newProductData.forEach(product => categories.add(product.category));
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Call the function to populate dropdown
    populateCategoryDropdown();

    // Handle category selection and filter products
    categorySelect.addEventListener('change', function () {
        const selectedCategory = categorySelect.value;

        // Filter products based on selected category
        const filteredOnSaleProducts = newProductData.filter(product => product.onSale && (selectedCategory === "all" || product.category === selectedCategory));
        const filteredProducts = newProductData.filter(product => !product.onSale && (selectedCategory === "all" || product.category === selectedCategory));

        // Display filtered products in their respective sections
        displayProducts(filteredOnSaleProducts, saleGrid);
        displayProducts(filteredProducts, productsGrid);
    });
});
