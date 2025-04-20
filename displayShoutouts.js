// displayShoutouts.js (Version includes Hide TikTok Logic + All Other Sections)

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
import { getFirestore, collection, getDocs, doc, getDoc, Timestamp, orderBy, query } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// --- Initialize Firebase ---
let db;
let firebaseAppInitialized = false;
// Declare references in module scope (will be assigned after init)
let profileDocRef;
let presidentDocRef;
let usefulLinksCollectionRef;
let socialLinksCollectionRef;
let disabilitiesCollectionRef;
let techItemsCollectionRef;
let shoutoutsMetaRef;
let faqsCollectionRef;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    // Assign references now that db is initialized
    profileDocRef = doc(db, "site_config", "mainProfile");
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
    console.error("Firebase initialization failed on index.html:", error);
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
        // Use US English locale as a fallback, attempt user's locale first
        const locale = navigator.language || 'en-US';
        return date.toLocaleString(locale, {
            dateStyle: 'medium', timeStyle: 'short'
        });
    } catch (error) { console.error("Error formatting timestamp:", error); return 'Invalid Date'; }
}

// --- Functions to Render Shoutout Cards ---
function renderTikTokCard(account) { const profilePic = account.profilePic || 'images/default-profile.jpg'; const username = account.username || 'N/A'; const nickname = account.nickname || 'N/A'; const bio = account.bio || ''; const followers = account.followers || 'N/A'; const isVerified = account.isVerified || false; const profileUrl = username !== 'N/A' ? `https://tiktok.com/@${encodeURIComponent(username)}` : '#'; const verifiedBadge = isVerified ? '<img src="check.png" alt="Verified" class="verified-badge">' : ''; return `<div class="creator-card"><img src="${profilePic}" alt="@${username}" class="creator-pic" onerror="this.src='images/default-profile.jpg'"><div class="creator-info"><div class="creator-header"><h3>${nickname} ${verifiedBadge}</h3></div> <p class="creator-username">@${username}</p> <p class="creator-bio">${bio}</p> <p class="follower-count">${followers} Followers</p> <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="visit-profile"> Visit Profile </a></div></div>`;}
function renderInstagramCard(account) { const profilePic = account.profilePic || 'images/default-profile.jpg'; const username = account.username || 'N/A'; const nickname = account.nickname || 'N/A'; const bio = account.bio || ''; const followers = account.followers || 'N/A'; const isVerified = account.isVerified || false; const profileUrl = username !== 'N/A' ? `https://instagram.com/${encodeURIComponent(username)}` : '#'; const verifiedBadge = isVerified ? '<img src="instagramcheck.png" alt="Verified" class="instagram-verified-badge">' : ''; return `<div class="instagram-creator-card"><img src="${profilePic}" alt="${nickname}" class="instagram-creator-pic" onerror="this.src='images/default-profile.jpg'"><div class="instagram-creator-info"><div class="instagram-creator-header"><h3>${nickname} ${verifiedBadge}</h3></div> <p class="instagram-creator-username">@${username}</p> <p class="instagram-creator-bio">${bio}</p> <p class="instagram-follower-count">${followers} Followers</p> <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="instagram-visit-profile"> Visit Profile </a></div></div>`;}
function renderYouTubeCard(account) { const profilePic = account.profilePic || 'images/default-profile.jpg'; const username = account.username || 'N/A'; const nickname = account.nickname || 'N/A'; const bio = account.bio || ''; const subscribers = account.subscribers || 'N/A'; const coverPhoto = account.coverPhoto || null; const isVerified = account.isVerified || false; let safeUsername = username; if (username !== 'N/A' && !username.startsWith('@')) { safeUsername = `@${username}`; } const channelUrl = username !== 'N/A' ? `https://youtube.com/${encodeURIComponent(safeUsername)}` : '#'; const verifiedBadge = isVerified ? '<img src="youtubecheck.png" alt="Verified" class="youtube-verified-badge">' : ''; return `<div class="youtube-creator-card"> ${coverPhoto ? `<img src="${coverPhoto}" alt="${nickname} Cover Photo" class="youtube-cover-photo" onerror="this.style.display='none'">` : ''} <img src="${profilePic}" alt="@${username}" class="youtube-creator-pic" onerror="this.src='images/default-profile.jpg'"><div class="youtube-creator-info"><div class="youtube-creator-header"><h3>${nickname} ${verifiedBadge}</h3></div> <div class="username-container"><p class="youtube-creator-username">@${username}</p></div> <p class="youtube-creator-bio">${bio}</p> <p class="youtube-subscriber-count">${subscribers} Subscribers</p> <a href="${channelUrl}" target="_blank" rel="noopener noreferrer" class="youtube-visit-profile"> Visit Channel </a></div></div>`;}

// --- Function to Render Tech Item Card ---
function renderTechItemHomepage(itemData) { const name = itemData.name || 'Unnamed Device'; const model = itemData.model || ''; const iconClass = itemData.iconClass || 'fas fa-question-circle'; const material = itemData.material || ''; const storage = itemData.storage || ''; const batteryCapacity = itemData.batteryCapacity || ''; const color = itemData.color || ''; const price = itemData.price ? `$${itemData.price}` : ''; const dateReleased = itemData.dateReleased || ''; const dateBought = itemData.dateBought || ''; const osVersion = itemData.osVersion || ''; const batteryHealth = itemData.batteryHealth !== null && !isNaN(itemData.batteryHealth) ? parseInt(itemData.batteryHealth, 10) : null; const batteryCycles = itemData.batteryCycles !== null && !isNaN(itemData.batteryCycles) ? itemData.batteryCycles : null; let batteryHtml = ''; if (batteryHealth !== null) { let batteryClass = ''; if (batteryHealth <= 20) batteryClass = 'critical'; else if (batteryHealth <= 50) batteryClass = 'low-power'; batteryHtml = `<div class="tech-detail"><i class="fas fa-heart"></i><span>Battery Health:</span></div><div class="battery-container"><div class="battery-icon ${batteryClass}"><div class="battery-level" style="width: ${batteryHealth}%;"></div><div class="battery-percentage">${batteryHealth}%</div></div></div>`; } let cyclesHtml = ''; if (batteryCycles !== null) { cyclesHtml = `<div class="tech-detail"><i class="fas fa-sync"></i><span>Battery Charge Cycles:</span> ${batteryCycles}</div>`; } return `<div class="tech-item"><h3><i class="${iconClass}"></i> ${name}</h3> ${model ? `<div class="tech-detail"><i class="fas fa-info-circle"></i><span>Model:</span> ${model}</div>` : ''} ${material ? `<div class="tech-detail"><i class="fas fa-layer-group"></i><span>Material:</span> ${material}</div>` : ''} ${storage ? `<div class="tech-detail"><i class="fas fa-hdd"></i><span>Storage:</span> ${storage}</div>` : ''} ${batteryCapacity ? `<div class="tech-detail"><i class="fas fa-battery-full"></i><span>Battery Capacity:</span> ${batteryCapacity}</div>` : ''} ${color ? `<div class="tech-detail"><i class="fas fa-palette"></i><span>Color:</span> ${color}</div>` : ''} ${price ? `<div class="tech-detail"><i class="fas fa-tag"></i><span>Price:</span> ${price}</div>` : ''} ${dateReleased ? `<div class="tech-detail"><i class="fas fa-calendar-plus"></i><span>Date Released:</span> ${dateReleased}</div>` : ''} ${dateBought ? `<div class="tech-detail"><i class="fas fa-shopping-cart"></i><span>Date Bought:</span> ${dateBought}</div>` : ''} ${osVersion ? `<div class="tech-detail"><i class="fab fa-apple"></i><span>OS Version:</span> ${osVersion}</div>` : ''} ${batteryHtml} ${cyclesHtml} </div>`;}

/** Generates HTML for a single FAQ item for the homepage */
function renderFaqItemHomepage(faqData) { const question = faqData.question || 'No Question'; const answerHtml = faqData.answer || '<p>No Answer Provided.</p>'; return `<div class="faq-item"><button class="faq-question">${question}<span class="faq-icon">+</span></button><div class="faq-answer">${answerHtml}</div></div>`;}

// --- Data Loading and Display Functions ---

async function displayProfileData() {
    const profileUsernameElement = document.getElementById('profile-username-main');
    const profilePicElement = document.getElementById('profile-pic-main');
    const profileBioElement = document.getElementById('profile-bio-main');
    const profileStatusElement = document.getElementById('profile-status-main');
    const defaultUsername = "Username"; const defaultBio = ""; const defaultProfilePic = "images/default-profile.jpg"; const defaultStatusEmoji = '❓'; const statusEmojis = { online: '🟢', idle: '🟡', offline: '⚪️', dnd: '🔴' };
    if (!profileUsernameElement || !profilePicElement || !profileBioElement || !profileStatusElement) { console.warn("Profile display elements missing."); }
    if (!firebaseAppInitialized || !db || !profileDocRef) { console.error("Profile Fetch Error: Firebase not ready/ref missing."); if(profileBioElement) profileBioElement.textContent = "Error loading profile."; if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername; if (profilePicElement) profilePicElement.src = defaultProfilePic; if (profileStatusElement) profileStatusElement.textContent = defaultStatusEmoji; return; }
    try { const docSnap = await getDoc(profileDocRef); if (docSnap.exists()) { const data = docSnap.data(); if (profileUsernameElement) profileUsernameElement.textContent = data.username || defaultUsername; if (profilePicElement) profilePicElement.src = data.profilePicUrl || defaultProfilePic; if (profileBioElement) profileBioElement.textContent = data.bio || defaultBio; if (profileStatusElement) { const statusKey = data.status || 'offline'; profileStatusElement.textContent = statusEmojis[statusKey] || defaultStatusEmoji; } } else { console.warn(`Profile document missing.`); if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername; if (profilePicElement) profilePicElement.src = defaultProfilePic; if (profileBioElement) profileBioElement.textContent = defaultBio; if (profileStatusElement) profileStatusElement.textContent = statusEmojis['offline']; } } catch (error) { console.error("Error fetching profile:", error); if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername; if (profilePicElement) profilePicElement.src = defaultProfilePic; if (profileBioElement) profileBioElement.textContent = "Error loading bio."; if (profileStatusElement) profileStatusElement.textContent = '❓'; }
}

async function displayPresidentData() {
    const placeholderElement = document.getElementById('president-placeholder');
    if (!placeholderElement) { console.warn("President placeholder missing."); return; }
    placeholderElement.innerHTML = '<p style="text-align: center; padding: 20px;">Loading president info...</p>';
    if (!firebaseAppInitialized || !db) { console.error("President display error: Firebase not ready."); placeholderElement.innerHTML = '<p class="error">Could not load (DB Init Error).</p>'; return; } if (!presidentDocRef) { console.error("President display error: presidentDocRef missing."); placeholderElement.innerHTML = '<p class="error">Could not load (Config Error).</p>'; return; }
    try { const docSnap = await getDoc(presidentDocRef); if (docSnap.exists()) { const data = docSnap.data(); const presidentHTML = `<section id="current-president" class="president-section"><h2 class="section-title">Current U.S. President</h2><div class="president-info"><img src="${data.imageUrl || 'images/default-president.jpg'}" alt="President ${data.name || 'N/A'}" class="president-photo" onerror="this.src='images/default-president.jpg'; this.alt='Photo Missing';"><div class="president-details"><h3 class="president-name">${data.name || 'N/A'}</h3><p><strong>Born:</strong> ${data.born || 'N/A'}</p><p><strong>Height:</strong> ${data.height || 'N/A'}</p><p><strong>Party:</strong> ${data.party || 'N/A'}</p><p class="presidential-term"><strong>Term:</strong> ${data.term || 'N/A'}</p><p><strong>VP:</strong> ${data.vp || 'N/A'}</p></div></div></section>`; placeholderElement.innerHTML = presidentHTML; } else { console.warn(`President document missing.`); placeholderElement.innerHTML = '<p style="text-align: center; padding: 20px;">President info unavailable.</p>'; } } catch (error) { console.error("Error fetching president data:", error); placeholderElement.innerHTML = `<p class="error">Error loading president info: ${error.message}</p>`; }
}

async function loadAndDisplayUsefulLinks() {
    const containerElement = document.querySelector('.useful-links-section .links-container');
    if (!firebaseAppInitialized || !db) { console.error("Useful Links load error: Firebase not ready."); if(containerElement) containerElement.innerHTML = '<p class="error">Error loading links.</p>'; return; } if (!containerElement) { console.warn("Useful links container missing."); return; } if(!usefulLinksCollectionRef) { console.error("Useful Links load error: Collection reference missing."); containerElement.innerHTML = '<p class="error">Config error.</p>'; return;}
    containerElement.innerHTML = '<p>Loading links...</p>';
    try { const linkQuery = query(usefulLinksCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(linkQuery); containerElement.innerHTML = ''; if (querySnapshot.empty) { containerElement.innerHTML = '<p>No useful links available.</p>'; } else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.label && data.url) { const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.textContent = data.label; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; linkElement.className = 'link-button'; containerElement.appendChild(linkElement); } else { console.warn("Skipping useful link:", doc.id); } }); } console.log(`Displayed ${querySnapshot.size} useful links.`);
    } catch (error) { console.error("Error loading useful links:", error); containerElement.innerHTML = '<p class="error">Could not load links.</p>'; }
}

async function loadAndDisplaySocialLinks() {
    const containerElement = document.querySelector('.social-links-container');
    if (!firebaseAppInitialized || !db) { console.error("Social Links load error: Firebase not ready."); if (containerElement) containerElement.innerHTML = '<p class="error">Error loading socials.</p>'; return; } if (!containerElement) { console.warn("Social links container missing."); return; } if (!socialLinksCollectionRef) { console.error("Social Links load error: Collection reference missing."); containerElement.innerHTML = '<p class="error">Config error.</p>'; return;}
    containerElement.innerHTML = '<p>Loading socials...</p>';
    try { const linkQuery = query(socialLinksCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(linkQuery); containerElement.innerHTML = ''; if (querySnapshot.empty) { containerElement.innerHTML = '<p>No social links available.</p>'; } else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.label && data.url) { const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; linkElement.className = 'social-button'; /* If you add iconClass later: if (data.iconClass) { const iconElement = document.createElement('i'); iconElement.className = data.iconClass + ' social-icon'; linkElement.appendChild(iconElement); } */ const textElement = document.createElement('span'); textElement.textContent = data.label; linkElement.appendChild(textElement); containerElement.appendChild(linkElement); } else { console.warn("Skipping social link:", doc.id); } }); } console.log(`Displayed ${querySnapshot.size} social links.`);
    } catch (error) { console.error("Error loading social links:", error); containerElement.innerHTML = '<p class="error">Could not load socials.</p>'; }
}

async function loadAndDisplayDisabilities() {
    const placeholderElement = document.getElementById('disabilities-list-placeholder');
    if (!placeholderElement) { console.warn("Disabilities placeholder missing."); return; }
    placeholderElement.innerHTML = '<li>Loading...</li>';
    if (!firebaseAppInitialized || !db) { console.error("Disabilities load error: Firebase not ready."); placeholderElement.innerHTML = '<li>Error (DB Init Error).</li>'; return; } if (!disabilitiesCollectionRef) { console.error("Disabilities load error: Collection ref missing."); placeholderElement.innerHTML = '<li>Error (Config Error).</li>'; return; }
    try { const disabilityQuery = query(disabilitiesCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(disabilityQuery); placeholderElement.innerHTML = ''; if (querySnapshot.empty) { placeholderElement.innerHTML = '<li>No specific information available.</li>'; } else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.name && data.url) { const listItem = document.createElement('li'); const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.textContent = data.name; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; listItem.appendChild(linkElement); placeholderElement.appendChild(listItem); } else { console.warn("Skipping disability item:", doc.id); } }); } console.log(`Displayed ${querySnapshot.size} disability links.`); } catch (error) { console.error("Error loading disabilities:", error); if (error.code === 'failed-precondition') { placeholderElement.innerHTML = '<li>Error: DB config needed.</li>'; console.error("Missing Firestore index for disabilities (order)."); } else { placeholderElement.innerHTML = '<li>Could not load list.</li>'; } }
}

async function loadAndDisplayTechItems() {
    const techItemsListContainer = document.getElementById('tech-items-list-dynamic');
    if (!firebaseAppInitialized || !db || !techItemsCollectionRef) { console.error("Tech Item Load Error: Firebase not ready or collection ref missing."); if (techItemsListContainer) techItemsListContainer.innerHTML = '<p class="error">Error loading tech data (DB connection).</p>'; return; } if (!techItemsListContainer) { console.error("Tech Item Load Error: Container element #tech-items-list-dynamic not found in HTML."); return; }
    console.log("Fetching tech items for homepage...");
    techItemsListContainer.innerHTML = '<p>Loading Tech Info...</p>'; // Loading message
    try { const techQuery = query(techItemsCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(techQuery); let allItemsHtml = ''; if (querySnapshot.empty) { console.log("No tech items found in Firestore."); allItemsHtml = '<p>No tech items to display currently.</p>'; } else { console.log(`Found ${querySnapshot.size} tech items.`); querySnapshot.forEach((doc) => { allItemsHtml += renderTechItemHomepage(doc.data()); }); } techItemsListContainer.innerHTML = allItemsHtml; console.log("Tech items list updated on homepage."); } catch (error) { console.error("Error loading/displaying tech items:", error); let errorMsg = "Could not load tech information at this time."; if (error.code === 'failed-precondition') { errorMsg = "Error: DB config needed for tech items (order)."; console.error("Missing Firestore index for tech_items (order)."); } else { errorMsg = `Could not load tech information: ${error.message}`; } techItemsListContainer.innerHTML = `<p class="error">${errorMsg}</p>`; }
}

async function loadAndDisplayFaqs() {
    const faqContainer = document.getElementById('faq-container-dynamic');
    if (!firebaseAppInitialized || !db || !faqsCollectionRef) { console.error("FAQ Load Error: Firebase not ready or collection ref missing."); if (faqContainer) faqContainer.innerHTML = '<p class="error">Error loading FAQs (DB connection).</p>'; return; } if (!faqContainer) { console.error("FAQ Load Error: Container element #faq-container-dynamic not found in HTML."); return; }
    console.log("Fetching FAQs for homepage...");
    faqContainer.innerHTML = '<p>Loading FAQs...</p>'; // Loading message
    try { const faqQuery = query(faqsCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(faqQuery); let allItemsHtml = ''; if (querySnapshot.empty) { console.log("No FAQs found in Firestore."); allItemsHtml = '<p>No frequently asked questions available yet.</p>'; } else { console.log(`Found ${querySnapshot.size} FAQs.`); querySnapshot.forEach((doc) => { allItemsHtml += renderFaqItemHomepage(doc.data()); }); } faqContainer.innerHTML = allItemsHtml; attachFaqAccordionListeners(); console.log("FAQ list updated on homepage."); } catch (error) { console.error("Error loading/displaying FAQs:", error); let errorMsg = "Could not load FAQs at this time."; if (error.code === 'failed-precondition') errorMsg = "Error: DB config needed for FAQs (order)."; faqContainer.innerHTML = `<p class="error">${errorMsg}</p>`; }
}

/** Attaches accordion functionality using event delegation */
function attachFaqAccordionListeners() {
    const container = document.getElementById('faq-container-dynamic');
    if (!container) { console.error("FAQ Accordion Error: Container not found."); return; }
    console.log("Attaching FAQ accordion listeners...");
    // --- Check if listener already attached to prevent duplicates ---
    if (container.dataset.faqListenersAttached === 'true') {
        console.log("FAQ listeners already attached, skipping.");
        return;
    }
    container.dataset.faqListenersAttached = 'true'; // Mark as attached
    // ----------------------------------------------------------
    container.addEventListener('click', (event) => { const questionButton = event.target.closest('.faq-question'); if (!questionButton) return; const faqItem = questionButton.closest('.faq-item'); if (!faqItem) return; const answer = faqItem.querySelector('.faq-answer'); const isActive = faqItem.classList.contains('active'); const allItems = container.querySelectorAll('.faq-item'); allItems.forEach(otherItem => { if (otherItem !== faqItem && otherItem.classList.contains('active')) { otherItem.classList.remove('active'); const otherAnswer = otherItem.querySelector('.faq-answer'); if (otherAnswer) otherAnswer.style.maxHeight = null; } }); if (isActive) { faqItem.classList.remove('active'); if (answer) answer.style.maxHeight = null; } else { faqItem.classList.add('active'); if (answer) answer.style.maxHeight = answer.scrollHeight + "px"; } }); console.log("FAQ accordion listeners attached.");
}


// --- Specific Shoutout Loading Function (Called by initializeHomepageContent) ---
// This function now only loads the actual shoutout data for visible sections
async function loadShoutoutPlatformData(platform, gridElement, timestampElement) {
    if (!firebaseAppInitialized || !db) { console.error(`Shoutout load error (${platform}): Firebase not ready.`); return; }
    if (!gridElement) { console.warn(`Grid element missing for ${platform}.`); return; }

    console.log(`Loading ${platform} shoutout data...`);
    gridElement.innerHTML = `<p>Loading ${platform} Creators...</p>`;
    if (timestampElement) timestampElement.textContent = 'Last Updated: Loading...';

    let renderFunction;
    switch(platform) {
        case 'tiktok': renderFunction = renderTikTokCard; break;
        case 'instagram': renderFunction = renderInstagramCard; break;
        case 'youtube': renderFunction = renderYouTubeCard; break;
        default: console.error(`Unknown platform ${platform}`); return;
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

        // Fetch and update timestamp
        if (timestampElement && shoutoutsMetaRef) {
            try {
                const metaSnap = await getDoc(shoutoutsMetaRef);
                if (metaSnap.exists()) {
                    timestampElement.textContent = `Last Updated: ${formatFirestoreTimestamp(metaSnap.data()?.[`lastUpdatedTime_${platform}`])}`;
                } else {
                     if(timestampElement) timestampElement.textContent = 'Last Updated: N/A';
                }
            } catch (e) {
                console.warn(`Could not fetch timestamp for ${platform}:`, e);
                 if(timestampElement) timestampElement.textContent = 'Last Updated: Error';
            }
        }
        console.log(`${platform} shoutouts displayed.`);

    } catch (error) {
        console.error(`Error loading ${platform} shoutout data:`, error);
        gridElement.innerHTML = `<p class="error">Error loading ${platform} creators.</p>`;
         if (timestampElement) timestampElement.textContent = 'Last Updated: Error';
    }
}


// --- NEW MASTER INITIALIZATION FUNCTION ---
async function initializeHomepageContent() {
    console.log("Initializing homepage content visibility...");

    // Get references early
    const mainContentWrapper = document.querySelector('.container'); // Used for maintenance mode
    const maintenanceMessageElement = document.getElementById('maintenanceModeMessage'); // Used for maintenance mode

    // References based on user's provided HTML structure for TikTok section
    const tiktokHeaderContainer = document.getElementById('tiktok-shoutouts');       // Div with H2 and timestamp
    const tiktokGridContainer = document.querySelector('.shoutouts-section .creator-grid'); // Grid for cards (Make selector more specific if needed)
    const tiktokUnavailableMessage = document.querySelector('.shoutouts-section .unavailable-message'); // Message div

    // Safety check for Firebase before proceeding
    if (!firebaseAppInitialized || !db || !profileDocRef) {
         console.error("Firebase not ready or profileDocRef missing. Site cannot load settings.");
         if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = '<p class="error">Site configuration error. Please try again later.</p>'; maintenanceMessageElement.style.display = 'block'; }
         if (mainContentWrapper) mainContentWrapper.style.display = 'none'; // Hide main content on critical error
         return;
     }

    // Fetch site settings (Maintenance and TikTok Visibility)
    let maintenanceEnabled = false;
    let hideTikTokSection = false;

    try {
        console.log("Fetching site settings...");
        const configSnap = await getDoc(profileDocRef);

        if (configSnap.exists()) {
            const settingsData = configSnap.data();
            maintenanceEnabled = settingsData?.isMaintenanceModeEnabled || false;
            hideTikTokSection = settingsData?.hideTikTokSection || false;
        } else {
            console.warn("Site settings document ('site_config/mainProfile') not found. Using defaults.");
            // Defaults are already false
        }
        console.log("Maintenance mode active:", maintenanceEnabled);
        console.log("Hide TikTok Section setting:", hideTikTokSection);

    } catch (error) {
        console.error("Critical Error fetching site settings:", error);
        // Display a general error and stop loading content
        if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = `<p class="error">An error occurred loading site configuration: ${error.message}.</p>`; maintenanceMessageElement.style.display = 'block'; }
        if (mainContentWrapper) mainContentWrapper.style.display = 'none';
        return;
    }

    // --- Apply Maintenance Mode First ---
    if (maintenanceEnabled) {
        console.log("Maintenance mode is ON. Hiding main content.");
        if (mainContentWrapper) { mainContentWrapper.style.display = 'none'; }
        if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = '<p>The site is currently undergoing maintenance. Please check back later.</p>'; maintenanceMessageElement.style.display = 'block'; }
        return; // Stop further execution
    } else {
        // --- Maintenance Mode is OFF ---
        console.log("Maintenance mode is OFF. Proceeding with content display...");
        if (mainContentWrapper) { mainContentWrapper.style.display = ''; } // Ensure main content visible
        if (maintenanceMessageElement) { maintenanceMessageElement.style.display = 'none'; }
    }

    // --- Apply TikTok Visibility Logic ---
    if (tiktokHeaderContainer && tiktokGridContainer) { // Check if TikTok elements exist
        if (hideTikTokSection) {
            // HIDE TikTok Section, SHOW Message
            console.log("Hiding TikTok section and showing unavailable message.");
            tiktokHeaderContainer.style.display = 'none';
            tiktokGridContainer.style.display = 'none';
            if (tiktokUnavailableMessage) {
                tiktokUnavailableMessage.innerHTML = '<p style="margin:0; padding: 15px; text-align: center;"><strong>Notice:</strong> Due to current regulations in the United States, TikTok content is unavailable at this time.</p>';
                tiktokUnavailableMessage.style.display = 'block';
            }
        } else {
            // SHOW TikTok Section, HIDE Message
            console.log("Showing TikTok section and hiding unavailable message.");
            tiktokHeaderContainer.style.display = ''; // Show header
            tiktokGridContainer.style.display = '';   // Show grid (CSS default)
            if (tiktokUnavailableMessage) {
                tiktokUnavailableMessage.style.display = 'none'; // Hide message
                tiktokUnavailableMessage.innerHTML = ''; // Clear message content
            }
            // *** Trigger loading ONLY TikTok data now ***
            const timestampElement = tiktokHeaderContainer.querySelector('#tiktok-last-updated-timestamp');
            loadShoutoutPlatformData('tiktok', tiktokGridContainer, timestampElement);
        }
    } else {
        console.warn("Could not find TikTok header or grid containers to apply visibility logic.");
        // Ensure message is hidden if containers are missing
         if (tiktokUnavailableMessage) tiktokUnavailableMessage.style.display = 'none';
    }

    // --- Load ALL OTHER Content Sections ---
    // Use Promise.allSettled for remaining sections for parallelism and error isolation
    console.log("Initiating loading of other content sections...");
    const otherLoadPromises = [
        displayProfileData(), // Uses global refs now
        displayPresidentData(), // Uses global refs now
        loadShoutoutPlatformData('instagram', document.querySelector('.instagram-creator-grid'), document.getElementById('instagram-last-updated-timestamp')), // Load Instagram
        loadShoutoutPlatformData('youtube', document.querySelector('.youtube-creator-grid'), document.getElementById('youtube-last-updated-timestamp')), // Load YouTube
        loadAndDisplayUsefulLinks(), // Uses global refs now
        loadAndDisplaySocialLinks(), // Uses global refs now
        loadAndDisplayDisabilities(), // Uses global refs now
        loadAndDisplayTechItems(), // Uses global refs now
        loadAndDisplayFaqs() // Uses global refs now
    ];

    const otherResults = await Promise.allSettled(otherLoadPromises);
    otherResults.forEach((result, index) => {
        const functionNames = ["Profile", "President", "Instagram Shoutouts", "YouTube Shoutouts", "UsefulLinks", "SocialLinks", "Disabilities", "TechItems", "FAQs"];
        if (result.status === 'rejected') {
            console.error(`Error loading ${functionNames[index] || 'Unknown Section'}:`, result.reason);
        }
    });
    console.log("Other dynamic content loading initiated.");
}


// --- Call the main initialization function when the DOM is ready ---
document.addEventListener('DOMContentLoaded', initializeHomepageContent);
