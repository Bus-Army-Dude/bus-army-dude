document.addEventListener('DOMContentLoaded', function () {
    // Disable right-click (context menu) across the entire page
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault(); // Disable right-click
    });

    // Prevent image dragging and right-click on images
    const images = document.querySelectorAll('img');
    images.forEach(image => {
        image.addEventListener('dragstart', function (e) {
            e.preventDefault(); // Disable image dragging
        });
        image.addEventListener('contextmenu', function (e) {
            e.preventDefault(); // Disable right-click on images
        });
    });

    // Disable text selection (for copy-pasting protection)
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
            e.preventDefault(); // Prevent key combinations
        }
    });

    // Disable long press (on mobile devices) to prevent copy/paste actions
    document.body.addEventListener('touchstart', function (e) {
        e.preventDefault(); // Disable touch events like long-press (for mobile)
    });

    // Disable the ability to save images via the right-click context menu
    images.forEach(image => {
        image.addEventListener('touchstart', function (e) {
            e.preventDefault(); // Disable touch events like long-press (for mobile)
        });
    });

    // Prevent "Save as" context menu action across mobile and desktop
    document.body.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    // Disable double-tap for text selection on mobile devices
    document.body.addEventListener('touchstart', function (e) {
        if (e.target && e.target.tagName === 'P') {
            e.preventDefault(); // Prevent double-tap on text to select
        }
    });

    // Disable any clipboard actions such as cut, copy, paste
    document.addEventListener('cut', function (e) {
        e.preventDefault(); // Disable cutting text
    });

    // Disable right-click, copying, and saving of images
    images.forEach(image => {
        image.addEventListener('contextmenu', function (e) {
            e.preventDefault(); // Disable context menu on images
        });

        image.addEventListener('dragstart', function (e) {
            e.preventDefault(); // Disable drag to save image
        });
    });
    
    // Handle the product data dynamically
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

    // Category dropdown setup
    const categorySelect = document.getElementById('categorySelect');
    const categories = Array.from(new Set(newProductData.map(product => product.category))); // Get unique categories
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    // Function to display products
    function displayProducts(products, container) {
        container.innerHTML = ''; // Clear existing products
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
            container.appendChild(productCard); // Append product card to the container
        });
    }

    // Initially display all products
    const productsGrid = document.querySelector('.products-grid');
    const saleGrid = document.querySelector('.sale-grid');
    displayProducts(newProductData, productsGrid);
    displayProducts(newProductData.filter(product => product.onSale), saleGrid);

    // Handle category selection
    categorySelect.addEventListener('change', function () {
        const selectedCategory = categorySelect.value;
        const filteredProducts = selectedCategory === 'all' ? newProductData : newProductData.filter(product => product.category === selectedCategory);
        displayProducts(filteredProducts, productsGrid); // Display filtered products
    });
});
