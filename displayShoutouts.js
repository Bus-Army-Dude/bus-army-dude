// displayShoutouts.js (Corrected Version - Includes Profile, President, Disabilities, Links, Shoutouts, Tech)

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
// Ensure ALL necessary functions are imported
import { getFirestore, collection, getDocs, doc, getDoc, Timestamp, orderBy, query } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// --- Initialize Firebase ---
let db;
let firebaseAppInitialized = false;
// Declare references in module scope (will be assigned after init)
let profileDocRef;
let presidentDocRef; // For President section
let usefulLinksCollectionRef; // For Useful Links
let socialLinksCollectionRef; // For Social Links
let disabilitiesCollectionRef; // For Disabilities
let techItemsCollectionRef; // For Tech Items << NEW
let shoutoutsMetaRef; // For shoutout timestamps
let faqsCollectionRef; // Declare globally

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    // Assign references now that db is initialized
    profileDocRef = doc(db, "site_config", "mainProfile");
    presidentDocRef = doc(db, "site_config", "currentPresident"); // Assign President ref
    usefulLinksCollectionRef = collection(db, "useful_links"); // Assign Useful Links ref
    socialLinksCollectionRef = collection(db, "social_links"); // Assign Social Links ref
    disabilitiesCollectionRef = collection(db, "disabilities"); // Assign Disabilities ref
    techItemsCollectionRef = collection(db, "tech_items"); // Assign Tech ref << NEW
    shoutoutsMetaRef = doc(db, 'siteConfig', 'shoutoutsMetadata'); // Assign shoutout meta ref
    faqsCollectionRef = collection(db, "faqs"); // Assign
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

// --- Global variable declarations for DOM elements ---
// (Declared globally so they are accessible inside DOMContentLoaded async function)
let maintenanceMessageElement;
let mainContentWrapper;
let usefulLinksContainerElement;
let socialLinksContainerElement;
let disabilitiesListPlaceholder;
let presidentPlaceholderElement;
let techItemsListContainer; // For Tech Items << NEW
let faqContainer; // <<< ADD THIS LINE

// Profile elements
let profileUsernameElement;
let profilePicElement;
let profileBioElement;
let profileStatusElement;

// Shoutout elements
let tiktokGrid, instagramGrid, youtubeGrid;
let tiktokTimestampEl, instagramTimestampEl, youtubeTimestampEl;


// --- Helper Function to Format Timestamps ---
function formatFirestoreTimestamp(firestoreTimestamp) {
    if (!firestoreTimestamp || !(firestoreTimestamp instanceof Timestamp)) { return 'N/A'; }
    try {
        const date = firestoreTimestamp.toDate();
        return date.toLocaleString(navigator.language || 'en-US', {
             dateStyle: 'medium', timeStyle: 'short'
        });
    } catch (error) { console.error("Error formatting timestamp:", error); return 'Invalid Date'; }
}

// --- Functions to Render Shoutout Cards ---
function renderTikTokCard(account) { const profilePic = account.profilePic || 'images/default-profile.jpg'; const username = account.username || 'N/A'; const nickname = account.nickname || 'N/A'; const bio = account.bio || ''; const followers = account.followers || 'N/A'; const isVerified = account.isVerified || false; const profileUrl = username !== 'N/A' ? `https://tiktok.com/@${encodeURIComponent(username)}` : '#'; const verifiedBadge = isVerified ? '<img src="check.png" alt="Verified" class="verified-badge">' : ''; return `<div class="creator-card"><img src="${profilePic}" alt="@${username}" class="creator-pic" onerror="this.src='images/default-profile.jpg'"><div class="creator-info"><div class="creator-header"><h3>${nickname} ${verifiedBadge}</h3></div> <p class="creator-username">@${username}</p> <p class="creator-bio">${bio}</p> <p class="follower-count">${followers} Followers</p> <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="visit-profile"> Visit Profile </a></div></div>`;}
function renderInstagramCard(account) { const profilePic = account.profilePic || 'images/default-profile.jpg'; const username = account.username || 'N/A'; const nickname = account.nickname || 'N/A'; const bio = account.bio || ''; const followers = account.followers || 'N/A'; const isVerified = account.isVerified || false; const profileUrl = username !== 'N/A' ? `https://instagram.com/${encodeURIComponent(username)}` : '#'; const verifiedBadge = isVerified ? '<img src="instagramcheck.png" alt="Verified" class="instagram-verified-badge">' : ''; return `<div class="instagram-creator-card"><img src="${profilePic}" alt="${nickname}" class="instagram-creator-pic" onerror="this.src='images/default-profile.jpg'"><div class="instagram-creator-info"><div class="instagram-creator-header"><h3>${nickname} ${verifiedBadge}</h3></div> <p class="instagram-creator-username">@${username}</p> <p class="instagram-creator-bio">${bio}</p> <p class="instagram-follower-count">${followers} Followers</p> <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="instagram-visit-profile"> Visit Profile </a></div></div>`;}
function renderYouTubeCard(account) { const profilePic = account.profilePic || 'images/default-profile.jpg'; const username = account.username || 'N/A'; const nickname = account.nickname || 'N/A'; const bio = account.bio || ''; const subscribers = account.subscribers || 'N/A'; const coverPhoto = account.coverPhoto || null; const isVerified = account.isVerified || false; let safeUsername = username; if (username !== 'N/A' && !username.startsWith('@')) { safeUsername = `@${username}`; } const channelUrl = username !== 'N/A' ? `https://youtube.com/${encodeURIComponent(safeUsername)}` : '#'; const verifiedBadge = isVerified ? '<img src="youtubecheck.png" alt="Verified" class="youtube-verified-badge">' : ''; return `<div class="youtube-creator-card"> ${coverPhoto ? `<img src="${coverPhoto}" alt="${nickname} Cover Photo" class="youtube-cover-photo" onerror="this.style.display='none'">` : ''} <img src="${profilePic}" alt="@${username}" class="youtube-creator-pic" onerror="this.src='images/default-profile.jpg'"><div class="youtube-creator-info"><div class="youtube-creator-header"><h3>${nickname} ${verifiedBadge}</h3></div> <div class="username-container"><p class="youtube-creator-username">@${username}</p></div> <p class="youtube-creator-bio">${bio}</p> <p class="youtube-subscriber-count">${subscribers} Subscribers</p> <a href="${channelUrl}" target="_blank" rel="noopener noreferrer" class="youtube-visit-profile"> Visit Channel </a></div></div>`;}

/** Generates HTML for a single FAQ item for the homepage */
function renderFaqItemHomepage(faqData) {
    const question = faqData.question || 'No Question';
    // IMPORTANT: Treat answer as HTML potentially, but sanitize if needed depending on source
    // For now, assume the HTML stored in Firestore is safe/intended.
    const answerHtml = faqData.answer || '<p>No Answer Provided.</p>';

    return `
        <div class="faq-item">
            <button class="faq-question">
                ${question}
                <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer">
                ${answerHtml} </div>
        </div>`;
}

/** Fetches FAQs from Firestore and displays them on the homepage */
async function loadAndDisplayFaqs() {
    if (!firebaseAppInitialized || !db || !faqsCollectionRef) {
         console.error("FAQ Load Error: Firebase not ready or collection ref missing.");
         if (faqContainer) faqContainer.innerHTML = '<p class="error">Error loading FAQs (DB connection).</p>';
         return;
    }
    if (!faqContainer) {
         console.error("FAQ Load Error: Container element #faq-container-dynamic not found in HTML.");
         return;
    }

    console.log("Fetching FAQs for homepage...");
    faqContainer.innerHTML = '<p>Loading FAQs...</p>'; // Loading message

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
                 allItemsHtml += renderFaqItemHomepage(doc.data()); // Build HTML string
             });
         }

         // Set the innerHTML of the container with the generated items
         faqContainer.innerHTML = allItemsHtml;

         // *** IMPORTANT: Attach accordion listeners AFTER content is loaded ***
         attachFaqAccordionListeners();

         console.log("FAQ list updated on homepage.");

    } catch (error) {
         console.error("Error loading/displaying FAQs:", error);
         let errorMsg = "Could not load FAQs at this time.";
         if (error.code === 'failed-precondition') errorMsg = "Error: DB config needed for FAQs (order).";
         faqContainer.innerHTML = `<p class="error">${errorMsg}</p>`;
    }
}

/** Attaches accordion functionality using event delegation */
function attachFaqAccordionListeners() {
    const container = document.getElementById('faq-container-dynamic');
    if (!container) {
        console.error("FAQ Accordion Error: Container not found.");
        return;
    }
    console.log("Attaching FAQ accordion listeners...");

    // Use event delegation on the container
    container.addEventListener('click', (event) => {
        const questionButton = event.target.closest('.faq-question');
        if (!questionButton) return; // Exit if the click wasn't on a question button

        const faqItem = questionButton.closest('.faq-item');
        if (!faqItem) return; // Exit if structure is wrong

        const answer = faqItem.querySelector('.faq-answer');
        const isActive = faqItem.classList.contains('active');

        // Close all *other* active items first
        const allItems = container.querySelectorAll('.faq-item');
        allItems.forEach(otherItem => {
            if (otherItem !== faqItem && otherItem.classList.contains('active')) {
                 otherItem.classList.remove('active');
                 const otherAnswer = otherItem.querySelector('.faq-answer');
                 if (otherAnswer) otherAnswer.style.maxHeight = null;
            }
        });

        // Toggle the clicked item
        if (isActive) {
             faqItem.classList.remove('active');
             if (answer) answer.style.maxHeight = null;
        } else {
             faqItem.classList.add('active');
             if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
              // Optional: Scroll into view smoothly if needed
              // setTimeout(() => { // Timeout allows transition to start
              //     const rect = faqItem.getBoundingClientRect();
              //     const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
              //     if (!isInViewport) {
              //         faqItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              //     }
              // }, 310); // Delay slightly longer than CSS transition
        }
    });

     // Optional: Close all if clicking outside (might be annoying, use with caution)
     /*
     document.addEventListener('click', (e) => {
         if (!container.contains(e.target) || !e.target.closest('.faq-item')) {
             const allItems = container.querySelectorAll('.faq-item.active');
             allItems.forEach(item => {
                  item.classList.remove('active');
                  const answer = item.querySelector('.faq-answer');
                  if (answer) answer.style.maxHeight = null;
             });
         }
     });
     */
     console.log("FAQ accordion listeners attached.");
}


// --- Function to Render Tech Item Card --- <<< NEW FUNCTION >>>
/** Generates HTML for a single tech item for the homepage */
function renderTechItemHomepage(itemData) {
    const name = itemData.name || 'Unnamed Device';
    const model = itemData.model || '';
    const iconClass = itemData.iconClass || 'fas fa-question-circle'; // Default icon
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

         batteryHtml = `
             <div class="tech-detail"><i class="fas fa-heart"></i><span>Battery Health:</span></div>
             <div class="battery-container">
                 <div class="battery-icon ${batteryClass}">
                     <div class="battery-level" style="width: ${batteryHealth}%;"></div>
                     <div class="battery-percentage">${batteryHealth}%</div>
                 </div>
             </div>`;
    }

    let cyclesHtml = '';
    if (batteryCycles !== null) {
        cyclesHtml = `<div class="tech-detail"><i class="fas fa-sync"></i><span>Battery Charge Cycles:</span> ${batteryCycles}</div>`;
    }

    return `
        <div class="tech-item">
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


// --- Function to Load and Display Profile Data ---
async function displayProfileData(profileUsernameElement, profilePicElement, profileBioElement, profileStatusElement) {
    // ... (Keep existing function code) ...
     const defaultUsername = "Username"; const defaultBio = ""; const defaultProfilePic = "images/default-profile.jpg"; const defaultStatusEmoji = '❓'; const statusEmojis = { online: '🟢', idle: '🟡', offline: '⚪️', dnd: '🔴' };
     if (!profileUsernameElement || !profilePicElement || !profileBioElement || !profileStatusElement) { console.warn("Profile display elements missing."); }
     if (!firebaseAppInitialized || !db || !profileDocRef) { console.error("Profile Fetch Error: Firebase not ready/ref missing."); if(profileBioElement) profileBioElement.textContent = "Error loading profile."; if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername; if (profilePicElement) profilePicElement.src = defaultProfilePic; if (profileStatusElement) profileStatusElement.textContent = defaultStatusEmoji; return; }
     try { const docSnap = await getDoc(profileDocRef); if (docSnap.exists()) { const data = docSnap.data(); if (profileUsernameElement) profileUsernameElement.textContent = data.username || defaultUsername; if (profilePicElement) profilePicElement.src = data.profilePicUrl || defaultProfilePic; if (profileBioElement) profileBioElement.textContent = data.bio || defaultBio; if (profileStatusElement) { const statusKey = data.status || 'offline'; profileStatusElement.textContent = statusEmojis[statusKey] || defaultStatusEmoji; } } else { console.warn(`Profile document missing.`); if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername; if (profilePicElement) profilePicElement.src = defaultProfilePic; if (profileBioElement) profileBioElement.textContent = defaultBio; if (profileStatusElement) profileStatusElement.textContent = statusEmojis['offline']; } } catch (error) { console.error("Error fetching profile:", error); if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername; if (profilePicElement) profilePicElement.src = defaultProfilePic; if (profileBioElement) profileBioElement.textContent = "Error loading bio."; if (profileStatusElement) profileStatusElement.textContent = '❓'; }
}

// --- Function to Load and Display Shoutouts ---
async function loadAndDisplayShoutouts(tiktokGrid, instagramGrid, youtubeGrid, tiktokTimestampEl, instagramTimestampEl, youtubeTimestampEl) {
    // ... (Keep existing function code) ...
     if (!firebaseAppInitialized || !db) { console.error("Shoutout load error: Firebase not ready."); return; }
     if (tiktokGrid) tiktokGrid.innerHTML = '<p>Loading TikTok Creators...</p>'; if (instagramGrid) instagramGrid.innerHTML = '<p>Loading Instagram Creators...</p>'; if (youtubeGrid) youtubeGrid.innerHTML = '<p>Loading YouTube Creators...</p>'; if (tiktokTimestampEl) tiktokTimestampEl.textContent = 'Last Updated: Loading...'; if (instagramTimestampEl) instagramTimestampEl.textContent = 'Last Updated: Loading...'; if (youtubeTimestampEl) youtubeTimestampEl.textContent = 'Last Updated: Loading...';
     try {
         const shoutoutsCol = collection(db, 'shoutouts'); const shoutoutQuery = query(shoutoutsCol, orderBy("order", "asc")); const querySnapshot = await getDocs(shoutoutQuery); const shoutouts = { tiktok: [], instagram: [], youtube: [] };
         querySnapshot.forEach((docSnapshot) => { const data = docSnapshot.data(); if (data.platform && shoutouts.hasOwnProperty(data.platform)) { const accountData = { id: docSnapshot.id, username: data.username || null, nickname: data.nickname || null, profilePic: data.profilePic || null, bio: data.bio || '', followers: data.followers || 'N/A', subscribers: data.subscribers || 'N/A', isVerified: data.isVerified || false, coverPhoto: data.coverPhoto || null, platform: data.platform, order: data.order !== undefined ? data.order : Infinity }; shoutouts[data.platform].push(accountData); } else { console.warn(`Doc ${docSnapshot.id} missing/unknown platform: ${data.platform}`); } });
         let metadata = {}; if(shoutoutsMetaRef) { try { const metaSnap = await getDoc(shoutoutsMetaRef); if(metaSnap.exists()) metadata = metaSnap.data(); } catch(e){console.warn("Could not fetch shoutout metadata:", e)} }
         if (tiktokGrid) { if (shoutouts.tiktok.length > 0) { tiktokGrid.innerHTML = shoutouts.tiktok.map(renderTikTokCard).join(''); } else { tiktokGrid.innerHTML = '<p>No TikTok creators featured currently.</p>'; } if (tiktokTimestampEl) { tiktokTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_tiktok)}`; } } else { console.warn("TikTok grid missing."); }
         if (instagramGrid) { if (shoutouts.instagram.length > 0) { instagramGrid.innerHTML = shoutouts.instagram.map(renderInstagramCard).join(''); } else { instagramGrid.innerHTML = '<p>No Instagram creators featured currently.</p>'; } if (instagramTimestampEl) { instagramTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_instagram)}`; } } else { console.warn("Instagram grid missing."); }
         if (youtubeGrid) { if (shoutouts.youtube.length > 0) { youtubeGrid.innerHTML = shoutouts.youtube.map(renderYouTubeCard).join(''); } else { youtubeGrid.innerHTML = '<p>No YouTube creators featured currently.</p>'; } if (youtubeTimestampEl) { youtubeTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_youtube)}`; } } else { console.warn("YouTube grid missing."); }
          console.log("Shoutout sections updated.");
     } catch (error) { console.error("Error loading shoutout data:", error); if (tiktokGrid) tiktokGrid.innerHTML = '<p class="error">Error loading TikTok creators.</p>'; if (instagramGrid) instagramGrid.innerHTML = '<p class="error">Error loading Instagram creators.</p>'; if (youtubeGrid) youtubeGrid.innerHTML = '<p class="error">Error loading YouTube creators.</p>'; if (tiktokTimestampEl) tiktokTimestampEl.textContent = 'Last Updated: Error'; if (instagramTimestampEl) instagramTimestampEl.textContent = 'Last Updated: Error'; if (youtubeTimestampEl) youtubeTimestampEl.textContent = 'Last Updated: Error'; }
}

// --- Function to Load and Display Useful Links ---
async function loadAndDisplayUsefulLinks(containerElement) {
    // ... (Keep existing function code) ...
     if (!firebaseAppInitialized || !db) { console.error("Useful Links load error: Firebase not ready."); if(containerElement) containerElement.innerHTML = '<p class="error">Error loading links.</p>'; return; } if (!containerElement) { console.warn("Useful links container missing."); return; } if(!usefulLinksCollectionRef) { console.error("Useful Links load error: Collection reference missing."); containerElement.innerHTML = '<p class="error">Config error.</p>'; return;}
     containerElement.innerHTML = '<p>Loading links...</p>';
     try { const linkQuery = query(usefulLinksCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(linkQuery); containerElement.innerHTML = ''; if (querySnapshot.empty) { containerElement.innerHTML = '<p>No useful links available.</p>'; } else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.label && data.url) { const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.textContent = data.label; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; linkElement.className = 'link-button'; containerElement.appendChild(linkElement); } else { console.warn("Skipping useful link:", doc.id); } }); } console.log(`Displayed ${querySnapshot.size} useful links.`);
     } catch (error) { console.error("Error loading useful links:", error); containerElement.innerHTML = '<p class="error">Could not load links.</p>'; }
}

// --- Function to Load and Display Social Links ---
async function loadAndDisplaySocialLinks(containerElement) {
    // ... (Keep existing function code) ...
     if (!firebaseAppInitialized || !db) { console.error("Social Links load error: Firebase not ready."); if (containerElement) containerElement.innerHTML = '<p class="error">Error loading socials.</p>'; return; } if (!containerElement) { console.warn("Social links container missing."); return; } if (!socialLinksCollectionRef) { console.error("Social Links load error: Collection reference missing."); containerElement.innerHTML = '<p class="error">Config error.</p>'; return;}
     containerElement.innerHTML = '<p>Loading socials...</p>';
     try { const linkQuery = query(socialLinksCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(linkQuery); containerElement.innerHTML = ''; if (querySnapshot.empty) { containerElement.innerHTML = '<p>No social links available.</p>'; } else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.label && data.url) { const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; linkElement.className = 'social-button'; if (data.iconClass) { const iconElement = document.createElement('i'); iconElement.className = data.iconClass + ' social-icon'; linkElement.appendChild(iconElement); } const textElement = document.createElement('span'); textElement.textContent = data.label; linkElement.appendChild(textElement); containerElement.appendChild(linkElement); } else { console.warn("Skipping social link:", doc.id); } }); } console.log(`Displayed ${querySnapshot.size} social links.`);
     } catch (error) { console.error("Error loading social links:", error); containerElement.innerHTML = '<p class="error">Could not load socials.</p>'; }
}

// --- Function to Load and Display President Data ---
async function displayPresidentData(placeholderElement) {
    // ... (Keep existing function code) ...
     if (!placeholderElement) { console.warn("President placeholder missing."); return; }
     placeholderElement.innerHTML = '<p style="text-align: center; padding: 20px;">Loading president info...</p>';
     if (!firebaseAppInitialized || !db) { console.error("President display error: Firebase not ready."); placeholderElement.innerHTML = '<p class="error">Could not load (DB Init Error).</p>'; return; } if (!presidentDocRef) { console.error("President display error: presidentDocRef missing."); placeholderElement.innerHTML = '<p class="error">Could not load (Config Error).</p>'; return; }
     try { const docSnap = await getDoc(presidentDocRef); if (docSnap.exists()) { const data = docSnap.data(); const presidentHTML = `<section id="current-president" class="president-section"><h2 class="section-title">Current U.S. President</h2><div class="president-info"><img src="${data.imageUrl || 'images/default-president.jpg'}" alt="President ${data.name || 'N/A'}" class="president-photo" onerror="this.src='images/default-president.jpg'; this.alt='Photo Missing';"><div class="president-details"><h3 class="president-name">${data.name || 'N/A'}</h3><p><strong>Born:</strong> ${data.born || 'N/A'}</p><p><strong>Height:</strong> ${data.height || 'N/A'}</p><p><strong>Party:</strong> ${data.party || 'N/A'}</p><p class="presidential-term"><strong>Term:</strong> ${data.term || 'N/A'}</p><p><strong>VP:</strong> ${data.vp || 'N/A'}</p></div></div></section>`; placeholderElement.innerHTML = presidentHTML; } else { console.warn(`President document missing.`); placeholderElement.innerHTML = '<p style="text-align: center; padding: 20px;">President info unavailable.</p>'; } } catch (error) { console.error("Error fetching president data:", error); placeholderElement.innerHTML = `<p class="error">Error loading president info: ${error.message}</p>`; }
}

// --- Function to Load and Display Disabilities ---
async function loadAndDisplayDisabilities(placeholderElement) {
    // ... (Keep existing function code) ...
     if (!placeholderElement) { console.warn("Disabilities placeholder missing."); return; }
     placeholderElement.innerHTML = '<li>Loading...</li>';
     if (!firebaseAppInitialized || !db) { console.error("Disabilities load error: Firebase not ready."); placeholderElement.innerHTML = '<li>Error (DB Init Error).</li>'; return; } if (!disabilitiesCollectionRef) { console.error("Disabilities load error: Collection ref missing."); placeholderElement.innerHTML = '<li>Error (Config Error).</li>'; return; }
     try { const disabilityQuery = query(disabilitiesCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(disabilityQuery); placeholderElement.innerHTML = ''; if (querySnapshot.empty) { placeholderElement.innerHTML = '<li>No specific information available.</li>'; } else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.name && data.url) { const listItem = document.createElement('li'); const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.textContent = data.name; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; listItem.appendChild(linkElement); placeholderElement.appendChild(listItem); } else { console.warn("Skipping disability item:", doc.id); } }); } console.log(`Displayed ${querySnapshot.size} disability links.`); } catch (error) { console.error("Error loading disabilities:", error); if (error.code === 'failed-precondition') { placeholderElement.innerHTML = '<li>Error: DB config needed.</li>'; console.error("Missing Firestore index for disabilities (order)."); } else { placeholderElement.innerHTML = '<li>Could not load list.</li>'; } }
}

// --- Function to Load and Display Tech Items --- <<< NEW FUNCTION >>>
async function loadAndDisplayTechItems() {
    // Check if Firebase is ready and the container exists
    if (!firebaseAppInitialized || !db || !techItemsCollectionRef) {
         console.error("Tech Item Load Error: Firebase not ready or collection ref missing.");
         if (techItemsListContainer) techItemsListContainer.innerHTML = '<p class="error">Error loading tech data (DB connection).</p>';
         return;
    }
    if (!techItemsListContainer) {
         console.error("Tech Item Load Error: Container element #tech-items-list-dynamic not found in HTML.");
         return;
    }

    console.log("Fetching tech items for homepage...");
    techItemsListContainer.innerHTML = '<p>Loading Tech Info...</p>'; // Loading message

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
                 allItemsHtml += renderTechItemHomepage(doc.data()); // Build HTML string
             });
         }
         // Set the innerHTML of the list container
         techItemsListContainer.innerHTML = allItemsHtml;
         console.log("Tech items list updated on homepage.");

    } catch (error) {
         console.error("Error loading/displaying tech items:", error);
          let errorMsg = "Could not load tech information at this time.";
          if (error.code === 'failed-precondition') {
              errorMsg = "Error: DB config needed for tech items (order).";
              console.error("Missing Firestore index for tech_items (order).");
          } else {
             errorMsg = `Could not load tech information: ${error.message}`;
          }
         techItemsListContainer.innerHTML = `<p class="error">${errorMsg}</p>`;
    }
}

// --- Run functions when the DOM is ready ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM loaded. Checking Firebase status and maintenance mode...");

    // --- Assign ALL DOM Element References FIRST ---
    maintenanceMessageElement = document.getElementById('maintenanceModeMessage');
    mainContentWrapper = document.querySelector('.container');
    usefulLinksContainerElement = document.querySelector('.useful-links-section .links-container');
    socialLinksContainerElement = document.querySelector('.social-links-container');
    disabilitiesListPlaceholder = document.getElementById('disabilities-list-placeholder');
    presidentPlaceholderElement = document.getElementById('president-placeholder');
    techItemsListContainer = document.getElementById('tech-items-list-dynamic'); // Assign tech container
    profileUsernameElement = document.getElementById('profile-username-main');
    profilePicElement = document.getElementById('profile-pic-main');
    profileBioElement = document.getElementById('profile-bio-main');
    profileStatusElement = document.getElementById('profile-status-main');
    tiktokGrid = document.querySelector('.creator-grid');
    instagramGrid = document.querySelector('.instagram-creator-grid');
    youtubeGrid = document.querySelector('.youtube-creator-grid');
    tiktokTimestampEl = document.getElementById('tiktok-last-updated-timestamp');
    instagramTimestampEl = document.getElementById('instagram-last-updated-timestamp'); // Corrected ID based on original file? Check HTML
    youtubeTimestampEl = document.getElementById('youtube-last-updated-timestamp'); // Corrected ID based on original file? Check HTML
    faqContainer = document.getElementById('faq-container-dynamic');

    console.log("DEBUG: DOM Elements referenced.");

    // --- Check Firebase Initialization ---
    if (!firebaseAppInitialized) {
        console.error("Firebase not ready. Site cannot load.");
        if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = '<p class="error">Site cannot load (Connection Error).</p>'; maintenanceMessageElement.style.display = 'block'; }
        else { const errorDiv = document.createElement('div'); errorDiv.className = 'error-message-fallback'; errorDiv.innerHTML = '<p class="error" style="text-align: center; color: red; padding: 20px;">Site cannot load (Connection Error).</p>'; document.body.prepend(errorDiv); }
        if (mainContentWrapper) mainContentWrapper.style.display = 'none';
        return;
    }

    // --- Maintenance Mode Check and Content Loading ---
    try {
        console.log("Checking maintenance mode...");
        if (!profileDocRef) { throw new Error("Profile document reference is missing."); }
        const configSnap = await getDoc(profileDocRef);
        let maintenanceEnabled = configSnap.exists() ? (configSnap.data()?.isMaintenanceModeEnabled || false) : false;
        console.log("Maintenance mode active:", maintenanceEnabled);

        if (maintenanceEnabled) {
            // --- Maintenance Mode ON ---
            console.log("Maintenance mode is ON. Hiding main content.");
            if (mainContentWrapper) { mainContentWrapper.style.display = 'none'; }
            if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = '<p>The site is currently undergoing maintenance. Please check back later.</p>'; maintenanceMessageElement.style.display = 'block'; }
            else { console.error("Maintenance message element (#maintenanceModeMessage) is missing from HTML!"); const maintDiv = document.createElement('div'); maintDiv.innerHTML = '<p style="text-align:center; padding: 50px; color: orange;">Site Maintenance</p>'; document.body.prepend(maintDiv); }
            return;
        } else {
            // --- Maintenance Mode OFF ---
            console.log("Maintenance mode is OFF. Loading all page content...");
            if (mainContentWrapper) { mainContentWrapper.style.display = ''; }
            if (maintenanceMessageElement) { maintenanceMessageElement.style.display = 'none'; }

            // --- Load ALL dynamic content Concurrently ---
            console.log("Initiating parallel loading of content sections...");
            const loadPromises = [
                displayProfileData(profileUsernameElement, profilePicElement, profileBioElement, profileStatusElement),
                displayPresidentData(presidentPlaceholderElement),
                loadAndDisplayShoutouts(tiktokGrid, instagramGrid, youtubeGrid, tiktokTimestampEl, instagramTimestampEl, youtubeTimestampEl),
                loadAndDisplayUsefulLinks(usefulLinksContainerElement),
                loadAndDisplaySocialLinks(socialLinksContainerElement),
                loadAndDisplayDisabilities(disabilitiesListPlaceholder),
                loadAndDisplayTechItems(), // Load Tech Items
                loadAndDisplayFaqs() // <<< ADD THIS CALL
            ];
            const results = await Promise.allSettled(loadPromises);

            results.forEach((result, index) => {
                const functionNames = ["Profile", "President", "Shoutouts", "UsefulLinks", "SocialLinks", "Disabilities", "TechItems"];
                if (result.status === 'rejected') {
                    console.error(`Error loading ${functionNames[index]}:`, result.reason);
                }
            });
            console.log("All dynamic content loading initiated.");
        } // End Maintenance Mode OFF block
    } catch (error) {
        // --- General Error Handling ---
        console.error("Error during DOMContentLoaded initialization or maintenance check:", error);
        if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = `<p class="error">An error occurred while loading site configuration: ${error.message}. Please try again later.</p>`; maintenanceMessageElement.style.display = 'block'; }
        else { const errorDiv = document.createElement('div'); errorDiv.innerHTML = `<p class="error" style="text-align: center; color: red; padding: 20px;">An error occurred loading site configuration.</p>`; document.body.prepend(errorDiv); }
        if (mainContentWrapper) mainContentWrapper.style.display = 'none';
    }
}); // End DOMContentLoaded listener
