// Sample article data (you can replace this with your actual data fetching logic)
const articles = [
    {
        id: 1,
        title: "The market's gonna boom,' says Trump as Wall Street tumbles over tariffs",
        shortDescription: "A day after President Donald Trump’s reciprocal tariffs sent global markets tumbling - and his administration urged the American public to be patient - the president struck an optimistic note.",
        content: "WASHINGTON − A day after President Donald Trump’s reciprocal tariffs sent global markets tumbling - and his administration urged the American public to be patient - the president struck an optimistic note. Wall Street and global stock exchanges took a sharp nosedive Thursday as investors braced for the possibility of a recession, after Trump imposed higher tariffs on dozens of countries − including some of America’s biggest trading partners. The S&P 500 was down 3.4% and the Dow Jones Industrial Average was down more than 1,100 points or 2.6% at 12:40 p.m.On Thursday, Trump, who has declined to rule out the possibility of a recession, compared his “Liberation Day” tariffs to surgery as he delivered a positive prognosis on the White House South Lawn. I think it's going very well. It was an operation like when a patient gets operated, he said, adding that the move was already bringing in close to $7 trillion in investment. The markets are gonna boom. The stock is gonna boom the country's gonna boom, and the rest of the world wants to see is there any way they can make a deal he said. They've taken advantage of us for many, many years. On Wednesday as he unveiled his reciprocal tariffs plan in the Rose Garden, Trump said he was charging the countries a discounted reciprocal rate “because we are being very kind as he announced tariffs ranging from 10% to 49%. In a Thursday morning post on TruthSocial, Trump said the country would emerge stronger after the operation. THE OPERATION IS OVER! THE PATIENT LIVED, AND IS HEALING, he wrote. THE PROGNOSIS IS THAT THE PATIENT WILL BE FAR STRONGER, BIGGER, BETTER, AND MORE RESILIENT THAN EVER BEFORE. MAKE AMERICA GREAT AGAIN!!! Vice President JD Vance on Thursday defended the president's tariff move and said it would take time to see the benefits of the tariff and deregulation policy. What I’d ask folks to appreciate here is that we are not going to fix things overnight, Vance said Thursday during a FOX & Friends interview. We’ve seen closing factories, we’ve seen rising inflation. President Trump is taking this economy in a different direction. For instance, China, which was previously hit with a 20% tariff to address its role in the production of synthetic opioids, received an additional 34%, bringing the total to 54%. Cambodia was hit with a 49% tariff while Thailand came in at 36%. The reciprocal tariffs will go into effect on April 9. Reciprocal. That means they do it to us, and we do it to them, Trump said from the Rose Garden. European Commission President Ursula von der Leyen said Trump’s 20% tariffs on the bloc of 27 countries is a major blow to the whole economy. The global economy will massively suffer, she said. Uncertainty will spiral and trigger the rise of further protectionism. The EU chief said she was prepared to implement countermeasures. A top House Democrat vowed to try forcing a vote to block the tariffs. I'll soon introduce a privileged resolution to force a vote on ending the made up national emergency Trump is using to justify these taxes, Rep. Greg Meeks, D-N.Y., the Foreign Affairs Committee's ranking member, wrote in a post on X. Trump just hit Americans with the largest regressive tax hike in modern history − massive tariffs on all imports, he said. While Democrats panned Trump’s tariff plans, Republicans were quick to defend the president. Rep. Rick Allen, R-Ga., said the president was undoing decades of unfair trade practices and putting American workers, businesses, and manufacturers FIRST. These reciprocal tariffs are simply leveling the playing field and will help ensure the U.S. is no longer on the losing end of global trade, he tweeted on X.",
        imageUrl: "https://www.usatoday.com/gcdn/authoring/authoring-images/2025/04/03/USAT/82795406007-20250403-t-150930-z-1525855833-rc-2-xpdaft-9-cm-rtrmadp-3-usatrumptariffstariffsformula.JPG?width=1320&height=880&fit=crop&format=pjpg&auto=webp",
        postedOn: "2025-04-03T15:33:00Z", // ISO date format
        author: "Swapna Venugopal Ramaswamy",
        category: "Politics"
    }
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
