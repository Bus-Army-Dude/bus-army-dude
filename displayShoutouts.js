// displayShoutouts.js

// Use the same Firebase config as in admin.js
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
// Optional: If using the TikTok region check from creatorshoutouts.js
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js"; // Only if needed

// --- Initialize Firebase ---
let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized for display.");
} catch (error) {
    console.error("Firebase initialization failed on index.html:", error);
    // Display a generic error message to the user on the page?
    const grids = document.querySelectorAll('.creator-grid, .instagram-creator-grid, .youtube-creator-grid');
    grids.forEach(grid => grid.innerHTML = '<p class="error">Could not load creator data. Failed to connect to database.</p>');
}

// --- Helper Function to Format Timestamps ---
function formatFirestoreTimestamp(firestoreTimestamp) {
    if (!firestoreTimestamp || !(firestoreTimestamp instanceof Timestamp)) {
        return 'N/A'; // Return 'N/A' or some default if the timestamp is invalid
    }
    try {
        const date = firestoreTimestamp.toDate(); // Convert Firebase Timestamp to JS Date
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return date.toLocaleString('en-US', { // Use appropriate locale
            timeZone: userTimeZone,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
    } catch (error) {
        console.error("Error formatting timestamp:", error);
        return 'Invalid Date';
    }
}

// --- Functions to Render Cards ---

function renderTikTokCard(account) {
    // This structure is based on your creatorshoutouts.js example
    return `
        <div class="creator-card">
            <img src="${account.profilePic || 'images/default-profile.jpg'}" alt="@${account.username}" class="creator-pic" onerror="this.src='images/default-profile.jpg'">
            <div class="creator-info">
                <div class="creator-header">
                    <h3>${account.nickname || 'N/A'} ${account.isVerified ? '<img src="check.png" alt="Verified" class="verified-badge">' : ''}</h3>
                </div>
                <p class="creator-username">@${account.username || 'N/A'}</p>
                <p class="creator-bio">${account.bio || ''}</p>
                <p class="follower-count">${account.followers || 'N/A'} Followers</p>
                <a href="https://tiktok.com/@${account.username}" target="_blank" rel="noopener noreferrer" class="visit-profile"> Visit Profile </a>
            </div>
        </div>
    `;
}

function renderInstagramCard(account) {
    // This structure is based on your creatorshoutouts.js example
    return `
        <div class="instagram-creator-card">
            <img src="${account.profilePic || 'images/default-profile.jpg'}" alt="${account.nickname}" class="instagram-creator-pic" onerror="this.src='images/default-profile.jpg'">
            <div class="instagram-creator-info">
                <div class="instagram-creator-header">
                    <h3>${account.nickname || 'N/A'} ${account.isVerified ? '<img src="instagramcheck.png" alt="Verified" class="instagram-verified-badge">' : ''}</h3>
                </div>
                <p class="instagram-creator-username">@${account.username || 'N/A'}</p>
                <p class="instagram-creator-bio">${account.bio || ''}</p>
                <p class="instagram-follower-count">${account.followers || 'N/A'} Followers</p>
                <a href="https://instagram.com/${account.username}" target="_blank" rel="noopener noreferrer" class="instagram-visit-profile"> Visit Profile </a>
            </div>
        </div>
    `;
}

function renderYouTubeCard(account) {
    // This structure is based on your creatorshoutouts.js example
     // Construct YouTube channel URL - NOTE: YouTube uses handles now, but @username might work for older links.
     // A more robust approach might store the full channel URL or channel ID in Firestore.
     // Using googleusercontent.com seems incorrect for a direct channel link. Let's use the standard format.
     const channelUrl = `https://www.youtube.com/@${account.username}`;

    return `
        <div class="youtube-creator-card">
            ${account.coverPhoto ? `<img src="${account.coverPhoto}" alt="${account.nickname} Cover Photo" class="youtube-cover-photo" onerror="this.style.display='none'">` : ''}
            <img src="${account.profilePic || 'images/default-profile.jpg'}" alt="@${account.username}" class="youtube-creator-pic" onerror="this.src='images/default-profile.jpg'">
            <div class="youtube-creator-info">
                <div class="youtube-creator-header">
                    <h3>${account.nickname || 'N/A'} ${account.isVerified ? '<img src="youtubecheck.png" alt="Verified" class="youtube-verified-badge">' : ''}</h3>
                </div>
                 <div class="username-container">
                    <p class="youtube-creator-username">@${account.username || 'N/A'}</p>
                 </div>
                <p class="youtube-creator-bio">${account.bio || ''}</p>
                <p class="youtube-subscriber-count">${account.subscribers || 'N/A'} Subscribers</p>
                <a href="${channelUrl}" target="_blank" rel="noopener noreferrer" class="youtube-visit-profile"> Visit Channel </a>
            </div>
        </div>
    `;
}


// --- Function to Load and Display Shoutouts ---
async function loadAndDisplayShoutouts() {
    if (!db) {
        console.error("Firestore database instance is not available.");
        return;
    }

    // Get references to containers and timestamp elements
    const tiktokGrid = document.querySelector('.creator-grid');
    const instagramGrid = document.querySelector('.instagram-creator-grid');
    const youtubeGrid = document.querySelector('.youtube-creator-grid');
    const tiktokTimestampEl = document.getElementById('tiktok-last-updated-timestamp');
    const instagramTimestampEl = document.getElementById('lastUpdatedInstagram');
    const youtubeTimestampEl = document.getElementById('lastUpdatedYouTube');

    // Show loading state
    if (tiktokGrid) tiktokGrid.innerHTML = '<p>Loading TikTok Creators...</p>';
    if (instagramGrid) instagramGrid.innerHTML = '<p>Loading Instagram Creators...</p>';
    if (youtubeGrid) youtubeGrid.innerHTML = '<p>Loading YouTube Creators...</p>';

    try {
        // 1. Fetch Shoutout Data (ordered by the 'order' field)
        const shoutoutsCol = collection(db, 'shoutouts');
        // Create a query to order by the 'order' field, ascending
        const shoutoutQuery = query(shoutoutsCol, orderBy("order", "asc"));
        const querySnapshot = await getDocs(shoutoutQuery);

        const shoutouts = {
            tiktok: [],
            instagram: [],
            youtube: []
        };

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Ensure platform exists and is one of the expected types
            if (data.platform && shoutouts.hasOwnProperty(data.platform)) {
                shoutouts[data.platform].push({ id: doc.id, ...data });
            } else {
                console.warn(`Document ${doc.id} has missing or unknown platform: ${data.platform}`);
            }
        });

        // 2. Fetch Metadata (Last Updated Times)
        const metaRef = doc(db, 'siteConfig', 'shoutoutsMetadata');
        const metaSnap = await getDoc(metaRef);
        const metadata = metaSnap.exists() ? metaSnap.data() : {};

        // 3. Render TikTok
        if (tiktokGrid) {
             // --- Optional: TikTok Region Check (Adapt from creatorshoutouts.js if needed) ---
             // const userRegion = await getUserRegion(); // Implement getUserRegion if using
             // const regionAvailability = metadata.regionAvailability || {}; // Fetch availability from Firestore? Or keep static?
             // if (regionAvailability[userRegion]) {
                 if (shoutouts.tiktok.length > 0) {
                     tiktokGrid.innerHTML = shoutouts.tiktok.map(renderTikTokCard).join('');
                 } else {
                     tiktokGrid.innerHTML = '<p>No TikTok creators featured currently.</p>';
                 }
             // } else {
             //     showUnavailableMessage(userRegion); // Implement showUnavailableMessage
             //     tiktokGrid.innerHTML = ''; // Clear loading
             // }
        }
        if (tiktokTimestampEl) {
            tiktokTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_tiktok)}`;
        }

        // 4. Render Instagram
        if (instagramGrid) {
            if (shoutouts.instagram.length > 0) {
                instagramGrid.innerHTML = shoutouts.instagram.map(renderInstagramCard).join('');
            } else {
                instagramGrid.innerHTML = '<p>No Instagram creators featured currently.</p>';
            }
        }
        if (instagramTimestampEl) {
            instagramTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_instagram)}`;
        }

        // 5. Render YouTube
        if (youtubeGrid) {
            if (shoutouts.youtube.length > 0) {
                youtubeGrid.innerHTML = shoutouts.youtube.map(renderYouTubeCard).join('');
            } else {
                youtubeGrid.innerHTML = '<p>No YouTube creators featured currently.</p>';
            }
        }
        if (youtubeTimestampEl) {
            youtubeTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_youtube)}`;
        }

    } catch (error) {
        console.error("Error loading shoutout data:", error);
        if (tiktokGrid) tiktokGrid.innerHTML = '<p class="error">Error loading TikTok creators.</p>';
        if (instagramGrid) instagramGrid.innerHTML = '<p class="error">Error loading Instagram creators.</p>';
        if (youtubeGrid) youtubeGrid.innerHTML = '<p class="error">Error loading YouTube creators.</p>';
         // Also update timestamps to show error?
        if (tiktokTimestampEl) tiktokTimestampEl.textContent = 'Last Updated: Error';
        if (instagramTimestampEl) instagramTimestampEl.textContent = 'Last Updated: Error';
        if (youtubeTimestampEl) youtubeTimestampEl.textContent = 'Last Updated: Error';
    }
}

// --- Run the function when the DOM is ready ---
// Use DOMContentLoaded for better performance than window.onload
document.addEventListener('DOMContentLoaded', loadAndDisplayShoutouts);
