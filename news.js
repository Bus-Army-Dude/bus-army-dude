// Sample article data (you can replace this with your actual data fetching logic)
const articles = [
    {
        id: 1,
        title: "The Future of AI",
        shortDescription: "Artificial Intelligence is transforming industries. Here's what you need to know.",
        content: "Full article about the future of AI...",
        imageUrl: "https://via.placeholder.com/150",
        postedOn: "2025-04-02T08:30:00Z", // ISO date format
        author: "John Doe",
        category: "Technology"
    },
    {
        id: 2,
        title: "Breaking News: Stock Market Crash",
        shortDescription: "The stock market has experienced a major crash today. Here's what you need to know.",
        content: "Full article about the stock market crash...",
        imageUrl: "https://via.placeholder.com/150",
        postedOn: "2025-04-02T10:00:00Z",
        author: "Jane Smith",
        category: "Business"
    },
    {
        id: 3,
        title: "World Leaders Meet for Climate Talks",
        shortDescription: "Leaders from around the globe are convening to discuss the pressing issue of climate change.",
        content: "Details about the climate talks...",
        imageUrl: "https://via.placeholder.com/150",
        postedOn: "2025-04-01T14:00:00Z",
        author: "Alice Brown",
        category: "World"
    },
    {
        id: 4,
        title: "New Study Links Exercise to Better Mental Health",
        shortDescription: "Research suggests that regular physical activity has significant benefits for mental well-being.",
        content: "Findings of the mental health study...",
        imageUrl: "https://via.placeholder.com/150",
        postedOn: "2025-04-03T09:00:00Z",
        author: "Bob Green",
        category: "Health"
    },
    {
        id: 5,
        title: "Local Sports Team Wins Championship",
        shortDescription: "The city celebrates as their beloved sports team brings home the championship trophy.",
        content: "Coverage of the championship game...",
        imageUrl: "https://via.placeholder.com/150",
        postedOn: "2025-04-03T12:00:00Z",
        author: "Charlie White",
        category: "Sports"
    },
    // Add more articles as needed
];

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

// Function to create an article card and append it to the news container
function createArticleCard(article) {
    const articleCard = document.createElement('div');
    articleCard.classList.add('article-card');

    // Article image
    const image = document.createElement('img');
    image.src = article.imageUrl;
    image.alt = article.title;
    articleCard.appendChild(image);

    // Article category
    const category = document.createElement('div');
    category.classList.add('article-category');
    category.textContent = article.category; // Display category on the card
    articleCard.appendChild(category);

    // Article title
    const title = document.createElement('h3');
    title.classList.add('article-title');
    title.textContent = article.title;
    articleCard.appendChild(title);

    // Short description
    const description = document.createElement('p');
    description.classList.add('short-description');
    description.textContent = article.shortDescription;
    articleCard.appendChild(description);

    // Posted by & time ago (e.g., "4 hours ago")
    const postedBy = document.createElement('div');
    postedBy.classList.add('posted-by');
    postedBy.innerHTML = `<span class="posted-on">${timeAgo(article.postedOn)}</span> <span class="author">by ${article.author}</span>`;
    articleCard.appendChild(postedBy);

    // Add a click event to open the article in the modal
    articleCard.addEventListener('click', () => openArticleModal(article));

    // Append the article card to the news container
    document.getElementById('news-container').appendChild(articleCard);
}

// Function to open the article modal
function openArticleModal(article) {
    // Set modal content based on the article
    document.getElementById('category-name').textContent = article.category;
    document.getElementById('article-title').textContent = article.title;
    document.getElementById('short-description').textContent = article.shortDescription;
    document.getElementById('author').textContent = article.author;
    document.getElementById('date').textContent = timeAgo(article.postedOn);
    document.getElementById('article-image').src = article.imageUrl;
    document.getElementById('article-image').alt = article.title;
    document.getElementById('article-content').textContent = article.content;

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

    // First, filter by time range
    switch (range) {
        case 'past-hour':
            filteredArticles = filteredArticles.filter(article => now - new Date(article.postedOn) <= 60 * 60 * 1000);
            break;
        case 'past-24-hours':
            filteredArticles = filteredArticles.filter(article => now - new Date(article.postedOn) <= 24 * 60 * 60 * 1000);
            break;
        case 'past-week':
            filteredArticles = filteredArticles.filter(article => now - new Date(article.postedOn) <= 7 * 24 * 60 * 60 * 1000);
            break;
        case 'past-year':
            filteredArticles = filteredArticles.filter(article => now - new Date(article.postedOn) <= 365 * 24 * 60 * 60 * 1000);
            break;
        default:
            break; // 'anytime' - no time filter
    }

    // Then, filter by category
    if (category !== 'home') { // 'home' will show all categories
        filteredArticles = filteredArticles.filter(article => article.category.toLowerCase() === category);
    }

    // Clear the existing articles and load filtered ones
    document.getElementById('news-container').innerHTML = '';
    filteredArticles.forEach(article => {
        createArticleCard(article);
    });
}

// Function to load all articles initially
function loadArticles() {
    articles.forEach(article => {
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
    loadArticles(); // Load all articles initially

    // Add event listeners to the navigation tabs
    const navTabs = document.querySelectorAll('.nav-tabs a');
    navTabs.forEach(tab => {
        tab.addEventListener('click', handleNavTabClick);
    });

    // Add event listener to the time filter dropdown
    const timeFilter = document.getElementById('time-filter');
    timeFilter.addEventListener('change', (event) => {
        const activeCategory = document.querySelector('.nav-tabs a.active');
        const categoryValue = activeCategory ? activeCategory.dataset.category : 'home';
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
