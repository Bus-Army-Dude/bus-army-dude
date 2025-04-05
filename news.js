// Sample API Key & Endpoint (replace with your own API key and URL)
const apiKey = 'd02d6826e3dd4dba9bea9e86d7d4563b'; // Replace with your NewsAPI key
const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`; // Removed category parameter

let articles = [];

// Function to format the date into "X hours ago" or "X minutes ago"
function timeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
}

// Function to fetch articles from the API
async function fetchArticles() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        console.log("API Response:", data); // Log the API response for debugging

        if (data.articles && data.articles.length > 0) {
            articles = data.articles;
            loadArticles(); // Load the fetched articles to the page
            populateCategories(); // Populate the categories
        } else {
            console.warn("No articles found in the API response.");
            document.getElementById('articles-container').innerHTML = "<p>No articles found.</p>";
        }
    } catch (error) {
        console.error('Error fetching the articles:', error);
        document.getElementById('articles-container').innerHTML = "<p>Error loading articles.</p>";
    }
}

// Function to create an article card and append it to the news container
function createArticleCard(article) {
    const articleCard = document.createElement('div');
    articleCard.classList.add('article-card');
    articleCard.dataset.articleId = article.id;

    // Article image
    const image = document.createElement('img');
    image.src = article.urlToImage || 'default-image.jpg';
    image.alt = article.title;
    articleCard.appendChild(image);

    // Article category
    const category = document.createElement('div');
    category.classList.add('article-category');
    category.textContent = article.category || 'No Category';
    articleCard.appendChild(category);

    // Article title
    const title = document.createElement('h3');
    title.classList.add('article-title');
    title.textContent = article.title;
    articleCard.appendChild(title);

    // Short description
    const description = document.createElement('p');
    description.classList.add('short-description');
    description.textContent = article.description || 'No description available';
    articleCard.appendChild(description);

    // Posted by section
    const postedBy = document.createElement('div');
    postedBy.classList.add('posted-by');
    postedBy.textContent = `${timeAgo(article.publishedAt)} by ${article.author || 'Unknown'}`;
    articleCard.appendChild(postedBy);

    // Add a click event to open the article in the modal
    articleCard.addEventListener('click', () => openArticleModal(article));

    // Append the article card to the news container
    document.getElementById('articles-container').appendChild(articleCard);
}

// Function to load all articles initially
function loadArticles() {
    document.getElementById('articles-container').innerHTML = ''; // Clear existing articles
    articles.forEach(article => {
        createArticleCard(article);
    });
}

// Function to open the article modal and display its content
function openArticleModal(article) {
    document.getElementById('modal-title').textContent = article.title;
    document.getElementById('modal-description').textContent = article.description || 'No description available';
    document.getElementById('modal-posted-by').textContent = article.author || 'Unknown';
    document.getElementById('modal-posted-date').textContent = timeAgo(article.publishedAt);
    document.getElementById('modal-image').src = article.urlToImage || 'default-image.jpg';
    document.getElementById('modal-image').alt = article.title;

    // Show the modal
    document.getElementById('article-modal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
    document.getElementById('article-modal').style.display = 'none';
}

// Function to filter articles by time range and category
function filterArticles(range, category) {
    let filteredArticles = articles;

    const now = new Date();

    // Filter by time range
    switch (range) {
        case 'past-hour':
            filteredArticles = filteredArticles.filter(article => now - new Date(article.publishedAt) <= 60 * 60 * 1000);
            break;
        case 'past-24-hours':
            filteredArticles = filteredArticles.filter(article => now - new Date(article.publishedAt) <= 24 * 60 * 60 * 1000);
            break;
        case 'past-week':
            filteredArticles = filteredArticles.filter(article => now - new Date(article.publishedAt) <= 7 * 24 * 60 * 60 * 1000);
            break;
        case 'past-year':
            filteredArticles = filteredArticles.filter(article => now - new Date(article.publishedAt) <= 365 * 24 * 60 * 60 * 1000);
            break;
        default:
            break; // 'anytime' - no time filter
    }

    // Filter by category
    if (category !== 'home' && category !== 'all') {
        filteredArticles = filteredArticles.filter(article => article.category.toLowerCase() === category.toLowerCase());
    }

    // Clear the existing articles and load filtered ones
    document.getElementById('articles-container').innerHTML = '';
    filteredArticles.forEach(article => {
        createArticleCard(article);
    });
}

// Function to handle navigation tab clicks
function handleNavTabClick(event) {
    event.preventDefault(); // Prevent the default link behavior
    const category = event.target.dataset.category;
    const timeFilterValue = document.getElementById('time-filter').value;
    filterArticles(timeFilterValue, category);

    // Update the active class on the navigation tabs
    document.querySelectorAll('.nav-tabs a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Function to populate categories in the sidebar and navigation
function populateCategories() {
    const categories = ['All']; // Add more categories as needed
    const navCategories = document.getElementById('categories-nav');
    const listCategories = document.getElementById('categories-list');

    categories.forEach(category => {
        // Navigation categories
        const navItem = document.createElement('li');
        const navLink = document.createElement('a');
        navLink.href = '#';
        navLink.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        navLink.dataset.category = category;
        navLink.addEventListener('click', handleNavTabClick);
        navItem.appendChild(navLink);
        navCategories.appendChild(navItem);

        // Sidebar categories
        const listItem = document.createElement('li');
        const listLink = document.createElement('a');
        listLink.href = '#';
        listLink.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        listLink.dataset.category = category;
        listLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default link behavior
            filterArticles(document.getElementById('time-filter').value, category);
        });
        listItem.appendChild(listLink);
        listCategories.appendChild(listItem);
    });
}

// Wait for DOM content to be loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    fetchArticles(); // Fetch the articles initially

    // Add event listeners to the navigation tabs
    const navTabs = document.querySelectorAll('.nav-tabs a');
    navTabs.forEach(tab => {
        tab.addEventListener('click', handleNavTabClick);
    });

    // Add event listener to the time filter dropdown
    const timeFilter = document.getElementById('time-filter');
    timeFilter.addEventListener('change', (event) => {
        filterArticles(event.target.value, 'all');
    });

    // Add event listener for the close button
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Add event listener for the Escape key to close the modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    // Initially set the 'All' tab as active
    const homeTab = document.querySelector('.nav-tabs a[data-category="All"]');
    if (homeTab) {
        homeTab.classList.add('active');
    }
});

// Update the footer year every year.
document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
