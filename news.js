// Sample API Key & Endpoint (replace with your own API key and URL)
const apiKey = 'd02d6826e3dd4dba9bea9e86d7d4563b';  // Replace with your NewsAPI key
const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${apiKey}`;

let articles = [];
let selectedCategory = 'Technology';  // Hard-code category or set dynamically

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
        const data = await response.json();
        
        console.log(data);  // Check the API response

        if (data.articles) {
            articles = data.articles;
            loadArticles(); // Load the fetched articles to the page
        }
    } catch (error) {
        console.error('Error fetching the articles:', error);
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

    // Article category (using selectedCategory for consistency)
    const category = document.createElement('div');
    category.classList.add('article-category');
    category.textContent = selectedCategory || 'No Category';  // Display category dynamically
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
    document.getElementById('news-container').appendChild(articleCard);
}

// Function to load all articles initially
function loadArticles() {
    document.getElementById('news-container').innerHTML = ''; // Clear existing articles
    articles.forEach(article => {
        createArticleCard(article);
    });
}

// Function to open the article modal and display its content
function openArticleModal(article) {
    document.getElementById('category-name').textContent = selectedCategory || 'No Category';
    document.getElementById('article-title').textContent = article.title;
    document.getElementById('short-description').textContent = article.description || 'No description available';
    document.getElementById('author').textContent = article.author || 'Unknown';
    document.getElementById('date').textContent = timeAgo(article.publishedAt);
    document.getElementById('article-image').src = article.urlToImage || 'default-image.jpg';
    document.getElementById('article-image').alt = article.title;
    document.getElementById('article-content').textContent = article.content || 'No content available';

    // Show the modal
    document.getElementById('modal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
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
    document.getElementById('news-container').innerHTML = '';
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

// Wait for DOM content to be loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    fetchArticles(); // Fetch the articles initially

    // Add event listeners to the navigation tabs
    const navTabs = document.querySelectorAll('.nav-tabs a');
    navTabs.forEach(tab => {
        tab.addEventListener('click', handleNavTabClick);
    });

    // Add event listener to the category dropdown
    const categorySelect = document.getElementById('category-select');
    categorySelect.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;
        const timeFilterValue = document.getElementById('time-filter').value;
        filterArticles(timeFilterValue, selectedCategory);
    });

    // Add event listener to the time filter dropdown
    const timeFilter = document.getElementById('time-filter');
    timeFilter.addEventListener('change', (event) => {
        const activeCategory = document.querySelector('.nav-tabs a.active');
        const categoryValue = activeCategory ? activeCategory.dataset.category : document.getElementById('category-select').value;
        filterArticles(event.target.value, categoryValue);
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

    // Initially set the 'Home' tab as active
    const homeTab = document.querySelector('.nav-tabs a[data-category="home"]');
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
