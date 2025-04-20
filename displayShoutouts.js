// displayShoutouts.js (Firebase Configurable Countdown + All Sections)

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
let profileDocRef; // Holds main site config now (profile, status, maintenance, tiktok hide, countdown)
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
// (These functions remain the same as before - kept short here for brevity)
function renderTikTokCard(account) { /* ... same code ... */ }
function renderInstagramCard(account) { /* ... same code ... */ }
function renderYouTubeCard(account) { /* ... same code ... */ } // Contains corrected URL
function renderTechItemHomepage(itemData) { /* ... same code ... */ }
function renderFaqItemHomepage(faqData) { /* ... same code ... */ }

// --- Data Loading and Display Functions (Profile, President, Links, Disabilities, Tech, FAQs, Shoutouts) ---
// (These functions remain the same as before - kept short here for brevity)
// Note: displayProfileData now only handles username/pic/bio/status display part from mainProfile doc
async function displayProfileData(profileData) { // Accepts data fetched in initializeHomepageContent
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
}
async function displayPresidentData() { /* ... same code ... */ }
async function loadAndDisplayUsefulLinks() { /* ... same code ... */ }
async function loadAndDisplaySocialLinks() { /* ... same code ... */ }
async function loadAndDisplayDisabilities() { /* ... same code ... */ }
async function loadAndDisplayTechItems() { /* ... same code ... */ }
async function loadAndDisplayFaqs() { /* ... same code ... */ }
function attachFaqAccordionListeners() { /* ... same code ... */ }
async function loadShoutoutPlatformData(platform, gridElement, timestampElement) { /* ... same code ... */ }

// --- ***** UPDATED: Countdown Timer Logic - Now Configurable ***** ---
function startEventCountdown(targetTimestamp, countdownTitle) {
    const countdownSection = document.querySelector('.countdown-section');
    const titleElement = countdownSection?.querySelector('h2');
    const yearsElement = document.getElementById('countdown-years');
    const monthsElement = document.getElementById('countdown-months');
    const daysElement = document.getElementById('countdown-days');
    const hoursElement = document.getElementById('countdown-hours');
    const minutesElement = document.getElementById('countdown-minutes');
    const secondsElement = document.getElementById('countdown-seconds');
    const countdownContainer = countdownSection?.querySelector('.countdown-container');

    // --- Check if core elements exist ---
    if (!countdownSection || !titleElement || !yearsElement || !monthsElement || !daysElement || !hoursElement || !minutesElement || !secondsElement || !countdownContainer) {
        console.warn("Countdown elements missing (section, title, or units). Hiding countdown section.");
        if (countdownSection) countdownSection.style.display = 'none';
        return;
    }

    // --- Validate Input Data ---
    let targetDateMillis;
    if (targetTimestamp && targetTimestamp instanceof Timestamp) {
        try {
            targetDateMillis = targetTimestamp.toMillis();
        } catch (e) {
            console.error("Error converting Firestore Timestamp for countdown:", e);
            targetDateMillis = null;
        }
    } else {
        targetDateMillis = null; // Handle case where timestamp is missing or not a Timestamp object
    }

    const displayTitle = countdownTitle || "Countdown"; // Default title if missing

    // If target date is invalid or missing, hide the section
    if (!targetDateMillis) {
        console.warn("Invalid or missing countdown target date from Firebase. Hiding countdown section.");
        countdownSection.style.display = 'none';
        return;
    }

    // --- Get references to inner elements ---
    const yearsFront = yearsElement.querySelector('.flip-clock-front');
    const monthsFront = monthsElement.querySelector('.flip-clock-front');
    const daysFront = daysElement.querySelector('.flip-clock-front');
    const hoursFront = hoursElement.querySelector('.flip-clock-front');
    const minutesFront = minutesElement.querySelector('.flip-clock-front');
    const secondsFront = secondsElement.querySelector('.flip-clock-front');

    if (!yearsFront || !monthsFront || !daysFront || !hoursFront || !minutesFront || !secondsFront ) {
        console.warn("One or more countdown inner front elements (.flip-clock-front) not found. Countdown cannot display numbers.");
        countdownSection.style.display = 'none'; // Hide if structure is broken
        return;
    }

    // --- Set Title ---
    titleElement.textContent = displayTitle;
    console.log(`Starting countdown timer for: "${displayTitle}"`);

    // --- Helper to Update Display ---
    function updateDisplay(y, mo, d, h, m, s) {
        yearsFront.textContent = String(y).padStart(2, '0');
        monthsFront.textContent = String(mo).padStart(2, '0');
        daysFront.textContent = String(d).padStart(2, '0');
        hoursFront.textContent = String(h).padStart(2, '0');
        minutesFront.textContent = String(m).padStart(2, '0');
        secondsFront.textContent = String(s).padStart(2, '0');
    }

    // --- Interval Logic ---
    const intervalId = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDateMillis - now;

        if (distance < 0) {
            clearInterval(intervalId);
            console.log(`Countdown for "${displayTitle}" finished.`);
            updateDisplay(0, 0, 0, 0, 0, 0);
             // You might want a specific "expired" title from Firestore too, or just keep the original.
             // titleElement.textContent = "Event Started!"; // Example
            return;
        }

        // Approximate Calculation Method
        const totalDays = Math.floor(distance / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const totalMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const totalSeconds = Math.floor((distance % (1000 * 60)) / 1000);
        const approxYears = Math.floor(totalDays / 365);
        const daysAfterYears = totalDays % 365;
        const approxMonths = Math.floor(daysAfterYears / 30);
        const finalDays = daysAfterYears % 30;

        updateDisplay(approxYears, approxMonths, finalDays, totalHours, totalMinutes, totalSeconds);

    }, 1000);

    // --- Initial Display ---
    const now = new Date().getTime();
    const distance = targetDateMillis - now;
    if (distance > 0) {
        const totalDays = Math.floor(distance / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const totalMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const totalSeconds = Math.floor((distance % (1000 * 60)) / 1000);
        const approxYears = Math.floor(totalDays / 365);
        const daysAfterYears = totalDays % 365;
        const approxMonths = Math.floor(daysAfterYears / 30);
        const finalDays = daysAfterYears % 30;
        updateDisplay(approxYears, approxMonths, finalDays, totalHours, totalMinutes, totalSeconds);
    } else {
         clearInterval(intervalId); // Clear interval if expired on load
         updateDisplay(0, 0, 0, 0, 0, 0);
         // titleElement.textContent = "Event Started!"; // Example for expired state
    }
}
// --- ***** END: Configurable Countdown Timer Logic ***** ---


// --- MASTER INITIALIZATION FUNCTION ---
async function initializeHomepageContent() {
    console.log("Initializing homepage content...");

    const mainContentWrapper = document.querySelector('.container');
    const maintenanceMessageElement = document.getElementById('maintenanceModeMessage');
    const countdownSection = document.querySelector('.countdown-section'); // Reference to hide if needed

    // References for Shoutout Sections (using specific IDs is recommended)
    const tiktokHeaderContainer = document.getElementById('tiktok-shoutouts');
    const tiktokGridContainer = document.getElementById('tiktok-creator-grid');
    const tiktokUnavailableMessage = document.getElementById('tiktok-unavailable-message');
    const instagramGridContainer = document.getElementById('instagram-creator-grid');
    const youtubeGridContainer = document.getElementById('youtube-creator-grid');

    // --- Safety check for Firebase ---
    if (!firebaseAppInitialized || !db || !profileDocRef) {
         console.error("Firebase not ready or profileDocRef missing. Site cannot load settings.");
         if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = '<p class="error">Site configuration error. Please try again later.</p>'; maintenanceMessageElement.style.display = 'block'; }
         if (mainContentWrapper) mainContentWrapper.style.display = 'none';
         if (countdownSection) countdownSection.style.display = 'none'; // Hide countdown on critical error too
         return;
    }

    // --- Fetch Central Site Configuration ---
    let siteSettings = {};
    let maintenanceEnabled = false;
    let hideTikTokSection = false;
    let countdownTargetDate = null; // Expecting Firestore Timestamp
    let countdownTitle = null;      // Expecting String

    try {
        console.log("Fetching site settings from site_config/mainProfile...");
        const configSnap = await getDoc(profileDocRef);

        if (configSnap.exists()) {
            siteSettings = configSnap.data() || {}; // Store all data for profile display later
            maintenanceEnabled = siteSettings.isMaintenanceModeEnabled || false;
            hideTikTokSection = siteSettings.hideTikTokSection || false;
            // Get countdown config
            countdownTargetDate = siteSettings.countdownTargetDate; // Should be a Timestamp object
            countdownTitle = siteSettings.countdownTitle;           // Should be a String
        } else {
            console.warn("Site settings document ('site_config/mainProfile') not found. Using defaults.");
            // Defaults already set (false, false, null, null)
        }
        console.log("Settings fetched:", { maintenanceEnabled, hideTikTokSection, countdownTitle, countdownTargetDate: countdownTargetDate ? 'Exists' : 'Missing' });

    } catch (error) {
        console.error("Critical Error fetching site settings:", error);
        if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = `<p class="error">An error occurred loading site configuration: ${error.message}.</p>`; maintenanceMessageElement.style.display = 'block'; }
        if (mainContentWrapper) mainContentWrapper.style.display = 'none';
        if (countdownSection) countdownSection.style.display = 'none'; // Hide countdown on critical error
        return;
    }

    // --- Apply Maintenance Mode ---
    if (maintenanceEnabled) {
        console.log("Maintenance mode is ON. Hiding main content and countdown.");
        if (mainContentWrapper) mainContentWrapper.style.display = 'none';
        if (countdownSection) countdownSection.style.display = 'none'; // Hide countdown in maintenance
        if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = '<p>The site is currently undergoing maintenance. Please check back later.</p>'; maintenanceMessageElement.style.display = 'block'; }
        return; // Stop further execution
    } else {
        console.log("Maintenance mode is OFF. Proceeding with content display...");
        if (mainContentWrapper) mainContentWrapper.style.display = '';
        if (countdownSection) countdownSection.style.display = ''; // Show countdown section (if data is valid)
        if (maintenanceMessageElement) maintenanceMessageElement.style.display = 'none';
    }

    // --- Start Countdown (Pass fetched config) ---
    // It will handle its own visibility based on valid data now
    startEventCountdown(countdownTargetDate, countdownTitle);

    // --- Apply TikTok Visibility Logic ---
    if (tiktokHeaderContainer && tiktokGridContainer) {
        if (hideTikTokSection) {
            // Hide TikTok Section
            console.log("Hiding TikTok section based on settings.");
            tiktokHeaderContainer.style.display = 'none';
            tiktokGridContainer.style.display = 'none';
            if (tiktokUnavailableMessage) {
                tiktokUnavailableMessage.innerHTML = '<p style="margin:0; padding: 15px; text-align: center;"><strong>Notice:</strong> Due to current regulations in the United States, TikTok content is unavailable at this time.</p>';
                tiktokUnavailableMessage.style.display = 'block';
            } else { console.warn("TikTok unavailable message element not found."); }
        } else {
            // Show TikTok Section
            console.log("Showing TikTok section based on settings.");
            tiktokHeaderContainer.style.display = '';
            tiktokGridContainer.style.display = '';
            if (tiktokUnavailableMessage) {
                tiktokUnavailableMessage.style.display = 'none';
                tiktokUnavailableMessage.innerHTML = '';
            }
            // Load TikTok data ONLY if section is visible
            const timestampElement = tiktokHeaderContainer.querySelector('#tiktok-last-updated-timestamp');
            loadShoutoutPlatformData('tiktok', tiktokGridContainer, timestampElement);
        }
    } else {
        console.warn("Could not find TikTok header/grid containers to apply visibility logic.");
        if (tiktokUnavailableMessage) tiktokUnavailableMessage.style.display = 'none';
    }

    // --- Load ALL OTHER Content Sections ---
    console.log("Initiating loading of other content sections...");
    // Pass fetched profile data directly to avoid second fetch
    displayProfileData(siteSettings); // <<< Pass fetched data here

    const otherLoadPromises = [
        // displayProfileData is called above now
        displayPresidentData(),
        loadShoutoutPlatformData('instagram', instagramGridContainer, document.getElementById('instagram-last-updated-timestamp')),
        loadShoutoutPlatformData('youtube', youtubeGridContainer, document.getElementById('youtube-last-updated-timestamp')),
        loadAndDisplayUsefulLinks(),
        loadAndDisplaySocialLinks(),
        loadAndDisplayDisabilities(),
        loadAndDisplayTechItems(),
        loadAndDisplayFaqs() // This also attaches FAQ listeners after loading
    ];

    const otherResults = await Promise.allSettled(otherLoadPromises);
    otherResults.forEach((result, index) => {
        // Adjust index since displayProfileData is removed from promises
        const functionNames = ["President", "Instagram Shoutouts", "YouTube Shoutouts", "UsefulLinks", "SocialLinks", "Disabilities", "TechItems", "FAQs"];
        if (result.status === 'rejected') {
            console.error(`Error loading ${functionNames[index] || 'Unknown Section'}:`, result.reason);
        }
    });
    console.log("Other dynamic content loading initiated.");
}


// --- Call the main initialization function when the DOM is ready ---
document.addEventListener('DOMContentLoaded', initializeHomepageContent);
