// Add JavaScript for interactivity if needed
// Example: Filtering products based on categories
document.addEventListener('DOMContentLoaded', function() {
    const categories = document.querySelectorAll('.categories-list li a');
    
    categories.forEach(category => {
        category.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Filter products by ' + category.textContent);
        });
    });

    // Example: If you want to dynamically add products to the grid
    const newProductData = [
        { name: 'Product 1', price: '$29.99', imgSrc: 'product1.jpg', description: 'Product description goes here.' },
        { name: 'Product 2', price: '$39.99', imgSrc: 'product2.jpg', description: 'Product description goes here.' },
        // Add more products as needed
    ];

    const productGrid = document.querySelector('.product-grid');

    newProductData.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.imgSrc}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <span>${product.price}</span>
            </div>
        `;

        productGrid.appendChild(productCard);
    });
});
