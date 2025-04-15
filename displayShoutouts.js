// displayShoutouts.js (Complete with President, Disabilities, & Tech Items Sections)

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
let shoutoutsMetaRef;
let usefulLinksCollectionRef;
let socialLinksCollectionRef;
let disabilitiesCollectionRef; // Added
let techItemsCollectionRef; // Added

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    // Assign references
    profileDocRef = doc(db, "site_config", "mainProfile");
    presidentDocRef = doc(db, "site_config", "currentPresident");
    shoutoutsMetaRef = doc(db, 'siteConfig', 'shoutoutsMetadata');
    usefulLinksCollectionRef = collection(db, "useful_links");
    socialLinksCollectionRef = collection(db, "social_links");
    disabilitiesCollectionRef = collection(db, "disabilities"); // Assign Disabilities ref
    techItemsCollectionRef = collection(db, "tech_items");       // Assign Tech Items ref
    firebaseAppInitialized = true;
    console.log("Firebase initialized for display.");
} catch (error) {
    console.error("Firebase initialization failed on index.html:", error);
    const body = document.body;
    if (body) { body.innerHTML = '<p class="error" style="text-align: center; padding: 50px; color: red;">Could not connect to database services. Site unavailable.</p>'; }
    firebaseAppInitialized = false;
}

// --- Helper Function to Format Timestamps ---
function formatFirestoreTimestamp(firestoreTimestamp) { /* ... function content as provided before ... */ }

// --- Functions to Render Shoutout Cards ---
function renderTikTokCard(account) { /* ... function content as provided before ... */ }
function renderInstagramCard(account) { /* ... function content as provided before ... */ }
function renderYouTubeCard(account) { /* ... function content as provided before ... */ }

// --- Function to Load and Display Profile Data ---
async function displayProfileData() { /* ... function content as provided before ... */ }

// --- Function to Load and Display Shoutouts ---
async function loadAndDisplayShoutouts() { /* ... function content as provided before ... */ }

// --- Function to Load and Display Useful Links ---
async function loadAndDisplayUsefulLinks() { /* ... function content as provided before ... */ }

// --- Function to Load and Display Social Links ---
async function loadAndDisplaySocialLinks() { /* ... function content as provided before ... */ }

// --- Function to Load and Display President Data ---
async function displayPresidentData() { /* ... function content as provided before ... */ }

// --- Function to Load and Display Disabilities ---
async function loadAndDisplayDisabilities() {
    const placeholderElement = document.getElementById('disabilities-list-placeholder'); // Target the UL
    if (!placeholderElement) { console.warn("Disabilities placeholder missing."); return; }
    placeholderElement.innerHTML = '<li>Loading...</li>';
    if (!firebaseAppInitialized || !db) { console.error("Disabilities load: Firebase not ready."); placeholderElement.innerHTML = '<li>Error (DB Init Error).</li>'; return; }
    if (!disabilitiesCollectionRef) { console.error("Disabilities load: Collection ref missing."); placeholderElement.innerHTML = '<li>Error (Config Error).</li>'; return; }
    try {
        const disabilityQuery = query(disabilitiesCollectionRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(disabilityQuery);
        placeholderElement.innerHTML = ''; // Clear loading
        if (querySnapshot.empty) { placeholderElement.innerHTML = '<li>No specific information available.</li>'; }
        else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.name && data.url) { const listItem = document.createElement('li'); const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.textContent = data.name; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; listItem.appendChild(linkElement); placeholderElement.appendChild(listItem); } else { console.warn("Skipping disability item:", doc.id); } }); }
        console.log(`Displayed ${querySnapshot.size} disability links.`);
    } catch (error) { console.error("Error loading disabilities:", error); if (error.code === 'failed-precondition') { placeholderElement.innerHTML = '<li>Error: DB config needed.</li>'; console.error("Missing Firestore index for disabilities (order)."); } else { placeholderElement.innerHTML = '<li>Could not load list.</li>'; } }
}

// --- Function to Load and Display Tech Items (NEW) ---
async function loadAndDisplayTechItems() {
    const placeholderElement = document.getElementById('tech-info-placeholder');
    if (!placeholderElement) { console.warn("Tech info placeholder element missing."); return; }
    placeholderElement.innerHTML = '<p style="text-align: center; padding: 20px;">Loading tech info...</p>';
    if (!firebaseAppInitialized || !db) { console.error("Tech info load error: Firebase not ready."); placeholderElement.innerHTML = '<p class="error">Could not load tech info (DB Init Error).</p>'; return; }
    if (!techItemsCollectionRef) { console.error("Tech info load error: Collection ref missing."); placeholderElement.innerHTML = '<p class="error">Could not load tech info (Config Error).</p>'; return; }

    try {
        const techQuery = query(techItemsCollectionRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(techQuery);

        let techHTML = `<div class="tech-section section"><h2><i class="fas fa-microchip"></i> Tech Information</h2>`; // Start building HTML

        if (querySnapshot.empty) {
            techHTML += '<p>No tech items available.</p>';
        } else {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const health = parseInt(data.batteryHealth);
                const cycles = data.batteryCycles; // Keep as number or null/undefined

                // Determine icon based on type (add more types as needed)
                let iconClass = 'fas fa-microchip'; // Default
                if (data.deviceType?.toLowerCase() === 'phone') iconClass = 'fas fa-mobile-alt';
                else if (data.deviceType?.toLowerCase() === 'watch') iconClass = 'fas fa-stopwatch';
                else if (data.deviceType?.toLowerCase() === 'computer' || data.deviceType?.toLowerCase() === 'mac') iconClass = 'fas fa-desktop';

                techHTML += `
                    <div class="tech-item">
                        <h3><i class="${iconClass}"></i> ${data.deviceName || 'N/A'}</h3>
                        ${data.model ? `<div class="tech-detail"><i class="fas fa-info-circle"></i><span>Model:</span> ${data.model}</div>` : ''}
                        ${data.material ? `<div class="tech-detail"><i class="fas fa-layer-group"></i><span>Material:</span> ${data.material}</div>` : ''}
                        ${data.storage ? `<div class="tech-detail"><i class="fas fa-hdd"></i><span>Storage:</span> ${data.storage}</div>` : ''}
                        ${data.capacity ? `<div class="tech-detail"><i class="fas fa-battery-full"></i><span>Battery Capacity:</span> ${data.capacity}</div>` : ''}
                        ${data.color ? `<div class="tech-detail"><i class="fas fa-palette"></i><span>Color:</span> ${data.color}</div>` : ''}
                        ${data.price ? `<div class="tech-detail"><i class="fas fa-tag"></i><span>Price:</span> ${data.price}</div>` : ''}
                        ${data.released ? `<div class="tech-detail"><i class="fas fa-calendar-plus"></i><span>Date Released:</span> ${data.released}</div>` : ''}
                        ${data.bought ? `<div class="tech-detail"><i class="fas fa-shopping-cart"></i><span>Date Bought:</span> ${data.bought}</div>` : ''}
                        ${data.osVersion ? `<div class="tech-detail"><i class="fab fa-apple"></i><span>OS Version:</span> ${data.osVersion}</div>` : ''}
                `;
                // Conditionally add Battery Health and Cycles if they exist and are valid numbers
                if (health && !isNaN(health)) {
                    techHTML += `
                        <div class="tech-detail"><i class="fas fa-heart"></i><span>Battery Health:</span></div>
                        <div class="battery-container"> <div class="battery-icon">
                            <div class="battery-level" style="width: ${health}%;"></div>
                            <div class="battery-percentage">${health}%</div>
                        </div> </div>
                    `;
                }
                 if (cycles && !isNaN(cycles)) {
                    techHTML += `<div class="tech-detail"><i class="fas fa-sync"></i><span>Battery Charge Cycles:</span> ${cycles}</div>`;
                }
                techHTML += `</div>`; // Close tech-item div
            });
        }
        techHTML += `</div>`; // Close tech-section div
        placeholderElement.innerHTML = techHTML; // Insert the complete HTML
        console.log(`Displayed ${querySnapshot.size} tech items.`);

    } catch (error) {
        console.error("Error loading or displaying tech items:", error);
        if (error.code === 'failed-precondition') { placeholderElement.innerHTML = '<p class="error">Error loading tech info (DB config needed).</p>'; console.error("Missing Firestore index for tech_items (order)."); }
        else { placeholderElement.innerHTML = '<p class="error">Could not load tech info.</p>'; }
    }
}

// --- Global variable declarations ---
let maintenanceMessageElement;
let mainContentWrapper;
let usefulLinksContainerElement;
let socialLinksContainerElement;

// --- Run functions when the DOM is ready ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM loaded. Checking Firebase status and maintenance mode...");
    maintenanceMessageElement = document.getElementById('maintenanceModeMessage'); mainContentWrapper = document.querySelector('.container'); usefulLinksContainerElement = document.querySelector('.useful-links-section .links-container'); socialLinksContainerElement = document.querySelector('.social-links-container');

    if (!firebaseAppInitialized) { console.error("Firebase not ready. Site cannot load."); if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = '<p class="error">Site cannot load (Connection Error).</p>'; maintenanceMessageElement.style.display = 'block'; } else { const eb = document.createElement('div'); eb.innerHTML = '<p class="error">Site cannot load (Connection Error).</p>'; document.body.prepend(eb); } if (mainContentWrapper) mainContentWrapper.style.display = 'none'; return; }

    try { console.log("Checking maintenance mode..."); if (!profileDocRef) { throw new Error("profileDocRef missing."); } const configSnap = await getDoc(profileDocRef); let maintenanceEnabled = configSnap.exists() ? (configSnap.data()?.isMaintenanceModeEnabled || false) : false; console.log("Maintenance mode:", maintenanceEnabled);
        if (maintenanceEnabled) { console.log("Maintenance mode ON."); if (mainContentWrapper) { mainContentWrapper.style.display = 'none'; } if (maintenanceMessageElement) { maintenanceMessageElement.style.display = 'block'; } else { console.error("Maintenance msg element missing!"); } return; }
        else { console.log("Maintenance mode OFF. Loading content."); if (mainContentWrapper) { mainContentWrapper.style.display = ''; } if (maintenanceMessageElement) { maintenanceMessageElement.style.display = 'none'; }
            // Load ALL dynamic content
            if (typeof displayProfileData === 'function') { displayProfileData(); } else { console.error("displayProfileData missing!"); }
            if (typeof displayPresidentData === 'function') { displayPresidentData(); } else { console.error("displayPresidentData missing!"); }
            if (typeof loadAndDisplayShoutouts === 'function') { loadAndDisplayShoutouts(); } else { console.error("loadAndDisplayShoutouts missing!"); }
            if (typeof loadAndDisplayUsefulLinks === 'function') { if(usefulLinksContainerElement) { loadAndDisplayUsefulLinks(); } else { console.warn("Useful links container missing."); } } else { console.error("loadAndDisplayUsefulLinks missing!"); }
            if (typeof loadAndDisplaySocialLinks === 'function') { if (socialLinksContainerElement) { loadAndDisplaySocialLinks(); } else { console.warn("Social links container missing."); } } else { console.error("loadAndDisplaySocialLinks missing!"); }
            if (typeof loadAndDisplayDisabilities === 'function') { loadAndDisplayDisabilities(); } else { console.error("loadAndDisplayDisabilities missing!"); } // Load Disabilities
            if (typeof loadAndDisplayTechItems === 'function') { loadAndDisplayTechItems(); } else { console.error("loadAndDisplayTechItems missing!"); } // Load Tech Items

        }
    } catch (error) { console.error("Error during DOMContentLoaded:", error); if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = `<p class="error">Error loading site: ${error.message}</p>`; maintenanceMessageElement.style.display = 'block'; } else { const eb = document.createElement('div'); eb.innerHTML = `<p class="error">Error loading site: ${error.message}</p>`; document.body.prepend(eb); } if (mainContentWrapper) mainContentWrapper.style.display = 'none'; }
}); // End DOMContentLoaded listener
