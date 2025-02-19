// Replace with your Fourthwall API URL for product fetching
const apiUrl = 'https://storefront-api.fourthwall.com/v1/collections?storefront_token=<ptkn_f9428183-c420-41b7-a28e-d91fb04c8dda>'; // API URL with the storefront_token

// Fetch products from the API and organize them by category
async function fetchProducts() {
    try {
        const response = await fetch(apiUrl); // No need for Authorization header
        const data = await response.json();
        
        if (!data || !data.collections) {
            console.error('No products found');
            return;
        }

        const categories = organizeByCategory(data.collections);
        updateCategories(categories);
        updateProductSections(categories);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Organize products by category
function organizeByCategory(collections) {
    const categories = {};

    collections.forEach(collection => {
        const category = collection.name || 'Uncategorized'; // Use collection name for category
        if (!categories[category]) {
            categories[category] = [];
        }

        collection.products.forEach(product => {
            categories[category].push(product);
        });
    });

    return categories;
}

// Update category navigation dynamically
function updateCategories(categories) {
    const categoryNav = document.getElementById('category-nav');
    categoryNav.innerHTML = ''; // Clear existing categories

    Object.keys(categories).forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.innerHTML = `<a href="#${category}">${category}</a>`;
        categoryNav.appendChild(categoryItem);
    });
}

// Update product sections dynamically
function updateProductSections(categories) {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = ''; // Clear existing product sections

    Object.keys(categories).forEach(category => {
        const categorySection = document.createElement('section');
        categorySection.id = category;

        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        sectionHeader.innerHTML = `<h2>${category}</h2><span class="product-count">(${categories[category].length})</span>`;
        categorySection.appendChild(sectionHeader);

        const productGrid = document.createElement('div');
        productGrid.className = 'product-grid';
        
        categories[category].forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';

            // Stock availability
            const stockRibbon = document.createElement('div');
            stockRibbon.className = `stock-ribbon ${product.inStock ? 'in-stock' : 'out-of-stock'}`;
            stockRibbon.innerText = product.inStock ? 'In Stock' : 'Out of Stock';
            productItem.appendChild(stockRibbon);

            // Product image
            const productImage = document.createElement('img');
            productImage.src = product.imageUrl;
            productImage.alt = product.name;
            productItem.appendChild(productImage);

            // Product name
            const productName = document.createElement('h3');
            productName.innerText = product.name;
            productItem.appendChild(productName);

            // Price (with sale price if available)
            const productPrice = document.createElement('p');
            productPrice.className = 'price';

            if (product.salePrice) {
                const originalPrice = document.createElement('span');
                originalPrice.className = 'original-price';
                originalPrice.innerText = `$${product.price}`; // Original price
                productPrice.appendChild(originalPrice);

                const salePrice = document.createElement('span');
                salePrice.className = 'sale-price';
                salePrice.innerText = `$${product.salePrice}`; // Sale price
                productPrice.appendChild(salePrice);
            } else {
                productPrice.innerText = `$${product.price}`; // Regular price
            }

            productItem.appendChild(productPrice);

            // Buy Now link
            const productLink = document.createElement('a');
            productLink.href = product.url;
            productLink.className = 'buy-now';
            productLink.innerText = 'Buy Now';
            productItem.appendChild(productLink);

            productGrid.appendChild(productItem);
        });

        categorySection.appendChild(productGrid);
        productContainer.appendChild(categorySection);
    });
}

// Fetch products when the page loads
document.addEventListener('DOMContentLoaded', fetchProducts);

// Update footer year
document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;
});
