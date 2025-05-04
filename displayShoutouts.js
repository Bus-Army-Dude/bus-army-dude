// displayShoutouts.js (MODIFIED - Handles index.html AND status.html - Fixed Limit Import)

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyCIZ0fri5V1E2si1xXpBPQQJqj1F_KuuG0", // Use your actual API key
    authDomain: "busarmydudewebsite.firebaseapp.com",
    projectId: "busarmydudewebsite",
    storageBucket: "busarmydudewebsite.firebasestorage.app",
    messagingSenderId: "42980404680",
    appId: "1:42980404680:web:f4f1e54789902a4295e4fd",
    measurementId: "G-DQPH8YL789" // Optional
};

// --- Firebase Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    Timestamp,
    orderBy,
    query,
    where,
    limit // <<< CORRECTED: Added limit function import
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// --- Firebase Initialization ---
let db;
let firebaseAppInitialized = false;

// --- Firestore References (Declare all needed references) ---
let profileDocRef;
let presidentDocRef;
let usefulLinksCollectionRef;
let socialLinksCollectionRef;
let disabilitiesCollectionRef;
let techItemsCollectionRef;
let shoutoutsMetaRef;
let faqsCollectionRef;
let businessDocRef;
let componentsCollectionRef; // <<< FOR STATUS PAGE
let incidentsCollectionRef;  // <<< FOR STATUS PAGE

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);

    // Assign references for index.html content
    profileDocRef = doc(db, "site_config", "mainProfile");
    businessDocRef = doc(db, "site_config", "businessDetails");
    presidentDocRef = doc(db, "site_config", "currentPresident");
    usefulLinksCollectionRef = collection(db, "useful_links");
    socialLinksCollectionRef = collection(db, "social_links");
    disabilitiesCollectionRef = collection(db, "disabilities");
    techItemsCollectionRef = collection(db, "tech_items");
    shoutoutsMetaRef = doc(db, 'siteConfig', 'shoutoutsMetadata');
    faqsCollectionRef = collection(db, "faqs");

    // Assign references for status.html content
    componentsCollectionRef = collection(db, "status_components");
    incidentsCollectionRef = collection(db, "status_incidents");

    firebaseAppInitialized = true;
    console.log("Firebase initialized for display (handling index.html & status.html).");
} catch (error) {
    console.error("Firebase initialization failed:", error);
    // Display error on the page if possible
    try {
        document.body.innerHTML = '<p class="error" style="text-align: center; padding: 50px; color: red; font-size: 1.2em;">Could not connect to required services. Please try again later.</p>';
    } catch (e) { /* Ignore if body isn't ready */ }
    firebaseAppInitialized = false;
}

// --- Helper Functions ---

/**
 * Formats a Firestore Timestamp into a readable string.
 * @param {Timestamp} firestoreTimestamp - The Firestore Timestamp object.
 * @returns {string} Formatted date/time string or 'N/A'.
 */
function formatTimestamp(firestoreTimestamp) {
    // Check if it's a valid Firestore Timestamp object
    if (!firestoreTimestamp || typeof firestoreTimestamp.toDate !== 'function') {
        // Optionally check if it's already a Date object (e.g., from older data)
        if (firestoreTimestamp instanceof Date) {
             // Format the existing Date object
             try {
                 return firestoreTimestamp.toLocaleString(navigator.language || 'en-US', {
                     year: 'numeric', month: 'short', day: 'numeric',
                     hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
                 });
             } catch (error) {
                 console.error("Error formatting existing Date:", error);
                 return 'Invalid Date';
             }
        }
        // If it's neither a Timestamp nor a Date, return 'N/A'
        return 'N/A';
    }
    // If it is a Firestore Timestamp, convert and format
    try {
        const date = firestoreTimestamp.toDate();
        return date.toLocaleString(navigator.language || 'en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
        });
    } catch (error) {
        console.error("Error formatting Firestore Timestamp:", error);
        return 'Invalid Date';
    }
}


/**
 * Converts a status string (e.g., "Operational") into a CSS class name.
 * Used for both component and incident statuses.
 * @param {string} status - The status string.
 * @returns {string} CSS class name (e.g., "status-operational").
 */
function getStatusClass(status) {
    if (!status) return 'status-unknown';
    // Convert to lowercase and replace spaces with hyphens for CSS
    return `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
}


// --- Functions to Render index.html Cards ---
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
              <img src="${profilePic}" alt="@${username}" class="creator-pic" onerror="this.onerror=null; this.src='images/default-profile.jpg';">
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
              <img src="${profilePic}" alt="${nickname}" class="instagram-creator-pic" onerror="this.onerror=null; this.src='images/default-profile.jpg';">
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
    const username = account.username || 'N/A'; // YouTube handle
    const nickname = account.nickname || 'N/A'; // Channel name
    const bio = account.bio || '';
    const subscribers = account.subscribers || 'N/A';
    const coverPhoto = account.coverPhoto || null;
    const isVerified = account.isVerified || false;
    let safeUsername = username;
    if (username !== 'N/A' && !username.startsWith('@')) { safeUsername = `@${username}`; }
    const channelUrl = username !== 'N/A' ? `https://www.youtube.com/${encodeURIComponent(safeUsername)}` : '#'; // Corrected URL
    const verifiedBadge = isVerified ? '<img src="youtubecheck.png" alt="Verified" class="youtube-verified-badge">' : '';
    return `<div class="youtube-creator-card">
              ${coverPhoto ? `<img src="${coverPhoto}" alt="${nickname} Cover Photo" class="youtube-cover-photo" onerror="this.style.display='none'">` : ''}
              <img src="${profilePic}" alt="${nickname}" class="youtube-creator-pic" onerror="this.onerror=null; this.src='images/default-profile.jpg';">
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
    const name = itemData.name || 'Unnamed Device'; const model = itemData.model || '';
    const iconClass = itemData.iconClass || 'fas fa-question-circle'; const material = itemData.material || '';
    const storage = itemData.storage || ''; const batteryCapacity = itemData.batteryCapacity || '';
    const color = itemData.color || ''; const price = itemData.price ? `$${itemData.price}` : '';
    const dateReleased = itemData.dateReleased || ''; const dateBought = itemData.dateBought || '';
    const osVersion = itemData.osVersion || '';
    const batteryHealth = itemData.batteryHealth !== null && !isNaN(itemData.batteryHealth) ? parseInt(itemData.batteryHealth, 10) : null;
    const batteryCycles = itemData.batteryCycles !== null && !isNaN(itemData.batteryCycles) ? itemData.batteryCycles : null;
    let batteryHtml = ''; if (batteryHealth !== null) { let batteryClass = ''; if (batteryHealth <= 20) batteryClass = 'critical'; else if (batteryHealth <= 50) batteryClass = 'low-power'; const displayHealth = Math.min(batteryHealth, 100); batteryHtml = `<div class="tech-detail"><i class="fas fa-heart"></i><span>Battery Health:</span></div><div class="battery-container"><div class="battery-icon ${batteryClass}"><div class="battery-level" style="width: ${displayHealth}%;"></div><div class="battery-percentage">${batteryHealth}%</div></div></div>`; }
    let cyclesHtml = ''; if (batteryCycles !== null) { cyclesHtml = `<div class="tech-detail"><i class="fas fa-sync"></i><span>Battery Charge Cycles:</span> ${batteryCycles}</div>`; }
    return `<div class="tech-item"><h3><i class="${iconClass}"></i> ${name}</h3> ${model ? `<div class="tech-detail"><i class="fas fa-info-circle"></i><span>Model:</span> ${model}</div>` : ''} ${material ? `<div class="tech-detail"><i class="fas fa-layer-group"></i><span>Material:</span> ${material}</div>` : ''} ${storage ? `<div class="tech-detail"><i class="fas fa-hdd"></i><span>Storage:</span> ${storage}</div>` : ''} ${batteryCapacity ? `<div class="tech-detail"><i class="fas fa-battery-full"></i><span>Battery Capacity:</span> ${batteryCapacity}</div>` : ''} ${color ? `<div class="tech-detail"><i class="fas fa-palette"></i><span>Color:</span> ${color}</div>` : ''} ${price ? `<div class="tech-detail"><i class="fas fa-tag"></i><span>Price:</span> ${price}</div>` : ''} ${dateReleased ? `<div class="tech-detail"><i class="fas fa-calendar-plus"></i><span>Date Released:</span> ${dateReleased}</div>` : ''} ${dateBought ? `<div class="tech-detail"><i class="fas fa-shopping-cart"></i><span>Date Bought:</span> ${dateBought}</div>` : ''} ${osVersion ? `<div class="tech-detail"><i class="fab fa-apple"></i><span>OS Version:</span> ${osVersion}</div>` : ''} ${batteryHtml} ${cyclesHtml}</div>`;
}
function renderFaqItemHomepage(faqData) {
    const question = faqData.question || 'No Question Provided';
    const answerHtml = faqData.answer ? (faqData.answer.includes('<') ? faqData.answer : `<p>${faqData.answer}</p>`) : '<p>No Answer Provided.</p>';
    return `<div class="faq-item"><button class="faq-question">${question}<span class="faq-icon">+</span></button><div class="faq-answer">${answerHtml}</div></div>`;
}

// --- Data Loading and Display Functions for index.html ---
async function displayProfileData(profileData) {
    const profileUsernameElement = document.getElementById('profile-username-main'); const profilePicElement = document.getElementById('profile-pic-main'); const profileBioElement = document.getElementById('profile-bio-main'); const profileStatusElement = document.getElementById('profile-status-main'); const defaultUsername = "Username"; const defaultBio = ""; const defaultProfilePic = "images/default-profile.jpg"; const defaultStatusEmoji = '❓'; const statusEmojis = { online: '🟢', idle: '🟡', offline: '⚪️', dnd: '🔴' }; if (!profileUsernameElement || !profilePicElement || !profileBioElement || !profileStatusElement) { console.warn("Profile display elements missing."); return; } if (!profileData) { console.warn("Profile data not provided. Using defaults."); profileUsernameElement.textContent = defaultUsername; profilePicElement.src = defaultProfilePic; profileBioElement.textContent = defaultBio; profileStatusElement.textContent = statusEmojis['offline']; return; } profileUsernameElement.textContent = profileData.username || defaultUsername; profilePicElement.src = profileData.profilePicUrl || defaultProfilePic; profileBioElement.textContent = profileData.bio || defaultBio; const statusKey = profileData.status || 'offline'; profileStatusElement.textContent = statusEmojis[statusKey] || defaultStatusEmoji; console.log("Profile section updated.");
}
async function displayPresidentData() {
    const placeholderElement = document.getElementById('president-placeholder'); if (!placeholderElement) { console.warn("President placeholder missing."); return; } placeholderElement.innerHTML = '<p>Loading president info...</p>'; if (!firebaseAppInitialized || !db || !presidentDocRef) { console.error("President display error."); placeholderElement.innerHTML = '<p class="error">Could not load.</p>'; return; } try { const docSnap = await getDoc(presidentDocRef); if (docSnap.exists()) { const data = docSnap.data(); const presidentHTML = `<section id="current-president" class="president-section"><h2 class="section-title">Current U.S. President</h2><div class="president-info"><img src="${data.imageUrl || 'images/default-president.jpg'}" alt="President ${data.name || 'N/A'}" class="president-photo" onerror="this.onerror=null; this.src='images/default-president.jpg'; this.alt='Photo Missing';"><div class="president-details"><h3 class="president-name">${data.name || 'N/A'}</h3><p><strong>Born:</strong> ${data.born || 'N/A'}</p><p><strong>Height:</strong> ${data.height || 'N/A'}</p><p><strong>Party:</strong> ${data.party || 'N/A'}</p><p class="presidential-term"><strong>Term:</strong> ${data.term || 'N/A'}</p><p><strong>VP:</strong> ${data.vp || 'N/A'}</p></div></div></section>`; placeholderElement.innerHTML = presidentHTML; console.log("President section updated."); } else { console.warn(`President document missing.`); placeholderElement.innerHTML = '<p>President info unavailable.</p>'; } } catch (error) { console.error("Error fetching president data:", error); placeholderElement.innerHTML = `<p class="error">Error loading president info.</p>`; }
}
async function loadAndDisplayUsefulLinks() {
    const containerElement = document.querySelector('.useful-links-section .links-container'); if (!containerElement) return; if (!firebaseAppInitialized || !db || !usefulLinksCollectionRef) { containerElement.innerHTML = '<p class="error">Error loading links.</p>'; return; } containerElement.innerHTML = '<p>Loading links...</p>'; try { const linkQuery = query(usefulLinksCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(linkQuery); containerElement.innerHTML = ''; if (querySnapshot.empty) { containerElement.innerHTML = '<p>No useful links available.</p>'; } else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.label && data.url) { const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.textContent = data.label; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; linkElement.className = 'link-button'; containerElement.appendChild(linkElement); } }); } console.log(`Displayed ${querySnapshot.size} useful links.`); } catch (error) { console.error("Error loading useful links:", error); containerElement.innerHTML = `<p class="error">Could not load useful links.</p>`; }
}
async function loadAndDisplaySocialLinks() {
    const containerElement = document.querySelector('.social-links-container'); if (!containerElement) return; if (!firebaseAppInitialized || !db || !socialLinksCollectionRef) { containerElement.innerHTML = '<p class="error">Error loading socials.</p>'; return; } containerElement.innerHTML = '<p>Loading socials...</p>'; try { const linkQuery = query(socialLinksCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(linkQuery); containerElement.innerHTML = ''; if (querySnapshot.empty) { containerElement.innerHTML = '<p>No social links available.</p>'; } else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.label && data.url) { const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; linkElement.className = 'social-button'; if (data.iconClass) { const iconElement = document.createElement('i'); iconElement.className = data.iconClass + ' social-icon'; linkElement.appendChild(iconElement); } const textElement = document.createElement('span'); textElement.textContent = data.label; linkElement.appendChild(textElement); containerElement.appendChild(linkElement); } }); } console.log(`Displayed ${querySnapshot.size} social links.`); } catch (error) { console.error("Error loading social links:", error); containerElement.innerHTML = `<p class="error">Could not load social links.</p>`; }
}
async function loadAndDisplayDisabilities() {
    const placeholderElement = document.getElementById('disabilities-list-placeholder'); if (!placeholderElement) return; placeholderElement.innerHTML = '<li>Loading...</li>'; if (!firebaseAppInitialized || !db || !disabilitiesCollectionRef) { placeholderElement.innerHTML = '<li>Error loading.</li>'; return; } try { const disabilityQuery = query(disabilitiesCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(disabilityQuery); placeholderElement.innerHTML = ''; if (querySnapshot.empty) { placeholderElement.innerHTML = '<li>No info available.</li>'; } else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.name && data.url) { const listItem = document.createElement('li'); const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.textContent = data.name; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; listItem.appendChild(linkElement); placeholderElement.appendChild(listItem); } }); } console.log(`Displayed ${querySnapshot.size} disability links.`); } catch (error) { console.error("Error loading disabilities:", error); placeholderElement.innerHTML = `<li>Error loading list.</li>`; }
}
async function loadAndDisplayTechItems() {
    const techItemsListContainer = document.getElementById('tech-items-list-dynamic'); if (!techItemsListContainer) return; if (!firebaseAppInitialized || !db || !techItemsCollectionRef) { techItemsListContainer.innerHTML = '<p class="error">Error loading tech data.</p>'; return; } console.log("Fetching tech items..."); techItemsListContainer.innerHTML = '<p>Loading Tech Info...</p>'; try { const techQuery = query(techItemsCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(techQuery); let allItemsHtml = ''; if (querySnapshot.empty) { allItemsHtml = '<p>No tech items to display.</p>'; } else { querySnapshot.forEach((doc) => { allItemsHtml += renderTechItemHomepage(doc.data()); }); } techItemsListContainer.innerHTML = allItemsHtml; console.log("Tech items list updated."); } catch (error) { console.error("Error loading tech items:", error); techItemsListContainer.innerHTML = `<p class="error">Could not load tech information.</p>`; }
}
async function loadAndDisplayFaqs() {
    const faqContainer = document.getElementById('faq-container-dynamic'); if (!faqContainer) return; if (!firebaseAppInitialized || !db || !faqsCollectionRef) { faqContainer.innerHTML = '<p class="error">Error loading FAQs.</p>'; return; } console.log("Fetching FAQs..."); faqContainer.innerHTML = '<p>Loading FAQs...</p>'; try { const faqQuery = query(faqsCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(faqQuery); let allItemsHtml = ''; if (querySnapshot.empty) { allItemsHtml = '<p>No FAQs available yet.</p>'; } else { querySnapshot.forEach((doc) => { allItemsHtml += renderFaqItemHomepage(doc.data()); }); } faqContainer.innerHTML = allItemsHtml; attachFaqAccordionListeners(); console.log("FAQ list updated."); } catch (error) { console.error("Error loading FAQs:", error); faqContainer.innerHTML = `<p class="error">Could not load FAQs.</p>`; }
}
function attachFaqAccordionListeners() {
    const container = document.getElementById('faq-container-dynamic'); if (!container) return; console.log("Attaching FAQ listeners..."); if (container.dataset.faqListenersAttached === 'true') return; container.dataset.faqListenersAttached = 'true'; const allFaqItems = container.querySelectorAll('.faq-item'); container.addEventListener('click', (event) => { const questionButton = event.target.closest('.faq-question'); if (!questionButton) return; const clickedFaqItem = questionButton.closest('.faq-item'); if (!clickedFaqItem) return; const answer = clickedFaqItem.querySelector('.faq-answer'); if (!answer) return; const icon = questionButton.querySelector('.faq-icon'); const wasActive = clickedFaqItem.classList.contains('active'); allFaqItems.forEach(item => { if (item !== clickedFaqItem && item.classList.contains('active')) { item.classList.remove('active'); const otherAnswer = item.querySelector('.faq-answer'); const otherIcon = item.querySelector('.faq-icon'); if (otherAnswer) otherAnswer.style.maxHeight = null; if (otherIcon) otherIcon.textContent = '+'; } }); if (wasActive) { clickedFaqItem.classList.remove('active'); answer.style.maxHeight = null; if (icon) icon.textContent = '+'; } else { clickedFaqItem.classList.add('active'); answer.style.maxHeight = answer.scrollHeight + "px"; if (icon) icon.textContent = '-'; } }); console.log("FAQ listeners attached.");
}
async function loadShoutoutPlatformData(platform, gridElement, timestampElement) {
    if (!firebaseAppInitialized || !db) { if(gridElement) gridElement.innerHTML = `<p class="error">Error (DB Init).</p>`; return; } if (!gridElement) return; console.log(`Loading ${platform} shoutouts...`); gridElement.innerHTML = `<p>Loading ${platform} Creators...</p>`; if (timestampElement) timestampElement.textContent = 'Last Updated: Loading...'; let renderFunction; switch(platform) { case 'tiktok': renderFunction = renderTikTokCard; break; case 'instagram': renderFunction = renderInstagramCard; break; case 'youtube': renderFunction = renderYouTubeCard; break; default: gridElement.innerHTML = `<p class="error">Config error.</p>`; return; } try { const shoutoutsCol = collection(db, 'shoutouts'); const shoutoutQuery = query(shoutoutsCol, where("platform", "==", platform), orderBy("order", "asc")); const querySnapshot = await getDocs(shoutoutQuery); if (querySnapshot.empty) { gridElement.innerHTML = `<p>No ${platform} creators featured.</p>`; } else { gridElement.innerHTML = querySnapshot.docs.map(doc => renderFunction(doc.data())).join(''); } if (timestampElement && shoutoutsMetaRef) { try { const metaSnap = await getDoc(shoutoutsMetaRef); if (metaSnap.exists()) { const tsField = `lastUpdatedTime_${platform}`; timestampElement.textContent = `Last Updated: ${formatTimestamp(metaSnap.data()?.[tsField])}`; } else { if(timestampElement) timestampElement.textContent = 'Last Updated: N/A'; } } catch (e) { if(timestampElement) timestampElement.textContent = 'Last Updated: Error'; } } else if (timestampElement) { timestampElement.textContent = 'Last Updated: N/A'; } console.log(`${platform} shoutouts displayed.`); } catch (error) { console.error(`Error loading ${platform} data:`, error); gridElement.innerHTML = `<p class="error">Error loading ${platform}.</p>`; if (timestampElement) timestampElement.textContent = 'Last Updated: Error'; if (error.code === 'failed-precondition') { gridElement.innerHTML += `<br><small>Error: Missing DB index.</small>`; } }
}
function startEventCountdown(targetTimestamp, countdownTitle, expiredMessageOverride) {
    const countdownSection = document.querySelector('.countdown-section'); if (!countdownSection) return; const titleElement = countdownSection.querySelector('h2'); const yearsElement = document.getElementById('countdown-years'); const monthsElement = document.getElementById('countdown-months'); const daysElement = document.getElementById('countdown-days'); const hoursElement = document.getElementById('countdown-hours'); const minutesElement = document.getElementById('countdown-minutes'); const secondsElement = document.getElementById('countdown-seconds'); const countdownContainer = countdownSection.querySelector('.countdown-container'); if (!titleElement || !yearsElement || !monthsElement || !daysElement || !hoursElement || !minutesElement || !secondsElement || !countdownContainer) { console.warn("Countdown elements missing."); } let targetDateMillis; let targetDateObj; if (targetTimestamp && targetTimestamp instanceof Timestamp) { try { targetDateObj = targetTimestamp.toDate(); targetDateMillis = targetDateObj.getTime(); } catch (e) { targetDateMillis = null; } } else { targetDateMillis = null; } const displayTitle = countdownTitle || "Countdown"; if (!targetDateMillis || !targetDateObj) { countdownSection.style.display = 'none'; return; } const yearsFront = yearsElement?.querySelector('.flip-clock-front'); const monthsFront = monthsElement?.querySelector('.flip-clock-front'); const daysFront = daysElement?.querySelector('.flip-clock-front'); const hoursFront = hoursElement?.querySelector('.flip-clock-front'); const minutesFront = minutesElement?.querySelector('.flip-clock-front'); const secondsFront = secondsElement?.querySelector('.flip-clock-front'); if (titleElement) titleElement.textContent = displayTitle; console.log(`Initializing countdown: "${displayTitle}"`); function updateDisplay(y, mo, d, h, m, s) { if(yearsFront) yearsFront.textContent = String(y).padStart(2, '0'); if(monthsFront) monthsFront.textContent = String(mo).padStart(2, '0'); if(daysFront) daysFront.textContent = String(d).padStart(2, '0'); if(hoursFront) hoursFront.textContent = String(h).padStart(2, '0'); if(minutesFront) minutesFront.textContent = String(m).padStart(2, '0'); if(secondsFront) secondsFront.textContent = String(s).padStart(2, '0'); } let intervalId = null; function showExpiredState() { const defaultExpiredMsg = `${displayTitle || 'The event'} has started!`; const messageText = expiredMessageOverride || defaultExpiredMsg; if (countdownSection) { countdownSection.innerHTML = `<h2>${displayTitle}</h2><p class="countdown-expired-message">${messageText.replace(/\n/g, '<br>')}</p><div style="font-size: 1.5em;">🎉🏁</div>`; countdownSection.style.display = 'block'; } } function calculateAndUpdate() { if (!yearsFront || !monthsFront || !daysFront || !hoursFront || !minutesFront || !secondsFront ) { if (intervalId) clearInterval(intervalId); return false; } const now = new Date(); const target = targetDateObj; const distance = target.getTime() - now.getTime(); if (distance < 0) { if (intervalId) clearInterval(intervalId); showExpiredState(); return false; } const seconds = Math.floor((distance / 1000) % 60); const minutes = Math.floor((distance / 1000 / 60) % 60); const hours = Math.floor((distance / (1000 * 60 * 60)) % 24); let years = target.getFullYear() - now.getFullYear(); let months = target.getMonth() - now.getMonth(); let days = target.getDate() - now.getDate(); if (days < 0) { months--; days += new Date(target.getFullYear(), target.getMonth(), 0).getDate(); } if (months < 0) { years--; months += 12; } years = Math.max(0, years); months = Math.max(0, months); days = Math.max(0, days); updateDisplay(years, months, days, hours, minutes, seconds); if(countdownContainer) countdownContainer.style.display = ''; return true; } if (!calculateAndUpdate()) { console.log("Countdown expired on initial load."); } else { intervalId = setInterval(calculateAndUpdate, 1000); console.log("Countdown interval started."); }
}
function capitalizeFirstLetter(string) { if (!string) return ''; return string.charAt(0).toUpperCase() + string.slice(1); }
function timeStringToMinutes(timeStr) { if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) return null; try { const [hours, minutes] = timeStr.split(':').map(Number); if (isNaN(hours) || isNaN(minutes)) return null; return hours * 60 + minutes; } catch (e) { return null; } }
function formatDisplayTimeBI(timeString, visitorTimezone) { if (typeof luxon === 'undefined' || !luxon.DateTime) { const [h, m] = timeString.split(':'); const hourNum = parseInt(h, 10); if (isNaN(hourNum) || isNaN(parseInt(m, 10))) return 'Invalid'; const ampm = hourNum >= 12 ? 'PM' : 'AM'; const hour12 = hourNum % 12 || 12; return `${hour12}:${String(m).padStart(2, '0')} ${ampm} ET (Lib Err)`; } const { DateTime } = luxon; const businessTimezone = 'America/New_York'; if (!timeString || typeof timeString !== 'string' || !timeString.includes(':')) return '?'; try { const [hour, minute] = timeString.split(':').map(Number); if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) { throw new Error("Invalid HH:MM format"); } const nowInBizTZ = DateTime.now().setZone(businessTimezone); const bizTime = nowInBizTZ.set({ hour, minute, second: 0, millisecond: 0 }); const visitorTime = bizTime.setZone(visitorTimezone); return visitorTime.toFormat('h:mm a ZZZZ'); } catch (e) { const [h, m] = timeString.split(':'); const hourNum = parseInt(h,10); if (isNaN(hourNum) || isNaN(parseInt(m, 10))) return 'Invalid Time'; const ampm = hourNum >= 12 ? 'PM' : 'AM'; const hour12 = hourNum % 12 || 12; return `${hour12}:${String(m).padStart(2, '0')} ${ampm} ET (LXN Err)`; } }
async function displayBusinessInfo() { const contactEmailDisplay = document.getElementById('contact-email-display'); const businessHoursDisplay = document.getElementById('business-hours-display'); const businessStatusDisplay = document.getElementById('business-status-display'); const temporaryHoursDisplay = document.getElementById('temporary-hours-display'); const holidayHoursDisplay = document.getElementById('holiday-hours-display'); if (!contactEmailDisplay || !businessHoursDisplay || !businessStatusDisplay || !temporaryHoursDisplay || !holidayHoursDisplay) return; if (!firebaseAppInitialized || !db || !businessDocRef) { if(businessStatusDisplay) businessStatusDisplay.textContent = 'Status: Error (Config)'; return; } try { const docSnap = await getDoc(businessDocRef); if (docSnap.exists()) { const data = docSnap.data(); if (contactEmailDisplay) { if (data.contactEmail) { contactEmailDisplay.innerHTML = `Contact: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>`; } else { contactEmailDisplay.innerHTML = ''; } } calculateAndDisplayStatusConvertedBI(data); } else { if(businessStatusDisplay) businessStatusDisplay.textContent = 'Status: N/A'; if(businessHoursDisplay) businessHoursDisplay.innerHTML = '<p>Hours not available.</p>'; } } catch (error) { if(businessStatusDisplay) businessStatusDisplay.textContent = 'Status: Error'; if(businessHoursDisplay) businessHoursDisplay.innerHTML = '<p>Error loading hours.</p>'; } }
function calculateAndDisplayStatusConvertedBI(businessData) { const businessHoursDisplay = document.getElementById('business-hours-display'); const businessStatusDisplay = document.getElementById('business-status-display'); const temporaryHoursDisplay = document.getElementById('temporary-hours-display'); const holidayHoursDisplay = document.getElementById('holiday-hours-display'); if (!businessHoursDisplay || !businessStatusDisplay || !temporaryHoursDisplay || !holidayHoursDisplay) return; const { regularHours = {}, holidayHours = [], temporaryHours = [], statusOverride = 'auto' } = businessData; let currentStatus = 'Closed'; let statusReason = 'Default'; let visitorTimezone; try { visitorTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; if (!visitorTimezone) throw new Error("TZ detection failed."); } catch (e) { businessStatusDisplay.innerHTML = '<span class="status-unavailable">Status Unavailable (TZ Error)</span>'; return; } const visitorNow = new Date(); let currentHourInBizTZ, currentMinuteInBizTZ, businessDateStr, businessDayName; try { const formatterTime = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }); const partsTime = formatterTime.formatToParts(visitorNow).reduce((acc, part) => { acc[part.type] = part.value; return acc; }, {}); currentHourInBizTZ = parseInt(partsTime.hour); currentMinuteInBizTZ = parseInt(partsTime.minute); const formatterDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }); businessDateStr = formatterDate.format(visitorNow); const formatterDay = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'long' }); businessDayName = formatterDay.format(visitorNow).toLowerCase(); if (isNaN(currentHourInBizTZ) || isNaN(currentMinuteInBizTZ) || !businessDateStr || !businessDayName) throw new Error("Failed parse"); } catch (e) { businessStatusDisplay.innerHTML = '<span class="status-unavailable">Status Error (Time Calc)</span>'; return; } const currentMinutesInBizTZ = currentHourInBizTZ * 60 + currentMinuteInBizTZ; let activeHoursRule = null; let ruleApplied = false; if (statusOverride !== 'auto') { currentStatus = statusOverride === 'open' ? 'Open' : (statusOverride === 'closed' ? 'Closed' : 'Temporarily Unavailable'); statusReason = 'Manual Override'; activeHoursRule = { reason: statusReason }; ruleApplied = true; } else { const todayHoliday = holidayHours.find(h => h.date === businessDateStr); if (todayHoliday) { statusReason = `Holiday (${todayHoliday.label || todayHoliday.date})`; activeHoursRule = { ...todayHoliday, reason: statusReason }; ruleApplied = true; if (todayHoliday.isClosed || !todayHoliday.open || !todayHoliday.close) { currentStatus = 'Closed'; } else { const openMins = timeStringToMinutes(todayHoliday.open); const closeMins = timeStringToMinutes(todayHoliday.close); currentStatus = (openMins !== null && closeMins !== null && currentMinutesInBizTZ >= openMins && currentMinutesInBizTZ < closeMins) ? 'Open' : 'Closed'; } activeHoursRule.reason = statusReason + ` (${currentStatus})`; } else { const activeTemporary = temporaryHours.find(t => businessDateStr >= t.startDate && businessDateStr <= t.endDate); if (activeTemporary) { if (activeTemporary.isClosed) { currentStatus = 'Closed'; statusReason = `Temporary Hours (${activeTemporary.label || 'Active'}) - Closed All Day`; activeHoursRule = { ...activeTemporary, reason: statusReason }; ruleApplied = true; } else if (activeTemporary.open && activeTemporary.close) { const openMins = timeStringToMinutes(activeTemporary.open); const closeMins = timeStringToMinutes(activeTemporary.close); if (openMins !== null && closeMins !== null && currentMinutesInBizTZ >= openMins && currentMinutesInBizTZ < closeMins) { currentStatus = 'Temporarily Unavailable'; statusReason = `Temporary Hours (${activeTemporary.label || 'Active'})`; activeHoursRule = { ...activeTemporary, reason: statusReason }; ruleApplied = true; } } } if (!ruleApplied) { statusReason = 'Regular Hours'; const todayRegularHours = regularHours[businessDayName]; if (todayRegularHours && !todayRegularHours.isClosed && todayRegularHours.open && todayRegularHours.close) { const openMins = timeStringToMinutes(todayRegularHours.open); const closeMins = timeStringToMinutes(todayRegularHours.close); if (openMins !== null && closeMins !== null && currentMinutesInBizTZ >= openMins && currentMinutesInBizTZ < closeMins) { currentStatus = 'Open'; activeHoursRule = { ...todayRegularHours, day: businessDayName, reason: statusReason + " (Open)" }; } else { currentStatus = 'Closed'; activeHoursRule = { ...todayRegularHours, day: businessDayName, reason: statusReason + " (Outside Hours)" }; } } else { currentStatus = 'Closed'; activeHoursRule = { ...(todayRegularHours || {}), day: businessDayName, isClosed: true, reason: statusReason + " (Closed Today)" }; } } } } let statusClass = currentStatus === 'Open' ? 'status-open' : (currentStatus === 'Temporarily Unavailable' ? 'status-unavailable' : 'status-closed'); businessStatusDisplay.innerHTML = `<span class="${statusClass}">${currentStatus}</span> <span class="status-reason">(${activeHoursRule?.reason || statusReason})</span>`; const displayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']; const visitorLocalDayName = visitorNow.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(); let displayHoursListHtml = '<ul>'; displayOrder.forEach(day => { const dayData = regularHours[day]; const isCurrentDayForVisitor = day === visitorLocalDayName; const highlightClass = isCurrentDayForVisitor ? 'current-day' : ''; displayHoursListHtml += `<li class="${highlightClass}"><strong>${capitalizeFirstLetter(day)}:</strong> `; if (dayData && !dayData.isClosed && dayData.open && dayData.close) { const openLocalStr = formatDisplayTimeBI(dayData.open, visitorTimezone); const closeLocalStr = formatDisplayTimeBI(dayData.close, visitorTimezone); displayHoursListHtml += `<span>${openLocalStr} - ${closeLocalStr}</span>`; } else { displayHoursListHtml += '<span>Closed</span>'; } displayHoursListHtml += '</li>'; }); displayHoursListHtml += '</ul>'; displayHoursListHtml += `<p class="hours-timezone-note">Hours displayed in your local time zone: ${visitorTimezone.replace('_', ' ')}</p>`; businessHoursDisplay.innerHTML = displayHoursListHtml; if (temporaryHoursDisplay) { const relevantTemporaryHours = temporaryHours.filter(t => t.endDate >= businessDateStr).sort((a, b) => (a.startDate > b.startDate ? 1 : -1)); if (relevantTemporaryHours.length > 0) { let tempHoursHtml = '<h4>Upcoming/Active Temporary Hours</h4><ul class="special-hours-display">'; relevantTemporaryHours.forEach(temp => { if (temp.startDate && temp.endDate) { tempHoursHtml += `<li><strong>${temp.label || 'Temporary Schedule'}:</strong><div class="special-hours-details"><span class="dates">${temp.startDate} to ${temp.endDate}</span> ${temp.isClosed ? '<span class="hours">Closed</span>' : `<span class="hours">${formatDisplayTimeBI(temp.open, visitorTimezone) || '?'} - ${formatDisplayTimeBI(temp.close, visitorTimezone) || '?'}</span>`}</div></li>`; } }); tempHoursHtml += '</ul>'; temporaryHoursDisplay.innerHTML = tempHoursHtml; temporaryHoursDisplay.style.display = ''; } else { temporaryHoursDisplay.innerHTML = ''; temporaryHoursDisplay.style.display = 'none'; } } if (holidayHoursDisplay) { const upcomingHolidayHours = holidayHours.filter(h => h.date >= businessDateStr).sort((a, b) => (a.date > b.date ? 1 : -1)); if (upcomingHolidayHours.length > 0) { let holidayHoursHtml = '<h4>Upcoming Holiday Hours</h4><ul class="special-hours-display">'; upcomingHolidayHours.forEach(holiday => { if (holiday.date) { holidayHoursHtml += `<li><strong>${holiday.label || holiday.date}:</strong><div class="special-hours-details">${holiday.isClosed ? '<span class="hours">Closed</span>' : `<span class="hours">${formatDisplayTimeBI(holiday.open, visitorTimezone) || '?'} - ${formatDisplayTimeBI(holiday.close, visitorTimezone) || '?'}</span>`}</div></li>`; } }); holidayHoursHtml += '</ul>'; holidayHoursDisplay.innerHTML = holidayHoursHtml; holidayHoursDisplay.style.display = ''; } else { holidayHoursDisplay.innerHTML = ''; holidayHoursDisplay.style.display = 'none'; } }
}


// ======================================================
// ===== START: STATUS PAGE FUNCTIONS (Added Here) =====
// ======================================================

/**
 * Fetches component data from Firestore and renders it to the status page.
 * Also updates the overall status banner based on component health.
 */
async function loadStatusComponents() {
    const componentsListContainer = document.getElementById('components-list'); // Target status page element
    const overallStatusBanner = document.getElementById('overall-status-banner'); // Target status page element

    if (!componentsListContainer || !overallStatusBanner) {
        console.warn("Status page component/banner elements not found. Skipping status load.");
        return; // Don't run if not on status page
    }
    console.log("Loading status page components...");
    componentsListContainer.innerHTML = '<p>Loading component statuses...</p>';
    overallStatusBanner.innerHTML = '<p>Loading overall system status...</p>';
    overallStatusBanner.className = 'overall-status-banner'; // Reset class

    try {
        // Use the correct collection reference
        const q = query(componentsCollectionRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        let componentHtml = '';
        const componentsData = [];

        if (querySnapshot.empty) {
            componentsListContainer.innerHTML = '<p>No components are currently being monitored.</p>';
            updateOverallStatusBanner([]); return;
        }

        querySnapshot.forEach((doc) => {
            const component = doc.data();
            const status = component.currentStatus || "Unknown";
            const statusClass = getStatusClass(status); // Use shared helper
            componentsData.push(component);
            componentHtml += `
                <div class="component-item" data-id="${doc.id}">
                    <div>
                        <span class="component-name">${component.name || 'Unnamed Component'}</span>
                        ${component.description ? `<p class="component-description">${component.description}</p>` : ''}
                    </div>
                    <span class="component-status ${statusClass}">${status}</span>
                </div>`;
        });
        componentsListContainer.innerHTML = componentHtml;
        updateOverallStatusBanner(componentsData); // Update banner after processing
    } catch (error) {
        console.error("Error loading status components:", error);
        componentsListContainer.innerHTML = '<p class="error">Could not load component statuses.</p>';
        overallStatusBanner.innerHTML = '<p class="error">Could not determine overall status.</p>';
        overallStatusBanner.className = 'overall-status-banner has-issues';
    }
}

/**
 * Updates the overall status banner on status.html.
 * @param {Array} componentsData - Array of component data objects.
 */
function updateOverallStatusBanner(componentsData) {
     const overallStatusBanner = document.getElementById('overall-status-banner');
     if (!overallStatusBanner) return;
     let overallStatusClass = "all-operational"; let overallMessage = "All Systems Operational";
     let majorOutage = false; let partialIssue = false;
     if (componentsData.length === 0) { overallStatusClass = "unknown"; overallMessage = "System status unavailable."; }
     else {
         for (const component of componentsData) {
             const status = component.currentStatus || "Unknown";
             if (status === "Major Outage") { majorOutage = true; break; }
             else if (status === "Partial Outage" || status === "Degraded Performance") { partialIssue = true; }
             else if (status !== "Operational") { partialIssue = true; }
         }
         if (majorOutage) { overallStatusClass = "major-issues"; overallMessage = "Major System Outage"; }
         else if (partialIssue) { overallStatusClass = "has-issues"; overallMessage = "Some Systems Experiencing Issues"; }
     }
     overallStatusBanner.innerHTML = `<p>${overallMessage}</p>`;
     overallStatusBanner.className = `overall-status-banner ${overallStatusClass}`;
}

/**
 * Fetches incident data from Firestore and renders active/past incidents on status.html.
 */
async function loadStatusIncidents() {
    const activeIncidentsListContainer = document.getElementById('active-incidents-list');
    const pastIncidentsListContainer = document.getElementById('past-incidents-list');

    if (!activeIncidentsListContainer || !pastIncidentsListContainer) {
        console.warn("Status page incident list elements not found. Skipping incident load.");
        return; // Don't run if not on status page
    }
    console.log("Loading status page incidents...");
    activeIncidentsListContainer.innerHTML = '<p>Checking for active incidents...</p>';
    pastIncidentsListContainer.innerHTML = '<p>Loading incident history...</p>';

    try {
        // Use the correct collection reference
        // *** This is the query that needs the index ***
        const q = query(incidentsCollectionRef, orderBy("createdAt", "desc"), limit(15)); // Added limit back
        const querySnapshot = await getDocs(q);
        let activeIncidentsHtml = ''; let pastIncidentsHtml = '';
        let activeCount = 0; let pastCount = 0;

        querySnapshot.forEach((doc) => {
            const incident = doc.data(); const status = incident.status || "Unknown";
            const statusClass = getStatusClass(status); const isResolved = status === "Resolved";
            let updatesHtml = '<div class="incident-updates">';
            if (incident.updates && Array.isArray(incident.updates) && incident.updates.length > 0) {
                const sortedUpdates = [...incident.updates].sort((a, b) => {
                    const timeA = a.timestamp?.toMillis() ?? 0;
                    const timeB = b.timestamp?.toMillis() ?? 0;
                    return timeB - timeA;
                });
                sortedUpdates.forEach(update => { updatesHtml += `<div class="incident-update"><p>${update.message || ''}</p><time>${formatTimestamp(update.timestamp)} - <strong>${update.status || ''}</strong></time></div>`; });
            } else { updatesHtml += '<div class="incident-update"><p>No updates yet.</p></div>'; }
            updatesHtml += '</div>';
            const affectedText = incident.affectedComponents && incident.affectedComponents.length > 0 ? `<p>Affected: ${incident.affectedComponents.join(', ')}</p>` : '';
            const timeText = `<p>Opened: ${formatTimestamp(incident.createdAt)} ${isResolved ? `| Resolved: ${formatTimestamp(incident.resolvedAt)}` : ''}</p>`;
            const footerHtml = `<footer class="incident-footer">${affectedText}${timeText}</footer>`;
            const incidentHtml = `<article class="incident-item" data-id="${doc.id}"><header class="incident-header"><h3 class="incident-title">${incident.title || 'Untitled'}</h3><span class="incident-status ${statusClass}">${status}</span></header>${updatesHtml}${footerHtml}</article>`;
            if (isResolved) { pastIncidentsHtml += incidentHtml; pastCount++; }
            else { activeIncidentsHtml += incidentHtml; activeCount++; }
        });

        activeIncidentsListContainer.innerHTML = activeCount === 0 ? '<p>No active incidents reported.</p>' : activeIncidentsHtml;
        pastIncidentsListContainer.innerHTML = pastCount === 0 ? '<p>No recent incident history.</p>' : pastIncidentsHtml;

    } catch (error) {
        console.error("Error loading status incidents:", error);
        activeIncidentsListContainer.innerHTML = '<p class="error">Could not load active incidents.</p>';
        pastIncidentsListContainer.innerHTML = '<p class="error">Could not load incident history.</p>';
    }
}

// ======================================================
// ===== END: STATUS PAGE FUNCTIONS =====================
// ======================================================


// --- MASTER INITIALIZATION FUNCTION (MODIFIED) ---
async function initializePageContent() {
    console.log("Initializing page content...");

    // Check if Firebase is ready
    if (!firebaseAppInitialized || !db) {
        console.error("Firebase not ready. Cannot initialize content.");
        try { document.body.innerHTML = '<p class="error" style="text-align: center; padding: 50px; color: red;">Error connecting to services.</p>'; } catch (e) {}
        return;
    }

    // --- Detect which page we are on ---
    const isHomepage = document.getElementById('profile-username-main') !== null;
    const isStatusPage = document.getElementById('overall-status-banner') !== null;

    if (isHomepage) {
        console.log("Detected Homepage (index.html). Loading homepage content...");
        await initializeHomepageContent(); // Call original loader
    } else if (isStatusPage) {
        console.log("Detected Status Page (status.html). Loading status content...");
        await initializeStatusPageContent(); // Call new status loader
    } else {
        console.warn("Could not determine page type. No dynamic content loaded by displayShoutouts.js.");
    }
}

// --- Original Homepage Initialization Logic (extracted) ---
async function initializeHomepageContent() {
    // References to homepage elements
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

    // Fetch site settings
    let siteSettings = {}; let maintenanceEnabled = false; let maintenanceTitle = "Site Under Maintenance"; let maintenanceMessage = "Performing scheduled maintenance..."; let hideTikTokSection = false; let countdownTargetDate = null; let countdownTitle = null; let countdownExpiredMessage = null;
    try {
        const configSnap = await getDoc(profileDocRef); if (configSnap.exists()) { siteSettings = configSnap.data() || {}; maintenanceEnabled = siteSettings.isMaintenanceModeEnabled || false; maintenanceTitle = siteSettings.maintenanceTitle || maintenanceTitle; maintenanceMessage = siteSettings.maintenanceMessage || maintenanceMessage; hideTikTokSection = siteSettings.hideTikTokSection || false; countdownTargetDate = siteSettings.countdownTargetDate; countdownTitle = siteSettings.countdownTitle; countdownExpiredMessage = siteSettings.countdownExpiredMessage; } else { console.warn("Site settings document not found."); }
    } catch (error) { console.error("Error fetching site settings:", error); /* Handle error */ }

    // --- Maintenance Mode Check ---
    if (maintenanceEnabled) {
        console.log("Maintenance mode ON."); if (maintenanceOverlay) { const titleEl = maintenanceOverlay.querySelector('h1'); const msgEl = maintenanceOverlay.querySelector('p'); if (titleEl) titleEl.textContent = maintenanceTitle; if (msgEl) msgEl.textContent = maintenanceMessage; maintenanceOverlay.style.display = 'flex'; maintenanceOverlay.classList.add('active'); document.body.classList.add('maintenance-active'); if (mainContentWrapper) mainContentWrapper.style.display = 'none'; } return;
    } else { if (maintenanceOverlay) maintenanceOverlay.style.display = 'none'; document.body.classList.remove('maintenance-active'); if (mainContentWrapper) mainContentWrapper.style.display = ''; }

    // --- Load Homepage Content ---
    console.log("Loading dynamic content for homepage...");
    startEventCountdown(countdownTargetDate, countdownTitle, countdownExpiredMessage);

    let isTikTokVisible = false; if (tiktokHeaderContainer && tiktokGridContainer) { if (hideTikTokSection) { tiktokHeaderContainer.style.display = 'none'; tiktokGridContainer.style.display = 'none'; if (tiktokUnavailableMessage) { tiktokUnavailableMessage.innerHTML = '<p>TikTok shoutouts hidden.</p>'; tiktokUnavailableMessage.style.display = 'block'; } } else { tiktokHeaderContainer.style.display = ''; tiktokGridContainer.style.display = ''; if (tiktokUnavailableMessage) tiktokUnavailableMessage.style.display = 'none'; isTikTokVisible = true; } }

    const loadPromises = [ displayProfileData(siteSettings), displayBusinessInfo(), displayPresidentData(), loadShoutoutPlatformData('instagram', instagramGridContainer, document.getElementById('instagram-last-updated-timestamp')), loadShoutoutPlatformData('youtube', youtubeGridContainer, document.getElementById('youtube-last-updated-timestamp')), loadAndDisplayUsefulLinks(), loadAndDisplaySocialLinks(), loadAndDisplayDisabilities(), loadAndDisplayTechItems(), loadAndDisplayFaqs() ];
    if (isTikTokVisible && tiktokGridContainer) { const tsEl = document.getElementById('tiktok-last-updated-timestamp'); if (tsEl) { loadPromises.push(loadShoutoutPlatformData('tiktok', tiktokGridContainer, tsEl)); } }

    const results = await Promise.allSettled(loadPromises); results.forEach((result, index) => { if (result.status === 'rejected') { console.error(`Error loading homepage section ${index}:`, result.reason); } });
    console.log("Homepage dynamic content loading initiated/completed.");
}

// --- New Status Page Initialization Logic ---
async function initializeStatusPageContent() {
    console.log("Loading dynamic content for status page...");
    const loadPromises = [ loadStatusComponents(), loadStatusIncidents() ];
    const results = await Promise.allSettled(loadPromises);
    results.forEach((result, index) => { if (result.status === 'rejected') { console.error(`Error loading status page section ${index}:`, result.reason); } });
    console.log("Status page dynamic content loading initiated/completed.");
}


// --- Call the main initialization function when the DOM is ready ---
document.addEventListener('DOMContentLoaded', initializePageContent);
