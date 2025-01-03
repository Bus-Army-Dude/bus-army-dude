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
            name: 'Clear Case (Samsung & Apple)', 
            price: '$14.82', 
            imgSrc: 'product_images/clear-cases.jpg', // Path to image in product_images folder
            description: 'Clear phone case protects phone surface and aesthetics.  Made of durable polycarbonate with TPU cushioned edges, it offers scratch and bump protection while maintaining a slim profile.', 
            category: 'Accessories', 
            onSale: false,
            link: 'https://rivers-merch-store.printify.me/product/13136298/clear-cases?category=accessories' 
        },
        { 
            name: 'Impact-Resistant Cases (ADHD Awareness)', 
            price: '$19.75 - $17.77', 
            imgSrc: 'product_images/impact-resistant-cases.jpg', // Path to image in product_images folder
            description: 'Dual-layer polycarbonate phone cases with full-wrap print, wireless charging support, and removable inner TPU layer. Available in matte or glossy finish.', 
            category: 'Accessories', 
            onSale: false,
            link: 'https://rivers-merch-store.printify.me/product/13888139/impact-resistant-cases?category=accessories' 
        },
        { 
            name: 'Toddler Long Sleeve Tee', 
            price: '$20.62', 
            imgSrc: 'product_images/toddler-long-sleeve-tee.jpg', // Path to image in product_images folder
            description: 'Custom toddler long-sleeve tee made from 100% combed ringspun cotton. Features durable construction, comfortable fit, and tear-away label for sensitive skin.', 
            category: 'Kids', 
            onSale: false,
            link: 'https://rivers-merch-store.printify.me/product/13392485/toddler-long-sleeve-tee?category=kids-clothing' 
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
