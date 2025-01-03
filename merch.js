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
        }
    };

    // Initialize copy protection
    enhancedCopyProtection.init();

    // Your Actual Product Data
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

    // Populate categories dropdown dynamically
    function populateCategories() {
        const categorySelect = document.getElementById('categorySelect');
        const categories = Array.from(new Set(products.map(product => product.category)));
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categorySelect.appendChild(option);
        });
    }

    // Display products based on selected category with modern layout
    function displayProducts(category = 'all') {
        const productGrid = document.querySelector('.products-grid');
        productGrid.innerHTML = '';

        const filteredProducts = category === 'all' ? products : products.filter(product => product.category === category);
        filteredProducts.forEach(product => {
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
                    <a href="${product.link}" target="_blank" class="view-product">
                        <button class="view-button">View Product</button>
                    </a>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // Initialize categories and products on page load
    populateCategories();
    displayProducts();

    // Event listener for category selection
    document.getElementById('categorySelect').addEventListener('change', (event) => {
        const selectedCategory = event.target.value;
        displayProducts(selectedCategory);
    });
}); 
