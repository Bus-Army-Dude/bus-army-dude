// displayShoutouts.js (Complete with Profile, President, Disabilities, Links, Tech Sections)

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
// Declare references in module scope
let profileDocRef;
let presidentDocRef;
let usefulLinksCollectionRef;
let socialLinksCollectionRef;
let disabilitiesCollectionRef;
let shoutoutsMetaRef;
let techItemsCollectionRef; // Declare tech ref

// --- Global variable declarations for DOM elements ---
// (Declared globally so they are accessible inside DOMContentLoaded async function)
let maintenanceMessageElement;
let mainContentWrapper;
let usefulLinksContainerElement;
let socialLinksContainerElement;
let disabilitiesListPlaceholder; // Placeholder for disabilities list
let presidentPlaceholderElement; // Placeholder for president info
let techItemsListContainer; // Placeholder for tech items list

// Profile elements
let profileUsernameElement;
let profilePicElement;
let profileBioElement;
let profileStatusElement;

// Shoutout elements
let tiktokGrid, instagramGrid, youtubeGrid;
let tiktokTimestampEl, instagramTimestampEl, youtubeTimestampEl;


try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    // Assign references now that db is initialized
    profileDocRef = doc(db, "site_config", "mainProfile");
    presidentDocRef = doc(db, "site_config", "currentPresident");
    usefulLinksCollectionRef = collection(db, "useful_links");
    socialLinksCollectionRef = collection(db, "social_links");
    disabilitiesCollectionRef = collection(db, "disabilities");
    shoutoutsMetaRef = doc(db, 'siteConfig', 'shoutoutsMetadata');
    techItemsCollectionRef = collection(db, "tech_items"); // Assign tech ref
    firebaseAppInitialized = true;
    console.log("Firebase initialized for display.");
} catch (error) {
    console.error("Firebase initialization failed on index.html:", error);
    const body = document.body;
    if (body) { body.innerHTML = '<p class="error" style="text-align: center; padding: 50px; color: red;">Could not connect to database services. Site unavailable.</p>'; }
    firebaseAppInitialized = false;
}

// --- Helper Function to Format Timestamps ---
function formatFirestoreTimestamp(firestoreTimestamp) {
    if (!firestoreTimestamp || !(firestoreTimestamp instanceof Timestamp)) { return 'N/A'; }
    try { const date = firestoreTimestamp.toDate(); return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }); }
    catch (error) { console.error("Error formatting timestamp:", error); return 'Invalid Date'; }
}

// --- Functions to Render Shoutout Cards ---
function renderTikTokCard(account) { /* ... function code ... */ }
function renderInstagramCard(account) { /* ... function code ... */ }
function renderYouTubeCard(account) { /* ... function code ... */ }

// --- Function to Render Tech Item Card ---
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

// --- Function to Load and Display Tech Items ---
/** Fetches tech items from Firestore and displays them on the homepage */
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
         // Set the innerHTML of the list container (inside the main section)
         techItemsListContainer.innerHTML = allItemsHtml;
         console.log("Tech items list updated on homepage.");

    } catch (error) {
         console.error("Error loading/displaying tech items:", error);
         techItemsListContainer.innerHTML = '<p class="error">Could not load tech information at this time.</p>';
    }
}


// --- Function to Load and Display Profile Data ---
async function displayProfileData() { /* ... function code from previous version ... */ }

// --- Function to Load and Display Shoutouts ---
async function loadAndDisplayShoutouts() { /* ... function code from previous version ... */ }

// --- Function to Load and Display Useful Links ---
async function loadAndDisplayUsefulLinks() { /* ... function code from previous version ... */ }

// --- Function to Load and Display Social Links ---
async function loadAndDisplaySocialLinks() { /* ... function code from previous version ... */ }

// --- Function to Load and Display President Data ---
async function displayPresidentData() { /* ... function code from previous version ... */ }

// --- Function to Load and Display Disabilities ---
async function loadAndDisplayDisabilities() { /* ... function code from previous version ... */ }


// --- Run functions when the DOM is ready ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM loaded. Checking Firebase status and maintenance mode...");

    // Assign DOM elements AFTER DOM is loaded
    maintenanceMessageElement = document.getElementById('maintenanceModeMessage');
    mainContentWrapper = document.querySelector('.container'); // Or specific content wrapper
    usefulLinksContainerElement = document.querySelector('.useful-links-section .links-container'); // Adjust selector if needed
    socialLinksContainerElement = document.querySelector('.social-links-container'); // Adjust selector if needed
    disabilitiesListPlaceholder = document.getElementById('disabilities-list-placeholder'); // Add ID in HTML
    presidentPlaceholderElement = document.getElementById('president-placeholder'); // Add ID in HTML
    techItemsListContainer = document.getElementById('tech-items-list-dynamic'); // Use the correct ID

    // Profile elements
    profileUsernameElement = document.getElementById('profile-username-main');
    profilePicElement = document.getElementById('profile-pic-main');
    profileBioElement = document.getElementById('profile-bio-main');
    profileStatusElement = document.getElementById('profile-status-main');

    // Shoutout elements
    tiktokGrid = document.querySelector('.creator-grid'); // Adjust selector if needed
    instagramGrid = document.querySelector('.instagram-creator-grid'); // Adjust selector if needed
    youtubeGrid = document.querySelector('.youtube-creator-grid'); // Adjust selector if needed
    tiktokTimestampEl = document.getElementById('tiktok-last-updated-timestamp'); // Add ID in HTML
    instagramTimestampEl = document.getElementById('instagram-last-updated-timestamp'); // Add ID in HTML
    youtubeTimestampEl = document.getElementById('youtube-last-updated-timestamp'); // Add ID in HTML

    if (!firebaseAppInitialized) {
        console.error("Firebase not ready. Site cannot load.");
        // ... (error handling for missing Firebase) ...
        return;
    }

    try {
        console.log("Checking maintenance mode...");
        if (!profileDocRef) { throw new Error("profileDocRef missing."); }
        const configSnap = await getDoc(profileDocRef);
        let maintenanceEnabled = configSnap.exists() ? (configSnap.data()?.isMaintenanceModeEnabled || false) : false;
        console.log("Maintenance mode:", maintenanceEnabled);

        if (maintenanceEnabled) {
            console.log("Maintenance mode ON.");
            if (mainContentWrapper) { mainContentWrapper.style.display = 'none'; }
            if (maintenanceMessageElement) { maintenanceMessageElement.style.display = 'block'; }
            else { console.error("Maintenance msg element missing!"); }
            return; // Stop loading content if in maintenance
        } else {
            console.log("Maintenance mode OFF. Loading content.");
            if (mainContentWrapper) { mainContentWrapper.style.display = ''; } // Ensure content is visible
            if (maintenanceMessageElement) { maintenanceMessageElement.style.display = 'none'; }

            // --- Load ALL dynamic content ---
            // Using Promise.allSettled to load sections somewhat concurrently
            // and continue even if one section fails.
            const loadPromises = [
                displayProfileData(),
                displayPresidentData(),
                loadAndDisplayShoutouts(),
                loadAndDisplayUsefulLinks(),
                loadAndDisplaySocialLinks(),
                loadAndDisplayDisabilities(),
                loadAndDisplayTechItems() // Load Tech Items
            ];

            const results = await Promise.allSettled(loadPromises);

            // Optionally log results of loading
             results.forEach((result, index) => {
                const functionNames = ["Profile", "President", "Shoutouts", "UsefulLinks", "SocialLinks", "Disabilities", "TechItems"];
                if (result.status === 'rejected') {
                    console.error(`Error loading ${functionNames[index]}:`, result.reason);
                } else {
                    console.log(`${functionNames[index]} loaded successfully.`);
                }
            });
            console.log("All dynamic content loading initiated.");
        }
    } catch (error) {
        // General error handling during DOMContentLoaded/maintenance check
        console.error("Error during DOMContentLoaded or maintenance check:", error);
        if (maintenanceMessageElement) {
            maintenanceMessageElement.innerHTML = `<p class="error">Error loading site configuration: ${error.message}</p>`;
            maintenanceMessageElement.style.display = 'block';
        } else {
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `<p class="error" style="text-align: center; color: red;">Error loading site configuration.</p>`;
            document.body.prepend(errorDiv);
        }
        if (mainContentWrapper) mainContentWrapper.style.display = 'none'; // Hide content on error
    }
}); // End DOMContentLoaded listener
