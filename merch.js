document.addEventListener('DOMContentLoaded', function() {
    // Get all category links
    const categories = document.querySelectorAll('.categories-list li a');
    
    // Get all product cards
    const allProducts = document.querySelectorAll('.product-card');
    
    // Loop through each category link and add filtering functionality
    categories.forEach(category => {
        category.addEventListener('click', function(e) {
            e.preventDefault();  // Prevent the default link behavior

            // Get the category name from the clicked link
            const categoryName = category.textContent.trim();

            // Loop through all product cards and hide/show based on the selected category
            allProducts.forEach(product => {
                const productCategory = product.getAttribute('data-category');

                // If the product's category matches the selected category, show it; otherwise, hide it
                if (categoryName === "All" || productCategory === categoryName) {
                    product.style.display = "block"; // Show product
                } else {
                    product.style.display = "none"; // Hide product
                }
            });

            // Optionally, display an alert for the selected filter (can be removed later)
            alert('Filter products by ' + categoryName);
        });
    });

    // Example: If you want to dynamically add products to the grid
    const newProductData = [
        { name: 'Product 1', price: '$29.99', imgSrc: 'product1.jpg', description: 'Product description goes here.', category: 'T-shirts', onSale: true },
        { name: 'Product 2', price: '$39.99', imgSrc: 'product2.jpg', description: 'Product description goes here.', category: 'Hats', onSale: false },
        { name: 'Product 3', price: '$19.99', imgSrc: 'product3.jpg', description: 'Product description goes here.', category: 'Accessories', onSale: true },
        // Add more products as needed
    ];

    const productGrid = document.querySelector('.product-grid');
    const saleGrid = document.querySelector('.sale-grid');  // For On Sale products

    // Dynamically add products to the general grid and On Sale grid
    newProductData.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.setAttribute('data-category', product.category);  // Set the product category
        
        productCard.innerHTML = `
            <img src="${product.imgSrc}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <span>${product.price}</span>
                <a href="https://example.com/buy-product" class="buy-btn">Buy Now</a>
            </div>
        `;
        
        // If the product is on sale, add it to the On Sale section
        if (product.onSale) {
            saleGrid.appendChild(productCard);
        } else {
            productGrid.appendChild(productCard); // Add to regular product grid
        }
    });
});
