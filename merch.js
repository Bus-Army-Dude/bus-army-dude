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
        { name: 'Clear Cases (for Samsung & Apple)', price: '$14.82', imgSrc: 'product_images/clear-cases.jpeg', description: 'Clear phone case protects phone surface and aesthetics.  Made of durable polycarbonate with TPU cushioned edges, it offers scratch and bump protection while maintaining a slim profile.', category: 'Cases', onSale: false },
        // Add more products as needed
    ];

    const productGrid = document.querySelector('.product-grid');
    const saleGrid = document.querySelector('.sale-grid');  // For On Sale products
    const newProductGrid = document.querySelector('.new-product-grid');  // For New Products

    // Dynamically add products to the grids
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
                <a href="https://rivers-merch-store.printify.me/products" class="buy-btn">Buy Now</a>
            </div>
        `;
        
        // If the product is on sale, add it to the On Sale section
        if (product.onSale) {
            saleGrid.appendChild(productCard);
        } else {
            // If not on sale, add it to the New Products section
            newProductGrid.appendChild(productCard);
        }
    });
});
