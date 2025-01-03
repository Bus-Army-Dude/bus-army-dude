document.addEventListener('DOMContentLoaded', function () {
    // Prevent right-click and certain keyboard shortcuts for dev tools
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault(); // Disable right-click
    });

    // Prevent image dragging and right-click
    const images = document.querySelectorAll('img');
    images.forEach(image => {
        image.addEventListener('dragstart', function (e) {
            e.preventDefault(); // Disable image dragging
        });
        image.addEventListener('contextmenu', function (e) {
            e.preventDefault(); // Disable right-click on images
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

    // Disable printing (Ctrl + P, etc.)
    document.addEventListener('keydown', function (e) {
        // Block Ctrl+P (Print), Ctrl+C (Copy), Ctrl+V (Paste), Ctrl+S (Save)
        if ((e.ctrlKey && (e.key === 'p' || e.key === 'c' || e.key === 'v' || e.key === 's')) || e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J'))) {
            e.preventDefault();
        }
    });

    // Prevent right-click, select, copy/paste and dev tools on mobile devices
    document.addEventListener('touchstart', function (e) {
        e.preventDefault(); // Disable touch interaction (like selection and copy)
    });

    // Prevent print (Ctrl + P) and right-click in the body
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey && e.key === 'p') || e.key === 'F12') {
            e.preventDefault(); // Disable printing on Windows
        }
    });

    // Prevent right-click and keyboard shortcuts for copy/paste
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault(); // Disable right-click on any element
    });

    // Product data (replace with your actual product data)
    const productData = [
        { name: 'Clear Case (Samsung & Apple)', price: '$14.82', category: 'Accessories' },
        { name: 'Impact-Resistant Cases (ADHD Awareness)', price: '$19.75 - $17.77', category: 'Accessories' },
        { name: 'Toddler Long Sleeve Tee', price: '$20.62', category: 'Kids' }
    ];

    const categorySelect = document.getElementById('categorySelect');
    const productsGrid = document.querySelector('.products-grid');
    const saleGrid = document.querySelector('.sale-grid');

    // Function to populate the category dropdown dynamically, ensuring no duplicates
    function populateCategoryDropdown() {
        const categories = new Set();
        productData.forEach(product => {
            categories.add(product.category);
        });

        // Clear existing options, if any
        categorySelect.innerHTML = '';

        // Add "All Categories" as the first option
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'All Categories';
        categorySelect.appendChild(allOption);

        // Add each unique category to the dropdown
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Function to display products dynamically
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

    // Call the function to populate the categories
    populateCategoryDropdown();

    // Display all products initially
    function displayAllProducts() {
        const onSaleProducts = productData.filter(product => product.onSale);
        const products = productData.filter(product => !product.onSale);

        // Display products in their respective sections
        displayProducts(onSaleProducts, saleGrid);
        displayProducts(products, productsGrid);
    }

    // Call the function to display all products initially
    displayAllProducts();

    // Handle category click and filter products
    categorySelect.addEventListener('change', function (e) {
        const categoryName = categorySelect.value;

        // Filter products based on selected category
        const filteredOnSaleProducts = productData.filter(product => product.onSale && (categoryName === "all" || product.category === categoryName));
        const filteredProducts = productData.filter(product => !product.onSale && (categoryName === "all" || product.category === categoryName));

        // Display filtered products in their respective sections
        displayProducts(filteredOnSaleProducts, saleGrid);
        displayProducts(filteredProducts, productsGrid);
    });
});
