// Sample articles data - Replace this with actual data source
const articlesData = [
  {
    category: "Technology",
    title: "New AI Technology is Revolutionizing the Industry",
    author: "Jane Doe",
    datePosted: "2025-04-01T12:25:00", // ISO date string format
    shortDescription: "AI is changing the world of technology by introducing smart automation...",
    fullContent: "Full article content goes here. Detailed information about how AI is revolutionizing the industry...",
    imageUrl: "https://via.placeholder.com/150",
    source: "TechNews"
  },
  {
    category: "Business",
    title: "Global Market Trends in 2025",
    author: "John Smith",
    datePosted: "2025-03-30T09:30:00",
    shortDescription: "Explore the latest trends in the global market and economic growth for 2025...",
    fullContent: "Full article content goes here. In-depth analysis of market trends, economic forecasts, and more...",
    imageUrl: "https://via.placeholder.com/150",
    source: "BusinessDaily"
  }
  // Add more articles as needed
];

// Utility function to format time ago (e.g., "4 hours ago")
function timeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  if (diffInYears > 0) return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  if (diffInMonths > 0) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInMinutes > 0) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
}

// Function to create the article card and append it to the page
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
  
  // Posted by & time ago
  const postedBy = document.createElement('div');
  postedBy.classList.add('posted-by');
  const author = document.createElement('span');
  author.classList.add('author');
  author.textContent = article.author;
  const date = document.createElement('span');
  date.classList.add('date');
  date.textContent = `Posted on: ${new Date(article.datePosted).toLocaleDateString()}`;
  const timeAgoText = document.createElement('span');
  timeAgoText.classList.add('posted-time');
  timeAgoText.textContent = timeAgo(article.datePosted);
  
  postedBy.appendChild(author);
  postedBy.appendChild(date);
  postedBy.appendChild(timeAgoText);
  articleCard.appendChild(postedBy);
  
  // Append the article card to the news container
  const newsContainer = document.getElementById('news-container');
  newsContainer.appendChild(articleCard);

  // Add click event to open the modal
  articleCard.addEventListener('click', () => openModal(article));
}

// Function to open the modal with the article's full content
function openModal(article) {
  const modal = document.getElementById('modal');
  const modalContent = document.querySelector('.modal-content');
  const categoryName = document.getElementById('category-name');
  const articleTitle = document.getElementById('article-title');
  const shortDescription = document.getElementById('short-description');
  const postedByDate = document.getElementById('posted-by-date');
  const articleImage = document.getElementById('article-image');
  const articleContent = document.getElementById('article-content');
  
  // Fill modal content with article details
  categoryName.textContent = article.category;
  articleTitle.textContent = article.title;
  shortDescription.textContent = article.shortDescription;
  postedByDate.innerHTML = `Posted by: <span>${article.author}</span> - <span>${new Date(article.datePosted).toLocaleDateString()}</span>`;
  articleImage.src = article.imageUrl;
  articleImage.alt = article.title;
  articleContent.textContent = article.fullContent;
  
  // Show the modal
  modal.style.display = 'flex';
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

// Function to handle category and time filter
function filterArticles() {
  const selectedCategory = document.querySelector('.nav-tabs .active')?.dataset.category;
  const selectedTime = document.getElementById('time-filter').value;
  
  // Filter logic - based on selected category and time
  // You would need to apply your own filtering logic based on the selected category and time (e.g., use the filter settings on `articlesData` array)
  
  // For now, let's just display all articles
  const filteredArticles = articlesData; // Replace this with your filter logic
  document.getElementById('news-container').innerHTML = ''; // Clear existing articles
  filteredArticles.forEach(createArticleCard); // Re-create articles based on filter
}

// Initial load - display all articles
articlesData.forEach(createArticleCard);

// Event listener for category clicks (to change active category)
document.querySelectorAll('.nav-tabs a').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.nav-tabs a').forEach(link => link.classList.remove('active'));
    this.classList.add('active');
    filterArticles(); // Apply the filter based on the selected category
  });
});

// Event listener for the time filter
document.getElementById('time-filter').addEventListener('change', filterArticles);

// Close modal when clicking the close button
document.querySelector('.close-button').addEventListener('click', closeModal);

