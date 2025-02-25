// Sample product data
const products = [
    {
        title: 'Autism Mode Puzzle Heart Baby Onesie',
        price: 24.00,
        description: "Embrace uniqueness with our Autism Mode baby onesie. Made of ultrasoft fabric, this lightweight onesie is perfect for active babies. Featuring a colorful puzzle heart logo and a bold 'AUTISM MODE' switch, it's a statement piece for supporting autism awareness.",
        image: 'product_images/autism-mode.webp',
        onSale: false,
        stockStatus: 'In Stock',
        category: 'baby-toddler',
        link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/autism-mode-puzzle-heart-baby-onesie",
    },
    {
        title: 'Bear Hug Baby Tee',
        price: 28.00,
        description: "Wrap your little one in love with our Bella+Canvas Baby Jersey Short Sleeve Tee. Made from soft jersey cotton, this tee features an adorable bear holding an 'I LOVE YOU' sign. Perfect for adding a touch of cuteness to any baby's outfit. Shop now at River's Merch Store!",
        image: 'product_images/bear-hug-baby-tee.webp',
        onSale: false,
        stockStatus: 'In Stock',
        category: 'baby-toddler',
        link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/bear-hug-baby-tee",
    },
    {
        title: 'ADHD Awareness Ribbon Baby Tee',
        price: 29.00,
        description: "Raise awareness in style with this ultra-soft baby tee featuring the iconic orange ADHD awareness ribbon. Made from lightweight jersey cotton for maximum comfort, this tee is the perfect canvas for your unique designs. Show support while keeping your little one comfy and stylish.",
        image: 'product_images/adhd.webp',
        onSale: false,
        stockStatus: 'In Stock',
        category: 'baby-toddler',
        link: "https://riverkritzar-shop.fourthwall.com/en-usd/products/adhd-awareness-ribbon-baby-tee",
    }
    // Add more products here
];

// Function to display products based on selected category
function displayProducts(category = 'all') {
    const productSection = document.querySelector("#product-section .products");
    const sectionTitle = document.getElementById("sectionTitle");
    const productCount = document.getElementById("productCount");

    // Clear previous products
    productSection.innerHTML = '';

    // Filter products based on selected category
    const filteredProducts = category === "all" ? products : products.filter(product => product.category === category);

    // Update section title and count
    sectionTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1) + " Products";
    productCount.textContent = `${filteredProducts.length} items`;

    // Loop through the filtered products and display them
    filteredProducts.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        productDiv.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${product.onSale ? '<div class="sale-ribbon">SALE</div>' : ''}
                <div class="stock-status">${product.stockStatus}</div>
            </div>
            <div class="product-title">${product.title}</div>
            <div class="product-price">$${product.price}</div>
            <div class="product-description">${product.description}</div>
            <a href="${product.link}" class="product-button">View Product</a>
        `;

        productSection.appendChild(productDiv);
    });
}

// Event listener for category dropdown
document.getElementById("category-select").addEventListener("change", (event) => {
    displayProducts(event.target.value);
});

// Initial display of all products when the page loads
displayProducts("all");

// Set the current year for copyright dynamically
document.getElementById("year").textContent = new Date().getFullYear(); 
