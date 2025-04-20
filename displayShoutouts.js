// displayShoutouts.js (Fixed Selectors + Configurable Countdown + All Sections - Full Code)

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
let profileDocRef; // Holds main site config (profile, status, maintenance, tiktok hide, countdown)
let presidentDocRef;
let usefulLinksCollectionRef;
let socialLinksCollectionRef;
let disabilitiesCollectionRef;
let techItemsCollectionRef;
let shoutoutsMetaRef; // Assumes 'siteConfig' is a top-level collection for this doc path
let faqsCollectionRef;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    // Assign references
    profileDocRef = doc(db, "site_config", "mainProfile"); // <<< Central config doc
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

// --- Helper Function to Format Timestamps ---
function formatFirestoreTimestamp(firestoreTimestamp) {
    if (!firestoreTimestamp || !(firestoreTimestamp instanceof Timestamp)) { return 'N/A'; }
    try {
        const date = firestoreTimestamp.toDate();
        const locale = navigator.language || 'en-US';
        return date.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
    } catch (error) { console.error("Error formatting timestamp:", error); return 'Invalid Date'; }
}

// --- Functions to Render Cards (Shoutouts, Tech, FAQs) ---
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
    const channelUrl = username !== 'N/A' ? `https://www.youtube.com/${encodeURIComponent(safeUsername)}` : '#';
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
        attachFaqAccordionListeners(); // Attach listeners AFTER content is added
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

/** Attaches accordion functionality using event delegation */
function attachFaqAccordionListeners() {
    const container = document.getElementById('faq-container-dynamic');
    if (!container) { console.error("FAQ Accordion Error: Container #faq-container-dynamic not found for listeners."); return; }

    console.log("Attaching FAQ accordion listeners...");
    if (container.dataset.faqListenersAttached === 'true') {
        console.log("FAQ listeners already attached, skipping.");
        return;
    }
    container.dataset.faqListenersAttached = 'true';

    container.addEventListener('click', (event) => {
        const questionButton = event.target.closest('.faq-question');
        if (!questionButton) return;
        const faqItem = questionButton.closest('.faq-item');
        if (!faqItem) return;
        const answer = faqItem.querySelector('.faq-answer');
        if (!answer) return;
        const icon = questionButton.querySelector('.faq-icon');
        const isActive = faqItem.classList.contains('active');

        if (isActive) {
            faqItem.classList.remove('active');
            answer.style.maxHeight = null;
            if (icon) icon.textContent = '+';
        } else {
            faqItem.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + "px";
             if (icon) icon.textContent = '-';
        }
    });
    console.log("FAQ accordion listeners attached.");
}

// Handles Shoutout Platforms display
async function loadShoutoutPlatformData(platform, gridElement, timestampElement) {
    if (!firebaseAppInitialized || !db) { console.error(`Shoutout load error (${platform}): Firebase not ready.`); if(gridElement) gridElement.innerHTML = `<p class="error">Error loading ${platform} creators (DB Init).</p>`; return; }
    // Changed check: Now just warns if gridElement is missing, doesn't try to write to it.
    if (!gridElement) {
        console.warn(`Grid element missing for ${platform}. Cannot display shoutouts.`);
        return; // Exit if grid element isn't found
    }

    console.log(`Loading ${platform} shoutout data into:`, gridElement); // Log the element found
    gridElement.innerHTML = `<p>Loading ${platform} Creators...</p>`; // Show loading IN the grid
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


// --- ***** Countdown Timer Logic (v7 - Handles Custom/Default Expiry Message) ***** ---
// This version ACCEPTS 3 arguments and DISPLAYS the message
function startEventCountdown(targetTimestamp, countdownTitle, expiredMessageOverride) { // <<< ACCEPTS 3 ARGUMENTS
    const countdownSection = document.querySelector('.countdown-section');
    if (!countdownSection) { console.warn("Countdown section element missing."); return; }

    const titleElement = countdownSection.querySelector('h2');
    const yearsElement = document.getElementById('countdown-years');
    const monthsElement = document.getElementById('countdown-months');
    const daysElement = document.getElementById('countdown-days');
    const hoursElement = document.getElementById('countdown-hours');
    const minutesElement = document.getElementById('countdown-minutes');
    const secondsElement = document.getElementById('countdown-seconds');
    const countdownContainer = countdownSection.querySelector('.countdown-container');

    // Check elements needed for running state first
    if (!titleElement || !yearsElement || !monthsElement || !daysElement || !hoursElement || !minutesElement || !secondsElement || !countdownContainer) {
        console.warn("Initial countdown display elements missing (title, units, or container).");
    }

    let targetDateMillis;
    let targetDateObj;
    if (targetTimestamp && targetTimestamp instanceof Timestamp) {
        try {
            targetDateObj = targetTimestamp.toDate();
            targetDateMillis = targetDateObj.getTime();
        } catch (e) { console.error("Error converting Timestamp:", e); targetDateMillis = null; }
    } else {
        if (targetTimestamp) { console.warn("Received countdownTargetDate but it's not a Timestamp:", targetTimestamp); }
        targetDateMillis = null;
    }

    const displayTitle = countdownTitle || "Countdown";

    if (!targetDateMillis || !targetDateObj) {
        console.warn(`Invalid/missing countdown target date for "${displayTitle}". Hiding section.`);
        countdownSection.style.display = 'none';
        return;
    }

    const yearsFront = yearsElement?.querySelector('.flip-clock-front');
    const monthsFront = monthsElement?.querySelector('.flip-clock-front');
    const daysFront = daysElement?.querySelector('.flip-clock-front');
    const hoursFront = hoursElement?.querySelector('.flip-clock-front');
    const minutesFront = minutesElement?.querySelector('.flip-clock-front');
    const secondsFront = secondsElement?.querySelector('.flip-clock-front');

    if (titleElement) titleElement.textContent = displayTitle;
    console.log(`Initializing countdown timer for: "${displayTitle}"`);

    function updateDisplay(y, mo, d, h, m, s) {
        if(yearsFront) yearsFront.textContent = String(y).padStart(2, '0');
        if(monthsFront) monthsFront.textContent = String(mo).padStart(2, '0');
        if(daysFront) daysFront.textContent = String(d).padStart(2, '0');
        if(hoursFront) hoursFront.textContent = String(h).padStart(2, '0');
        if(minutesFront) minutesFront.textContent = String(m).padStart(2, '0');
        if(secondsFront) secondsFront.textContent = String(s).padStart(2, '0');
    }

    function daysInMonth(month, year) { return new Date(year, month + 1, 0).getDate(); }

    let intervalId = null;

    // --- Function to display the CUSTOM or DEFAULT "Expired" state ---
    function showExpiredState() {
        console.log(`Countdown for "${displayTitle}" finished.`);
        const defaultExpiredMsg = `${displayTitle || 'The event'} has started!`;
        // Use the custom message from Firestore if provided, otherwise use the default
        const messageText = expiredMessageOverride || defaultExpiredMsg; // <<< Uses the passed message

        if (countdownSection) {
             // Replace content: Keep original title H2, add the message P below.
             countdownSection.innerHTML = `
                 <h2>${displayTitle}</h2>  <p class="countdown-expired-message" style="font-size: 1.1em; line-height: 1.6; margin: 15px 0;">
                     ${messageText.replace(/\n/g, '<br>')} </p>
                 <div style="font-size: 1.5em; color: var(--text-color);">🎉🏁</div> `;
             countdownSection.style.display = 'block';
        }
    }

    function calculateAndUpdate() {
        if (!yearsFront || !monthsFront || !daysFront || !hoursFront || !minutesFront || !secondsFront ) {
             console.warn("Countdown inner display elements missing during update. Stopping timer.");
             if (intervalId) clearInterval(intervalId);
             return false;
         }
        const now = new Date();
        const target = targetDateObj;
        const distance = target.getTime() - now.getTime();

        if (distance < 0) { // Check if expired
            if (intervalId) clearInterval(intervalId);
            showExpiredState(); // <<< CALL FUNCTION TO SHOW MESSAGE
            return false;
        }

        // Calculate time components if not expired
        const seconds = Math.floor((distance / 1000) % 60);
        const minutes = Math.floor((distance / 1000 / 60) % 60);
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        let years = target.getFullYear() - now.getFullYear();
        let months = target.getMonth() - now.getMonth();
        let days = target.getDate() - now.getDate();
        // Borrowing Logic
        if (days < 0) { months--; days += new Date(target.getFullYear(), target.getMonth(), 0).getDate(); }
        if (months < 0) { years--; months += 12; }
        years = Math.max(0, years); months = Math.max(0, months); days = Math.max(0, days);

        updateDisplay(years, months, days, hours, minutes, seconds);
        if(countdownContainer) countdownContainer.style.display = '';
        return true;
    }

    // Initial Setup & Interval
    if (!calculateAndUpdate()) {
        console.log("Countdown expired on initial load."); // showExpiredState was called inside
    } else {
        intervalId = setInterval(calculateAndUpdate, 1000);
        console.log("Countdown interval started.");
    }
}
// --- ***** END: Countdown Timer Logic (v7) ***** ---


// --- MASTER INITIALIZATION FUNCTION ---
async function initializeHomepageContent() {
    console.log("Initializing homepage content...");

    const mainContentWrapper = document.querySelector('.container');
    const maintenanceMessageElement = document.getElementById('maintenanceModeMessage');
    const countdownSection = document.querySelector('.countdown-section');

    // --- SELECTORS UPDATED TO MATCH YOUR HTML ---
    const tiktokHeaderContainer = document.getElementById('tiktok-shoutouts');
    // Selects the div with class 'creator-grid' immediately following the header
    const tiktokGridContainer = document.querySelector('#tiktok-shoutouts + .creator-grid');
    // Selects the div with class 'unavailable-message' immediately following the grid container
    const tiktokUnavailableMessage = document.querySelector('#tiktok-shoutouts + .creator-grid + .unavailable-message');
    // Selects the div using its class name
    const instagramGridContainer = document.querySelector('.instagram-creator-grid');
    // Selects the div using its class name
    const youtubeGridContainer = document.querySelector('.youtube-creator-grid');
    // --- END SELECTOR UPDATES ---


    // Safety check for Firebase
    if (!firebaseAppInitialized || !db || !profileDocRef) {
         console.error("Firebase not ready or profileDocRef missing. Site cannot load settings.");
         if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = '<p class="error">Site configuration error. Please try again later.</p>'; maintenanceMessageElement.style.display = 'block'; }
         if (mainContentWrapper) mainContentWrapper.style.display = 'none';
         if (countdownSection) countdownSection.style.display = 'none';
         return;
    }

    // Fetch Central Site Configuration from 'site_config/mainProfile'
    let siteSettings = {};
    let maintenanceEnabled = false;
    let hideTikTokSection = false;
    let countdownTargetDate = null;
    let countdownTitle = null;

    try {
        console.log("Fetching site settings from site_config/mainProfile...");
        const configSnap = await getDoc(profileDocRef);

        if (configSnap.exists()) {
            siteSettings = configSnap.data() || {};
            maintenanceEnabled = siteSettings.isMaintenanceModeEnabled || false;
            hideTikTokSection = siteSettings.hideTikTokSection || false;
            countdownTargetDate = siteSettings.countdownTargetDate; // Expecting Firestore Timestamp
            countdownTitle = siteSettings.countdownTitle;           // Expecting String
        } else {
            console.warn("Site settings document ('site_config/mainProfile') not found. Using defaults.");
        }
        console.log("Settings fetched:", { maintenanceEnabled, hideTikTokSection, countdownTitle, countdownTargetDate: countdownTargetDate ? 'Exists' : 'Missing' });

    } catch (error) {
        console.error("Critical Error fetching site settings:", error);
        if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = `<p class="error">An error occurred loading site configuration: ${error.message}.</p>`; maintenanceMessageElement.style.display = 'block'; }
        if (mainContentWrapper) mainContentWrapper.style.display = 'none';
        if (countdownSection) countdownSection.style.display = 'none';
        return;
    }

    // Apply Maintenance Mode
    if (maintenanceEnabled) {
        console.log("Maintenance mode is ON. Hiding main content and countdown.");
        if (mainContentWrapper) mainContentWrapper.style.display = 'none';
        if (countdownSection) countdownSection.style.display = 'none';
        if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = '<p>The site is currently undergoing maintenance. Please check back later.</p>'; maintenanceMessageElement.style.display = 'block'; }
        return;
    } else {
        console.log("Maintenance mode is OFF. Proceeding with content display...");
        if (mainContentWrapper) mainContentWrapper.style.display = '';
        if (countdownSection) countdownSection.style.display = ''; // Show section initially (function hides if data invalid)
        if (maintenanceMessageElement) maintenanceMessageElement.style.display = 'none';
    }

    // Start Countdown (using fetched config)
    startEventCountdown(countdownTargetDate, countdownTitle);

    // Apply TikTok Visibility Logic using the corrected selectors
    // Check if BOTH header and grid were found using the NEW selectors
    if (!tiktokHeaderContainer || !tiktokGridContainer) {
         console.warn("Could not find TikTok header (#tiktok-shoutouts) and/or grid container (#tiktok-shoutouts + .creator-grid) to apply visibility logic.");
         if (tiktokUnavailableMessage) tiktokUnavailableMessage.style.display = 'none'; // Hide message if structure is wrong
    } else {
        // Elements found, proceed with logic
        if (hideTikTokSection) {
            console.log("Hiding TikTok section based on settings.");
            tiktokHeaderContainer.style.display = 'none';
            tiktokGridContainer.style.display = 'none';
            if (tiktokUnavailableMessage) {
                tiktokUnavailableMessage.innerHTML = '<p style="margin:0; padding: 15px; text-align: center;"><strong>Notice:</strong> Due to current regulations in the United States, TikTok content is unavailable at this time.</p>';
                tiktokUnavailableMessage.style.display = 'block';
            } else { console.warn("TikTok unavailable message element (#tiktok-shoutouts + .creator-grid + .unavailable-message) not found."); } // Updated selector check
        } else {
            console.log("Showing TikTok section based on settings.");
            tiktokHeaderContainer.style.display = '';
            tiktokGridContainer.style.display = ''; // Assuming default display is suitable
            if (tiktokUnavailableMessage) {
                tiktokUnavailableMessage.style.display = 'none';
                tiktokUnavailableMessage.innerHTML = '';
            }
            const timestampElement = tiktokHeaderContainer.querySelector('#tiktok-last-updated-timestamp');
            loadShoutoutPlatformData('tiktok', tiktokGridContainer, timestampElement); // Pass the correctly selected grid container
        }
    }


    // Load ALL OTHER Content Sections using corrected selectors where applicable
    console.log("Initiating loading of other content sections...");

    displayProfileData(siteSettings); // Call profile display with already fetched data

    // Pass the correctly selected grid containers to loadShoutoutPlatformData
    const otherLoadPromises = [
        displayPresidentData(),
        // These calls should now find the elements using the class selectors
        loadShoutoutPlatformData('instagram', instagramGridContainer, document.getElementById('instagram-last-updated-timestamp')),
        loadShoutoutPlatformData('youtube', youtubeGridContainer, document.getElementById('youtube-last-updated-timestamp')),
        loadAndDisplayUsefulLinks(),
        loadAndDisplaySocialLinks(),
        loadAndDisplayDisabilities(),
        loadAndDisplayTechItems(),
        loadAndDisplayFaqs()
    ];

    const otherResults = await Promise.allSettled(otherLoadPromises);
    otherResults.forEach((result, index) => {
        const functionNames = ["President", "Instagram Shoutouts", "YouTube Shoutouts", "UsefulLinks", "SocialLinks", "Disabilities", "TechItems", "FAQs"];
        if (result.status === 'rejected') {
            console.error(`Error loading ${functionNames[index] || 'Unknown Section'}:`, result.reason);
        }
    });
    console.log("Other dynamic content loading initiated.");
}


// --- Call the main initialization function when the DOM is ready ---
document.addEventListener('DOMContentLoaded', initializeHomepageContent);
