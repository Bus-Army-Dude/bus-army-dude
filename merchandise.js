// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Sample product data
const products = [
    {
        title: 'Autism Mode Puzzele Heart Baby Onesie',
        price: 24.00,
        description: "Embrace uniqueness with our Autism Mode baby onesie. Made of ultrasoft fabric, this lightweight onesie is perfect for active babies. Featuring a colorful puzzle heart logo and a bold 'AUTISM MODE' switch, it's a statement piece for supporting autism awareness.",
        image: 'product_images/autism-mode.webp',
        onSale: false,
        stockStatus: 'In Stock',
        category: 'baby-toddler', // Added category for filtering
        link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/autism-mode-puzzle-heart-baby-onesie",
    }
    // Add more products as needed
];

// Function to display products
function displayProducts(category = 'all') {
    const productSection = document.getElementById('product-section').querySelector('.products');
    const sectionTitle = document.getElementById('sectionTitle');
    const productCount = document.getElementById('productCount');

    productSection.innerHTML = ''; // Clear previous products

    let filteredProducts = products.filter(product => category === 'all' || product.category === category);

    // Update section title and product count
    switch (category) {
        case 'all':
            sectionTitle.textContent = 'All Products';
            break;
        case 'outdoor':
            sectionTitle.textContent = 'Outdoor';
            break;
        case 'hats':
            sectionTitle.textContent = 'Hats';
            break;
        case 'hoodies-sweatshirts':
            sectionTitle.textContent = 'Hoodies & Sweatshirts';
            break;
        case 't-shirts':
            sectionTitle.textContent = 'T-Shirts';
            break;
        case 'baby-toddler':
            sectionTitle.textContent = 'Baby & Toddler';
            break;
        case 'kitchenwear':
            sectionTitle.textContent = 'Kitchenwear';
            break;
        case 'accessories':
            sectionTitle.textContent = 'Accessories';
            break;
        default:
            sectionTitle.textContent = 'All Products';
    }

    // Update product count
    productCount.textContent = `${filteredProducts.length} items`;

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

// Initial product display (All Products)
displayProducts();

// Handle category selection change
document.getElementById('category-select').addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    displayProducts(selectedCategory);
});
