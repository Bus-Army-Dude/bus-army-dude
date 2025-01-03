document.addEventListener('DOMContentLoaded', function () {
    // Disable right-click (context menu)
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

    // Example of how to log the product images to ensure correct paths (useful for debugging)
    const productData = [
        { 
            name: 'Clear Case (Samsung & Apple)', 
            price: '$14.82', 
            imgSrc: 'product_images/clear-cases.jpg', 
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

    // Logic for displaying product information
    function displayProducts(products) {
        const productsGrid = document.querySelector('.products-grid');
        productsGrid.innerHTML = ''; // Clear the grid before adding new products

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.setAttribute('data-category', product.category); // Add category as data attribute

            const productImage = new Image();
            productImage.src = product.imgSrc;

            // Check for image load or error
            productImage.onload = function () {
                console.log('Image loaded successfully:', product.imgSrc);
            };

            productImage.onerror = function () {
                console.error('Image failed to load:', product.imgSrc);
            };

            productCard.innerHTML = `
                <img src="${product.imgSrc}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span>${product.price}</span>
                    <a href="${product.link}" class="buy-btn" target="_blank">Buy Now</a>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
    }

    // Initial call to display products
    displayProducts(productData);
});
