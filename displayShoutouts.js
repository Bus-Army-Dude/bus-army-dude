// displayShoutouts.js

// Use the same Firebase config as in admin.js (Ensure this is correct)
const firebaseConfig = {
    apiKey: "AIzaSyCIZ0fri5V1E2si1xXpBPQQJqj1F_KuuG0", // Use your actual API key
    authDomain: "busarmydudewebsite.firebaseapp.com",
    projectId: "busarmydudewebsite",
    storageBucket: "busarmydudewebsite.firebasestorage.app",
    messagingSenderId: "42980404680",
    appId: "1:42980404680:web:f4f1e54789902a4295e4fd",
    measurementId: "G-DQPH8YL789" // Optional
};

// Import necessary Firebase functions (v9+ modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, Timestamp, orderBy, query, where } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// --- Initialize Firebase ---
let db;
let firebaseAppInitialized = false;
// Declare references in module scope
let profileDocRef; 
let presidentDocRef;
let usefulLinksCollectionRef;
let socialLinksCollectionRef;
let disabilitiesCollectionRef;
let techItemsCollectionRef;
let shoutoutsMetaRef; 
let faqsCollectionRef;
let businessDocRef; 

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    // Assign references
    profileDocRef = doc(db, "site_config", "mainProfile"); 
    businessDocRef = doc(db, "site_config", "businessDetails"); 
    presidentDocRef = doc(db, "site_config", "currentPresident");
    usefulLinksCollectionRef = collection(db, "useful_links");
    socialLinksCollectionRef = collection(db, "social_links");
    disabilitiesCollectionRef = collection(db, "disabilities");
    techItemsCollectionRef = collection(db, "tech_items");
    shoutoutsMetaRef = doc(db, 'siteConfig', 'shoutoutsMetadata');
    faqsCollectionRef = collection(db, "faqs");
    firebaseAppInitialized = true;
    console.log("Firebase initialized for display.");
} catch (error) {
    console.error("Firebase initialization failed:", error);
    const body = document.body;
    if (body) {
        body.innerHTML = '<p class="error" style="text-align: center; padding: 50px; color: red; font-size: 1.2em;">Could not connect to required services. Please try again later.</p>';
    }
    firebaseAppInitialized = false;
}

// --- !! MOVED HERE FOR GLOBAL SCOPE !! ---
const assumedBusinessTimezone = 'America/New_York'; // Your business's primary IANA timezone

// --- Helper Functions ---
function formatFirestoreTimestamp(firestoreTimestamp) {
    if (!firestoreTimestamp || !(firestoreTimestamp instanceof Timestamp)) { return 'N/A'; }
    try {
        const date = firestoreTimestamp.toDate();
        const locale = navigator.language || 'en-US';
        return date.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
    } catch (error) { console.error("Error formatting timestamp:", error); return 'Invalid Date'; }
}

// --- Functions to Render Cards (Shoutouts, Tech, FAQs) ---
// (Your existing renderTikTokCard, renderInstagramCard, renderYouTubeCard, renderTechItemHomepage, renderFaqItemHomepage functions remain here, unchanged from your provided file)
function renderTikTokCard(account) {
    const profilePic = account.profilePic || 'images/default-profile.jpg';
    const username = account.username || 'N/A';
    const nickname = account.nickname || 'N/A';
    const bio = account.bio || '';
    const followers = account.followers || 'N/A';
    const isVerified = account.isVerified || false;
    const profileUrl = username !== 'N/A' ? `https://tiktok.com/@${encodeURIComponent(username)}` : '#';
    const verifiedBadge = isVerified ? '<img src="check.png" alt="Verified" class="verified-badge">' : '';
    return `<div class="creator-card">
              <img src="${profilePic}" alt="@${username}" class="creator-pic" onerror="this.src='images/default-profile.jpg'">
              <div class="creator-info">
                <div class="creator-header"><h3>${nickname} ${verifiedBadge}</h3></div>
                <p class="creator-username">@${username}</p>
                <p class="creator-bio">${bio}</p>
                <p class="follower-count">${followers} Followers</p>
                <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="visit-profile"> Visit Profile </a>
              </div>
            </div>`;
}

function renderInstagramCard(account) {
    const profilePic = account.profilePic || 'images/default-profile.jpg';
    const username = account.username || 'N/A';
    const nickname = account.nickname || 'N/A';
    const bio = account.bio || '';
    const followers = account.followers || 'N/A';
    const isVerified = account.isVerified || false;
    const profileUrl = username !== 'N/A' ? `https://instagram.com/${encodeURIComponent(username)}` : '#';
    const verifiedBadge = isVerified ? '<img src="instagramcheck.png" alt="Verified" class="instagram-verified-badge">' : '';
    return `<div class="instagram-creator-card">
              <img src="${profilePic}" alt="${nickname}" class="instagram-creator-pic" onerror="this.src='images/default-profile.jpg'">
              <div class="instagram-creator-info">
                <div class="instagram-creator-header"><h3>${nickname} ${verifiedBadge}</h3></div>
                <p class="instagram-creator-username">@${username}</p>
                <p class="instagram-creator-bio">${bio}</p>
                <p class="instagram-follower-count">${followers} Followers</p>
                <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="instagram-visit-profile"> Visit Profile </a>
              </div>
            </div>`;
}

function renderYouTubeCard(account) {
    const profilePic = account.profilePic || 'images/default-profile.jpg';
    const username = account.username || 'N/A';
    const nickname = account.nickname || 'N/A';
    const bio = account.bio || '';
    const subscribers = account.subscribers || 'N/A';
    const coverPhoto = account.coverPhoto || null;
    const isVerified = account.isVerified || false;
    let safeUsername = username;
    if (username !== 'N/A' && !username.startsWith('@')) {
        safeUsername = `@${username}`;
    }
    const channelUrl = username !== 'N/A' ? `https://www.youtube.com/$${encodeURIComponent(safeUsername)}` : '#';
    const verifiedBadge = isVerified ? '<img src="youtubecheck.png" alt="Verified" class="youtube-verified-badge">' : '';
    return `<div class="youtube-creator-card">
              ${coverPhoto ? `<img src="${coverPhoto}" alt="${nickname} Cover Photo" class="youtube-cover-photo" onerror="this.style.display='none'">` : ''}
              <img src="${profilePic}" alt="${nickname}" class="youtube-creator-pic" onerror="this.src='images/default-profile.jpg'">
              <div class="youtube-creator-info">
                <div class="youtube-creator-header"><h3>${nickname} ${verifiedBadge}</h3></div>
                <div class="username-container"><p class="youtube-creator-username">${safeUsername}</p></div>
                <p class="youtube-creator-bio">${bio}</p>
                <p class="youtube-subscriber-count">${subscribers} Subscribers</p>
                <a href="${channelUrl}" target="_blank" rel="noopener noreferrer" class="youtube-visit-profile"> Visit Channel </a>
              </div>
            </div>`;
}

function renderTechItemHomepage(itemData) {
    const name = itemData.name || 'Unnamed Device';
    const model = itemData.model || '';
    const iconClass = itemData.iconClass || 'fas fa-question-circle';
    const material = itemData.material || '';
    const storage = itemData.storage || '';
    const batteryCapacity = itemData.batteryCapacity || '';
    const color = itemData.color || '';
    const price = itemData.price ? `$${itemData.price}` : '';
    const dateReleased = itemData.dateReleased || '';
    const dateBought = itemData.dateBought || '';
    const osVersion = itemData.osVersion || '';
    const batteryHealth = itemData.batteryHealth !== null && !isNaN(itemData.batteryHealth) ? parseInt(itemData.batteryHealth, 10) : null;
    const batteryCycles = itemData.batteryCycles !== null && !isNaN(itemData.batteryCycles) ? itemData.batteryCycles : null;

    let batteryHtml = '';
    if (batteryHealth !== null) {
        let batteryClass = '';
        if (batteryHealth <= 20) batteryClass = 'critical';
        else if (batteryHealth <= 50) batteryClass = 'low-power';
        const displayHealth = Math.min(batteryHealth, 100);
        batteryHtml = `<div class="tech-detail"><i class="fas fa-heart"></i><span>Battery Health:</span></div>
                      <div class="battery-container">
                        <div class="battery-icon ${batteryClass}">
                          <div class="battery-level" style="width: ${displayHealth}%;"></div>
                          <div class="battery-percentage">${batteryHealth}%</div>
                        </div>
                      </div>`;
    }

    let cyclesHtml = '';
    if (batteryCycles !== null) {
        cyclesHtml = `<div class="tech-detail"><i class="fas fa-sync"></i><span>Battery Charge Cycles:</span> ${batteryCycles}</div>`;
    }

    return `<div class="tech-item">
              <h3><i class="${iconClass}"></i> ${name}</h3>
              ${model ? `<div class="tech-detail"><i class="fas fa-info-circle"></i><span>Model:</span> ${model}</div>` : ''}
              ${material ? `<div class="tech-detail"><i class="fas fa-layer-group"></i><span>Material:</span> ${material}</div>` : ''}
              ${storage ? `<div class="tech-detail"><i class="fas fa-hdd"></i><span>Storage:</span> ${storage}</div>` : ''}
              ${batteryCapacity ? `<div class="tech-detail"><i class="fas fa-battery-full"></i><span>Battery Capacity:</span> ${batteryCapacity}</div>` : ''}
              ${color ? `<div class="tech-detail"><i class="fas fa-palette"></i><span>Color:</span> ${color}</div>` : ''}
              ${price ? `<div class="tech-detail"><i class="fas fa-tag"></i><span>Price:</span> ${price}</div>` : ''}
              ${dateReleased ? `<div class="tech-detail"><i class="fas fa-calendar-plus"></i><span>Date Released:</span> ${dateReleased}</div>` : ''}
              ${dateBought ? `<div class="tech-detail"><i class="fas fa-shopping-cart"></i><span>Date Bought:</span> ${dateBought}</div>` : ''}
              ${osVersion ? `<div class="tech-detail"><i class="fab fa-apple"></i><span>OS Version:</span> ${osVersion}</div>` : ''}
              ${batteryHtml}
              ${cyclesHtml}
            </div>`;
}

function renderFaqItemHomepage(faqData) {
    const question = faqData.question || 'No Question Provided';
    const answerHtml = faqData.answer ? (faqData.answer.includes('<') ? faqData.answer : `<p>${faqData.answer}</p>`) : '<p>No Answer Provided.</p>';
    return `<div class="faq-item">
              <button class="faq-question">
                ${question}
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-answer">
                ${answerHtml}
              </div>
            </div>`;
}

// --- Data Loading and Display Functions ---
// (Your existing displayProfileData, displayPresidentData, loadAndDisplayUsefulLinks, 
//  loadAndDisplaySocialLinks, loadAndDisplayDisabilities, loadAndDisplayTechItems, 
//  loadAndDisplayFaqs, attachFaqAccordionListeners, loadShoutoutPlatformData functions remain here, unchanged)

async function displayProfileData(profileData) {
    const profileUsernameElement = document.getElementById('profile-username-main');
    const profilePicElement = document.getElementById('profile-pic-main');
    const profileBioElement = document.getElementById('profile-bio-main');
    const profileStatusElement = document.getElementById('profile-status-main');
    const defaultUsername = "Username"; const defaultBio = ""; const defaultProfilePic = "images/default-profile.jpg"; const defaultStatusEmoji = '❓'; const statusEmojis = { online: '🟢', idle: '🟡', offline: '⚪️', dnd: '🔴' };

    if (!profileUsernameElement || !profilePicElement || !profileBioElement || !profileStatusElement) { console.warn("Profile display elements missing."); return; }

    if (!profileData) {
        console.warn("Profile data not provided to displayProfileData. Using defaults.");
        profileUsernameElement.textContent = defaultUsername;
        profilePicElement.src = defaultProfilePic;
        profileBioElement.textContent = defaultBio;
        profileStatusElement.textContent = statusEmojis['offline'];
        return;
    }

    profileUsernameElement.textContent = profileData.username || defaultUsername;
    profilePicElement.src = profileData.profilePicUrl || defaultProfilePic;
    profileBioElement.textContent = profileData.bio || defaultBio;
    const statusKey = profileData.status || 'offline';
    profileStatusElement.textContent = statusEmojis[statusKey] || defaultStatusEmoji;
    console.log("Profile section updated.");
}

async function displayPresidentData() {
    const placeholderElement = document.getElementById('president-placeholder');
    if (!placeholderElement) { console.warn("President placeholder missing."); return; }
    placeholderElement.innerHTML = '<p style="text-align: center; padding: 20px;">Loading president info...</p>';

    if (!firebaseAppInitialized || !db) { console.error("President display error: Firebase not ready."); placeholderElement.innerHTML = '<p class="error">Could not load (DB Init Error).</p>'; return; }
    if (!presidentDocRef) { console.error("President display error: presidentDocRef missing."); placeholderElement.innerHTML = '<p class="error">Could not load (Config Error).</p>'; return; }

    try {
        const docSnap = await getDoc(presidentDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const presidentHTML = `
                <section id="current-president" class="president-section">
                  <h2 class="section-title">Current U.S. President</h2>
                  <div class="president-info">
                    <img src="${data.imageUrl || 'images/default-president.jpg'}" alt="President ${data.name || 'N/A'}" class="president-photo" onerror="this.src='images/default-president.jpg'; this.alt='Photo Missing';">
                    <div class="president-details">
                      <h3 class="president-name">${data.name || 'N/A'}</h3>
                      <p><strong>Born:</strong> ${data.born || 'N/A'}</p>
                      <p><strong>Height:</strong> ${data.height || 'N/A'}</p>
                      <p><strong>Party:</strong> ${data.party || 'N/A'}</p>
                      <p class="presidential-term"><strong>Term:</strong> ${data.term || 'N/A'}</p>
                      <p><strong>VP:</strong> ${data.vp || 'N/A'}</p>
                    </div>
                  </div>
                </section>`;
            placeholderElement.innerHTML = presidentHTML;
            console.log("President section updated.");
        } else {
            console.warn(`President document ('site_config/currentPresident') missing.`);
            placeholderElement.innerHTML = '<p style="text-align: center; padding: 20px;">President info unavailable.</p>';
        }
    } catch (error) {
        console.error("Error fetching president data:", error);
        placeholderElement.innerHTML = `<p class="error">Error loading president info: ${error.message}</p>`;
    }
}

async function loadAndDisplayUsefulLinks() {
    const containerElement = document.querySelector('.useful-links-section .links-container');
    if (!containerElement) { console.warn("Useful links container missing (.useful-links-section .links-container)."); return; }

    if (!firebaseAppInitialized || !db) { console.error("Useful Links load error: Firebase not ready."); containerElement.innerHTML = '<p class="error">Error loading links (DB Init Error).</p>'; return; }
    if (!usefulLinksCollectionRef) { console.error("Useful Links load error: Collection reference missing."); containerElement.innerHTML = '<p class="error">Error loading links (Config Error).</p>'; return; }

    containerElement.innerHTML = '<p>Loading links...</p>';
    try {
        const linkQuery = query(usefulLinksCollectionRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(linkQuery);
        containerElement.innerHTML = '';

        if (querySnapshot.empty) {
            containerElement.innerHTML = '<p>No useful links available at this time.</p>';
        } else {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.label && data.url) {
                    const linkElement = document.createElement('a');
                    linkElement.href = data.url;
                    linkElement.textContent = data.label;
                    linkElement.target = '_blank';
                    linkElement.rel = 'noopener noreferrer';
                    linkElement.className = 'link-button';
                    containerElement.appendChild(linkElement);
                } else {
                    console.warn("Skipping useful link item due to missing label or URL:", doc.id);
                }
            });
        }
        console.log(`Displayed ${querySnapshot.size} useful links.`);
    } catch (error) {
        console.error("Error loading useful links:", error);
        let errorMsg = "Could not load useful links.";
        if (error.code === 'failed-precondition') {
            errorMsg = "Error: DB configuration needed for links (order).";
            console.error("Missing Firestore index for useful_links collection, ordered by 'order'.");
        }
        containerElement.innerHTML = `<p class="error">${errorMsg}</p>`;
    }
}

async function loadAndDisplaySocialLinks() {
    const containerElement = document.querySelector('.social-links-container');
    if (!containerElement) { console.warn("Social links container missing (.social-links-container)."); return; }

    if (!firebaseAppInitialized || !db) { console.error("Social Links load error: Firebase not ready."); containerElement.innerHTML = '<p class="error">Error loading socials (DB Init Error).</p>'; return; }
    if (!socialLinksCollectionRef) { console.error("Social Links load error: Collection reference missing."); containerElement.innerHTML = '<p class="error">Error loading socials (Config Error).</p>'; return;}

    containerElement.innerHTML = '<p>Loading socials...</p>';
    try {
        const linkQuery = query(socialLinksCollectionRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(linkQuery);
        containerElement.innerHTML = '';

        if (querySnapshot.empty) {
            containerElement.innerHTML = '<p>No social links available.</p>';
        } else {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.label && data.url) {
                    const linkElement = document.createElement('a');
                    linkElement.href = data.url;
                    linkElement.target = '_blank';
                    linkElement.rel = 'noopener noreferrer';
                    linkElement.className = 'social-button';

                    if (data.iconClass) {
                        const iconElement = document.createElement('i');
                        iconElement.className = data.iconClass + ' social-icon';
                        linkElement.appendChild(iconElement);
                    }

                    const textElement = document.createElement('span');
                    textElement.textContent = data.label;
                    linkElement.appendChild(textElement);
                    containerElement.appendChild(linkElement);
                } else {
                    console.warn("Skipping social link item due to missing label or URL:", doc.id);
                }
            });
        }
        console.log(`Displayed ${querySnapshot.size} social links.`);
    } catch (error) {
        console.error("Error loading social links:", error);
        let errorMsg = "Could not load social links.";
        if (error.code === 'failed-precondition') {
            errorMsg = "Error: DB configuration needed for socials (order).";
            console.error("Missing Firestore index for social_links collection, ordered by 'order'.");
        }
        containerElement.innerHTML = `<p class="error">${errorMsg}</p>`;
    }
}

async function loadAndDisplayDisabilities() {
    const placeholderElement = document.getElementById('disabilities-list-placeholder');
    if (!placeholderElement) { console.warn("Disabilities placeholder missing (#disabilities-list-placeholder)."); return; }
    placeholderElement.innerHTML = '<li>Loading...</li>';

    if (!firebaseAppInitialized || !db) { console.error("Disabilities load error: Firebase not ready."); placeholderElement.innerHTML = '<li>Error (DB Init Error).</li>'; return; }
    if (!disabilitiesCollectionRef) { console.error("Disabilities load error: Collection ref missing."); placeholderElement.innerHTML = '<li>Error (Config Error).</li>'; return; }

    try {
        const disabilityQuery = query(disabilitiesCollectionRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(disabilityQuery);
        placeholderElement.innerHTML = '';

        if (querySnapshot.empty) {
            placeholderElement.innerHTML = '<li>No specific information available at this time.</li>';
        } else {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.name && data.url) {
                    const listItem = document.createElement('li');
                    const linkElement = document.createElement('a');
                    linkElement.href = data.url;
                    linkElement.textContent = data.name;
                    linkElement.target = '_blank';
                    linkElement.rel = 'noopener noreferrer';
                    listItem.appendChild(linkElement);
                    placeholderElement.appendChild(listItem);
                } else {
                    console.warn("Skipping disability item due to missing name or URL:", doc.id);
                }
            });
        }
        console.log(`Displayed ${querySnapshot.size} disability links.`);
    } catch (error) {
        console.error("Error loading disabilities:", error);
        let errorMsg = "Could not load list.";
        if (error.code === 'failed-precondition') {
            errorMsg = "Error: DB config needed (order).";
            console.error("Missing Firestore index for disabilities collection, ordered by 'order'.");
        }
        placeholderElement.innerHTML = `<li>${errorMsg}</li>`;
    }
}

async function loadAndDisplayTechItems() {
    const techItemsListContainer = document.getElementById('tech-items-list-dynamic');
    if (!techItemsListContainer) { console.error("Tech Item Load Error: Container element #tech-items-list-dynamic not found."); return; }

    if (!firebaseAppInitialized || !db || !techItemsCollectionRef) { console.error("Tech Item Load Error: Firebase not ready or collection ref missing."); techItemsListContainer.innerHTML = '<p class="error">Error loading tech data (DB connection/Config).</p>'; return; }

    console.log("Fetching tech items for homepage...");
    techItemsListContainer.innerHTML = '<p>Loading Tech Info...</p>';
    try {
        const techQuery = query(techItemsCollectionRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(techQuery);
        let allItemsHtml = '';

        if (querySnapshot.empty) {
            console.log("No tech items found in Firestore.");
            allItemsHtml = '<p>No tech items to display currently.</p>';
        } else {
            console.log(`Found ${querySnapshot.size} tech items.`);
            querySnapshot.forEach((doc) => {
                allItemsHtml += renderTechItemHomepage(doc.data());
            });
        }
        techItemsListContainer.innerHTML = allItemsHtml;
        console.log("Tech items list updated on homepage.");
    } catch (error) {
        console.error("Error loading/displaying tech items:", error);
        let errorMsg = "Could not load tech information at this time.";
        if (error.code === 'failed-precondition') {
            errorMsg = "Error: DB configuration needed for tech items (order).";
            console.error("Missing Firestore index for tech_items collection, ordered by 'order'.");
        } else {
            errorMsg = `Could not load tech information: ${error.message}`;
        }
        techItemsListContainer.innerHTML = `<p class="error">${errorMsg}</p>`;
    }
}

async function loadAndDisplayFaqs() {
    const faqContainer = document.getElementById('faq-container-dynamic');
    if (!faqContainer) { console.error("FAQ Load Error: Container element #faq-container-dynamic not found."); return; }

    if (!firebaseAppInitialized || !db || !faqsCollectionRef) { console.error("FAQ Load Error: Firebase not ready or collection ref missing."); faqContainer.innerHTML = '<p class="error">Error loading FAQs (DB connection/Config).</p>'; return; }

    console.log("Fetching FAQs for homepage...");
    faqContainer.innerHTML = '<p>Loading FAQs...</p>';
    try {
        const faqQuery = query(faqsCollectionRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(faqQuery);
        let allItemsHtml = '';

        if (querySnapshot.empty) {
            console.log("No FAQs found in Firestore.");
            allItemsHtml = '<p>No frequently asked questions available yet.</p>';
        } else {
            console.log(`Found ${querySnapshot.size} FAQs.`);
            querySnapshot.forEach((doc) => {
                allItemsHtml += renderFaqItemHomepage(doc.data());
            });
        }
        faqContainer.innerHTML = allItemsHtml;
        attachFaqAccordionListeners(); 
        console.log("FAQ list updated on homepage.");
    } catch (error) {
        console.error("Error loading/displaying FAQs:", error);
        let errorMsg = "Could not load FAQs at this time.";
        if (error.code === 'failed-precondition') {
            errorMsg = "Error: DB configuration needed for FAQs (order).";
            console.error("Missing Firestore index for faqs collection, ordered by 'order'.");
        }
        faqContainer.innerHTML = `<p class="error">${errorMsg}</p>`;
    }
}

function attachFaqAccordionListeners() {
    const container = document.getElementById('faq-container-dynamic');
    if (!container) { console.error("FAQ Accordion Error: Container #faq-container-dynamic not found for listeners."); return; }

    console.log("Attaching FAQ accordion listeners (single open)...");
    if (container.dataset.faqListenersAttached === 'true') {
        console.log("FAQ listeners already attached, skipping.");
        return;
    }
    container.dataset.faqListenersAttached = 'true';

    const allFaqItems = container.querySelectorAll('.faq-item');

    container.addEventListener('click', (event) => {
        const questionButton = event.target.closest('.faq-question');
        if (!questionButton) return; 

        const clickedFaqItem = questionButton.closest('.faq-item');
        if (!clickedFaqItem) return; 

        const answer = clickedFaqItem.querySelector('.faq-answer');
        if (!answer) return; 

        const icon = questionButton.querySelector('.faq-icon');
        const wasActive = clickedFaqItem.classList.contains('active');

        allFaqItems.forEach(item => {
            if (item !== clickedFaqItem && item.classList.contains('active')) {
                item.classList.remove('active'); 
                const otherAnswer = item.querySelector('.faq-answer');
                const otherIcon = item.querySelector('.faq-icon');
                if (otherAnswer) otherAnswer.style.maxHeight = null; 
                if (otherIcon) otherIcon.textContent = '+'; 
            }
        });

        if (wasActive) {
            clickedFaqItem.classList.remove('active');
            answer.style.maxHeight = null;
            if (icon) icon.textContent = '+';
        } else {
            clickedFaqItem.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + "px";
            if (icon) icon.textContent = '-'; 
        }
    });
    console.log("FAQ accordion listeners attached (single open).");
}

async function loadShoutoutPlatformData(platform, gridElement, timestampElement) {
    if (!firebaseAppInitialized || !db) { console.error(`Shoutout load error (${platform}): Firebase not ready.`); if(gridElement) gridElement.innerHTML = `<p class="error">Error loading ${platform} creators (DB Init).</p>`; return; }
    if (!gridElement) {
        console.warn(`Grid element missing for ${platform}. Cannot display shoutouts.`);
        return; 
    }

    console.log(`Loading ${platform} shoutout data into:`, gridElement);
    gridElement.innerHTML = `<p>Loading ${platform} Creators...</p>`;
    if (timestampElement) timestampElement.textContent = 'Last Updated: Loading...';

    let renderFunction;
    switch(platform) {
        case 'tiktok': renderFunction = renderTikTokCard; break;
        case 'instagram': renderFunction = renderInstagramCard; break;
        case 'youtube': renderFunction = renderYouTubeCard; break;
        default: console.error(`Unknown platform type: ${platform}`); gridElement.innerHTML = `<p class="error">Configuration error for ${platform}.</p>`; return;
    }

    try {
        const shoutoutsCol = collection(db, 'shoutouts');
        const shoutoutQuery = query(shoutoutsCol, where("platform", "==", platform), orderBy("order", "asc"));
        const querySnapshot = await getDocs(shoutoutQuery);

        if (querySnapshot.empty) {
            gridElement.innerHTML = `<p>No ${platform} creators featured currently.</p>`;
        } else {
            gridElement.innerHTML = querySnapshot.docs.map(doc => renderFunction(doc.data())).join('');
        }

        if (timestampElement && shoutoutsMetaRef) {
            try {
                const metaSnap = await getDoc(shoutoutsMetaRef);
                if (metaSnap.exists()) {
                    const tsField = `lastUpdatedTime_${platform}`;
                    timestampElement.textContent = `Last Updated: ${formatFirestoreTimestamp(metaSnap.data()?.[tsField])}`;
                } else {
                    if(timestampElement) timestampElement.textContent = 'Last Updated: N/A';
                }
            } catch (e) {
                console.warn(`Could not fetch timestamp for ${platform}:`, e);
                if(timestampElement) timestampElement.textContent = 'Last Updated: Error';
            }
        } else if (timestampElement) {
            console.warn("Timestamp element provided, but shoutoutsMetaRef is not configured.");
            timestampElement.textContent = 'Last Updated: N/A';
        }
        console.log(`${platform} shoutouts displayed.`);

    } catch (error) {
        console.error(`Error loading ${platform} shoutout data:`, error);
        gridElement.innerHTML = `<p class="error">Error loading ${platform} creators.</p>`;
        if (timestampElement) timestampElement.textContent = 'Last Updated: Error';
        if (error.code === 'failed-precondition') {
            console.error(`Firestore query requires a composite index for 'shoutouts' on fields 'platform' and 'order'. Please create this index in the Firebase console.`);
            gridElement.innerHTML += `<br><small>Error: Missing database index. Check console.</small>`;
        }
    }
}


// --- BUSINESS INFO HELPER FUNCTIONS (FROM YOUR PROVIDED SCRIPT) ---
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function timeStringToMinutes(timeStr) {
    if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) return null;
    try {
        const [hours, minutes] = timeStr.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) return null;
        return hours * 60 + minutes;
    } catch (e) {
        console.error("Error converting time string to minutes:", timeStr, e);
        return null;
    }
}

function formatDisplayTimeBI(timeString, visitorTimezone) {
    if (typeof luxon === 'undefined' || !luxon.DateTime) {
        console.error("Luxon library not loaded for formatDisplayTimeBI!");
        const [h, m] = timeString ? timeString.split(':') : ["?", "?"];
        const hourNum = parseInt(h, 10);
        if (isNaN(hourNum) || isNaN(parseInt(m, 10))) return 'Invalid Time';
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const hour12 = hourNum % 12 || 12;
        return `${hour12}:${String(m).padStart(2, '0')} ${ampm} ET (Lib Err)`;
    }

    const { DateTime } = luxon;
    // assumedBusinessTimezone must be globally available
    if (typeof assumedBusinessTimezone === 'undefined') {
        console.error("assumedBusinessTimezone not defined for formatDisplayTimeBI!");
        return "? (TZ Conf Err)";
    }

    if (!timeString || typeof timeString !== 'string' || !timeString.includes(':')) return '?';

    try {
        const [hour, minute] = timeString.split(':').map(Number);
        if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            throw new Error("Invalid HH:MM format");
        }
        const nowInBizTZ = DateTime.now().setZone(assumedBusinessTimezone);
        const bizTime = nowInBizTZ.set({ hour: hour, minute: minute, second: 0, millisecond: 0 });
        const visitorTime = bizTime.setZone(visitorTimezone);
        return visitorTime.toFormat('h:mm a ZZZZ');
    } catch (e) {
        console.error("Error formatting display time with Luxon:", timeString, visitorTimezone, e);
        const [h, m] = timeString.split(':');
        const hourNum = parseInt(h, 10);
        if (isNaN(hourNum) || isNaN(parseInt(m, 10))) return 'Invalid Time';
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const hour12 = hourNum % 12 || 12;
        return `${hour12}:${String(m).padStart(2, '0')} ${ampm} ET (LXN Err)`;
    }
}

function formatDate(dateStr) {
    if (typeof luxon === 'undefined' || !luxon.DateTime) {
        console.error("Luxon library not loaded for formatDate!");
        try {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const parts = dateStr.split('-'); // YYYY-MM-DD
            const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])); // Treat as UTC to avoid timezone shift
            return date.toLocaleDateString('en-US', options);
        } catch (e) { return 'Invalid Date'; }
    }
    const { DateTime } = luxon;
    const date = DateTime.fromISO(dateStr); // Assumes dateStr is YYYY-MM-DD
    if (!date.isValid) {
        console.error("Invalid date string passed to Luxon formatDate:", dateStr, date.invalidReason);
        return 'Invalid Date';
    }
    return date.toFormat('cccc, LLLL d, yyyy');
}

// --- Main Business Info Display Logic ---
async function displayBusinessInfo() {
    const localContactEmailDisplay = document.getElementById('contact-email-display');
    const localBusinessHoursDisplay = document.getElementById('business-hours-display');
    const localBusinessStatusDisplay = document.getElementById('business-status-display');
    const localTemporaryHoursDisplay = document.getElementById('temporary-hours-display');
    const localHolidayHoursDisplay = document.getElementById('holiday-hours-display');

    if (!localContactEmailDisplay || !localBusinessHoursDisplay || !localBusinessStatusDisplay || !localTemporaryHoursDisplay || !localHolidayHoursDisplay) {
        console.warn("One or more Business info display elements missing in displayBusinessInfo.");
        return;
    }

    if (!firebaseAppInitialized || !db || !businessDocRef) {
        console.error("Cannot display business info: Firebase not ready or businessDocRef missing.");
        if (localBusinessStatusDisplay) localBusinessStatusDisplay.innerHTML = '<span class="status-unavailable">Status: Error (Config)</span>';
        return;
    }

    try {
        const docSnap = await getDoc(businessDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (localContactEmailDisplay) {
                if (data.contactEmail) {
                    localContactEmailDisplay.innerHTML = `Contact: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>`;
                } else {
                    localContactEmailDisplay.innerHTML = '';
                }
            }
            calculateAndDisplayStatusConvertedBI(data);
        } else {
            console.warn("Business details document not found in Firestore.");
            if (localBusinessStatusDisplay) localBusinessStatusDisplay.innerHTML = '<span class="status-unavailable">Status: N/A</span>';
            if (localBusinessHoursDisplay) localBusinessHoursDisplay.innerHTML = '<p>Hours not available.</p>';
        }
    } catch (error) {
        console.error("Error fetching business info:", error);
        if (localBusinessStatusDisplay) localBusinessStatusDisplay.innerHTML = '<span class="status-unavailable">Status: Error Loading</span>';
    }
}

// REPLACE your existing calculateAndDisplayStatusConvertedBI function with THIS ENTIRE VERSION:
function calculateAndDisplayStatusConvertedBI(businessData) {
    const localContactEmailDisplay = document.getElementById('contact-email-display');
    const localBusinessHoursDisplay = document.getElementById('business-hours-display');
    const localBusinessStatusDisplay = document.getElementById('business-status-display');
    const localTemporaryHoursDisplay = document.getElementById('temporary-hours-display');
    const localHolidayHoursDisplay = document.getElementById('holiday-hours-display');

    const statusMainTextEl = localBusinessStatusDisplay ? localBusinessStatusDisplay.querySelector('.status-main-text') : null;
    const statusCountdownTextEl = localBusinessStatusDisplay ? localBusinessStatusDisplay.querySelector('.status-countdown-text') : null;
    const statusReasonEl = localBusinessStatusDisplay ? localBusinessStatusDisplay.querySelector('.status-reason-text') : null;

    if (!localBusinessHoursDisplay || !localBusinessStatusDisplay || !localTemporaryHoursDisplay || !localHolidayHoursDisplay ||
        !statusMainTextEl || !statusCountdownTextEl || !statusReasonEl) {
        console.error("FATAL: One or more critical business display HTML elements are missing in calculateAndDisplayStatusConvertedBI.");
        if (localBusinessStatusDisplay) {
            localBusinessStatusDisplay.innerHTML = '<span class="status-unavailable" style="display:block; font-weight:bold;">Display Error</span><span style="font-size:0.8em; color:var(--secondary-text); display:block;">(UI elements missing)</span>';
        }
        return;
    }

    const { DateTime, Duration } = luxon;
    
    if (typeof assumedBusinessTimezone === 'undefined') {
        console.error("CRITICAL: assumedBusinessTimezone is not defined globally in displayShoutouts.js!");
        statusMainTextEl.textContent = 'Config Error';
        statusMainTextEl.className = 'status-main-text status-unavailable';
        statusCountdownTextEl.textContent = '(Timezone const missing)';
        statusReasonEl.textContent = '';
        return;
    }

    const { regularHours = {}, holidayHours = [], temporaryHours = [], statusOverride = 'auto' } = businessData;
    
    let currentStatus = 'Closed'; // Default
    let statusReason = 'Scheduled Hours'; // Default category
    let activeHoursRule = null;
    let ruleAppliedForStatus = false;

    let visitorTimezone;
    try {
        visitorTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (!visitorTimezone || !DateTime.now().setZone(visitorTimezone).isValid) {
             throw new Error("Visitor timezone detection failed or Luxon found it invalid.");
        }
    } catch (e) {
        console.error("Could not detect or use visitor timezone:", e);
        statusMainTextEl.textContent = 'Status Unavailable';
        statusMainTextEl.className = 'status-main-text status-unavailable';
        statusCountdownTextEl.textContent = '(Timezone Error)';
        statusReasonEl.textContent = '';
        return;
    }

    const nowInBizTZLuxon = DateTime.now().setZone(assumedBusinessTimezone);
    if (!nowInBizTZLuxon.isValid) {
        console.error("Luxon could not create a valid DateTime for business timezone:", assumedBusinessTimezone, "Reason:", nowInBizTZLuxon.invalidReason, nowInBizTZLuxon.invalidExplanation);
        statusMainTextEl.textContent = 'Status Error';
        statusMainTextEl.className = 'status-main-text status-unavailable';
        statusCountdownTextEl.textContent = '(Internal Time Error)';
        statusReasonEl.textContent = '';
        return;
    }

    const currentHourInBizTZ = nowInBizTZLuxon.hour;
    const currentMinuteInBizTZ = nowInBizTZLuxon.minute;
    const businessDateStr = nowInBizTZLuxon.toISODate();
    const businessDayName = nowInBizTZLuxon.toFormat('cccc').toLowerCase();
    const currentMinutesInBizTZ = currentHourInBizTZ * 60 + currentMinuteInBizTZ;

    // --- STATUS DETERMINATION LOGIC (Order: Override > Holiday > Temporary > Regular) ---
    if (statusOverride !== 'auto') {
        currentStatus = statusOverride === 'open' ? 'Open' : (statusOverride === 'closed' ? 'Closed' : 'Temporarily Unavailable');
        statusReason = 'Manual Override';
        activeHoursRule = { type: 'override', reasonOriginal: statusReason, isClosed: (currentStatus !== 'Open' && currentStatus !== 'Temporarily Unavailable'), open: null, close: null };
        ruleAppliedForStatus = true;
    }

    if (!ruleAppliedForStatus) {
        const todayHoliday = holidayHours.find(h => h.date === businessDateStr);
        if (todayHoliday) {
            statusReason = `Holiday (${todayHoliday.label || 'Event'})`;
            activeHoursRule = { ...todayHoliday, type: 'holiday', reasonOriginal: statusReason };
            ruleAppliedForStatus = true;
            if (todayHoliday.isClosed || !todayHoliday.open || !todayHoliday.close) {
                currentStatus = 'Closed';
            } else {
                const openMins = timeStringToMinutes(todayHoliday.open); 
                const closeMins = timeStringToMinutes(todayHoliday.close);
                currentStatus = (openMins !== null && closeMins !== null && currentMinutesInBizTZ >= openMins && currentMinutesInBizTZ < closeMins) ? 'Open' : 'Closed';
            }
        }
    }

    if (!ruleAppliedForStatus) {
        const activeTemporary = temporaryHours.find(t => t.startDate && t.endDate && businessDateStr >= t.startDate && businessDateStr <= t.endDate);
        if (activeTemporary) {
            statusReason = `Temporary (${activeTemporary.label || 'Schedule'})`;
            activeHoursRule = { ...activeTemporary, type: 'temporary', reasonOriginal: statusReason };
            ruleAppliedForStatus = true;
            if (activeTemporary.isClosed || !activeTemporary.open || !activeTemporary.close) {
                currentStatus = 'Closed'; // Temporary rule makes it closed for the day or has no specific times
            } else {
                const openMins = timeStringToMinutes(activeTemporary.open); 
                const closeMins = timeStringToMinutes(activeTemporary.close);
                // If within specific temporary open hours, status is "Temporarily Unavailable"
                // Otherwise, if a temporary rule is active for the day but we're outside its specific times, it's "Closed" (due to this temp rule)
                currentStatus = (openMins !== null && closeMins !== null && currentMinutesInBizTZ >= openMins && currentMinutesInBizTZ < closeMins) ? 'Temporarily Unavailable' : 'Closed';
            }
        }
    }

    if (!ruleAppliedForStatus) { // No override, holiday, or active temporary rule for today
        statusReason = 'Regular Hours';
        const todayRegularHours = regularHours[businessDayName];
        activeHoursRule = { ...(todayRegularHours || { isClosed: true, open: null, close: null }), type: 'regular', day: businessDayName, reasonOriginal: statusReason };
        if (todayRegularHours && !todayRegularHours.isClosed && todayRegularHours.open && todayRegularHours.close) {
            const openMins = timeStringToMinutes(todayRegularHours.open); 
            const closeMins = timeStringToMinutes(todayRegularHours.close);
            currentStatus = (openMins !== null && closeMins !== null && currentMinutesInBizTZ >= openMins && currentMinutesInBizTZ < closeMins) ? 'Open' : 'Closed';
        } else {
            currentStatus = 'Closed'; // Closed by regular schedule (either marked isClosed or no open/close times)
        }
    }
    
    // Update the activeHoursRule.reason to include the determined currentStatus for display
    if (activeHoursRule) {
        activeHoursRule.reason = `${activeHoursRule.reasonOriginal} - Currently ${currentStatus}`;
    } else { // Fallback, though activeHoursRule should always be set by this point
        activeHoursRule = { reason: `${statusReason} - Currently ${currentStatus}`, type: 'default', isClosed: (currentStatus === 'Closed'), open:null, close:null };
    }
    
    // --- DISPLAY MAIN STATUS & CALCULATE/DISPLAY MAIN COUNTDOWN ---
    let statusClass = 'status-closed';
    if (currentStatus === 'Open') statusClass = 'status-open';
    else if (currentStatus === 'Temporarily Unavailable') statusClass = 'status-unavailable';

    statusMainTextEl.className = 'status-main-text'; // Reset classes
    statusMainTextEl.classList.add(statusClass);
    statusMainTextEl.textContent = currentStatus;
    statusReasonEl.textContent = `(${activeHoursRule?.reason || statusReason})`;

    let countdownMessage = "";
    if (statusOverride === 'auto' && activeHoursRule && activeHoursRule.type !== 'override') {
        let nextEventTimeLuxon = null;
        let eventType = ""; // "close" or "open"
        let contextQualifier = ""; // For "temporarily", "for holiday"

        const ruleOpenTimeStr = activeHoursRule.open;
        const ruleCloseTimeStr = activeHoursRule.close;
        const ruleIsAllDayClosed = activeHoursRule.isClosed;

        if (currentStatus === 'Open' || currentStatus === 'Temporarily Unavailable') {
            eventType = "close";
            if (activeHoursRule.type === 'temporary') contextQualifier = "temporarily ";
            if (activeHoursRule.type === 'holiday') contextQualifier = "for holiday "; // Though 'Open' on holiday is less common for this qualifier

            if (ruleCloseTimeStr) {
                const [h, m] = ruleCloseTimeStr.split(':').map(Number);
                if (!isNaN(h) && !isNaN(m)) {
                    nextEventTimeLuxon = nowInBizTZLuxon.set({ hour: h, minute: m, second: 0, millisecond: 0 });
                    if (nextEventTimeLuxon < nowInBizTZLuxon) nextEventTimeLuxon = null; // Event passed for this rule instance
                }
            }
        } else if (currentStatus === 'Closed') {
            eventType = "open";
            if (activeHoursRule.type === 'temporary') contextQualifier = "temporarily ";
            if (activeHoursRule.type === 'holiday') contextQualifier = "for holiday ";

            if (!ruleIsAllDayClosed && ruleOpenTimeStr) {
                const [h, m] = ruleOpenTimeStr.split(':').map(Number);
                if (!isNaN(h) && !isNaN(m)) {
                    let potentialOpenTime = nowInBizTZLuxon.set({ hour: h, minute: m, second: 0, millisecond: 0 });
                    if (potentialOpenTime < nowInBizTZLuxon) { // Opening time for this rule passed today
                        // If it's a recurring regular day, check next day.
                        // For one-off holiday/temp, if opening time passed, it's done for this rule instance.
                        if (activeHoursRule.type === 'regular') {
                            nextEventTimeLuxon = potentialOpenTime.plus({ days: 1 });
                        } else { // For specific holiday/temp rule, if open time passed today, this rule won't make it open "again" today.
                            nextEventTimeLuxon = null;
                        }
                    } else {
                        nextEventTimeLuxon = potentialOpenTime;
                    }
                }
            } else if (ruleIsAllDayClosed) { // All-day closure by current rule
                countdownMessage = contextQualifier ? `${capitalizeFirstLetter(contextQualifier.trim())} Closed All Day` : "Closed All Day";
                // Finding the *absolute next* opening time after an all-day closure requires looking ahead,
                // which is complex. For now, the "Closed All Day" message with qualifier is the primary countdown.
            }
        }

        if (nextEventTimeLuxon && nextEventTimeLuxon >= nowInBizTZLuxon) {
            const diff = nextEventTimeLuxon.diff(nowInBizTZLuxon, ['hours', 'minutes']);
            const hours = Math.floor(diff.hours);
            const minutes = Math.floor(diff.minutes % 60);

            if (eventType === "close") {
                if (hours > 0) countdownMessage = `Closes ${contextQualifier}in ${hours} hr ${minutes} min`;
                else if (minutes >= 1) countdownMessage = `Closes ${contextQualifier}in ${minutes} min`;
                else countdownMessage = `Closing ${contextQualifier}very soon`;
            } else if (eventType === "open") {
                if (hours > 0) countdownMessage = `Opens ${contextQualifier}in ${hours} hr ${minutes} min`;
                else if (minutes >= 1) countdownMessage = `Opens ${contextQualifier}in ${minutes} min`;
                else countdownMessage = `Opening ${contextQualifier}very soon`;
            }
        } else if (!countdownMessage && currentStatus === 'Closed' && statusOverride === 'auto') {
            // If closed and no specific next event from current rule, or ruleIsAllDayClosed handled above
            if (!activeHoursRule.isClosed || (activeHoursRule.isClosed && activeHoursRule.type === 'regular')) { // if not an explicit all-day holiday/temp closure
                countdownMessage = "Check schedule for next opening";
            }
        }
    } else if (statusOverride !== 'auto') {
        countdownMessage = "Status is manually set";
    }
    statusCountdownTextEl.textContent = countdownMessage;

    // --- REGULAR HOURS DISPLAY ---
    const displayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const visitorLocalDayName = DateTime.now().setZone(visitorTimezone).toFormat('cccc').toLowerCase();
    let displayHoursListHtml = '<ul>';
    displayOrder.forEach(day => {
        const dayData = regularHours[day];
        const isCurrentDayForVisitorDisplay = day === visitorLocalDayName;
        const highlightClass = isCurrentDayForVisitorDisplay ? 'current-day' : '';
        displayHoursListHtml += `<li class="${highlightClass}"><strong>${capitalizeFirstLetter(day)}:</strong> `;
        if (dayData && !dayData.isClosed && dayData.open && dayData.close) {
            const openLocalStr = formatDisplayTimeBI(dayData.open, visitorTimezone);
            const closeLocalStr = formatDisplayTimeBI(dayData.close, visitorTimezone);
            displayHoursListHtml += `<span>${openLocalStr} - ${closeLocalStr}</span>`;
        } else {
            displayHoursListHtml += '<span>Closed</span>';
        }
        displayHoursListHtml += '</li>';
    });
    displayHoursListHtml += '</ul>';
    displayHoursListHtml += `<p class="hours-timezone-note">Hours displayed in your local time zone: ${visitorTimezone.replace(/_/g, ' ')}</p>`;
    if(localBusinessHoursDisplay) localBusinessHoursDisplay.innerHTML = displayHoursListHtml;

    // --- TEMPORARY HOURS DISPLAY (with individual countdowns) ---
    if (localTemporaryHoursDisplay) {
        const relevantTemporaryHours = (temporaryHours || [])
            .filter(t => t.startDate && t.endDate && DateTime.fromISO(t.endDate, { zone: assumedBusinessTimezone }).endOf('day') >= nowInBizTZLuxon.startOf('day'))
            .sort((a, b) => (DateTime.fromISO(a.startDate) > DateTime.fromISO(b.startDate) ? 1 : -1));

        if (relevantTemporaryHours.length > 0) {
            localTemporaryHoursDisplay.className = 'special-hours-list';
            let tempHoursHtml = '<h4>Upcoming/Active Temporary Hours</h4><ul class="special-hours-display">';
            relevantTemporaryHours.forEach(temp => {
                let tempCountdownStr = "";
                const tempStartLuxonDay = DateTime.fromISO(temp.startDate, { zone: assumedBusinessTimezone }).startOf('day');
                const tempEndLuxonDay = DateTime.fromISO(temp.endDate, { zone: assumedBusinessTimezone }).endOf('day');
                const startOfTodayInBiz = nowInBizTZLuxon.startOf('day');

                if (nowInBizTZLuxon >= tempStartLuxonDay && nowInBizTZLuxon <= tempEndLuxonDay) { // Active temp period date-wise
                    if (temp.isClosed) {
                        tempCountdownStr = `Closed (Temporary)`;
                    } else if (temp.open && temp.close) {
                        const tempOpenMinutes = timeStringToMinutes(temp.open);
                        const tempCloseMinutes = timeStringToMinutes(temp.close);
                        if (tempOpenMinutes !== null && tempCloseMinutes !== null) {
                            const tempOpenTimeToday = nowInBizTZLuxon.set({ hour: Math.floor(tempOpenMinutes / 60), minute: tempOpenMinutes % 60, second: 0, millisecond: 0 });
                            const tempCloseTimeToday = nowInBizTZLuxon.set({ hour: Math.floor(tempCloseMinutes / 60), minute: tempCloseMinutes % 60, second: 0, millisecond: 0 });

                            if (nowInBizTZLuxon >= tempOpenTimeToday && nowInBizTZLuxon < tempCloseTimeToday) {
                                const diff = tempCloseTimeToday.diff(nowInBizTZLuxon, ['hours', 'minutes']);
                                const h = Math.floor(diff.hours); const m = Math.floor(diff.minutes % 60);
                                if (h > 0) tempCountdownStr = `Closes (temp.) in ${h} hr ${m} min`;
                                else if (m >= 1) tempCountdownStr = `Closes (temp.) in ${m} min`; else tempCountdownStr = `Closing (temp.) very soon`;
                            } else if (nowInBizTZLuxon < tempOpenTimeToday) {
                                const diff = tempOpenTimeToday.diff(nowInBizTZLuxon, ['hours', 'minutes']);
                                const h = Math.floor(diff.hours); const m = Math.floor(diff.minutes % 60);
                                if (h > 0) tempCountdownStr = `Opens (temp.) in ${h} hr ${m} min`;
                                else if (m >= 1) tempCountdownStr = `Opens (temp.) in ${m} min`; else tempCountdownStr = `Opening (temp.) very soon`;
                            } else { tempCountdownStr = `Closed (temp. hours ended for today)`; }
                        } else {  tempCountdownStr = "Invalid temporary hours timing"; }
                    } else { // Temporary period, but no specific open/close times and not marked as isClosed:true - treat as unspecified.
                        tempCountdownStr = "Temporary schedule active";
                    }
                } else if (nowInBizTZLuxon < tempStartLuxonDay) { // Temp period is in the future
                    const diffInCalendarDays = Math.ceil(tempStartLuxonDay.diff(startOfTodayInBiz, 'days').days);
                    if (diffInCalendarDays >= 2) {
                        tempCountdownStr = `Starts in ${diffInCalendarDays} days`;
                    } else if (diffInCalendarDays === 1) {
                        tempCountdownStr = `Starts tomorrow`;
                    } else if (diffInCalendarDays === 0) { // Starts later today
                        const diffToStartEventHours = tempStartLuxonDay.diff(nowInBizTZLuxon, ['hours', 'minutes']);
                        // Ensure we are comparing to the actual open time if available for "later today"
                        let specificOpenTimeForToday = tempStartLuxonDay; // Defaults to start of day
                        if (temp.open) {
                             const tempOpenMinsToday = timeStringToMinutes(temp.open);
                             if (tempOpenMinsToday !== null) {
                                 specificOpenTimeForToday = nowInBizTZLuxon.set({ hour: Math.floor(tempOpenMinsToday / 60), minute: tempOpenMinsToday % 60, second: 0, millisecond: 0 });
                             }
                        }
                        if (specificOpenTimeForToday > nowInBizTZLuxon) { // If specific open time is still in future
                            const diffToActualOpen = specificOpenTimeForToday.diff(nowInBizTZLuxon, ['hours', 'minutes']);
                            const hours = Math.floor(diffToActualOpen.hours);
                            const minutes = Math.floor(diffToActualOpen.minutes % 60);
                            if (hours > 0) tempCountdownStr = `Starts today in ${hours} hr ${minutes} min`;
                            else if (minutes > 0) tempCountdownStr = `Starts today in ${minutes} min`;
                            else tempCountdownStr = `Starts very soon`;
                        } else { // If specific open time has passed but start of day hasn't, it's an edge case (should be handled by active block)
                             tempCountdownStr = `Starts very soon`;
                        }
                    } else { 
                        tempCountdownStr = `Upcoming`;
                    }
                }
                
                tempHoursHtml += `
                    <li>
                        <div class="hours-container">
                            <strong>${temp.label || 'Temporary Schedule'}</strong>
                            <span class="hours">${temp.isClosed ? 'Closed' : `${formatDisplayTimeBI(temp.open, visitorTimezone) || '?'} - ${formatDisplayTimeBI(temp.close, visitorTimezone) || '?'}`}</span>
                        </div>
                        <span class="dates">${formatDate(temp.startDate)} to ${formatDate(temp.endDate)}</span>
                        <div class="temp-status-countdown-text">${tempCountdownStr}</div>
                    </li>`;
            });
            tempHoursHtml += '</ul>';
            localTemporaryHoursDisplay.innerHTML = tempHoursHtml;
            localTemporaryHoursDisplay.style.display = '';
        } else {
            localTemporaryHoursDisplay.innerHTML = '';
            localTemporaryHoursDisplay.style.display = 'none';
            localTemporaryHoursDisplay.className = '';
        }
    }

    // --- HOLIDAY HOURS DISPLAY ---
    if (localHolidayHoursDisplay) {
        const upcomingHolidayHours = (holidayHours || [])
            .filter(h => h.date && DateTime.fromISO(h.date, { zone: assumedBusinessTimezone }).endOf('day') >= nowInBizTZLuxon.startOf('day'))
            .sort((a, b) => (DateTime.fromISO(a.date) > DateTime.fromISO(b.date) ? 1 : -1));

        if (upcomingHolidayHours.length > 0) {
            localHolidayHoursDisplay.className = 'special-hours-list';
            let holidayHoursHtml = '<h4>Upcoming Holiday Hours</h4><ul class="special-hours-display">';
            upcomingHolidayHours.forEach(holiday => {
                let holidayItemCountdownStr = ""; 
                if (holiday.date === businessDateStr) { // If today IS this holiday
                    if(activeHoursRule && activeHoursRule.type === 'holiday' && activeHoursRule.date === holiday.date) {
                       // The main status countdown already reflects this holiday's specific timing
                       holidayItemCountdownStr = statusCountdownTextEl.textContent || (currentStatus === "Open" ? "Currently Open" : "Currently Closed");
                    } else { 
                        holidayItemCountdownStr = holiday.isClosed ? "Closed Today (Holiday)" : "Special Holiday Hours Today";
                    }
                }
                // You could add logic here for future holidays to say "Holiday in X days" if desired.
                holidayHoursHtml += `
                    <li>
                        <div class="hours-container">
                            <strong>${holiday.label || 'Holiday'}</strong>
                            <span class="hours">${holiday.isClosed ? 'Closed' : `${formatDisplayTimeBI(holiday.open, visitorTimezone) || '?'} - ${formatDisplayTimeBI(holiday.close, visitorTimezone) || '?'}`}</span>
                        </div>
                        <span class="dates">${formatDate(holiday.date)}</span>
                        <div class="holiday-status-countdown-text">${holidayItemCountdownStr}</div>
                    </li>`;
            });
            holidayHoursHtml += '</ul>';
            localHolidayHoursDisplay.innerHTML = holidayHoursHtml;
            localHolidayHoursDisplay.style.display = '';
        } else {
            localHolidayHoursDisplay.innerHTML = '';
            localHolidayHoursDisplay.style.display = 'none';
            localHolidayHoursDisplay.className = '';
        }
    }
    
    if (localContactEmailDisplay) {
        if (businessData.contactEmail) {
            localContactEmailDisplay.innerHTML = `Contact: <a href="mailto:${businessData.contactEmail}">${businessData.contactEmail}</a>`;
        } else {
            localContactEmailDisplay.innerHTML = '';
        }
   }
} // --- END OF calculateAndDisplayStatusConvertedBI ---

// In displayShoutouts.js
// REPLACE your existing initializeHomepageContent function with THIS ENTIRE VERSION:

// --- MASTER INITIALIZATION FUNCTION (Ensure it includes business info refresh) ---
async function initializeHomepageContent() {
    console.log("Initializing homepage content (v_with_biz_refresh_FIXED_SCOPE)..."); // Your version log
    const mainContentWrapper = document.getElementById('main-content-wrapper');
    const maintenanceOverlay = document.getElementById('maintenanceLoadingOverlay');
    const countdownSection = document.querySelector('.countdown-section');
    const usefulLinksSection = document.querySelector('.useful-links-section');
    const bodyElement = document.body;
    const tiktokHeaderContainer = document.getElementById('tiktok-shoutouts');
    const tiktokGridContainer = document.querySelector('#tiktok-shoutouts ~ .creator-grid');
    const tiktokUnavailableMessage = document.querySelector('#tiktok-shoutouts ~ .creator-grid ~ .unavailable-message');
    const instagramGridContainer = document.querySelector('.instagram-creator-grid');
    const youtubeGridContainer = document.querySelector('.youtube-creator-grid');

    if (!firebaseAppInitialized || !db || !profileDocRef) {
        console.error("Firebase not ready or profileDocRef missing. Site cannot load settings.");
        return;
    }

    let siteSettings = {};
    let maintenanceEnabled = false;
    let maintenanceTitle = "Site Under Maintenance";
    let maintenanceMessage = "We are currently performing scheduled maintenance. Please check back later for updates.";
    let hideTikTokSection = false;
    let countdownTargetDate = null; 
    let countdownTitle = null;
    let countdownExpiredMessage = null;

    try {
        console.log("Fetching site settings from site_config/mainProfile...");
        const configSnap = await getDoc(profileDocRef);
        if (configSnap.exists()) {
            siteSettings = configSnap.data() || {};
            maintenanceEnabled = siteSettings.isMaintenanceModeEnabled || false;
            maintenanceTitle = siteSettings.maintenanceTitle || maintenanceTitle;
            maintenanceMessage = siteSettings.maintenanceMessage || maintenanceMessage;
            hideTikTokSection = siteSettings.hideTikTokSection || false;
            countdownTargetDate = siteSettings.countdownTargetDate instanceof Timestamp ? siteSettings.countdownTargetDate : null;
            countdownTitle = siteSettings.countdownTitle;
            countdownExpiredMessage = siteSettings.countdownExpiredMessage;
        } else {
            console.warn("Site settings document ('site_config/mainProfile') not found. Using defaults.");
        }
        console.log("Settings fetched:", { maintenanceEnabled, hideTikTokSection, countdownSet: !!countdownTargetDate });
    } catch (error) {
        console.error("Critical Error fetching site settings:", error);
        return;
    }

    if (maintenanceEnabled) {
        console.log("Maintenance mode ON. Activating overlay...");
        if (maintenanceOverlay) {
            const titleElement = maintenanceOverlay.querySelector('h1');
            const messageElement = maintenanceOverlay.querySelector('p');
            if (titleElement) titleElement.textContent = maintenanceTitle;
            if (messageElement) messageElement.textContent = maintenanceMessage;
            maintenanceOverlay.style.display = 'flex';
            maintenanceOverlay.classList.add('active');
            document.body.classList.add('maintenance-active');
            if (mainContentWrapper) mainContentWrapper.style.display = 'none';
        } else {
            console.error("Maintenance overlay element not found!");
        }
        return; 
    } else {
        console.log("Maintenance mode OFF.");
        if (mainContentWrapper) mainContentWrapper.style.display = '';
        if (maintenanceOverlay) maintenanceOverlay.style.display = 'none';
        bodyElement.classList.remove('maintenance-active');
        
        if (countdownTargetDate && typeof startEventCountdown === 'function') {
            if (countdownSection) countdownSection.style.display = 'block';
            startEventCountdown(countdownTargetDate, countdownTitle, countdownExpiredMessage);
        } else {
            if (countdownSection) countdownSection.style.display = 'none';
            console.log("No valid countdown target date set, or startEventCountdown not found. Countdown section hidden/not started.");
        }

        const oldMaintenanceMessageElement = document.getElementById('maintenanceModeMessage');
        if (oldMaintenanceMessageElement) oldMaintenanceMessageElement.style.display = 'none';
        if (usefulLinksSection) {
            usefulLinksSection.style.display = 'block';
        }

        let isTikTokVisible = false;
        if (!tiktokHeaderContainer || !tiktokGridContainer) {
            console.warn("Could not find TikTok header/grid containers.");
            if (tiktokUnavailableMessage) tiktokUnavailableMessage.style.display = 'none';
        } else {
            if (hideTikTokSection) {
                console.log("Hiding TikTok section.");
                tiktokHeaderContainer.style.display = 'none';
                tiktokGridContainer.style.display = 'none';
                if (tiktokUnavailableMessage) {
                    tiktokUnavailableMessage.innerHTML = '<p>TikTok shoutouts are currently hidden by the site administrator.</p>';
                    tiktokUnavailableMessage.style.display = 'block';
                }
                isTikTokVisible = false;
            } else {
                console.log("Showing TikTok section.");
                tiktokHeaderContainer.style.display = '';
                tiktokGridContainer.style.display = '';
                if (tiktokUnavailableMessage) tiktokUnavailableMessage.style.display = 'none';
                isTikTokVisible = true;
            }
        }

        console.log("Initiating loading of content sections...");

        // ---- INITIAL BUSINESS INFO LOAD + PERIODIC REFRESH SETUP ----
        // businessDocRef should be globally defined after Firebase init
        if (firebaseAppInitialized && typeof displayBusinessInfo === 'function' && db && businessDocRef) {
            await displayBusinessInfo(); 

            if (window.businessInfoRefreshInterval) { 
                clearInterval(window.businessInfoRefreshInterval);
            }
            window.businessInfoRefreshInterval = setInterval(async () => {
                if (document.hidden) return; 
                // console.log("Periodically refreshing business info..."); // For debugging
                await displayBusinessInfo(); 
            }, 60000); 
            console.log("Business info display and periodic refresh initiated.");
        } else {
            console.error("Business info cannot be loaded/refreshed: Firebase not init, displayBusinessInfo missing, or businessDocRef missing.");
            const biContainer = document.getElementById('business-status-display');
            const statusMainTextElLocal = biContainer ? biContainer.querySelector('.status-main-text') : null;
            if(statusMainTextElLocal) {
                 statusMainTextElLocal.textContent = "Info Unavailable";
                 statusMainTextElLocal.className = 'status-main-text status-unavailable';
            } else if (biContainer) {
                biContainer.innerHTML = "<span class='status-unavailable'>Business info could not be loaded.</span>";
            }
        }
        // ---- END BUSINESS INFO LOAD + REFRESH SETUP ----

        const loadPromises = [
            (typeof displayProfileData === 'function' ? displayProfileData(siteSettings) : Promise.resolve(console.warn("displayProfileData not defined"))),
            (typeof displayPresidentData === 'function' ? displayPresidentData() : Promise.resolve(console.warn("displayPresidentData not defined"))),
            (typeof loadShoutoutPlatformData === 'function' && instagramGridContainer ? loadShoutoutPlatformData('instagram', instagramGridContainer, document.getElementById('instagram-last-updated-timestamp')) : Promise.resolve(console.warn("loadShoutoutPlatformData for Instagram not defined or grid missing"))),
            (typeof loadShoutoutPlatformData === 'function' && youtubeGridContainer ? loadShoutoutPlatformData('youtube', youtubeGridContainer, document.getElementById('youtube-last-updated-timestamp')) : Promise.resolve(console.warn("loadShoutoutPlatformData for YouTube not defined or grid missing"))),
            (typeof loadAndDisplayUsefulLinks === 'function' ? loadAndDisplayUsefulLinks() : Promise.resolve(console.warn("loadAndDisplayUsefulLinks not defined"))),
            (typeof loadAndDisplaySocialLinks === 'function' ? loadAndDisplaySocialLinks() : Promise.resolve(console.warn("loadAndDisplaySocialLinks not defined"))),
            (typeof loadAndDisplayDisabilities === 'function' ? loadAndDisplayDisabilities() : Promise.resolve(console.warn("loadAndDisplayDisabilities not defined"))),
            (typeof loadAndDisplayTechItems === 'function' ? loadAndDisplayTechItems() : Promise.resolve(console.warn("loadAndDisplayTechItems not defined"))),
            (typeof loadAndDisplayFaqs === 'function' ? loadAndDisplayFaqs() : Promise.resolve(console.warn("loadAndDisplayFaqs not defined")))
        ];

        if (isTikTokVisible && tiktokGridContainer && typeof loadShoutoutPlatformData === 'function') {
            const tsEl = document.getElementById('tiktok-last-updated-timestamp');
            if (tsEl) {
                loadPromises.push(loadShoutoutPlatformData('tiktok', tiktokGridContainer, tsEl));
            } else {
                console.warn("Could not load TikTok section - timestamp element missing.");
            }
        } else if (isTikTokVisible) {
            console.warn("loadShoutoutPlatformData for TikTok not defined, or tiktokGridContainer missing");
        }

        const results = await Promise.allSettled(loadPromises);
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`Error loading a content section (index ${index}):`, result.reason);
            }
        });
        console.log("All other dynamic content loading initiated/completed.");
    }
} // --- End of initializeHomepageContent function ---

// --- Call the main initialization function when the DOM is ready ---
// (Ensure this line is correct and ONLY PRESENT ONCE at the end of your script)
document.addEventListener('DOMContentLoaded', initializeHomepageContent);
