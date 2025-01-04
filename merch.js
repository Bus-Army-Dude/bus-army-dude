document.addEventListener('DOMContentLoaded', () => {
    // Enhanced Copy Protection: Disable all copying, pasting, and other interactions
    const enhancedCopyProtection = {
        init() {
            // Disable right-click context menu
            document.addEventListener('contextmenu', e => e.preventDefault());

            // Disable text selection
            document.addEventListener('selectstart', e => e.preventDefault());

            // Disable copying
            document.addEventListener('copy', e => e.preventDefault());

            // Disable cutting
            document.addEventListener('cut', e => e.preventDefault());

            // Disable pasting
            document.addEventListener('paste', e => e.preventDefault());

            // Disable drag and drop
            document.addEventListener('dragstart', e => e.preventDefault());
            document.addEventListener('drop', e => e.preventDefault());

            // Disable image drag & drop (prevent saving images)
            const images = document.querySelectorAll('img');
            images.forEach(image => {
                image.setAttribute('draggable', 'false'); // Disable image drag
            });

            // Disable double-click text selection
            document.addEventListener('dblclick', e => e.preventDefault());

            // Prevent user from saving images or content through long-press on mobile
            document.body.style.userSelect = "none"; // Disables text selection globally
            document.body.style.webkitTouchCallout = "none"; // Disables iOS long press menu
            document.body.style.webkitUserSelect = "none"; // Disables text selection on webkit browsers (including iOS)
            document.body.style.msUserSelect = "none"; // Disables text selection on IE/Edge
        }
    };

    // Initialize copy protection
    enhancedCopyProtection.init();

   document.addEventListener('DOMContentLoaded', () => {
    // Product data with categories and links
    const products = [
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
            price: '$19.75', 
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
        },
        { 
            name: 'Square Sticker Label Rolls (1x1, 50 PCS)', 
            price: '$74.90', 
            imgSrc: 'product_images/square-sticker-label-rolls.jpg', 
            description: 'Custom sticker rolls are available in two sizes with a glossy finish and are durable against various elements. They come in rolls of 50, 100, or 250 pieces.', 
            category: 'Home & Living', 
            onSale: false,
            link: 'https://rivers-merch-store.printify.me/product/13150202/square-sticker-label-rolls?category=home-and-living' 
        },
        { 
            name: 'Square Sticker Label Rolls (1x1, 100 PCS)', 
            price: '$83.05', 
            imgSrc: 'product_images/square-sticker-label-rolls.jpg', 
            description: 'Custom sticker rolls are available in two sizes with a glossy finish and are durable against various elements. They come in rolls of 50, 100, or 250 pieces.', 
            category: 'Home & Living', 
            onSale: false,
            link: 'https://rivers-merch-store.printify.me/product/13150202/square-sticker-label-rolls?category=home-and-living' 
        },
        { 
            name: 'Square Sticker Label Rolls (1x1, 250 PCS)', 
            price: '$104.22', 
            imgSrc: 'product_images/square-sticker-label-rolls.jpg', 
            description: 'Custom sticker rolls are available in two sizes with a glossy finish and are durable against various elements. They come in rolls of 50, 100, or 250 pieces.', 
            category: 'Home & Living', 
            onSale: false,
            link: 'https://rivers-merch-store.printify.me/product/13150202/square-sticker-label-rolls?category=home-and-living' 
        },
        { 
            name: 'Square Sticker Label Rolls (2x2, 50 PCS)', 
            price: '$84.28', 
            imgSrc: 'product_images/square-sticker-label-rolls.jpg', 
            description: 'Custom sticker rolls are available in two sizes with a glossy finish and are durable against various elements. They come in rolls of 50, 100, or 250 pieces.', 
            category: 'Home & Living', 
            onSale: false,
            link: 'https://rivers-merch-store.printify.me/product/13150202/square-sticker-label-rolls?category=home-and-living' 
        },
        { 
            name: 'Square Sticker Label Rolls (2x2, 100 PCS)', 
            price: '$99.33', 
            imgSrc: 'product_images/square-sticker-label-rolls.jpg', 
            description: 'Custom sticker rolls are available in two sizes with a glossy finish and are durable against various elements. They come in rolls of 50, 100, or 250 pieces.', 
            category: 'Home & Living', 
            onSale: false,
            link: 'https://rivers-merch-store.printify.me/product/13150202/square-sticker-label-rolls?category=home-and-living' 
        }
    ];

    // Function to display products based on selected category
    const displayProducts = (category) => {
        const productsContainer = document.querySelector('.products-grid');
        productsContainer.innerHTML = ''; // Clear existing products

        const filteredProducts = category === 'All Products' ? products : products.filter(product => product.category === category);

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            const productImageWrapper = document.createElement('div');
            productImageWrapper.classList.add('product-image-wrapper');
            const productImage = document.createElement('img');
            productImage.classList.add('product-image');
            productImage.src = product.imgSrc;
            productImage.alt = product.name;
            productImageWrapper.appendChild(productImage);

            const productDetails = document.createElement('div');
            productDetails.classList.add('product-details');

            const productName = document.createElement('h3');
            productName.classList.add('product-name');
            productName.textContent = product.name;

            const productPrice = document.createElement('p');
            productPrice.classList.add('product-price');
            productPrice.textContent = product.price;

            const productDescription = document.createElement('p');
            productDescription.classList.add('product-description');
            productDescription.textContent = product.description;

            const viewProductButton = document.createElement('a');
            viewProductButton.classList.add('product-link-button');
            viewProductButton.href = product.link;
            viewProductButton.textContent = 'View Product';

            productDetails.appendChild(productName);
            productDetails.appendChild(productPrice);
            productDetails.appendChild(productDescription);
            productDetails.appendChild(viewProductButton);

            productCard.appendChild(productImageWrapper);
            productCard.appendChild(productDetails);
            productsContainer.appendChild(productCard);
        });
    };

    // Dynamically populate the category dropdown
    const categories = ['All Products', ...new Set(products.map(product => product.category))];
    const categorySelect = document.getElementById('categorySelect');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    // Add event listener for category selection
    categorySelect.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;
        displayProducts(selectedCategory);
    });

    // Display all products by default when page loads
    displayProducts('All Products');
});

// JavaScript for the hamburger menu toggle
document.getElementById('hamburger').addEventListener('click', function () {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
});
