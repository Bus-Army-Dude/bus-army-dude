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

// Function to filter articles by time range
function filterArticlesByTime(range) {
  let filteredArticles;

  const now = new Date();

  switch(range) {
    case 'past-hour':
      filteredArticles = articles.filter(article => {
        const articleDate = new Date(article.postedOn);
        return now - articleDate <= 60 * 60 * 1000; // 1 hour
      });
      break;
    case 'past-24-hours':
      filteredArticles = articles.filter(article => {
        const articleDate = new Date(article.postedOn);
        return now - articleDate <= 24 * 60 * 60 * 1000; // 24 hours
      });
      break;
    case 'past-week':
      filteredArticles = articles.filter(article => {
        const articleDate = new Date(article.postedOn);
        return now - articleDate <= 7 * 24 * 60 * 60 * 1000; // 7 days
      });
      break;
    case 'past-year':
      filteredArticles = articles.filter(article => {
        const articleDate = new Date(article.postedOn);
        return now - articleDate <= 365 * 24 * 60 * 60 * 1000; // 1 year
      });
      break;
    default:
      filteredArticles = articles;
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

// Wait for DOM content to be loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
  loadArticles();

  // Add event listener to the time filter dropdown
  const timeFilter = document.getElementById('time-filter');
  timeFilter.addEventListener('change', (event) => {
    filterArticlesByTime(event.target.value);
  });
});

// Add event listener for the close button
document.querySelector('.close-button').addEventListener('click', closeModal);
