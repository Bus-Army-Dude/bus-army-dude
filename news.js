document.addEventListener("DOMContentLoaded", function () {
    const newsContainer = document.getElementById("news-container");
    const articleData = [
        {
            category: "Technology",
            title: "AI is Changing the World",
            description: "A deep dive into how AI is evolving.",
            author: "John Doe",
            date: "April 3, 2025",
            image: "https://via.placeholder.com/300"
        },
        {
            category: "Science",
            title: "SpaceX's New Mission to Mars",
            description: "Exploring the latest developments in space travel.",
            author: "Jane Smith",
            date: "April 2, 2025",
            image: "https://via.placeholder.com/300"
        },
        // Add more articles here if needed
    ];

    // Loop through the articleData and dynamically insert each article
    articleData.forEach(article => {
        const articleElement = document.createElement("div");
        articleElement.classList.add("article-card");
        articleElement.innerHTML = `
            <div class="article-category">${article.category}</div>
            <img class="article-image" src="${article.image}" alt="${article.title}">
            <h3 class="article-title">${article.title}</h3>
            <p class="short-description">${article.description}</p>
            <p class="posted-by-date">Posted by: ${article.author} - ${article.date}</p>
            <button class="view-article-button" data-title="${article.title}" data-category="${article.category}" data-description="${article.description}" data-author="${article.author}" data-date="${article.date}" data-image="${article.image}">
                Read More
            </button>
        `;
        newsContainer.appendChild(articleElement);
    });

    // Add event listener to the "Read More" buttons to open the modal
    const viewArticleButtons = document.querySelectorAll(".view-article-button");
    viewArticleButtons.forEach(button => {
        button.addEventListener("click", function (e) {
            const { title, category, description, author, date, image } = e.target.dataset;
            openModal(title, category, description, author, date, image);
        });
    });
});

// Modal open function
function openModal(title, category, description, author, date, image) {
    document.getElementById("article-title").textContent = title;
    document.getElementById("category-name").textContent = category;
    document.getElementById("short-description").textContent = description;
    document.getElementById("author").textContent = author;
    document.getElementById("date").textContent = date;
    document.getElementById("article-image").src = image;
    document.getElementById("modal").style.display = "block";
}

// Modal close function
function closeModal() {
    document.getElementById("modal").style.display = "none";
}
