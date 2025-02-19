// Replace <API_URL> with the actual API you're using.
const apiUrl = 'https://storefront-api.fourthwall.com/v1/collections?storefront_token=<ptkn_f9428183-c420-41b7-a28e-d91fb04c8dda>';

document.addEventListener('DOMContentLoaded', function() {
    // Set the current year in the footer
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;

    // Fetch products from API
    fetchProducts();
});

async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data || !data.collections) {
            console.error('No products found.');
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
        const categoryName = collection.name;
        if (!categories[categoryName]) {
            categories[categoryName] = [];
        }
        categories[categoryName].push(...collection.products);
    });

    return categories;
}

// Update the navigation for categories
function updateCategories(categories) {
    const nav = document.getElementById('category-nav');
    nav.innerHTML = ''; // Clear existing content

    Object.keys(categories).forEach(category => {
        const li = document.createElement('li');
        li.textContent = category;
        li.addEventListener('click', () => displayCategory(category));
        nav.appendChild(li);
    });
}

// Update the product sections
function updateProductSections(categories) {
    const container = document.getElementById('product-container');
    container.innerHTML = ''; // Clear existing products

    Object.keys(categories).forEach(category => {
        const section = document.createElement('section');
        const header = document.createElement('h2');
        header.textContent = category;
        section.appendChild(header);

        categories[category].forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item');

            // Product image
            const img = document.createElement('img');
            img.src = product.image_url;
            productDiv.appendChild(img);

            // Product name
            const name = document.createElement('h3');
            name.textContent = product.name;
            productDiv.appendChild(name);

            // Product price
            const price = document.createElement('p');
            price.textContent = `$${product.price}`;
            productDiv.appendChild(price);

            section.appendChild(productDiv);
        });

        container.appendChild(section);
    });
}

// Display products by category
function displayCategory(category) {
    const container = document.getElementById('product-container');
    container.innerHTML = ''; // Clear previous products

    const products = categories[category];
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-item');

        const img = document.createElement('img');
        img.src = product.image_url;
        productDiv.appendChild(img);

        const name = document.createElement('h3');
        name.textContent = product.name;
        productDiv.appendChild(name);

        const price = document.createElement('p');
        price.textContent = `$${product.price}`;
        productDiv.appendChild(price);

        container.appendChild(productDiv);
    });
}
