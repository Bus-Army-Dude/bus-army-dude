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
// Array containing all the products
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
    }
];

// Extracting categories dynamically
const categories = ['All Products', ...new Set(products.map(product => product.category))];

// Function to display the products dynamically
function displayProducts(productsToDisplay) {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = ''; // Clear the grid before appending new products

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${product.imgSrc}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-details">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price}</p>
                <p class="product-description">${product.description}</p>
                <a href="${product.link}" class="product-link-button">View Product</a>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Function to handle category changes
function handleCategoryChange(event) {
    const selectedCategory = event.target.value;
    const filteredProducts = selectedCategory === 'All Products' 
        ? products 
        : products.filter(product => product.category === selectedCategory);

    displayProducts(filteredProducts);
}

// Function to populate the category dropdown menu
function populateCategoryDropdown() {
    const categorySelect = document.getElementById('categorySelect');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Initializing the page once the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    populateCategoryDropdown();  // Populate the category dropdown
    displayProducts(products);    // Display all products by default
    document.getElementById('categorySelect').addEventListener('change', handleCategoryChange); // Add event listener for category selection
});


// JavaScript for the hamburger menu toggle
document.getElementById('hamburger').addEventListener('click', function () {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
});
