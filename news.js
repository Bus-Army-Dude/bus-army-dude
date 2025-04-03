document.addEventListener("DOMContentLoaded", function () {
    const newsContainer = document.getElementById("news-container");
    const articleData = [
        {
            category: "Technology",
            title: "AI is Changing the World",
            description: "A deep dive into how AI is evolving.",
            author: "John Doe",
            postedAt: "2025-04-03T12:25:00-04:00", // Use ISO 8601 timestamp
            image: "https://via.placeholder.com/300"
        },
        {
            category: "Science",
            title: "SpaceX's New Mission to Mars",
            description: "Exploring the latest developments in space travel.",
            author: "Jane Smith",
            postedAt: "2025-04-02T10:00:00-04:00", // Another example
            image: "https://via.placeholder.com/300"
        }
    ];

    // Function to convert timestamp to "time ago" format
    function timeAgo(postedAt) {
        const currentTime = new Date();
        const postTime = new Date(postedAt);
        const diffInSeconds = Math.floor((currentTime - postTime) / 1000); // Difference in seconds
        
        const seconds = diffInSeconds;
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        // Return time ago string based on the difference
        if (seconds < 60) {
            return `${seconds} seconds ago`;
        } else if (minutes < 60) {
            return `${minutes} minutes ago`;
        } else if (hours < 24) {
            return `${hours} hours ago`;
        } else if (days < 7) {
            return `${days} days ago`;
        } else if (weeks < 4) {
            return `${weeks} weeks ago`;
        } else if (months < 12) {
            return `${months} months ago`;
        } else {
            return `${years} years ago`;
        }
    }

    // Loop through the articleData and dynamically insert each article
    articleData.forEach(article => {
        const articleElement = document.createElement("div");
        articleElement.classList.add("article-card");
        articleElement.innerHTML = `
            <div class="article-category">${article.category}</div>
            <img class="article-image" src="${article.image}" alt="${article.title}">
            <h3 class="article-title">${article.title}</h3>
            <p class="short-description">${article.description}</p>
            <p class="posted-by-date">Posted ${timeAgo(article.postedAt)} * By ${article.author}</p>
            <button class="view-article-button" data-title="${article.title}" data-category="${article.category}" data-description="${article.description}" data-author="${article.author}" data-date="${article.postedAt}" data-image="${article.image}">
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
