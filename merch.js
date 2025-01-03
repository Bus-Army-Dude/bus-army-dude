document.addEventListener('DOMContentLoaded', function() {
    const categories = document.querySelectorAll('.categories-list li a');
    const allProducts = document.querySelectorAll('.product-card');
    
    categories.forEach(category => {
        category.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryName = category.textContent.trim();

            allProducts.forEach(product => {
                const productCategory = product.getAttribute('data-category');
                if (categoryName === "All" || productCategory === categoryName) {
                    product.style.display = "block";
                } else {
                    product.style.display = "none";
                }
            });

            alert('Filter products by ' + categoryName);
        });
    });

    const newProductData = [
        { 
            name: 'Product 1', 
            price: '$29.99', 
            imgSrc: 'product_images/product1.jpg', // Path to image in product_images folder
            description: 'Product description goes here.', 
            category: 'T-shirts', 
            onSale: true,
            link: 'https://example.com/buy-product1' 
        },
        { 
            name: 'Product 2', 
            price: '$39.99', 
            imgSrc: 'product_images/product2.jpg', // Path to image in product_images folder
            description: 'Product description goes here.', 
            category: 'Hats', 
            onSale: false,
            link: 'https://example.com/buy-product2' 
        },
        { 
            name: 'Product 3', 
            price: '$19.99', 
            imgSrc: 'product_images/product3.jpg', // Path to image in product_images folder
            description: 'Product description goes here.', 
            category: 'Accessories', 
            onSale: false,
            link: 'https://example.com/buy-product3' 
        }
    ];

    const productGrid = document.querySelector('.product-grid');
    const saleGrid = document.querySelector('.sale-grid');
    const newProductGrid = document.querySelector('.new-product-grid');

    newProductData.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.setAttribute('data-category', product.category);

        productCard.innerHTML = `
            <img src="${product.imgSrc}" alt="${product.name}"> <!-- Image src updated to match product_images path -->
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <span>${product.price}</span>
                <a href="${product.link}" class="buy-btn" target="_blank">Buy Now</a>
            </div>
        `;

        if (product.onSale) {
            saleGrid.appendChild(productCard);
        } else {
            newProductGrid.appendChild(productCard);
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Disable right-click on the entire page
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // Disable right-click specifically on images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault(); // Disable right-click on images
        });
    });

    // Disable text selection
    document.body.style.userSelect = 'none';

    // Disable copy, cut, and paste actions
    document.addEventListener('copy', function(e) {
        e.preventDefault();
    });
    document.addEventListener('cut', function(e) {
        e.preventDefault();
    });
    document.addEventListener('paste', function(e) {
        e.preventDefault();
    });

    // Disable specific keyboard shortcuts (e.g., Ctrl+C, Ctrl+V)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
            e.preventDefault();
        }
    });

    // Your other JavaScript code for product handling (like product grids, categories, etc.)
});
