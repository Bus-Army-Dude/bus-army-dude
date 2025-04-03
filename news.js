document.addEventListener("DOMContentLoaded", () => {
    const articlesContainer = document.getElementById("articles-container");
    const timeFilter = document.getElementById("time-filter");

    // Sample article data (Replace with API fetch later)
    const articles = [
        {
            category: "Technology",
            title: "AI is Changing the World",
            description: "A look at how AI is transforming industries.",
            author: "John Doe",
            date: "2025-04-01T10:30:00Z",
            image: "https://via.placeholder.com/400",
            content: "This is the full content of the AI article..."
        },
        {
            category: "Business",
            title: "Stock Market Surges",
            description: "Markets see an all-time high after economic recovery.",
            author: "Jane Smith",
            date: "2025-04-02T15:00:00Z",
            image: "https://via.placeholder.com/400",
            content: "This is the full content of the business article..."
        }
    ];

    // Function to render articles
    function renderArticles(filteredArticles) {
        articlesContainer.innerHTML = ""; // Clear existing content
        filteredArticles.forEach(article => {
            const articleElement = document.createElement("div");
            articleElement.classList.add("news-article");
            articleElement.innerHTML = `
                <div class="news-header">
                    <img src="${article.image}" alt="News Logo" class="news-logo">
                    <h4 class="news-source">${article.category}</h4>
                </div>
                <h3 class="news-title">${article.title}</h3>
                <p class="news-meta">${formatDate(article.date)} - ${article.author}</p>
            `;
            articleElement.addEventListener("click", () => openModal(article));
            articlesContainer.appendChild(articleElement);
        });
    }

    // Function to open modal with article details
    function openModal(article) {
        document.getElementById("category-name").innerText = article.category;
        document.getElementById("article-title").innerText = article.title;
        document.getElementById("short-description").innerText = article.description;
        document.getElementById("author").innerText = article.author;
        document.getElementById("date").innerText = formatDate(article.date);
        document.getElementById("article-image").src = article.image;
        document.getElementById("article-content").innerText = article.content;

        document.getElementById("modal").style.display = "block";
    }

    // Function to close the modal
    function closeModal() {
        document.getElementById("modal").style.display = "none";
    }

    // Function to format the date
    function formatDate(isoDate) {
        const date = new Date(isoDate);
        return date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
    }

    // Function to filter articles by time range
    function filterArticlesByTime() {
        const selectedValue = timeFilter.value;
        const now = new Date();
        let filteredArticles = articles;

        if (selectedValue !== "anytime") {
            const timeFrames = {
                "past-hour": 1 * 60 * 60 * 1000,  // 1 hour in milliseconds
                "past-24-hours": 24 * 60 * 60 * 1000, // 24 hours
                "past-week": 7 * 24 * 60 * 60 * 1000, // 7 days
                "past-year": 365 * 24 * 60 * 60 * 1000 // 365 days
            };

            const timeLimit = now - timeFrames[selectedValue];
            filteredArticles = articles.filter(article => new Date(article.date) >= timeLimit);
        }

        renderArticles(filteredArticles);
    }

    // Event listener for the filter dropdown
    timeFilter.addEventListener("change", filterArticlesByTime);

    // Initial render
    renderArticles(articles);
});

// Close modal when clicking outside of it
window.onclick = (event) => {
    if (event.target.classList.contains("modal")) {
        closeModal();
    }
};
