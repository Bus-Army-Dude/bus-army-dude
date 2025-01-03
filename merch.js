document.addEventListener('DOMContentLoaded', function () {
    const categories = document.querySelectorAll('.categories-list li a');
    const productGrid = document.querySelector('.product-grid');

    // Product data (replace with your actual product data)
    const newProductData = [
        { 
            name: 'Clear Case (Samsung & Apple)', 
            price: '$14.82', 
            imgSrc: 'product_images/clear-cases.jpg', // Path to image in product_images folder
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

    // Generate product cards dynamically
    function displayProducts(products) {
        productGrid.innerHTML = ''; // Clear current product grid
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.setAttribute('data-category', product.category); // Add category as data attribute

            productCard.innerHTML = `
                <img src="${product.imgSrc}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span>${product.price}</span>
                    <a href="${product.link}" class="buy-btn" target="_blank">Buy Now</a>
                </div>
            `;
            productGrid.appendChild(productCard); // Append product card to grid
        });
    }

    // Initially display all products
    displayProducts(newProductData);

    // Handle category click and filter products
    categories.forEach(category => {
        category.addEventListener('click', function (e) {
            e.preventDefault();
            const categoryName = category.textContent.trim();

            // Filter products based on selected category
            if (categoryName === "All Products") {
                displayProducts(newProductData); // Show all products
            } else {
                const filteredProducts = newProductData.filter(product => product.category === categoryName);
                displayProducts(filteredProducts); // Show filtered products
            }
        });
    });
});
