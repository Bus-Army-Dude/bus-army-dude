// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Sample product data
const products = [
    {
        title: 'Product 1',
        price: 19.99,
        originalPrice: 29.99,
        description: 'A great product!',
        image: 'product-image1.jpg',
        onSale: true,
        stockStatus: 'In Stock',
        link: 'product-link1.html'
    },
    {
        title: 'Product 2',
        price: 15.99,
        originalPrice: 25.99,
        description: 'Another awesome product!',
        image: 'product-image2.jpg',
        onSale: false,
        stockStatus: 'Low Stock',
        link: 'product-link2.html'
    },
    // Add more products as needed
];

// Function to display products
function displayProducts(category = 'all') {
    const productSection = document.getElementById('product-section').querySelector('.products');
    productSection.innerHTML = ''; // Clear previous products

    let filteredProducts = products;

    if (category === 'on-sale') {
        filteredProducts = products.filter(product => product.onSale);
    } else if (category === 'new-arrivals') {
        // Example: filter by new arrivals if needed
        filteredProducts = products; // Replace with actual logic if applicable
    }

    filteredProducts.forEach(product => {
        const productContainer = document.createElement('div');
        productContainer.classList.add('product-container');
        
        productContainer.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${product.onSale ? '<div class="sale-ribbon">SALE</div>' : ''}
                <div class="stock-status">${product.stockStatus}</div>
            </div>
            <div class="product-title">${product.title}</div>
            <div class="product-price">$${product.price} <span class="original-price">$${product.originalPrice}</span></div>
            <div class="product-description">${product.description}</div>
            <a href="${product.link}" class="product-button">View Product</a>
        `;

        productSection.appendChild(productContainer);
    });
}

// Initial product display
displayProducts();

// Handle category selection change
document.getElementById('category-select').addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    displayProducts(selectedCategory);
});
