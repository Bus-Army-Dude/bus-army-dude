// displayShoutouts.js (Includes Profile, Shoutouts, and Business Hours Display Logic)

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyCIZ0fri5V1E2si1xXpBPQQJqj1F_KuuG0", // Use your actual API key
    authDomain: "busarmydudewebsite.firebaseapp.com",
    projectId: "busarmydudewebsite",
    storageBucket: "busarmydudewebsite.appspot.com", // Standard format usually ends with .appspot.com
    messagingSenderId: "42980404680",
    appId: "1:42980404680:web:f4f1e54789902a4295e4fd",
    measurementId: "G-DQPH8YL789", // Optional
    databaseURL: "https://busarmydudewebsite-default-rtdb.firebaseio.com" // <<<--- ADD/VERIFY YOUR REALTIME DATABASE URL HERE!
};

// --- Firebase SDK Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, Timestamp, orderBy, query } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js"; // <<< Added RTDB imports

// --- Firebase Initialization ---
let db; // Firestore instance
let rtdb; // Realtime Database instance
let firebaseAppInitialized = false; // Flag to track initialization status

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);       // Initialize Firestore
    rtdb = getDatabase(app);      // Initialize Realtime Database <<< ADDED
    firebaseAppInitialized = true; // Set flag on successful initialization
    console.log("Firebase initialized successfully (Firestore & RTDB).");
} catch (error) {
    console.error("Firebase initialization failed:", error);
    firebaseAppInitialized = false;
    // Display error messages for relevant sections if init fails
    const grids = document.querySelectorAll('.creator-grid, .instagram-creator-grid, .youtube-creator-grid');
    grids.forEach(grid => { if (grid) grid.innerHTML = '<p class="error">Site Error: DB Connection Failed.</p>'; });

    const profileBio = document.getElementById('profile-bio-main');
    if (profileBio) profileBio.textContent = 'Error loading site data.';
    // Set other profile defaults on error
    const profileUsernameElement = document.getElementById('profile-username-main');
    const profilePicElement = document.getElementById('profile-pic-main');
    const profileStatusElement = document.getElementById('profile-status-main');
    if (profileUsernameElement) profileUsernameElement.textContent = "Username";
    if (profilePicElement) profilePicElement.src = "images/default-profile.jpg"; // <<< Use default path
    if (profileStatusElement) profileStatusElement.textContent = '❓';

    // Business Hours Error Display on Init Failure <<< ADDED
    const hoursContainer = document.getElementById('hours-container');
    if (hoursContainer) hoursContainer.innerHTML = '<p class="error">Error loading hours (DB Init).</p>';
    const statusElement = document.getElementById('open-status');
    if (statusElement) statusElement.textContent = 'Error';
}

// ======================================================
// === Helper Functions ===
// ======================================================

// --- Timestamp Formatter (Existing - Firestore) ---
function formatFirestoreTimestamp(firestoreTimestamp) {
    if (!firestoreTimestamp || !(firestoreTimestamp instanceof Timestamp)) { return 'N/A'; }
    try {
        const date = firestoreTimestamp.toDate();
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // Example format: Long Day, Month Date, Year, Time AM/PM (in user's timezone)
        return date.toLocaleString('en-US', {
            timeZone: userTimeZone,
            weekday: 'long', // Optional: Add if needed
            year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: 'numeric', /* second: 'numeric', */ hour12: true
        });
    } catch (error) {
        console.error("Error formatting timestamp:", error);
        return 'Invalid Date';
    }
}

// --- Capitalize Helper (for Business Hours) ---
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Timezone Conversion Helper (for Business Hours) ---
// Converts time string (like "HH:MM AM/PM") stored in EST/EDT to user's local timezone string
function convertTimeToTimezone(timeStr, toTimezone, baseDate = new Date()) {
    if (!timeStr || typeof timeStr !== 'string') return "Invalid Time";

    // Regex to handle H:MM, HH:MM, optional space, AM/PM (case-insensitive)
    const parts = timeStr.match(/(\d{1,2}):(\d{2})\s?(AM|PM)?/i);
    if (!parts) {
        console.warn(`Invalid time format for conversion: ${timeStr}`);
        return "Invalid Format";
    }

    let [, hoursStr, minutesStr, period] = parts;
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) return "Invalid Time";

    // Adjust hours for AM/PM
    if (period) {
        period = period.toUpperCase();
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0; // Midnight case
    } // Assumes 24-hour if period is missing, adjust if needed

    // Create a date object pretending it's already in New York time zone for calculation simplicity
    // Note: Timezone handling in vanilla JS is tricky, especially with DST. Libraries like Luxon are more robust.
    // This approach tries to get the correct wall-clock time formatted for the target zone.
    try {
        // Get a formatter specifically for NY time
        const nyFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York', // Handles EST/EDT automatically
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false
        });
        // Format the base date (today) in NY time to get current date parts in that zone
        const nyDateParts = nyFormatter.formatToParts(baseDate).reduce((acc, part) => {
            acc[part.type] = part.value; return acc;
        }, {});

        // Construct a string representing the time in NY timezone on today's date there
        const dateStringInNY = `${nyDateParts.month}/${nyDateParts.day}/${nyDateParts.year}, ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
        const dateInNY = new Date(dateStringInNY); // Parse the date string, assuming it represents NY time

        // Now format this conceptual NY time into the user's target timezone
        return dateInNY.toLocaleTimeString('en-US', {
            timeZone: toTimezone,
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        console.error("Error converting time to timezone:", error, `Input: ${timeStr}`, `Target Zone: ${toTimezone}`);
        return "Error";
    }
}


// --- Time Parsing Helper (for Business Hours) ---
// Parses time string "HH:MM AM/PM" into minutes from midnight (0-1439)
function parseTimeEST(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return NaN;
    const parts = timeStr.match(/(\d{1,2}):(\d{2})\s?(AM|PM)?/i);
    if (!parts) return NaN;

    let [, hoursStr, minutesStr, period] = parts;
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

     if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return NaN; // Basic validation

    if (period) {
        period = period.toUpperCase();
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0; // Midnight case
    }
    return hours * 60 + minutes; // Total minutes from midnight
}

// --- Get Current Time in EST Helper (for Business Hours) ---
// Returns current time in America/New_York as { hours, minutes, totalMinutes }
function getCurrentTimeInEST() {
    const now = new Date();
    // Use options ensuring we get 24-hour format for calculation
    const options = { timeZone: 'America/New_York', hour: 'numeric', minute: 'numeric', hour12: false };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(now);
    let hours = 0, minutes = 0;
    parts.forEach(part => {
        if (part.type === 'hour') hours = parseInt(part.value, 10);
        if (part.type === 'minute') minutes = parseInt(part.value, 10);
    });
     // Handle potential 24:00 case from formatter, treat as 00:00
     if (hours === 24) hours = 0;
    return { hours, minutes, totalMinutes: hours * 60 + minutes };
}

// --- Get Current Day/Date in EST Helpers (for Business Hours) ---
function getDayOfWeekEST() { // Returns lowercase day name e.g., "friday"
    return new Date().toLocaleString("en-US", { weekday: 'long', timeZone: 'America/New_York' }).toLowerCase();
}
function getTodayDateEST() { // Returns date string in YYYY-MM-DD format
    return new Date().toLocaleDateString("en-CA", { timeZone: 'America/New_York' });
}


// ======================================================
// === Shoutout Card Rendering Functions (Existing) ===
// ======================================================
function renderTikTokCard(account) {
 return `
     <div class="creator-card">
         <img src="${account.profilePic || 'images/default-profile.jpg'}" alt="@${account.username}" class="creator-pic" onerror="this.src='images/default-profile.jpg'">
         <div class="creator-info">
             <div class="creator-header"><h3>${account.nickname || 'N/A'} ${account.isVerified ? '<img src="images/check.png" alt="Verified" class="verified-badge">' : ''}</h3></div> {/* <<< Check path */}
             <p class="creator-username">@${account.username || 'N/A'}</p>
             <p class="creator-bio">${account.bio || ''}</p>
             <p class="follower-count">${account.followers || 'N/A'} Followers</p>
             <a href="https://tiktok.com/@${account.username}" target="_blank" rel="noopener noreferrer" class="visit-profile"> Visit Profile </a>
         </div>
     </div>`;
}
function renderInstagramCard(account) {
 return `
     <div class="instagram-creator-card">
         <img src="${account.profilePic || 'images/default-profile.jpg'}" alt="${account.nickname}" class="instagram-creator-pic" onerror="this.src='images/default-profile.jpg'">
         <div class="instagram-creator-info">
             <div class="instagram-creator-header"><h3>${account.nickname || 'N/A'} ${account.isVerified ? '<img src="images/instagramcheck.png" alt="Verified" class="instagram-verified-badge">' : ''}</h3></div> {/* <<< Check path */}
             <p class="instagram-creator-username">@${account.username || 'N/A'}</p>
             <p class="instagram-creator-bio">${account.bio || ''}</p>
             <p class="instagram-follower-count">${account.followers || 'N/A'} Followers</p>
             <a href="https://instagram.com/${account.username}" target="_blank" rel="noopener noreferrer" class="instagram-visit-profile"> Visit Profile </a>
         </div>
     </div>`;
}
function renderYouTubeCard(account) {
     // Standard YouTube handle URL
     const channelUrl = `https://www.youtube.com/@${account.username}`;
     return `
        <div class="youtube-creator-card">
            ${account.coverPhoto ? `<img src="${account.coverPhoto}" alt="${account.nickname} Cover Photo" class="youtube-cover-photo" onerror="this.style.display='none'">` : ''}
            <img src="${account.profilePic || 'images/default-profile.jpg'}" alt="@${account.username}" class="youtube-creator-pic" onerror="this.src='images/default-profile.jpg'">
            <div class="youtube-creator-info">
                <div class="youtube-creator-header"><h3>${account.nickname || 'N/A'} ${account.isVerified ? '<img src="images/youtubecheck.png" alt="Verified" class="youtube-verified-badge">' : ''}</h3></div> {/* <<< Check path */}
                <div class="username-container"><p class="youtube-creator-username">@${account.username || 'N/A'}</p></div>
                <p class="youtube-creator-bio">${account.bio || ''}</p>
                <p class="youtube-subscriber-count">${account.subscribers || 'N/A'} Subscribers</p>
                <a href="${channelUrl}" target="_blank" rel="noopener noreferrer" class="youtube-visit-profile"> Visit Channel </a>
            </div>
        </div>`;
}


// ======================================================
// === Profile Section Display Logic (Existing) ===
// ======================================================
const profileUsernameElement = document.getElementById('profile-username-main');
const profilePicElement = document.getElementById('profile-pic-main');
const profileBioElement = document.getElementById('profile-bio-main');
const profileStatusElement = document.getElementById('profile-status-main');

const defaultUsername = "Username";
const defaultBio = "";
const defaultProfilePic = "images/default-profile.jpg"; // <<< --- IMPORTANT: UPDATE THIS PATH IF NEEDED!!
const defaultStatusEmoji = '❓';
const statusEmojis = { online: '🟢', away: '🟡', offline: '🔴' };

async function displayProfileData() {
    // Check if Firestore is ready
    if (!firebaseAppInitialized || !db) {
        console.error("Profile Fetch Error: Firebase Firestore not ready.");
        if (profileBioElement) profileBioElement.textContent = "Error loading profile (DB Init).";
        if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername;
        if (profilePicElement) profilePicElement.src = defaultProfilePic;
        if (profileStatusElement) profileStatusElement.textContent = defaultStatusEmoji;
        return;
    }

    // Check if required HTML elements exist
    if (!profileUsernameElement || !profilePicElement || !profileBioElement || !profileStatusElement) {
        console.warn("Profile display warning: One or more HTML elements missing. Check IDs: profile-username-main, profile-pic-main, profile-bio-main, profile-status-main.");
    }

    const profileDocRef = doc(db, "site_config", "mainProfile"); // <<< VERIFY THIS FIRESTORE PATH

    try {
        console.log("Fetching profile data for homepage from Firestore path:", profileDocRef.path);
        const docSnap = await getDoc(profileDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Firestore Profile data found:", data);
            if (profileUsernameElement) profileUsernameElement.textContent = data.username || defaultUsername;
            if (profilePicElement) profilePicElement.src = data.profilePicUrl || defaultProfilePic;
            if (profileBioElement) profileBioElement.textContent = data.bio || defaultBio;
            if (profileStatusElement) {
                const statusKey = data.status || 'offline'; // Default to offline if missing
                profileStatusElement.textContent = statusEmojis[statusKey] || defaultStatusEmoji;
            }
        } else {
            console.warn(`Firestore Profile document ('${profileDocRef.path}') not found. Displaying defaults.`);
            if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername;
            if (profilePicElement) profilePicElement.src = defaultProfilePic;
            if (profileBioElement) profileBioElement.textContent = defaultBio;
            if (profileStatusElement) profileStatusElement.textContent = statusEmojis['offline'];
        }
        console.log("Profile section updated.");
    } catch (error) {
        console.error("Error fetching/displaying profile data from Firestore:", error);
        // Set defaults/error messages on fetch error
        if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername;
        if (profilePicElement) profilePicElement.src = defaultProfilePic;
        if (profileBioElement) profileBioElement.textContent = "Error loading bio.";
        if (profileStatusElement) profileStatusElement.textContent = '❓';
    }
}

// ======================================================
// === Shoutout Display Logic (Existing - Firestore) ===
// ======================================================
async function loadAndDisplayShoutouts() {
    // Check if Firestore is ready
    if (!firebaseAppInitialized || !db) {
        console.error("Shoutout load error: Firebase Firestore not ready.");
        const tGrid = document.querySelector('.creator-grid'), iGrid = document.querySelector('.instagram-creator-grid'), yGrid = document.querySelector('.youtube-creator-grid');
        if(tGrid) tGrid.innerHTML = '<p class="error">Error: DB connection failed.</p>';
        if(iGrid) iGrid.innerHTML = '<p class="error">Error: DB connection failed.</p>';
        if(yGrid) yGrid.innerHTML = '<p class="error">Error: DB connection failed.</p>';
        return;
    }

    const tiktokGrid = document.querySelector('.creator-grid');
    const instagramGrid = document.querySelector('.instagram-creator-grid');
    const youtubeGrid = document.querySelector('.youtube-creator-grid');
    // Metadata elements - uncomment if you use them
    // const tiktokTimestampEl = document.getElementById('tiktok-last-updated-timestamp');
    // const instagramTimestampEl = document.getElementById('lastUpdatedInstagram');
    // const youtubeTimestampEl = document.getElementById('lastUpdatedYouTube');

    if (tiktokGrid) tiktokGrid.innerHTML = '<p>Loading TikTok...</p>';
    if (instagramGrid) instagramGrid.innerHTML = '<p>Loading Instagram...</p>';
    if (youtubeGrid) youtubeGrid.innerHTML = '<p>Loading YouTube...</p>';

    try {
        const shoutoutsCol = collection(db, 'shoutouts'); // <<< VERIFY THIS FIRESTORE COLLECTION NAME
        const shoutoutQuery = query(shoutoutsCol, orderBy("order", "asc"));
        console.log("Fetching shoutouts from Firestore...");
        const querySnapshot = await getDocs(shoutoutQuery);
        console.log(`Found ${querySnapshot.size} shoutout documents.`);

        const shoutouts = { tiktok: [], instagram: [], youtube: [] };
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.platform && shoutouts.hasOwnProperty(data.platform)) {
                shoutouts[data.platform].push({ id: doc.id, ...data });
            } else {
                console.warn(`Shoutout Doc ${doc.id} missing/unknown platform: ${data.platform}`);
            }
        });

        // Render TikTok
        if (tiktokGrid) {
            tiktokGrid.innerHTML = shoutouts.tiktok.length > 0
                ? shoutouts.tiktok.map(renderTikTokCard).join('')
                : '<p>No TikTok creators featured yet.</p>';
        }

        // Render Instagram
        if (instagramGrid) {
            instagramGrid.innerHTML = shoutouts.instagram.length > 0
                ? shoutouts.instagram.map(renderInstagramCard).join('')
                : '<p>No Instagram creators featured yet.</p>';
        }

        // Render YouTube
        if (youtubeGrid) {
            youtubeGrid.innerHTML = shoutouts.youtube.length > 0
                ? shoutouts.youtube.map(renderYouTubeCard).join('')
                : '<p>No YouTube creators featured yet.</p>';
        }

        // --- Metadata Display (Optional - Uncomment and verify path if needed) ---
        /*
        const metaRef = doc(db, 'siteConfig', 'shoutoutsMetadata'); // <<< VERIFY METADATA PATH
        console.log("Attempting to fetch metadata from Firestore:", metaRef.path);
        const metaSnap = await getDoc(metaRef);
        const metadata = metaSnap.exists() ? metaSnap.data() : {};
        console.log("Metadata fetched:", metadata);
        if (tiktokTimestampEl) tiktokTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_tiktok)}`;
        if (instagramTimestampEl) instagramTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_instagram)}`;
        if (youtubeTimestampEl) youtubeTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_youtube)}`;
        */

        console.log("Shoutout sections updated.");

    } catch (error) {
        console.error("Error loading shoutout data from Firestore:", error);
        if (tiktokGrid) tiktokGrid.innerHTML = '<p class="error">Error loading TikTok creators.</p>';
        if (instagramGrid) instagramGrid.innerHTML = '<p class="error">Error loading Instagram creators.</p>';
        if (youtubeGrid) youtubeGrid.innerHTML = '<p class="error">Error loading YouTube creators.</p>';
        // if (tiktokTimestampEl) tiktokTimestampEl.textContent = 'Last Updated: Error';
        // if (instagramTimestampEl) instagramTimestampEl.textContent = 'Last Updated: Error';
        // if (youtubeTimestampEl) youtubeTimestampEl.textContent = 'Last Updated: Error';
    }
}


// ======================================================
// === NEW START: Business Hours Display Logic (RTDB) ===
// ======================================================

// --- Select Business Hours HTML Elements ---
const userTimezoneElement = document.getElementById("user-timezone");
const hoursContainer = document.getElementById("hours-container");
const statusElement = document.getElementById("open-status");
const holidayAlertElement = document.getElementById("holiday-alert");
const holidayNameElement = document.getElementById("holiday-name");
const holidayHoursElement = document.getElementById("holiday-hours");
const tempAlertElement = document.getElementById("temporary-alert");
const tempHoursElement = document.getElementById("temporary-hours");
const tempReasonElement = document.getElementById("temporary-reason");

// --- Function to Render Regular Business Hours UI (from RTDB data) ---
function renderBusinessHoursUI(regularHours) {
    if (!hoursContainer) {
        console.warn("Business Hours: #hours-container not found in HTML.");
        return;
    }

    hoursContainer.innerHTML = ""; // Clear previous/loading state
    const displayOrder = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    let userTimezone;
    try {
        userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
        console.error("Could not determine user timezone.", e);
        userTimezone = "UTC"; // Fallback timezone
    }
    const currentDayLocal = new Date().toLocaleString("en-US", { weekday: "long", timeZone: userTimezone }).toLowerCase();

    displayOrder.forEach(day => {
        const hours = regularHours?.[day] || { open: null, close: null };
        const { open, close } = hours;

        const convertedOpen = open ? convertTimeToTimezone(open, userTimezone) : "Closed";
        const convertedClose = close ? convertTimeToTimezone(close, userTimezone) : "";

        const dayElement = document.createElement("div");
        dayElement.classList.add("hours-row");
        if (day === currentDayLocal) {
            dayElement.classList.add("current-day");
        }

        let displayHours = "Closed";
        if (convertedOpen !== "Closed" && convertedOpen !== "Invalid Format" && convertedOpen !== "Error") {
            displayHours = (convertedClose && convertedClose !== "Invalid Format" && convertedClose !== "Error")
                ? `${convertedOpen} - ${convertedClose}`
                : `Opens ${convertedOpen}`; // Handle open time only
        }

        dayElement.innerHTML = `<strong>${capitalize(day)}:</strong> <span>${displayHours}</span>`;
        hoursContainer.appendChild(dayElement);
    });
}

// --- Function to Calculate and Update Business Status (from RTDB data) ---
function calculateAndUpdateStatus(businessData) {
    if (!statusElement) {
         console.warn("Business Hours: #open-status element not found in HTML.");
        return; // Exit if status element doesn't exist
    }

    // Ensure data structure exists, provide defaults if not
    const regular = businessData?.regular || {};
    const holidays = businessData?.holidays || {};
    const temporary = businessData?.temporary || {}; // Should be object keyed by date

    let calculatedStatus = "Closed"; // Default status
    let activeHoliday = null;
    let activeTemporary = null;
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;


    // Reset alerts
    if (holidayAlertElement) holidayAlertElement.style.display = "none";
    if (tempAlertElement) tempAlertElement.style.display = "none";


    try {
        const nowEST = getCurrentTimeInEST();
        const currentMinutesEST = nowEST.totalMinutes;
        const dayOfWeekEST = getDayOfWeekEST();
        const todayDateEST = getTodayDateEST(); // YYYY-MM-DD

        // 1. Check Temporary Closures FIRST
        const todaysTemporaryClosures = temporary[todayDateEST]; // Object like { pushId1: {from:..., to:...}, pushId2: ... }
        if (todaysTemporaryClosures && typeof todaysTemporaryClosures === 'object') {
            for (const key in todaysTemporaryClosures) {
                const tempClosure = todaysTemporaryClosures[key];
                const fromMinutes = parseTimeEST(tempClosure.from);
                const toMinutes = parseTimeEST(tempClosure.to);

                if (!isNaN(fromMinutes) && !isNaN(toMinutes) && currentMinutesEST >= fromMinutes && currentMinutesEST < toMinutes) {
                    calculatedStatus = "Temporarily Unavailable";
                    activeTemporary = tempClosure; // Store the active closure details
                    break; // Exit loop once an active closure is found
                }
            }
        }

        // 2. If not Temp Closed, Check Holidays
        if (calculatedStatus !== "Temporarily Unavailable" && holidays[todayDateEST]) {
             activeHoliday = holidays[todayDateEST]; // Store holiday details
             const holidayHoursText = activeHoliday.hours || "";

             if (holidayHoursText.toLowerCase() === "closed") {
                 calculatedStatus = "Closed";
             } else if (holidayHoursText.includes('-')) {
                 const [openStr, closeStr] = holidayHoursText.split('-').map(s => s.trim());
                 const openMinutes = parseTimeEST(openStr);
                 const closeMinutes = parseTimeEST(closeStr);

                 if (!isNaN(openMinutes) && !isNaN(closeMinutes) && currentMinutesEST >= openMinutes && currentMinutesEST < closeMinutes) {
                     calculatedStatus = "Open"; // Open during holiday hours
                 } else {
                     calculatedStatus = "Closed"; // Outside holiday hours
                 }
             } else {
                  console.warn(`Invalid holiday hours format for ${todayDateEST}: "${holidayHoursText}". Assuming closed.`);
                  calculatedStatus = "Closed"; // Treat invalid format as closed
             }

             // Show holiday alert regardless of open/closed status for that day
             if (holidayAlertElement && holidayNameElement && holidayHoursElement) {
                 holidayNameElement.textContent = activeHoliday.name || 'Special Hours';
                 holidayHoursElement.textContent = holidayHoursText; // Show the exact hours string
                 holidayAlertElement.style.display = "block";
             }

        }

        // 3. If not Temp Closed and not Holiday, Check Regular Hours
        if (calculatedStatus !== "Temporarily Unavailable" && !activeHoliday) {
            const todayRegularHours = regular[dayOfWeekEST];
             if (todayRegularHours && todayRegularHours.open && todayRegularHours.close) {
                 const openMinutes = parseTimeEST(todayRegularHours.open);
                 const closeMinutes = parseTimeEST(todayRegularHours.close);
                 if (!isNaN(openMinutes) && !isNaN(closeMinutes) && currentMinutesEST >= openMinutes && currentMinutesEST < closeMinutes) {
                     calculatedStatus = "Open";
                 } else {
                     calculatedStatus = "Closed";
                 }
             } else {
                 // No regular hours defined or day is marked closed (open/close are null)
                 calculatedStatus = "Closed";
             }
             // Ensure holiday alert is hidden if it's a regular day
             if (holidayAlertElement) holidayAlertElement.style.display = "none";
        }


        // 4. Display Temporary Alert if applicable
        if (activeTemporary && tempAlertElement && tempReasonElement && tempHoursElement) {
            tempReasonElement.textContent = activeTemporary.reason || 'Busy'; // Show reason or default
            const convertedFrom = convertTimeToTimezone(activeTemporary.from, userTimezone);
            const convertedTo = convertTimeToTimezone(activeTemporary.to, userTimezone);
            tempHoursElement.textContent = `${convertedFrom} - ${convertedTo}`;
            tempAlertElement.style.display = 'block';
        }


    } catch (error) {
        console.error("Error calculating business status:", error);
        calculatedStatus = "Error"; // Indicate an error occurred
    }

    // 5. Update Status Element Display
    statusElement.textContent = calculatedStatus;
    statusElement.className = `status-${calculatedStatus.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`; // Create CSS class like status-open, status-closed, status-temporarily-unavailable


}


// --- Function to Initialize Business Hours Display (Listener) ---
function initializeBusinessHoursDisplay() {
    // Check if RTDB is ready
    if (!firebaseAppInitialized || !rtdb) {
        console.error("Business Hours Error: Firebase Realtime Database not ready.");
        if (hoursContainer) hoursContainer.innerHTML = '<p class="error">Error loading hours (DB Init).</p>';
        if (statusElement) statusElement.textContent = 'Error';
        return;
    }

    // Check required HTML elements exist
    if (!hoursContainer || !statusElement) {
        console.warn("Business Hours display warning: Missing crucial HTML elements (#hours-container or #open-status). Hours display disabled.");
        return;
    }

    const businessHoursRef = ref(rtdb, '/businessHours'); // <<< VERIFY RTDB PATH

    // Set initial loading states for hours section
    if (userTimezoneElement) {
         try { userTimezoneElement.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch(e){ userTimezoneElement.textContent = "N/A";}
    }
    hoursContainer.innerHTML = "<p>Loading hours...</p>";
    statusElement.textContent = "Loading...";
    if (holidayAlertElement) holidayAlertElement.style.display = "none";
    if (tempAlertElement) tempAlertElement.style.display = "none";

    console.log("Setting up listener for business hours at RTDB path:", businessHoursRef.toString());

    // Use onValue for real-time updates
    onValue(businessHoursRef, (snapshot) => {
        console.log("Business hours data received/updated from Firebase RTDB.");
        const businessData = snapshot.val();

        if (businessData) {
            renderBusinessHoursUI(businessData.regular);    // Update weekly hours display
            calculateAndUpdateStatus(businessData);         // Update status and alerts
        } else {
            // Handle case where /businessHours node doesn't exist or is null
            console.warn("No business hours data found in Firebase RTDB at /businessHours.");
            if (hoursContainer) hoursContainer.innerHTML = "<p>Business hours not available.</p>";
            if (statusElement) {
                statusElement.textContent = "Unavailable";
                statusElement.className = "status-unavailable";
            }
             if (holidayAlertElement) holidayAlertElement.style.display = "none";
             if (tempAlertElement) tempAlertElement.style.display = "none";
        }
    }, (error) => {
        // Handle errors listening to Realtime Database
        console.error("Error fetching/listening to business hours data from RTDB:", error);
        if (hoursContainer) hoursContainer.innerHTML = '<p class="error">Could not load hours.</p>';
        if (statusElement) {
             statusElement.textContent = 'Error';
             statusElement.className = "status-error";
        }
         if (holidayAlertElement) holidayAlertElement.style.display = "none";
         if (tempAlertElement) tempAlertElement.style.display = "none";
    });
}
// ======================================================
// === NEW END: Business Hours Display Logic ===
// ======================================================


// ======================================================
// === DOM Ready - Initialize Everything ===
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded. Checking Firebase status...");

    if (firebaseAppInitialized) {
        console.log("Firebase ready, calling display functions.");
        // Call functions to load data from respective databases
        displayProfileData();           // Load profile data (Firestore)
        loadAndDisplayShoutouts();      // Load shoutouts (Firestore)
        initializeBusinessHoursDisplay(); // Start listening for business hours (RTDB) <<< ADDED CALL
    } else {
        // Error handled during initialization, messages already set
        console.error("DOM loaded, but Firebase initialization failed earlier. Cannot load dynamic data.");
        // Optionally ensure error messages are displayed again if needed
         const profileBio = document.getElementById('profile-bio-main');
         if (profileBio && !profileBio.textContent.includes('Error')) profileBio.textContent = 'Error loading site data.';
         const hoursContainer = document.getElementById('hours-container');
         if (hoursContainer && !hoursContainer.textContent.includes('Error')) hoursContainer.innerHTML = '<p class="error">Error loading hours.</p>';
         const statusElement = document.getElementById('open-status');
         if (statusElement && !statusElement.textContent.includes('Error')) statusElement.textContent = 'Error';
    }
});
