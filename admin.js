// admin.js (Version includes Preview Prep + Previous Features + Social Links)

// *** Import Firebase services from your corrected init file ***
import { db, auth } from './firebase-init.js'; // Ensure path is correct

// Import Firebase functions (Includes 'where', 'query', 'orderBy', 'limit')
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc, serverTimestamp, getDoc, query, orderBy, where, limit } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"; //
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js"; //

// *** Global Variable for Client-Side Filtering ***
let allShoutouts = { tiktok: [], instagram: [], youtube: [] }; // Stores the full lists for filtering

let allUsefulLinks = [];
let allSocialLinks = [];
let allDisabilities = [];

document.addEventListener('DOMContentLoaded', () => { //
    // First, check if db and auth were successfully imported/initialized
    if (!db || !auth) { //
         console.error("Firestore (db) or Auth not initialized correctly. Check firebase-init.js and imports."); //
         alert("FATAL ERROR: Firebase services failed to load. Admin panel disabled."); //
         return; // Stop executing if Firebase isn't ready
    }
    console.log("Admin DOM Loaded. Setting up UI and CRUD functions."); //

    // --- Firestore Reference for Profile / Site Config ---
    const profileDocRef = doc(db, "site_config", "mainProfile"); //
    // Reference for Shoutout Metadata (used for timestamps)
    const shoutoutsMetaRef = doc(db, 'siteConfig', 'shoutoutsMetadata'); //
    // *** Firestore Reference for Useful Links ***
    const usefulLinksCollectionRef = collection(db, "useful_links"); // Collection name
    // --- Firestore Reference for Social Links ---
    // IMPORTANT: Assumes you have a Firestore collection named 'social_links'
    const socialLinksCollectionRef = collection(db, "social_links");
    // Reference for President Info
    const presidentDocRef = doc(db, "site_config", "currentPresident"); 

    // Firestore Reference for Disabilities
    const disabilitiesCollectionRef = collection(db, "disabilities");

    // --- Inactivity Logout Variables ---
    let inactivityTimer; //
    let expirationTime; //
    let displayIntervalId; //
    const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll']; //

    // --- DOM Element References ---
    const loginSection = document.getElementById('login-section'); //
    const adminContent = document.getElementById('admin-content'); //
    const loginForm = document.getElementById('login-form'); //
    const logoutButton = document.getElementById('logout-button'); //
    const authStatus = document.getElementById('auth-status'); //
    const adminGreeting = document.getElementById('admin-greeting'); //
    const emailInput = document.getElementById('email'); //
    const passwordInput = document.getElementById('password'); //
    const adminStatusElement = document.getElementById('admin-status'); //
    const nextButton = document.getElementById('next-button'); //
    const emailGroup = document.getElementById('email-group'); //
    const passwordGroup = document.getElementById('password-group'); //
    const loginButton = document.getElementById('login-button'); //
    const timerDisplayElement = document.getElementById('inactivity-timer-display'); //

    // Profile Management Elements
    const profileForm = document.getElementById('profile-form'); //
    const profileUsernameInput = document.getElementById('profile-username'); //
    const profilePicUrlInput = document.getElementById('profile-pic-url'); //
    const profileBioInput = document.getElementById('profile-bio'); //
    const profileStatusInput = document.getElementById('profile-status'); //
    const profileStatusMessage = document.getElementById('profile-status-message'); //
    const adminPfpPreview = document.getElementById('admin-pfp-preview'); //

    // Disabilities Management Elements
    const addDisabilityForm = document.getElementById('add-disability-form');
    const disabilitiesListAdmin = document.getElementById('disabilities-list-admin');
    const disabilitiesCount = document.getElementById('disabilities-count'); // Span to show count
    const editDisabilityModal = document.getElementById('edit-disability-modal');
    const editDisabilityForm = document.getElementById('edit-disability-form');
    const cancelEditDisabilityButton = document.getElementById('cancel-edit-disability-button'); // Close X button
    const cancelEditDisabilityButtonSecondary = document.getElementById('cancel-edit-disability-button-secondary'); // Secondary Cancel Button
    const editDisabilityNameInput = document.getElementById('edit-disability-name');
    const editDisabilityUrlInput = document.getElementById('edit-disability-url');
    const editDisabilityOrderInput = document.getElementById('edit-disability-order');
    const editDisabilityStatusMessage = document.getElementById('edit-disability-status-message'); // Status inside edit modal
    
    // Site Settings Elements
    const maintenanceModeToggle = document.getElementById('maintenance-mode-toggle'); //
    const settingsStatusMessage = document.getElementById('settings-status-message'); //

    // Shoutout Elements (Add Forms, Lists, Search)
    const addShoutoutTiktokForm = document.getElementById('add-shoutout-tiktok-form'); //
    const shoutoutsTiktokListAdmin = document.getElementById('shoutouts-tiktok-list-admin'); //
    const addShoutoutInstagramForm = document.getElementById('add-shoutout-instagram-form'); //
    const shoutoutsInstagramListAdmin = document.getElementById('shoutouts-instagram-list-admin'); //
    const addShoutoutYoutubeForm = document.getElementById('add-shoutout-youtube-form'); //
    const shoutoutsYoutubeListAdmin = document.getElementById('shoutouts-youtube-list-admin'); //
    const searchInputTiktok = document.getElementById('search-tiktok'); //
    const searchInputInstagram = document.getElementById('search-instagram'); //
    const searchInputYoutube = document.getElementById('search-youtube'); //

    // Shoutout Edit Modal Elements
    const editModal = document.getElementById('edit-shoutout-modal'); //
    const editForm = document.getElementById('edit-shoutout-form'); //
    const cancelEditButton = document.getElementById('cancel-edit-button'); //
    const editUsernameInput = document.getElementById('edit-username'); //
    const editNicknameInput = document.getElementById('edit-nickname'); //
    const editOrderInput = document.getElementById('edit-order'); //
    const editIsVerifiedInput = document.getElementById('edit-isVerified'); //
    const editBioInput = document.getElementById('edit-bio'); //
    const editProfilePicInput = document.getElementById('edit-profilePic'); //
    const editIsEnabledInput = document.getElementById('edit-isEnabled'); // Reference for per-shoutout enable/disable (if added later)
    const editFollowersInput = document.getElementById('edit-followers'); //
    const editSubscribersInput = document.getElementById('edit-subscribers'); //
    const editCoverPhotoInput = document.getElementById('edit-coverPhoto'); //
    const editPlatformSpecificDiv = document.getElementById('edit-platform-specific'); //

    // Shoutout Preview Area Elements
    const addTiktokPreview = document.getElementById('add-tiktok-preview'); //
    const addInstagramPreview = document.getElementById('add-instagram-preview'); //
    const addYoutubePreview = document.getElementById('add-youtube-preview'); //
    const editShoutoutPreview = document.getElementById('edit-shoutout-preview'); //

    // Useful Links Elements
    const addUsefulLinkForm = document.getElementById('add-useful-link-form'); //
    const usefulLinksListAdmin = document.getElementById('useful-links-list-admin'); //
    const usefulLinksCount = document.getElementById('useful-links-count'); // Span to show count
    const editUsefulLinkModal = document.getElementById('edit-useful-link-modal'); //
    const editUsefulLinkForm = document.getElementById('edit-useful-link-form'); //
    const cancelEditLinkButton = document.getElementById('cancel-edit-link-button'); // Close X button
    const cancelEditLinkButtonSecondary = document.getElementById('cancel-edit-link-button-secondary'); // Secondary Cancel Button
    const editLinkLabelInput = document.getElementById('edit-link-label'); //
    const editLinkUrlInput = document.getElementById('edit-link-url'); //
    const editLinkOrderInput = document.getElementById('edit-link-order'); //
    const editLinkStatusMessage = document.getElementById('edit-link-status-message'); // Status inside edit modal

    // --- Social Links Elements ---
    const addSocialLinkForm = document.getElementById('add-social-link-form');
    const socialLinksListAdmin = document.getElementById('social-links-list-admin');
    const socialLinksCount = document.getElementById('social-links-count'); // Span to show count
    const editSocialLinkModal = document.getElementById('edit-social-link-modal');
    const editSocialLinkForm = document.getElementById('edit-social-link-form');
    const cancelEditSocialLinkButton = document.getElementById('cancel-edit-social-link-button'); // Close X button
    const cancelEditSocialLinkButtonSecondary = document.getElementById('cancel-edit-social-link-button-secondary'); // Secondary Cancel Button
    const editSocialLinkLabelInput = document.getElementById('edit-social-link-label');
    const editSocialLinkUrlInput = document.getElementById('edit-social-link-url');
    const editSocialLinkOrderInput = document.getElementById('edit-social-link-order');
    const editSocialLinkStatusMessage = document.getElementById('edit-social-link-status-message'); // Status inside edit modal

    // President Management Elements
    const presidentForm = document.getElementById('president-form');
    const presidentNameInput = document.getElementById('president-name');
    const presidentBornInput = document.getElementById('president-born');
    const presidentHeightInput = document.getElementById('president-height');
    const presidentPartyInput = document.getElementById('president-party');
    const presidentTermInput = document.getElementById('president-term');
    const presidentVpInput = document.getElementById('president-vp');
    const presidentImageUrlInput = document.getElementById('president-image-url');
    const presidentStatusMessage = document.getElementById('president-status-message');
    const presidentPreviewArea = document.getElementById('president-preview');

    // *** COUNTDOWN: DOM Element References ***
    const countdownTargetDateInput = document.getElementById('countdown-target-date');
    const saveCountdownButton = document.getElementById('save-countdown-settings');
    const countdownStatusMessage = document.getElementById('countdown-settings-status');
    const countdownSectionDisplay = document.querySelector('.countdown-section'); // The whole display area
    const countdownPlaceholder = document.querySelector('.preview-placeholder'); // Placeholder text inside preview area
    // Get display elements for digits
    const countdownYearsDigits = document.querySelectorAll('#countdown-years .flip-clock-digit');
    const countdownMonthsDigits = document.querySelectorAll('#countdown-months .flip-clock-digit');
    const countdownDaysDigits = document.querySelectorAll('#countdown-days .flip-clock-digit');
    const countdownHoursDigits = document.querySelectorAll('#countdown-hours .flip-clock-digit');
    const countdownMinutesDigits = document.querySelectorAll('#countdown-minutes .flip-clock-digit');
    const countdownSecondsDigits = document.querySelectorAll('#countdown-seconds .flip-clock-digit');

    // *** COUNTDOWN: Global Variables ***
    let countdownTimerInterval; // Changed name slightly to avoid conflicts
    let countdownTargetDate = null; // Will hold the Date object

    // *** COUNTDOWN: Status Message Function ***
    function showCountdownSettingsStatus(message, isError = false) {
        if (!countdownStatusMessage) { console.warn("Countdown status message element not found"); return; }
        countdownStatusMessage.textContent = message;
        countdownStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
        // Clear message after 5 seconds
        setTimeout(() => { if (countdownStatusMessage) { countdownStatusMessage.textContent = ''; countdownStatusMessage.className = 'status-message'; } }, 5000);
    }

    // *** COUNTDOWN: Helper Functions ***
    function formatCountdownDigit(num) {
        return String(num).padStart(2, '0');
    }

    function updateCountdownFlipClock(digitElements, value) {
        const formatted = formatCountdownDigit(value);
        if (digitElements && digitElements.length === 2) {
            digitElements[0].textContent = formatted[0];
            digitElements[1].textContent = formatted[1];
        } else if (digitElements) {
             console.warn("Flip clock digit elements count mismatch. Expected 2, got:", digitElements.length);
        }
    }

    function updateLiveCountdownDisplay() {
        if (!countdownTargetDate || isNaN(countdownTargetDate.getTime())) {
             if(countdownSectionDisplay) countdownSectionDisplay.style.display = 'none';
             if(countdownPlaceholder) countdownPlaceholder.style.display = 'flex'; // Use flex to match CSS potentially
             return;
        }

        const now = new Date().getTime();
        const distance = countdownTargetDate.getTime() - now;

        if (distance <= 0) {
            // Countdown finished
            clearInterval(countdownTimerInterval);
            updateCountdownFlipClock(countdownYearsDigits, 0);
            updateCountdownFlipClock(countdownMonthsDigits, 0);
            updateCountdownFlipClock(countdownDaysDigits, 0);
            updateCountdownFlipClock(countdownHoursDigits, 0);
            updateCountdownFlipClock(countdownMinutesDigits, 0);
            updateCountdownFlipClock(countdownSecondsDigits, 0);
             if(countdownSectionDisplay) countdownSectionDisplay.style.display = 'block';
             if(countdownPlaceholder) countdownPlaceholder.style.display = 'none';
            return;
        }

        // Time calculations (simplified month/year)
        const totalSeconds = Math.floor(distance / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);

        const seconds = totalSeconds % 60;
        const minutes = totalMinutes % 60;
        const hours = totalHours % 24;

        let remainingDays = totalDays;
        let years = Math.floor(remainingDays / 365);
        remainingDays -= years * 365;
        let months = Math.floor(remainingDays / 30.4); // Approx
        remainingDays = Math.floor(remainingDays % 30.4); // Approx
        const days = remainingDays;

        // Update Display
        updateCountdownFlipClock(countdownYearsDigits, years);
        updateCountdownFlipClock(countdownMonthsDigits, months);
        updateCountdownFlipClock(countdownDaysDigits, days);
        updateCountdownFlipClock(countdownHoursDigits, hours);
        updateCountdownFlipClock(countdownMinutesDigits, minutes);
        updateCountdownFlipClock(countdownSecondsDigits, seconds);

        // Ensure display is visible
        if(countdownSectionDisplay) countdownSectionDisplay.style.display = 'block';
        if(countdownPlaceholder) countdownPlaceholder.style.display = 'none';
    }

    function startLiveCountdown() {
        clearInterval(countdownTimerInterval); // Clear existing
        if (countdownTargetDate && !isNaN(countdownTargetDate.getTime())) {
            console.log("Starting countdown interval for:", countdownTargetDate);
            updateLiveCountdownDisplay(); // Update immediately
            countdownTimerInterval = setInterval(updateLiveCountdownDisplay, 1000); // Update every second
        } else {
             console.log("No valid countdown target date found, countdown stopped.");
             if(countdownSectionDisplay) countdownSectionDisplay.style.display = 'none';
             if(countdownPlaceholder) countdownPlaceholder.style.display = 'flex';
        }
    }

    // *** COUNTDOWN: Load Target Date from Firestore ***
    async function loadCountdownTargetDate() {
        if (!countdownTargetDateInput) {
             console.warn("Countdown target date input not found.");
             return;
        }
         if (!auth || !auth.currentUser) {
            console.warn("Auth not ready for loading countdown date.");
            return; // Don't load if not logged in
        }

        console.log("Attempting to load countdown config from:", countdownConfigRef.path);
        try {
            const docSnap = await getDoc(countdownConfigRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const savedDateString = data.targetDateISO; // Expecting ISO string format
                console.log("Loaded countdown target ISO:", savedDateString);

                if (savedDateString) {
                    countdownTargetDate = new Date(savedDateString); // Parse ISO string
                    if (!isNaN(countdownTargetDate.getTime())) {
                        // Format for datetime-local input (YYYY-MM-DDTHH:mm)
                        // Adjust for local timezone offset ONLY for display in input
                        const timezoneOffset = countdownTargetDate.getTimezoneOffset() * 60000; // Offset in milliseconds
                        const localISOTime = new Date(countdownTargetDate.getTime() - timezoneOffset).toISOString().slice(0, 16);
                        countdownTargetDateInput.value = localISOTime;
                        console.log("Set input value to local time:", localISOTime);

                    } else {
                        console.warn("Invalid countdown date string found in Firestore:", savedDateString);
                        countdownTargetDate = null;
                        countdownTargetDateInput.value = '';
                    }
                } else {
                    console.log("No targetDateISO field found in countdown config.");
                    countdownTargetDate = null;
                    countdownTargetDateInput.value = '';
                }
            } else {
                console.log(`Countdown config document ('${countdownConfigRef.path}') not found. Input cleared.`);
                countdownTargetDate = null;
                countdownTargetDateInput.value = '';
            }
        } catch (error) {
            console.error("Error loading countdown target date:", error);
            showCountdownSettingsStatus("Error loading countdown date.", true);
            countdownTargetDate = null;
            countdownTargetDateInput.value = '';
        }
        startLiveCountdown(); // Start countdown based on loaded date (or lack thereof)
    }


    // *** COUNTDOWN: Save Target Date to Firestore ***
    async function saveCountdownTargetDate() {
        if (!countdownTargetDateInput) {
            showCountdownSettingsStatus("Input element not found.", true);
            return;
        }
         if (!auth || !auth.currentUser) {
            showCountdownSettingsStatus("Error: Not logged in.", true);
            return;
        }

        const dateString = countdownTargetDateInput.value;
        if (!dateString) {
            showCountdownSettingsStatus("Please select a target date and time.", true);
            return;
        }

        // Input type="datetime-local" gives string in "YYYY-MM-DDTHH:mm" format in local time
        // We need to parse this correctly and store it ideally as UTC (ISO string)
        const newTargetDate = new Date(dateString); // This parses the local string AS local time

        if (isNaN(newTargetDate.getTime())) {
            showCountdownSettingsStatus("Invalid date format selected.", true);
            return;
        }

        const targetDateISO = newTargetDate.toISOString(); // Convert the parsed local date to UTC ISO string for storage

        showCountdownSettingsStatus("Saving countdown target date...");
        try {
            // Use setDoc with merge: true to create or update the document
            await setDoc(countdownConfigRef, {
                targetDateISO: targetDateISO // Store the ISO string
            }, { merge: true });

            console.log("Countdown target date saved to Firestore:", targetDateISO);
            countdownTargetDate = newTargetDate; // Update the active target date (as Date object)
            showCountdownSettingsStatus("Countdown target date saved successfully!");
            startLiveCountdown(); // Restart countdown with new date

        } catch (error) {
            console.error("Error saving countdown target date:", error);
            showCountdownSettingsStatus(`Error saving countdown date: ${error.message}`, true);
        }
    }
    
// --- Helper Functions ---
    // Displays status messages in the main admin status area
    function showAdminStatus(message, isError = false) { //
        if (!adminStatusElement) { console.warn("Admin status element not found"); return; } //
        adminStatusElement.textContent = message; //
        adminStatusElement.className = `status-message ${isError ? 'error' : 'success'}`; //
        // Clear message after 5 seconds
        setTimeout(() => { if (adminStatusElement) { adminStatusElement.textContent = ''; adminStatusElement.className = 'status-message'; } }, 5000); //
    }

    // Displays status messages in the profile section's status area
    function showProfileStatus(message, isError = false) { //
        if (!profileStatusMessage) { console.warn("Profile status message element not found"); showAdminStatus(message, isError); return; } // Fallback to admin status
        profileStatusMessage.textContent = message; //
        profileStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`; //
         // Clear message after 5 seconds
        setTimeout(() => { if (profileStatusMessage) { profileStatusMessage.textContent = ''; profileStatusMessage.className = 'status-message'; } }, 5000); //
    }

    // Displays status messages in the site settings section's status area
    function showSettingsStatus(message, isError = false) { //
        if (!settingsStatusMessage) { console.warn("Settings status message element not found"); showAdminStatus(message, isError); return; } // Fallback to admin status
        settingsStatusMessage.textContent = message; //
        settingsStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`; //
         // Clear message after a few seconds
        setTimeout(() => { if (settingsStatusMessage) { settingsStatusMessage.textContent = ''; settingsStatusMessage.style.display = 'none'; } }, 3000); //
        // Ensure success/error message is visible briefly
        settingsStatusMessage.style.display = 'block'; //
    }

    // *** Add this near other status message functions ***
    function showEditLinkStatus(message, isError = false) { //
        if (!editLinkStatusMessage) { console.warn("Edit link status message element not found"); return; } //
        editLinkStatusMessage.textContent = message; //
        editLinkStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`; //
        // Clear message after 3 seconds
        setTimeout(() => { if (editLinkStatusMessage) { editLinkStatusMessage.textContent = ''; editLinkStatusMessage.className = 'status-message'; } }, 3000); //
    }

    // --- REVISED + CORRECTED Filtering Function for Useful Links ---
function displayFilteredUsefulLinks() {
    const listContainer = usefulLinksListAdmin;
    const countElement = usefulLinksCount;
    const searchInput = document.getElementById('search-useful-links');

    if (!listContainer || !searchInput || typeof allUsefulLinks === 'undefined') {
        console.error("Useful Links Filter Error: Missing elements/data.");
        if(listContainer) listContainer.innerHTML = `<p class="error">Error displaying list.</p>`;
        return;
    }

    const searchTerm = searchInput.value.trim().toLowerCase();
    // console.log(`Filtering Useful Links: Term = "${searchTerm}"`); // Keep or remove logs

    let listToRender = [];

    if (!searchTerm) {
        // console.log("Useful Links: Search term is empty, using full list.");
        listToRender = allUsefulLinks;
    } else {
        // console.log("Useful Links: Search term found, filtering list...");
        listToRender = allUsefulLinks.filter(link => {
            const label = (link.label || '').toLowerCase();
            // --- Only check the label ---
            return label.includes(searchTerm);
        });
    }

    // console.log(`Rendering ${listToRender.length} useful links.`);

    listContainer.innerHTML = '';

    if (listToRender.length > 0) {
        listToRender.forEach(link => {
            if (typeof renderUsefulLinkAdminListItem === 'function' && typeof handleDeleteUsefulLink === 'function' && typeof openEditUsefulLinkModal === 'function') {
                 renderUsefulLinkAdminListItem(listContainer, link.id, link.label, link.url, link.order, handleDeleteUsefulLink, openEditUsefulLinkModal);
            } else {
                 console.error("Error: renderUsefulLinkAdminListItem or its handlers are missing!");
                 listContainer.innerHTML = '<p class="error">Rendering function error.</p>';
                 return;
            }
        });
    } else {
        if (searchTerm) {
            listContainer.innerHTML = `<p>No useful links found matching "${searchTerm}".</p>`;
        } else {
            listContainer.innerHTML = `<p>No useful links found.</p>`;
        }
    }
    if (countElement) { countElement.textContent = `(${listToRender.length})`; }
}

// --- REVISED + CORRECTED Filtering Function for Disabilities ---
function displayFilteredDisabilities() {
    const listContainer = disabilitiesListAdmin;
    const countElement = disabilitiesCount;
    const searchInput = document.getElementById('search-disabilities');

    if (!listContainer || !searchInput || typeof allDisabilities === 'undefined') {
        console.error("Disabilities Filter Error: Missing elements/data.");
         if(listContainer) listContainer.innerHTML = `<p class="error">Error displaying list.</p>`;
        return;
    }

    const searchTerm = searchInput.value.trim().toLowerCase();
    // console.log(`Filtering Disabilities: Term = "${searchTerm}"`); // Keep or remove logs

    let listToRender = [];

    if (!searchTerm) {
        // console.log("Disabilities: Search term is empty, using full list.");
        listToRender = allDisabilities;
    } else {
        // console.log("Disabilities: Search term found, filtering list...");
        listToRender = allDisabilities.filter(item => {
            const name = (item.name || '').toLowerCase(); // Use 'name' field
             // --- Only check the name ---
            return name.includes(searchTerm);
        });
    }

    // console.log(`Rendering ${listToRender.length} disabilities.`);

    listContainer.innerHTML = '';

    if (listToRender.length > 0) {
        listToRender.forEach(item => {
            if (typeof renderDisabilityAdminListItem === 'function' && typeof handleDeleteDisability === 'function' && typeof openEditDisabilityModal === 'function') {
                renderDisabilityAdminListItem(listContainer, item.id, item.name, item.url, item.order, handleDeleteDisability, openEditDisabilityModal);
            } else {
                 console.error("Error: renderDisabilityAdminListItem or its handlers are missing!");
                 listContainer.innerHTML = '<p class="error">Rendering function error.</p>';
                 return;
            }
        });
    } else {
         if (searchTerm) {
            listContainer.innerHTML = `<p>No disabilities found matching "${searchTerm}".</p>`;
         } else {
            listContainer.innerHTML = `<p>No disabilities found.</p>`;
         }
    }
    if (countElement) { countElement.textContent = `(${listToRender.length})`; }
}

    // Search Listener for Useful Links (NEW)
const searchInputUsefulLinks = document.getElementById('search-useful-links');
if (searchInputUsefulLinks) {
    searchInputUsefulLinks.addEventListener('input', displayFilteredUsefulLinks);
}

// Search Listener for Social Links (NEW)
const searchInputSocialLinks = document.getElementById('search-social-links');
if (searchInputSocialLinks) {
    searchInputSocialLinks.addEventListener('input', displayFilteredSocialLinks);
}

// Search Listener for Disabilities (NEW)
const searchInputDisabilities = document.getElementById('search-disabilities');
if (searchInputDisabilities) {
    searchInputDisabilities.addEventListener('input', displayFilteredDisabilities);
}

    // --- Add this near other status message functions ---
    function showEditSocialLinkStatus(message, isError = false) {
       if (!editSocialLinkStatusMessage) { console.warn("Edit social link status message element not found"); return; }
       editSocialLinkStatusMessage.textContent = message;
       editSocialLinkStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
       // Clear message after 3 seconds
       setTimeout(() => { if (editSocialLinkStatusMessage) { editSocialLinkStatusMessage.textContent = ''; editSocialLinkStatusMessage.className = 'status-message'; } }, 3000);
    }

// --- Edit Modal Logic (UPDATED for Preview) ---
    // Opens the modal and populates it with data for the selected shoutout
    function openEditModal(docId, platform) { //
        if (!editModal || !editForm) { console.error("Edit modal/form not found."); showAdminStatus("UI Error: Cannot open edit form.", true); return; } //
        editForm.setAttribute('data-doc-id', docId); // Store ID and platform on the form
        editForm.setAttribute('data-platform', platform); //
        const docRef = doc(db, 'shoutouts', docId); // Reference to the specific shoutout doc

        getDoc(docRef).then(docSnap => { // Fetch the document
            if (docSnap.exists()) { //
                const data = docSnap.data(); //
                // Populate general fields
                if (editUsernameInput) editUsernameInput.value = data.username || ''; //
                if (editNicknameInput) editNicknameInput.value = data.nickname || ''; //
                if (editOrderInput) editOrderInput.value = data.order ?? ''; //
                if (editIsVerifiedInput) editIsVerifiedInput.checked = data.isVerified || false; //
                if (editBioInput) editBioInput.value = data.bio || ''; //
                if (editProfilePicInput) editProfilePicInput.value = data.profilePic || ''; //
                // Populate enable/disable toggle (for future feature)
                // if (editIsEnabledInput) editIsEnabledInput.checked = data.isEnabled ?? true;

                // Handle platform-specific fields visibility and values
                const followersDiv = editPlatformSpecificDiv?.querySelector('.edit-followers-group'); //
                const subscribersDiv = editPlatformSpecificDiv?.querySelector('.edit-subscribers-group'); //
                const coverPhotoDiv = editPlatformSpecificDiv?.querySelector('.edit-coverphoto-group'); //

                // Hide all platform-specific sections first
                if (followersDiv) followersDiv.style.display = 'none'; //
                if (subscribersDiv) subscribersDiv.style.display = 'none'; //
                if (coverPhotoDiv) coverPhotoDiv.style.display = 'none'; //

                // Show and populate the relevant section
                if (platform === 'youtube') { //
                    if (editSubscribersInput) editSubscribersInput.value = data.subscribers || 'N/A'; //
                    if (editCoverPhotoInput) editCoverPhotoInput.value = data.coverPhoto || ''; //
                    if (subscribersDiv) subscribersDiv.style.display = 'block'; //
                    if (coverPhotoDiv) coverPhotoDiv.style.display = 'block'; //
                } else { // TikTok or Instagram
                    if (editFollowersInput) editFollowersInput.value = data.followers || 'N/A'; //
                    if (followersDiv) followersDiv.style.display = 'block'; //
                }

                // Reset preview area and trigger initial update
                const previewArea = document.getElementById('edit-shoutout-preview'); //
                 if(previewArea) { //
                     previewArea.innerHTML = '<p><small>Generating preview...</small></p>'; // Placeholder
                     // *** ADDED: Trigger initial preview update ***
                     if (typeof updateShoutoutPreview === 'function') { //
                        updateShoutoutPreview('edit', platform); // Call the preview function
                     }
                     // *** END ADDED CODE ***
                 }

                editModal.style.display = 'block'; // Show the modal
            } else { //
                 showAdminStatus("Error: Could not load data for editing. Document not found.", true); //
            }
        }).catch(error => { //
             console.error("Error getting document for edit:", error); //
             showAdminStatus(`Error loading data: ${error.message}`, true); //
         });
    }

    // Closes the edit modal and resets the form
    function closeEditModal() { //
        if (editModal) editModal.style.display = 'none'; //
        if (editForm) editForm.reset(); // Reset form fields
        editForm?.removeAttribute('data-doc-id'); // Clear stored data
        editForm?.removeAttribute('data-platform'); //
         // Also clear the edit preview area
         if(editShoutoutPreview) { //
             editShoutoutPreview.innerHTML = '<p><small>Preview will appear here.</small></p>'; //
         }
    }

    // Event listeners for closing the modal (X button and clicking outside)
    if (cancelEditButton) cancelEditButton.addEventListener('click', closeEditModal); //
    window.addEventListener('click', (event) => { //
        // Close modal only if the direct click target is the modal backdrop itself
        if (event.target === editModal) { //
            closeEditModal(); //
        }
        // Add listener for clicking outside the useful link modal
        if (event.target === editUsefulLinkModal) { //
            closeEditUsefulLinkModal(); //
        }
        // Add listener for clicking outside the social link modal
        if (event.target === editSocialLinkModal) {
           closeEditSocialLinkModal();
        }
    });

// --- MODIFIED: renderAdminListItem Function (Includes Direct Link) ---
    // This function creates the HTML for a single item in the admin shoutout list
    function renderAdminListItem(container, docId, platform, username, nickname, order, deleteHandler, editHandler) { //
        // The 'isEnabled' status will be passed here later when implementing that feature
        if (!container) { console.warn("List container not found for platform:", platform); return; } //

        const itemDiv = document.createElement('div'); //
        itemDiv.className = 'list-item-admin'; // Base class
        itemDiv.setAttribute('data-id', docId); //

        // Placeholder comment: Add 'disabled-item' class later based on the 'isEnabled' field
        // Example: if (isEnabled === false) itemDiv.classList.add('disabled-item');

        // Construct direct link URL based on platform
        let directLinkUrl = '#'; // Default placeholder
        let safeUsername = username || ''; // Ensure username is not null/undefined

        if (platform === 'tiktok' && safeUsername) { //
            directLinkUrl = `https://tiktok.com/@${encodeURIComponent(safeUsername)}`; //
        } else if (platform === 'instagram' && safeUsername) { //
            directLinkUrl = `https://instagram.com/${encodeURIComponent(safeUsername)}`; //
        } else if (platform === 'youtube' && safeUsername) { //
            // Construct YouTube URL (ensure 'username' is the handle like '@MrBeast')
            let youtubeHandle = safeUsername.startsWith('@') ? safeUsername : `@${safeUsername}`; //
             // Assuming standard youtube.com/@handle format is desired for handles:
             directLinkUrl = `https://youtube.com/${encodeURIComponent(youtubeHandle)}`; //
        }

        // Build inner HTML - Structure includes item details and action buttons
        // NOTE: A checkbox for bulk actions will be added here later
        // NOTE: An indicator for enabled/disabled status will be added later
        itemDiv.innerHTML = `
            <div class="item-content">
                 <div class="item-details">
                    <strong>${nickname || 'N/A'}</strong>
                    <span>(@${username || 'N/A'})</span>
                    <small>Order: ${order ?? 'N/A'}</small>
                 </div>
            </div>
            <div class="item-actions">
                <a href="${directLinkUrl}" target="_blank" rel="noopener noreferrer" class="direct-link small-button" title="Visit Profile/Channel">
                    <i class="fas fa-external-link-alt"></i> Visit
                </a>
                <button type="button" class="edit-button small-button">Edit</button>
                <button type="button" class="delete-button small-button">Delete</button>
            </div>`; //

        // Add event listeners for Edit and Delete buttons
        const editButton = itemDiv.querySelector('.edit-button'); //
        if (editButton) editButton.addEventListener('click', () => editHandler(docId, platform)); //

        const deleteButton = itemDiv.querySelector('.delete-button'); //
        if (deleteButton) deleteButton.addEventListener('click', () => deleteHandler(docId, platform, itemDiv)); //

        // Add the completed item to the list container
        container.appendChild(itemDiv); //
    }
    // --- END MODIFIED: renderAdminListItem Function ---

// --- Copied Shoutout Card Rendering Functions (from displayShoutouts.js) ---
    // NOTE: Ensure image paths ('check.png', 'images/default-profile.jpg') are accessible
    //       from the admin page, or use absolute paths / different logic.

    function renderTikTokCard(account) { //
        // Use default values if account data is missing
        const profilePic = account.profilePic || 'images/default-profile.jpg'; // Default image path
        const username = account.username || 'N/A'; //
        const nickname = account.nickname || 'N/A'; //
        const bio = account.bio || ''; // Default to empty string
        const followers = account.followers || 'N/A'; //
        const isVerified = account.isVerified || false; //
        // Construct profile URL safely
        const profileUrl = username !== 'N/A' ? `https://tiktok.com/@${encodeURIComponent(username)}` : '#'; //
        // Correct path for admin context might be needed for check.png
        const verifiedBadge = isVerified ? '<img src="check.png" alt="Verified" class="verified-badge">' : ''; //

        return `
             <div class="creator-card">
                 <img src="${profilePic}" alt="@${username}" class="creator-pic" onerror="this.onerror=null; this.src='images/default-profile.jpg';">
                 <div class="creator-info">
                     <div class="creator-header"><h3>${nickname} ${verifiedBadge}</h3></div>
                     <p class="creator-username">@${username}</p>
                     <p class="creator-bio">${bio}</p>
                     <p class="follower-count">${followers} Followers</p>
                     <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="visit-profile"> Visit Profile </a>
                 </div>
             </div>`; //
       }

function renderInstagramCard(account) { //
        // Use default values if account data is missing
        const profilePic = account.profilePic || 'images/default-profile.jpg'; // Default image path
        const username = account.username || 'N/A'; //
        const nickname = account.nickname || 'N/A'; //
        const bio = account.bio || ''; // Default to empty string
        const followers = account.followers || 'N/A'; //
        const isVerified = account.isVerified || false; //
        // Construct profile URL safely
        const profileUrl = username !== 'N/A' ? `https://instagram.com/${encodeURIComponent(username)}` : '#'; //
         // Correct path for admin context might be needed for instagramcheck.png
         const verifiedBadge = isVerified ? '<img src="instagramcheck.png" alt="Verified" class="instagram-verified-badge">' : ''; // Uses specific class from display CSS

         return `
             <div class="instagram-creator-card">
                 <img src="${profilePic}" alt="${nickname}" class="instagram-creator-pic" onerror="this.onerror=null; this.src='images/default-profile.jpg';">
                 <div class="instagram-creator-info">
                     <div class="instagram-creator-header"><h3>${nickname} ${verifiedBadge}</h3></div>
                     <p class="instagram-creator-username">@${username}</p>
                     <p class="instagram-creator-bio">${bio}</p>
                     <p class="instagram-follower-count">${followers} Followers</p>
                     <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="instagram-visit-profile"> Visit Profile </a>
                 </div>
             </div>`; //
       }

function renderYouTubeCard(account) { //
        // Use default values if account data is missing
        const profilePic = account.profilePic || 'images/default-profile.jpg'; // Default image path
        const username = account.username || 'N/A'; // YouTube handle
        const nickname = account.nickname || 'N/A'; // Channel name
        const bio = account.bio || ''; //
        const subscribers = account.subscribers || 'N/A'; //
        const coverPhoto = account.coverPhoto || null; // May not exist
        const isVerified = account.isVerified || false; //
        // Construct channel URL safely using the handle
        let safeUsername = username; //
        if (username !== 'N/A' && !username.startsWith('@')) { //
            safeUsername = `@${username}`; // Prepend @ if missing for handle URL
        }
        const channelUrl = username !== 'N/A' ? `https://youtube.com/$${encodeURIComponent(safeUsername)}` : '#'; //
        // Correct path for admin context might be needed for youtubecheck.png
        const verifiedBadge = isVerified ? '<img src="youtubecheck.png" alt="Verified" class="youtube-verified-badge">' : ''; // Uses specific class from display CSS

        return `
            <div class="youtube-creator-card">
                ${coverPhoto ? `<img src="${coverPhoto}" alt="${nickname} Cover Photo" class="youtube-cover-photo" onerror="this.style.display='none'">` : ''}
                <img src="${profilePic}" alt="${nickname}" class="youtube-creator-pic" onerror="this.onerror=null; this.src='images/default-profile.jpg';">
                <div class="youtube-creator-info">
                    <div class="youtube-creator-header"><h3>${nickname} ${verifiedBadge}</h3></div>
                    <div class="username-container"><p class="youtube-creator-username">@${username}</p></div>
                    <p class="youtube-creator-bio">${bio}</p>
                    <p class="youtube-subscriber-count">${subscribers} Subscribers</p>
                    <a href="${channelUrl}" target="_blank" rel="noopener noreferrer" class="youtube-visit-profile"> Visit Channel </a>
                </div>
            </div>`; //
    }
    // --- END Copied Rendering Functions ---

// *** NEW FUNCTION: Updates Shoutout Preview Area ***
    function updateShoutoutPreview(formType, platform) { //
        let formElement; //
        let previewElement; //
        let accountData = {}; // Object to hold current form values

        // 1. Determine which form and preview area to use
        if (formType === 'add') { //
            formElement = document.getElementById(`add-shoutout-${platform}-form`); //
            previewElement = document.getElementById(`add-${platform}-preview`); //
        } else if (formType === 'edit') { //
            formElement = editForm; // Use the existing reference to the edit modal form
            previewElement = editShoutoutPreview; // Use the existing reference
             // Ensure the platform matches the modal's current platform (safety check)
             if (editForm.getAttribute('data-platform') !== platform) { //
                 // console.warn(`Preview update skipped: Platform mismatch (form=${editForm.getAttribute('data-platform')}, requested=${platform})`);
                 // Clear preview if platform mismatches (e.g., modal still open from previous edit)
                 if(previewElement) previewElement.innerHTML = '<p><small>Preview unavailable.</small></p>'; //
                 return; //
             }
        } else { //
            console.error("Invalid formType provided to updateShoutoutPreview:", formType); //
            return; //
        }

        if (!formElement || !previewElement) { //
            console.error(`Preview Error: Could not find form or preview element for ${formType} ${platform}`); //
            return; //
        }

        // 2. Read current values from the determined form's inputs
        try { //
            accountData.username = formElement.querySelector(`[name="username"]`)?.value.trim() || ''; //
            accountData.nickname = formElement.querySelector(`[name="nickname"]`)?.value.trim() || ''; //
            accountData.bio = formElement.querySelector(`[name="bio"]`)?.value.trim() || ''; //
            accountData.profilePic = formElement.querySelector(`[name="profilePic"]`)?.value.trim() || ''; //
            accountData.isVerified = formElement.querySelector(`[name="isVerified"]`)?.checked || false; //
             accountData.order = parseInt(formElement.querySelector(`[name="order"]`)?.value.trim() || 0); // Needed for potential rendering logic, default 0

            // Platform-specific fields
            if (platform === 'youtube') { //
                accountData.subscribers = formElement.querySelector(`[name="subscribers"]`)?.value.trim() || 'N/A'; //
                accountData.coverPhoto = formElement.querySelector(`[name="coverPhoto"]`)?.value.trim() || null; //
            } else { // TikTok or Instagram
                accountData.followers = formElement.querySelector(`[name="followers"]`)?.value.trim() || 'N/A'; //
            }
        } catch(e) { //
             console.error("Error reading form values for preview:", e); //
             previewElement.innerHTML = '<p class="error"><small>Error reading form values.</small></p>'; //
             return; //
        }


        // 3. Select the correct rendering function
        let renderFunction; //
        switch (platform) { //
            case 'tiktok': //
                renderFunction = renderTikTokCard; //
                break; //
            case 'instagram': //
                renderFunction = renderInstagramCard; //
                break; //
            case 'youtube': //
                renderFunction = renderYouTubeCard; //
                break; //
            default: //
                console.error("Invalid platform for preview:", platform); //
                previewElement.innerHTML = '<p class="error"><small>Invalid platform.</small></p>'; //
                return; //
        }

        // 4. Call the rendering function and update the preview area
        if (typeof renderFunction === 'function') { //
            try { //
                const cardHTML = renderFunction(accountData); // Generate the card HTML
                previewElement.innerHTML = cardHTML; // Update the preview div
            } catch (e) { //
                 console.error(`Error rendering preview card for ${platform}:`, e); //
                 previewElement.innerHTML = '<p class="error"><small>Error rendering preview.</small></p>'; //
            }
        } else { //
             console.error(`Rendering function for ${platform} not found!`); //
             previewElement.innerHTML = '<p class="error"><small>Preview engine error.</small></p>'; //
        }
    }
    // *** END updateShoutoutPreview FUNCTION ***

// *** FUNCTION: Displays Filtered Shoutouts (for Search Bar) ***
    // This function takes the platform name, filters the globally stored list,
    // and renders only the matching items based on search input.
    function displayFilteredShoutouts(platform) { //
        // Get the correct list container, count element, and search input for the given platform
        const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`); //
        const countElement = document.getElementById(`${platform}-count`); //
        const searchInput = document.getElementById(`search-${platform}`); // Get the specific search input

        // Safety checks for required elements and data
        if (!listContainer || !searchInput || !allShoutouts || !allShoutouts[platform]) { //
            console.error(`Missing elements or data for filtering platform: ${platform}.`); //
            if(listContainer) listContainer.innerHTML = `<p class="error">Error displaying filtered list (elements/data missing).</p>`; //
            return; //
        }

        const searchTerm = searchInput.value.trim().toLowerCase(); // Get current search term, lowercase
        const fullList = allShoutouts[platform]; // Get the full list stored earlier for this platform

        // Filter the full list based on the search term
        const filteredList = fullList.filter(account => { //
            // Check if search term is empty (show all) or if it matches nickname or username
            if (!searchTerm) { //
                return true; // Show all if search is empty
            }
            // Ensure properties exist before calling toLowerCase
            const nickname = (account.nickname || '').toLowerCase(); //
            const username = (account.username || '').toLowerCase(); //
            return nickname.includes(searchTerm) || username.includes(searchTerm); //
        });

        // Clear the current list display before rendering filtered items
        listContainer.innerHTML = ''; //

        // Render the filtered items by calling renderAdminListItem for each
        if (filteredList.length > 0) { //
            filteredList.forEach(account => { //
                // Ensure renderAdminListItem exists before calling
                if (typeof renderAdminListItem === 'function') { //
                    renderAdminListItem( //
                        listContainer, //
                        account.id, // Pass the document ID
                        platform, //
                        account.username, // Pass username
                        account.nickname, // Pass nickname
                        account.order,    // Pass order
                        // account.isEnabled, // Pass status later if needed for styling disabled items
                        handleDeleteShoutout, // Pass delete handler
                        openEditModal         // Pass edit handler
                    );
                } else { //
                     console.error("renderAdminListItem function is not defined during filtering!"); //
                     // Avoid infinite loop if render fails
                     listContainer.innerHTML = `<p class="error">Critical Error: Rendering function missing.</p>`; //
                     return; // Stop rendering this list
                }
            });
        } else { //
            // Display appropriate 'not found' message
            if (searchTerm) { // If search term exists but no results
                listContainer.innerHTML = `<p>No shoutouts found matching "${searchInput.value}".</p>`; //
            } else { // If no search term and list was initially empty
                listContainer.innerHTML = `<p>No ${platform} shoutouts found.</p>`; //
            }
        }

        // Update the count display based on the filtered list length
        if (countElement) { //
            countElement.textContent = `(${filteredList.length})`; //
        }
    }
    // *** END displayFilteredShoutouts FUNCTION ***

// --- MODIFIED: Function to Load Profile Data into Admin Form (Includes Maintenance Mode) ---
    async function loadProfileData() { //
        // Ensure user is logged in before attempting to load
        if (!auth || !auth.currentUser) { //
            console.warn("Auth not ready or user not logged in when trying to load profile."); //
            return; //
        }
        if (!profileForm) { // Check if the profile form exists in the DOM
            console.log("Profile form element not found."); //
            return; //
        }
        // Also check if maintenance toggle exists before trying to use it
        if (!maintenanceModeToggle) { //
             console.warn("Maintenance mode toggle element not found."); //
        }

        console.log("Attempting to load profile data from:", profileDocRef.path); //
        try { //
            const docSnap = await getDoc(profileDocRef); // Fetch the profile document

            if (docSnap.exists()) { //
                const data = docSnap.data(); //
                console.log("Loaded profile data:", data); //

                // Populate form fields with fetched data or defaults
                if(profileUsernameInput) profileUsernameInput.value = data.username || ''; //
                if(profilePicUrlInput) profilePicUrlInput.value = data.profilePicUrl || ''; //
                if(profileBioInput) profileBioInput.value = data.bio || ''; //
                if(profileStatusInput) profileStatusInput.value = data.status || 'offline'; // Default to 'offline' if not set

                // Set maintenance toggle state
                if(maintenanceModeToggle) { //
                     maintenanceModeToggle.checked = data.isMaintenanceModeEnabled || false; // Set toggle based on Firestore data (default false if missing)
                     maintenanceModeToggle.disabled = false; // Ensure it's enabled if data loaded
                }

                // Update profile picture preview
                if (adminPfpPreview && data.profilePicUrl) { //
                     adminPfpPreview.src = data.profilePicUrl; //
                     adminPfpPreview.style.display = 'inline-block'; // Show preview
                } else if (adminPfpPreview) { //
                     adminPfpPreview.src = ''; // Clear src if no URL
                     adminPfpPreview.style.display = 'none'; // Hide preview
                }
            } else { //
                 // Handle case where the profile document doesn't exist yet
                 console.warn(`Profile document ('${profileDocRef.path}') not found. Displaying defaults.`); //
                 if (profileForm) profileForm.reset(); // Reset main profile form fields
                 if (profileStatusInput) profileStatusInput.value = 'offline'; // Explicitly set default status

                 // Default maintenance toggle state
                 if(maintenanceModeToggle) { //
                     maintenanceModeToggle.checked = false; // Default to false if doc missing
                     maintenanceModeToggle.disabled = false; // Ensure enabled
                 }
                 if(adminPfpPreview) adminPfpPreview.style.display = 'none'; // Hide preview
            }
        } catch (error) { //
             console.error("Error loading profile data:", error); //
             showProfileStatus("Error loading profile data.", true); //
             // Set defaults and disable toggle on error
             if (profileForm) profileForm.reset(); //
             if (profileStatusInput) profileStatusInput.value = 'offline'; //
             if(maintenanceModeToggle) { //
                 maintenanceModeToggle.checked = false; //
                 maintenanceModeToggle.disabled = true; // Disable toggle on error
             }
             if(adminPfpPreview) adminPfpPreview.style.display = 'none'; //
        }
    }


    // --- Function to Save Profile Data ---
    async function saveProfileData(event) { //
        event.preventDefault(); // Prevent default form submission
        // Ensure user is logged in
        if (!auth || !auth.currentUser) { //
            showProfileStatus("Error: Not logged in.", true); //
            return; //
        }
        if (!profileForm) return; // Should not happen if loaded, but safety check

        // Gather data from form fields
        const newData = { //
            username: profileUsernameInput?.value.trim() || "", //
            profilePicUrl: profilePicUrlInput?.value.trim() || "", //
            bio: profileBioInput?.value.trim() || "", //
            status: profileStatusInput?.value || "offline", // Ensure a default value
            lastUpdated: serverTimestamp() // Add a timestamp for the update
            // Note: Maintenance mode is saved by its own function/listener
        };

        showProfileStatus("Saving profile..."); // Provide user feedback
        try { //
            // Use setDoc with merge: true to create or update the document
            await setDoc(profileDocRef, newData, { merge: true }); //
            console.log("Profile data saved to:", profileDocRef.path); //
            showProfileStatus("Profile updated successfully!", false); //

            // Optionally update the preview image immediately after saving a new URL
            if (adminPfpPreview && newData.profilePicUrl) { //
                adminPfpPreview.src = newData.profilePicUrl; //
                adminPfpPreview.style.display = 'inline-block'; //
            } else if (adminPfpPreview) { //
                 adminPfpPreview.src = ''; //
                 adminPfpPreview.style.display = 'none'; //
            }

        } catch (error) { //
             console.error("Error saving profile data:", error); //
             showProfileStatus(`Error saving profile: ${error.message}`, true); //
        }
    }

    // Event listener for profile picture URL input to update preview (optional but helpful)
    if (profilePicUrlInput && adminPfpPreview) { //
        profilePicUrlInput.addEventListener('input', () => { //
            const url = profilePicUrlInput.value.trim(); //
            if (url) { //
                adminPfpPreview.src = url; //
                adminPfpPreview.style.display = 'inline-block'; //
            } else { //
                adminPfpPreview.style.display = 'none'; //
            }
        });
        // Handle image loading errors for the preview
        adminPfpPreview.onerror = () => { //
            console.warn("Preview image failed to load from URL:", adminPfpPreview.src); //
            // Optionally show a placeholder or hide the preview on error
            // adminPfpPreview.src = 'path/to/error-placeholder.png';
             adminPfpPreview.style.display = 'none'; //
             profilePicUrlInput.classList.add('input-error'); // Add error class to input
        };
         // Remove error class when input changes
         profilePicUrlInput.addEventListener('focus', () => { //
            profilePicUrlInput.classList.remove('input-error'); //
         });
    }

// *** FUNCTION TO SAVE Maintenance Mode Status ***
    async function saveMaintenanceModeStatus(isEnabled) { //
        // Ensure user is logged in
        if (!auth || !auth.currentUser) { //
            showAdminStatus("Error: Not logged in. Cannot save settings.", true); // Use main admin status
            // Revert checkbox state visually if save fails due to auth issue
            if(maintenanceModeToggle) maintenanceModeToggle.checked = !isEnabled; //
            return; //
        }

        // Use the specific status message area for settings, fallback to main admin status
        const statusElement = settingsStatusMessage || adminStatusElement; //

        // Show saving message
        if (statusElement) { //
            statusElement.textContent = "Saving setting..."; //
            statusElement.className = "status-message"; // Reset style
            statusElement.style.display = 'block'; //
        }

        try { //
            // Use profileDocRef (site_config/mainProfile) to store the flag
            // Use setDoc with merge: true to update only this field without overwriting others
            await setDoc(profileDocRef, { //
                isMaintenanceModeEnabled: isEnabled // Save the boolean value (true/false)
            }, { merge: true }); //

            console.log("Maintenance mode status saved:", isEnabled); //

            // Show success message using the dedicated settings status element or fallback
             if (statusElement === settingsStatusMessage && settingsStatusMessage) { // Check if we are using the specific element
                 showSettingsStatus(`Maintenance mode ${isEnabled ? 'enabled' : 'disabled'}.`, false); // Uses the settings-specific display/clear logic
             } else { // Fallback if specific element wasn't found initially
                showAdminStatus(`Maintenance mode ${isEnabled ? 'enabled' : 'disabled'}.`, false); //
             }

        } catch (error) { //
            console.error("Error saving maintenance mode status:", error); //
            // Show error message in the specific status area or fallback
            if (statusElement === settingsStatusMessage && settingsStatusMessage) { //
                 showSettingsStatus(`Error saving setting: ${error.message}`, true); //
            } else { //
                showAdminStatus(`Error saving maintenance mode: ${error.message}`, true); //
            }
            // Revert checkbox state visually on error
             if(maintenanceModeToggle) maintenanceModeToggle.checked = !isEnabled; //
        }
    }
    // *** END FUNCTION ***

// --- Inactivity Logout & Timer Display Functions ---

    // Updates the countdown timer display
    function updateTimerDisplay() { //
        if (!timerDisplayElement) return; // Exit if display element doesn't exist
        const now = Date.now(); //
        const remainingMs = expirationTime - now; // Calculate remaining time

        if (remainingMs <= 0) { // If time is up
            timerDisplayElement.textContent = "00:00"; // Show zero
            clearInterval(displayIntervalId); // Stop the interval timer
        } else { //
            // Calculate remaining minutes and seconds
            const remainingSeconds = Math.round(remainingMs / 1000); //
            const minutes = Math.floor(remainingSeconds / 60); //
            const seconds = remainingSeconds % 60; //
            // Format as MM:SS and update display
            timerDisplayElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; //
        }
    }

    // Function called when the inactivity timeout is reached
    function logoutDueToInactivity() { //
        console.log("Logging out due to inactivity."); //
        clearTimeout(inactivityTimer); // Clear the master timeout
        clearInterval(displayIntervalId); // Clear the display update interval
        if (timerDisplayElement) timerDisplayElement.textContent = ''; // Clear display
        removeActivityListeners(); // Remove event listeners to prevent resetting timer after logout
        // Sign the user out using Firebase Auth
        signOut(auth).catch((error) => { //
             console.error("Error during inactivity logout:", error); //
             // Optionally show a message, though user might already be gone
             // showAdminStatus("Logged out due to inactivity.", false);
        });
        // Note: The onAuthStateChanged listener will handle hiding admin content
    }

    // Resets the inactivity timer whenever user activity is detected
    function resetInactivityTimer() { //
        clearTimeout(inactivityTimer); // Clear existing timeout
        clearInterval(displayIntervalId); // Clear existing display interval

        // Set the new expiration time
        expirationTime = Date.now() + INACTIVITY_TIMEOUT_MS; //
        // Set the main timeout to trigger logout
        inactivityTimer = setTimeout(logoutDueToInactivity, INACTIVITY_TIMEOUT_MS); //

        // Start updating the visual timer display every second
        if (timerDisplayElement) { //
             updateTimerDisplay(); // Update display immediately
             displayIntervalId = setInterval(updateTimerDisplay, 1000); // Update every second
        }
    }

    // Adds event listeners for various user activities
    function addActivityListeners() { //
        console.log("Adding activity listeners for inactivity timer."); //
        // Listen for any specified events on the document
        activityEvents.forEach(eventName => { //
            document.addEventListener(eventName, resetInactivityTimer, true); // Use capture phase
        });
    }

    // Removes the activity event listeners
    function removeActivityListeners() { //
        console.log("Removing activity listeners for inactivity timer."); //
        // Clear timers just in case
        clearTimeout(inactivityTimer); //
        clearInterval(displayIntervalId); //
        if (timerDisplayElement) timerDisplayElement.textContent = ''; // Clear display

        // Remove listeners for specified events
        activityEvents.forEach(eventName => { //
            document.removeEventListener(eventName, resetInactivityTimer, true); // Use capture phase
        });
    }

// --- 'Next' Button Logic ---
    // Handles the first step of the two-step login
    if (nextButton && emailInput && authStatus && emailGroup && passwordGroup && loginButton) { //
        nextButton.addEventListener('click', () => { //
            const userEmail = emailInput.value.trim(); // Get entered email

            // Check if email field is empty
            if (!userEmail) { //
                 authStatus.textContent = 'Please enter your email address.'; //
                 authStatus.className = 'status-message error'; // Show error style
                 authStatus.style.display = 'block'; // Make sure message is visible
                 return; // Stop processing if email is empty
            }

            // If email is entered:
            // Display welcome message (optional, or clear previous errors)
            authStatus.textContent = `Welcome back, ${userEmail}`; // Shows email
            // Or simply clear status: authStatus.textContent = '';
            authStatus.className = 'status-message'; // Reset style
            authStatus.style.display = 'block'; // Ensure it's visible or use 'none' to hide

            // Hide email field and Next button
            emailGroup.style.display = 'none'; //
            nextButton.style.display = 'none'; //

            // Show password field and the actual Login button
            passwordGroup.style.display = 'block'; //
            loginButton.style.display = 'inline-block'; // Or 'block' depending on layout

            // Focus the password input for better UX
            if(passwordInput) { //
                 passwordInput.focus(); //
            }
        });
    } else { //
         // Log warning if any elements for the two-step login are missing
         console.warn("Could not find all necessary elements for the 'Next' button functionality (Next Button, Email Input, Auth Status, Email Group, Password Group, Login Button)."); //
    }

// --- Authentication Logic ---
    // Listener for changes in authentication state (login/logout)
    onAuthStateChanged(auth, user => { //
        if (user) { //
            // User is signed in
            console.log("User logged in:", user.email); //
            if (loginSection) loginSection.style.display = 'none'; // Hide login form
            if (adminContent) adminContent.style.display = 'block'; // Show admin content
            if (logoutButton) logoutButton.style.display = 'inline-block'; // Show logout button
            if (adminGreeting) adminGreeting.textContent = `Logged in as: ${user.email}`; // Show user email

            // Clear any previous login status messages
            if (authStatus) { authStatus.textContent = ''; authStatus.className = 'status-message'; authStatus.style.display = 'none'; } //
            if (adminStatusElement) { adminStatusElement.textContent = ''; adminStatusElement.className = 'status-message'; } //

            // Load initial data for the admin panel
            loadProfileData(); // Load site profile data (includes maintenance mode state now)
            // Load shoutout lists for each platform
            if (typeof loadShoutoutsAdmin === 'function') { //
                 if (shoutoutsTiktokListAdmin) loadShoutoutsAdmin('tiktok'); //
                 if (shoutoutsInstagramListAdmin) loadShoutoutsAdmin('instagram'); //
                 if (shoutoutsYoutubeListAdmin) loadShoutoutsAdmin('youtube'); //
            } else { //
                 console.error("loadShoutoutsAdmin function is not defined!"); //
                 showAdminStatus("Error: Cannot load shoutout data.", true); //
            }
            // *** Call loadUsefulLinksAdmin when user logs in ***
            if (typeof loadUsefulLinksAdmin === 'function' && usefulLinksListAdmin) { //
                loadUsefulLinksAdmin(); //
            }
            // *** Call loadSocialLinksAdmin when user logs in ***
            if (typeof loadSocialLinksAdmin === 'function' && socialLinksListAdmin) {
                 loadSocialLinksAdmin();
            }

            // --- Load Disabilities (Check This Block) --- // <<< THIS IS THE KEY PART
            if (typeof loadDisabilitiesAdmin === 'function' && disabilitiesListAdmin) {
                 loadDisabilitiesAdmin(); // <<< **** ENSURE THIS LINE IS PRESENT AND CORRECT ****
            } else {
                 // Log warnings/errors if function or element is missing
                 if(!disabilitiesListAdmin) console.warn("Disabilities list container missing during initial load.");
                 if(typeof loadDisabilitiesAdmin !== 'function') console.error("loadDisabilitiesAdmin function missing during initial load!");
            }

            // --- ADD THIS LINE ---
            if (typeof loadPresidentData === 'function') {
                loadPresidentData(); // Load president data on login
            } else {
                 console.error("loadPresidentData function is missing!");
                 showAdminStatus("Error: Cannot load president data.", true);
            }

            // Start the inactivity timer now that the user is logged in
            resetInactivityTimer(); //
            addActivityListeners(); //

        } else { //
            // User is signed out
            console.log("User logged out."); //
            if (loginSection) loginSection.style.display = 'block'; // Show login form
            if (adminContent) adminContent.style.display = 'none'; // Hide admin content
            if (logoutButton) logoutButton.style.display = 'none'; // Hide logout button
            if (adminGreeting) adminGreeting.textContent = ''; // Clear greeting
            if (typeof closeEditModal === 'function') closeEditModal(); // Close edit modal if open
            if (typeof closeEditUsefulLinkModal === 'function') closeEditUsefulLinkModal(); // Close useful link modal
            if (typeof closeEditSocialLinkModal === 'function') closeEditSocialLinkModal(); // Close social link modal

            // *** COUNTDOWN: Load countdown date on login ***
            if (typeof loadCountdownTargetDate === 'function') {
                 loadCountdownTargetDate();
            } else {
                 console.error("loadCountdownTargetDate function is missing!");
                 showAdminStatus("Error: Cannot load countdown settings.", true);
            }

            // *** COUNTDOWN: Attach Event Listener for Save Button ***
    if (saveCountdownButton) {
        saveCountdownButton.addEventListener('click', saveCountdownTargetDate);
    } else {
         console.warn("Save Countdown Settings button not found.");
    }

            // Reset the login form to its initial state (email input visible)
            if (emailGroup) emailGroup.style.display = 'block'; //
            if (passwordGroup) passwordGroup.style.display = 'none'; //
            if (nextButton) nextButton.style.display = 'inline-block'; // Or 'block'
            if (loginButton) loginButton.style.display = 'none'; //
            if (authStatus) { authStatus.textContent = ''; authStatus.style.display = 'none'; } // Clear status message
            if (loginForm) loginForm.reset(); // Clear email/password inputs

            // Stop inactivity timer and remove listeners
            removeActivityListeners(); //
        }
    });

    // Login Form Submission (Handles the final step after password entry)
    if (loginForm) { //
        loginForm.addEventListener('submit', (e) => { //
            e.preventDefault(); // Prevent default form submission
            const email = emailInput.value; //
            const password = passwordInput.value; //

            // Re-validate inputs (especially password as email was checked by 'Next')
            if (!email || !password) { //
                 // Check which field is missing in the current state
                 if (passwordGroup && passwordGroup.style.display !== 'none' && !password) { //
                     if (authStatus) { authStatus.textContent = 'Please enter your password.'; authStatus.className = 'status-message error'; authStatus.style.display = 'block';} //
                 } else if (!email) { // Should ideally not happen in two-step flow, but check anyway
                     if (authStatus) { authStatus.textContent = 'Please enter your email.'; authStatus.className = 'status-message error'; authStatus.style.display = 'block';} //
                 } else { // Generic message if validation fails unexpectedly
                     if (authStatus) { authStatus.textContent = 'Please enter email and password.'; authStatus.className = 'status-message error'; authStatus.style.display = 'block';} //
                 }
                 return; // Stop if validation fails
            }

            // Show "Logging in..." message
            if (authStatus) { //
                authStatus.textContent = 'Logging in...'; //
                authStatus.className = 'status-message'; // Reset style
                authStatus.style.display = 'block'; //
            }

            // Attempt Firebase sign-in
            signInWithEmailAndPassword(auth, email, password) //
                .then((userCredential) => { //
                    // Login successful - onAuthStateChanged will handle the UI updates
                    console.log("Login successful via form submission."); //
                    // No need to clear authStatus here, onAuthStateChanged does it.
                 })
                .catch((error) => { //
                    // Handle login errors
                    console.error("Login failed:", error.code, error.message); //
                    let errorMessage = 'Invalid email or password.'; // Default error
                    // Map specific Firebase Auth error codes to user-friendly messages
                    if (error.code === 'auth/invalid-email') { errorMessage = 'Invalid email format.'; } //
                    else if (error.code === 'auth/user-disabled') { errorMessage = 'This account has been disabled.'; } //
                    else if (error.code === 'auth/invalid-credential') { errorMessage = 'Invalid email or password.'; } // Covers wrong password, user not found
                    else if (error.code === 'auth/too-many-requests') { errorMessage = 'Access temporarily disabled due to too many failed login attempts. Please try again later.'; } //
                    else { errorMessage = `An unexpected error occurred (${error.code}).`; } // Fallback

                    // Display the specific error message
                    if (authStatus) { //
                        authStatus.textContent = `Login Failed: ${errorMessage}`; //
                        authStatus.className = 'status-message error'; //
                        authStatus.style.display = 'block'; //
                    }
                });
        });
    }

    // Logout Button Event Listener
    if (logoutButton) { //
        logoutButton.addEventListener('click', () => { //
            console.log("Logout button clicked."); //
            removeActivityListeners(); // Stop inactivity timer first
            signOut(auth).then(() => { //
                 // Sign-out successful - onAuthStateChanged handles UI updates
                 console.log("User signed out via button."); //
             }).catch((error) => { //
                 // Handle potential logout errors
                 console.error("Logout failed:", error); //
                 showAdminStatus(`Logout Failed: ${error.message}`, true); // Show error in admin area
             });
        });
    }

// --- Shoutouts Load/Add/Delete/Update ---

    // Helper function to get the reference to the metadata document
    // Used for storing last updated timestamps
    function getShoutoutsMetadataRef() { //
        // Using 'siteConfig' collection and 'shoutoutsMetadata' document ID
        // Ensure this document exists or is created if needed
        return doc(db, 'siteConfig', 'shoutoutsMetadata'); //
    }

    // Updates the 'lastUpdatedTime' field in the metadata document for a specific platform
    async function updateMetadataTimestamp(platform) { //
         const metaRef = getShoutoutsMetadataRef(); //
         try { //
             await setDoc(metaRef, { //
                 [`lastUpdatedTime_${platform}`]: serverTimestamp() //
             }, { merge: true }); //
             console.log(`Metadata timestamp updated for ${platform}.`); //
         } catch (error) { //
             console.error(`Error updating timestamp for ${platform}:`, error); //
             showAdminStatus(`Warning: Could not update site timestamp for ${platform}.`, true); //
         }
    }

    // --- UPDATED: loadShoutoutsAdmin Function (Stores data, calls filter function) ---
    async function loadShoutoutsAdmin(platform) { //
        const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`); //
        const countElement = document.getElementById(`${platform}-count`); //

        if (!listContainer) { //
            console.error(`List container not found for platform: ${platform}`); //
            return; //
        }
        if (countElement) countElement.textContent = ''; //
        listContainer.innerHTML = `<p>Loading ${platform} shoutouts...</p>`; //

        // Ensure the global storage for this platform exists and is clear
        if (typeof allShoutouts !== 'undefined' && allShoutouts && allShoutouts.hasOwnProperty(platform)) { //
             allShoutouts[platform] = []; //
        } else { //
            console.error(`allShoutouts variable or platform key '${platform}' is missing or not initialized.`); //
             if (typeof allShoutouts === 'undefined' || !allShoutouts) { //
                 allShoutouts = { tiktok: [], instagram: [], youtube: [] }; //
             } else if (!allShoutouts.hasOwnProperty(platform)) { //
                 allShoutouts[platform] = []; //
             }
        }

        try { //
            const shoutoutsCol = collection(db, 'shoutouts'); //
            // Query requires composite index (platform, order)
            const shoutoutQuery = query( //
                shoutoutsCol, //
                where("platform", "==", platform), //
                orderBy("order", "asc") //
            );

            const querySnapshot = await getDocs(shoutoutQuery); //
            console.log(`Loaded ${querySnapshot.size} ${platform} documents.`); //

            // Store fetched data in the global variable 'allShoutouts'
            querySnapshot.forEach((docSnapshot) => { //
                allShoutouts[platform].push({ id: docSnapshot.id, ...docSnapshot.data() }); //
            });

            // Call the filtering/display function to initially render the list
            if (typeof displayFilteredShoutouts === 'function') { //
                displayFilteredShoutouts(platform); //
            } else { //
                 console.error(`displayFilteredShoutouts function is not yet defined when loading ${platform}`); //
                 listContainer.innerHTML = `<p class="error">Error initializing display function.</p>`; //
                 if (countElement) countElement.textContent = '(Error)'; //
            }

        } catch (error) { //
            console.error(`Error loading ${platform} shoutouts:`, error); //
            if (error.code === 'failed-precondition') { //
                 listContainer.innerHTML = `<p class="error">Error: Missing Firestore index for this query. Please create it using the link in the developer console (F12).</p>`; //
                 showAdminStatus(`Error loading ${platform}: Missing database index. Check console.`, true); //
            } else { //
                 listContainer.innerHTML = `<p class="error">Error loading ${platform} shoutouts.</p>`; //
                 showAdminStatus(`Failed to load ${platform} data: ${error.message}`, true); //
            }
            if (countElement) countElement.textContent = '(Error)'; //
        }
    }
    // --- END UPDATED: loadShoutoutsAdmin Function ---

// --- MODIFIED: handleAddShoutout Function (Includes Duplicate Check & Preview Clear) ---
    async function handleAddShoutout(platform, formElement) { //
        if (!formElement) { console.error("Form element not provided to handleAddShoutout"); return; } //

        // Get form values
        const username = formElement.querySelector(`#${platform}-username`)?.value.trim(); //
        const nickname = formElement.querySelector(`#${platform}-nickname`)?.value.trim(); //
        const orderStr = formElement.querySelector(`#${platform}-order`)?.value.trim(); //
        const order = parseInt(orderStr); //

        // Basic input validation
        if (!username || !nickname || !orderStr || isNaN(order) || order < 0) { //
            showAdminStatus(`Invalid input for ${platform}. Check required fields and ensure Order is a non-negative number.`, true); //
            return; //
        }

        // Duplicate Check Logic
        try { //
            const shoutoutsCol = collection(db, 'shoutouts'); //
            const duplicateCheckQuery = query( //
                shoutoutsCol, //
                where("platform", "==", platform), //
                where("username", "==", username), //
                limit(1) //
            );

            console.log(`Checking for duplicate: platform=${platform}, username=${username}`); //
            const querySnapshot = await getDocs(duplicateCheckQuery); //

            if (!querySnapshot.empty) { //
                console.warn("Duplicate found for", platform, username); //
                showAdminStatus(`Error: A shoutout for username '@${username}' on platform '${platform}' already exists.`, true); //
                return; //
            }
            console.log("No duplicate found. Proceeding to add."); //
            // --- End Duplicate Check ---


            // --- Add Logic ---
            const accountData = { //
                platform: platform, //
                username: username, //
                nickname: nickname, //
                order: order, //
                isVerified: formElement.querySelector(`#${platform}-isVerified`)?.checked || false, //
                bio: formElement.querySelector(`#${platform}-bio`)?.value.trim() || null, //
                profilePic: formElement.querySelector(`#${platform}-profilePic`)?.value.trim() || null, //
                createdAt: serverTimestamp(), //
                isEnabled: true //
            };

            if (platform === 'youtube') { //
                accountData.subscribers = formElement.querySelector(`#${platform}-subscribers`)?.value.trim() || 'N/A'; //
                accountData.coverPhoto = formElement.querySelector(`#${platform}-coverPhoto`)?.value.trim() || null; //
            } else { //
                accountData.followers = formElement.querySelector(`#${platform}-followers`)?.value.trim() || 'N/A'; //
            }

            const docRef = await addDoc(collection(db, 'shoutouts'), accountData); //
            console.log("Shoutout added with ID:", docRef.id); //
            await updateMetadataTimestamp(platform); //
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout added successfully.`, false); //
            formElement.reset(); // Reset the form fields

            // *** ADDED: Reset preview area after adding ***
            const previewArea = formElement.querySelector(`#add-${platform}-preview`); //
            if (previewArea) { //
                previewArea.innerHTML = '<p><small>Preview will appear here as you type.</small></p>'; //
            }
            // *** END ADDED CODE ***

            if (typeof loadShoutoutsAdmin === 'function') { //
                loadShoutoutsAdmin(platform); // Reload the list
            }

        } catch (error) { //
            console.error(`Error in handleAddShoutout for ${platform}:`, error); //
            showAdminStatus(`Error adding ${platform} shoutout: ${error.message}`, true); //
        }
    }


    // --- Function to Handle Updates from Edit Modal ---
    async function handleUpdateShoutout(event) { //
        event.preventDefault(); // Prevent default form submission
        if (!editForm) return; // Exit if form element is missing

        const docId = editForm.getAttribute('data-doc-id'); //
        const platform = editForm.getAttribute('data-platform'); //

        if (!docId || !platform) { //
            showAdminStatus("Error: Missing document ID or platform for update.", true); //
            return; //
        }

        // Get updated values from the edit form
        const username = editUsernameInput?.value.trim(); //
        const nickname = editNicknameInput?.value.trim(); //
        const orderStr = editOrderInput?.value.trim(); //
        const order = parseInt(orderStr); //

        // Basic validation
        if (!username || !nickname || !orderStr || isNaN(order) || order < 0) { //
            showAdminStatus(`Update Error: Invalid input. Check required fields and ensure Order is non-negative.`, true); //
            return; //
        }

        // Construct the object with updated data
        const updatedData = { //
            username: username, //
            nickname: nickname, //
            order: order, //
            isVerified: editIsVerifiedInput?.checked || false, //
            bio: editBioInput?.value.trim() || null, //
            profilePic: editProfilePicInput?.value.trim() || null, //
            // isEnabled: editIsEnabledInput?.checked ?? true, // Add later
            lastModified: serverTimestamp() // Add a timestamp for the modification
        };

        // Add platform-specific fields
        if (platform === 'youtube') { //
            updatedData.subscribers = editSubscribersInput?.value.trim() || 'N/A'; //
            updatedData.coverPhoto = editCoverPhotoInput?.value.trim() || null; //
        } else { // TikTok or Instagram
            updatedData.followers = editFollowersInput?.value.trim() || 'N/A'; //
        }

        // Update the document in Firestore
        showAdminStatus("Updating shoutout..."); // Feedback
        try { //
            const docRef = doc(db, 'shoutouts', docId); //
            await updateDoc(docRef, updatedData); // Perform the update
            await updateMetadataTimestamp(platform); // Update site timestamp
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout updated successfully.`, false); //
            if (typeof closeEditModal === 'function') closeEditModal(); // Close the modal
            if (typeof loadShoutoutsAdmin === 'function') loadShoutoutsAdmin(platform); // Reload the list
        } catch (error) { //
            console.error(`Error updating ${platform} shoutout (ID: ${docId}):`, error); //
            showAdminStatus(`Error updating ${platform} shoutout: ${error.message}`, true); //
        }
    }


    // --- Function to Handle Deleting a Shoutout ---
    async function handleDeleteShoutout(docId, platform, listItemElement) { //
        // Confirm deletion with the user
        if (!confirm(`Are you sure you want to permanently delete this ${platform} shoutout? This cannot be undone.`)) { //
            return; // Do nothing if user cancels
        }

        showAdminStatus("Deleting shoutout..."); // Feedback
        try { //
            // Delete the document from Firestore
            await deleteDoc(doc(db, 'shoutouts', docId)); //
            await updateMetadataTimestamp(platform); // Update site timestamp
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout deleted successfully.`, false); //

            // Reload the list - this is the simplest way to update the UI
            // and ensure the 'allShoutouts' array is also updated for filtering.
            if (typeof loadShoutoutsAdmin === 'function') { //
                loadShoutoutsAdmin(platform); //
            }

        } catch (error) { //
            console.error(`Error deleting ${platform} shoutout (ID: ${docId}):`, error); //
            showAdminStatus(`Error deleting ${platform} shoutout: ${error.message}`, true); //
        }
    }

// *** Function to render a single Useful Link item in the admin list ***
function renderUsefulLinkAdminListItem(container, docId, label, url, order, deleteHandler, editHandler) { //
    if (!container) return; //

    const itemDiv = document.createElement('div'); //
    itemDiv.className = 'list-item-admin'; //
    itemDiv.setAttribute('data-id', docId); //

    itemDiv.innerHTML = `
        <div class="item-content">
             <div class="item-details">
                <strong>${label || 'N/A'}</strong>
                <span>(${url || 'N/A'})</span>
                <small>Order: ${order ?? 'N/A'}</small>
             </div>
        </div>
        <div class="item-actions">
            <a href="${url || '#'}" target="_blank" rel="noopener noreferrer" class="direct-link small-button" title="Visit Link">
                 <i class="fas fa-external-link-alt"></i> Visit
            </a>
            <button type="button" class="edit-button small-button">Edit</button>
            <button type="button" class="delete-button small-button">Delete</button>
        </div>`; //

    // Add event listeners
    const editButton = itemDiv.querySelector('.edit-button'); //
    if (editButton) editButton.addEventListener('click', () => editHandler(docId)); // Pass only docId

    const deleteButton = itemDiv.querySelector('.delete-button'); //
    if (deleteButton) deleteButton.addEventListener('click', () => deleteHandler(docId, itemDiv)); // Pass docId and the item element

    container.appendChild(itemDiv); //
}


// *** CORRECTED Function to Load Useful Links ***
async function loadUsefulLinksAdmin() {
    if (!usefulLinksListAdmin) { console.error("Useful links list container missing."); return; }
    if (usefulLinksCount) usefulLinksCount.textContent = '';
    usefulLinksListAdmin.innerHTML = `<p>Loading useful links...</p>`;
    allUsefulLinks = []; // Clear the global array

    try {
        const linkQuery = query(usefulLinksCollectionRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(linkQuery);

        // Populate the global array
        querySnapshot.forEach((doc) => {
            allUsefulLinks.push({ id: doc.id, ...doc.data() }); // Store data in the array
        });
        console.log(`Stored ${allUsefulLinks.length} useful links.`);

        // Call the filter function to display initially (will show all)
        displayFilteredUsefulLinks();

    } catch (error) {
        console.error("Error loading useful links:", error);
        usefulLinksListAdmin.innerHTML = `<p class="error">Error loading links.</p>`;
        if (usefulLinksCount) usefulLinksCount.textContent = '(Error)';
        showAdminStatus("Error loading useful links.", true);
    }
}

// *** Function to Handle Adding a New Useful Link ***
async function handleAddUsefulLink(event) { //
    event.preventDefault(); //
    if (!addUsefulLinkForm) return; //

    const labelInput = addUsefulLinkForm.querySelector('#link-label'); //
    const urlInput = addUsefulLinkForm.querySelector('#link-url'); //
    const orderInput = addUsefulLinkForm.querySelector('#link-order'); //

    const label = labelInput?.value.trim(); //
    const url = urlInput?.value.trim(); //
    const orderStr = orderInput?.value.trim(); //
    const order = parseInt(orderStr); //

    if (!label || !url || !orderStr || isNaN(order) || order < 0) { //
        showAdminStatus("Invalid input for Useful Link. Check required fields and ensure Order is a non-negative number.", true); //
        return; //
    }

    // Simple check for valid URL structure (basic)
    try { //
        new URL(url); // This will throw an error if the URL is invalid
    } catch (_) { //
        showAdminStatus("Invalid URL format. Please enter a valid URL starting with http:// or https://", true); //
        return; //
    }

    const linkData = { //
        label: label, //
        url: url, //
        order: order, //
        createdAt: serverTimestamp() //
    };

    showAdminStatus("Adding useful link..."); //
    try { //
        const docRef = await addDoc(usefulLinksCollectionRef, linkData); //
        console.log("Useful link added with ID:", docRef.id); //
        // await updateMetadataTimestamp('usefulLinks'); // Optional: if tracking metadata
        showAdminStatus("Useful link added successfully.", false); //
        addUsefulLinkForm.reset(); // Reset the form
        loadUsefulLinksAdmin(); // Reload the list

    } catch (error) { //
        console.error("Error adding useful link:", error); //
        showAdminStatus(`Error adding useful link: ${error.message}`, true); //
    }
}

// *** Function to Handle Deleting a Useful Link ***
async function handleDeleteUsefulLink(docId, listItemElement) { //
    if (!confirm("Are you sure you want to permanently delete this useful link?")) { //
        return; //
    }

    showAdminStatus("Deleting useful link..."); //
    try { //
        await deleteDoc(doc(db, 'useful_links', docId)); //
        // await updateMetadataTimestamp('usefulLinks'); // Optional
        showAdminStatus("Useful link deleted successfully.", false); //
        loadUsefulLinksAdmin(); // Reload list is simplest

    } catch (error) { //
        console.error(`Error deleting useful link (ID: ${docId}):`, error); //
        showAdminStatus(`Error deleting useful link: ${error.message}`, true); //
    }
}


// *** Function to Open and Populate the Edit Useful Link Modal ***
function openEditUsefulLinkModal(docId) { //
    if (!editUsefulLinkModal || !editUsefulLinkForm) { //
        console.error("Edit useful link modal elements not found."); //
        showAdminStatus("UI Error: Cannot open edit form.", true); //
        return; //
    }

    const docRef = doc(db, 'useful_links', docId); //
    showEditLinkStatus("Loading link data..."); // Show status inside modal

    getDoc(docRef).then(docSnap => { //
        if (docSnap.exists()) { //
            const data = docSnap.data(); //
            editUsefulLinkForm.setAttribute('data-doc-id', docId); // Store doc ID on the form
            if (editLinkLabelInput) editLinkLabelInput.value = data.label || ''; //
            if (editLinkUrlInput) editLinkUrlInput.value = data.url || ''; //
            if (editLinkOrderInput) editLinkOrderInput.value = data.order ?? ''; //

            editUsefulLinkModal.style.display = 'block'; //
            showEditLinkStatus(""); // Clear loading message
        } else { //
            showAdminStatus("Error: Could not load link data for editing.", true); //
             showEditLinkStatus("Error: Link not found.", true); // Show error inside modal
        }
    }).catch(error => { //
        console.error("Error getting link document for edit:", error); //
        showAdminStatus(`Error loading link data: ${error.message}`, true); //
        showEditLinkStatus(`Error: ${error.message}`, true); //
    });
}

// *** Function to Close the Edit Useful Link Modal ***
function closeEditUsefulLinkModal() { //
    if (editUsefulLinkModal) editUsefulLinkModal.style.display = 'none'; //
    if (editUsefulLinkForm) editUsefulLinkForm.reset(); //
    editUsefulLinkForm?.removeAttribute('data-doc-id'); //
    if (editLinkStatusMessage) editLinkStatusMessage.textContent = ''; // Clear status message inside modal
}

// *** Function to Handle Updating a Useful Link from the Edit Modal ***
async function handleUpdateUsefulLink(event) { //
    event.preventDefault(); //
    if (!editUsefulLinkForm) return; //

    const docId = editUsefulLinkForm.getAttribute('data-doc-id'); //
    if (!docId) { //
        showEditLinkStatus("Error: Missing document ID for update.", true); //
        return; //
    }

    const label = editLinkLabelInput?.value.trim(); //
    const url = editLinkUrlInput?.value.trim(); //
    const orderStr = editLinkOrderInput?.value.trim(); //
    const order = parseInt(orderStr); //

    if (!label || !url || !orderStr || isNaN(order) || order < 0) { //
        showEditLinkStatus("Invalid input. Check required fields and ensure Order is non-negative.", true); //
        return; //
    }
     // Simple URL validation
    try { new URL(url); } catch (_) { //
        showEditLinkStatus("Invalid URL format.", true); //
        return; //
    }

    const updatedData = { //
        label: label, //
        url: url, //
        order: order, //
        lastModified: serverTimestamp() //
    };

    showEditLinkStatus("Saving changes..."); //
    try { //
        const docRef = doc(db, 'useful_links', docId); //
        await updateDoc(docRef, updatedData); //
        // await updateMetadataTimestamp('usefulLinks'); // Optional
        showAdminStatus("Useful link updated successfully.", false); // Show main status
        closeEditUsefulLinkModal(); //
        loadUsefulLinksAdmin(); // Reload the list

    } catch (error) { //
        console.error(`Error updating useful link (ID: ${docId}):`, error); //
        showEditLinkStatus(`Error saving: ${error.message}`, true); // Show error in modal
        showAdminStatus(`Error updating useful link: ${error.message}`, true); // Also show main status
    }
}

// --- Function to render a single Social Link item in the admin list ---
   function renderSocialLinkAdminListItem(container, docId, label, url, order, deleteHandler, editHandler) {
       if (!container) return;

       const itemDiv = document.createElement('div');
       itemDiv.className = 'list-item-admin';
       itemDiv.setAttribute('data-id', docId);

       // Basic validation for URL before creating the link
       let displayUrl = url || 'N/A';
       let visitUrl = '#';
       try {
           if (url) {
               visitUrl = new URL(url).href; // Ensures it's a valid structure
           }
       } catch (e) {
            console.warn(`Invalid URL skipped for visit button: ${url}`);
            displayUrl += " (Invalid URL)";
       }


       itemDiv.innerHTML = `
           <div class="item-content">
                <div class="item-details">
                   <strong>${label || 'N/A'}</strong>
                   <span>(${displayUrl})</span>
                   <small>Order: ${order ?? 'N/A'}</small>
                </div>
           </div>
           <div class="item-actions">
               <a href="${visitUrl}" target="_blank" rel="noopener noreferrer" class="direct-link small-button" title="Visit Link" ${visitUrl === '#' ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>
                    <i class="fas fa-external-link-alt"></i> Visit
               </a>
               <button type="button" class="edit-button small-button">Edit</button>
               <button type="button" class="delete-button small-button">Delete</button>
           </div>`;

       // Add event listeners
       const editButton = itemDiv.querySelector('.edit-button');
       if (editButton) editButton.addEventListener('click', () => editHandler(docId)); // Pass only docId

       const deleteButton = itemDiv.querySelector('.delete-button');
       if (deleteButton) deleteButton.addEventListener('click', () => deleteHandler(docId, itemDiv)); // Pass docId and the item element

       container.appendChild(itemDiv);
   }


   // *** CORRECTED Function to Load Social Links ***
async function loadSocialLinksAdmin() {
    if (!socialLinksListAdmin) { console.error("Social links list container missing."); return; }
    if (socialLinksCount) socialLinksCount.textContent = '';
    socialLinksListAdmin.innerHTML = `<p>Loading social links...</p>`;
    allSocialLinks = []; // Clear the global array

    try {
        const linkQuery = query(socialLinksCollectionRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(linkQuery);

        // Populate the global array
        querySnapshot.forEach((doc) => {
            allSocialLinks.push({ id: doc.id, ...doc.data() }); // Store data in the array
        });
         console.log(`Stored ${allSocialLinks.length} social links.`);

        // Call the filter function to display initially (will show all)
        displayFilteredSocialLinks();

    } catch (error) {
        console.error("Error loading social links:", error);
        let errorMsg = "Error loading social links.";
        if (error.code === 'failed-precondition') {
            errorMsg = "Error: Missing Firestore index for social links (order). Check console.";
            showAdminStatus(errorMsg, true);
        } else {
            showAdminStatus(errorMsg + `: ${error.message}`, true);
        }
        socialLinksListAdmin.innerHTML = `<p class="error">${errorMsg}</p>`;
        if (socialLinksCount) socialLinksCount.textContent = '(Error)';
    }
}

    // --- REVISED + CORRECTED Filtering Function for Social Links ---
// (Make sure this function exists in your file now)
function displayFilteredSocialLinks() {
    const listContainer = socialLinksListAdmin;
    const countElement = socialLinksCount;
    const searchInput = document.getElementById('search-social-links');

    if (!listContainer || !searchInput || typeof allSocialLinks === 'undefined') {
        console.error("Social Links Filter Error: Missing elements/data.");
         if(listContainer) listContainer.innerHTML = `<p class="error">Error displaying list.</p>`;
        return;
    }

    const searchTerm = searchInput.value.trim().toLowerCase();
    // console.log(`Filtering Social Links: Term = "${searchTerm}"`); // Keep or remove logs

    let listToRender = [];

    if (!searchTerm) {
        // console.log("Social Links: Search term is empty, using full list.");
        listToRender = allSocialLinks;
    } else {
        // console.log("Social Links: Search term found, filtering list...");
        listToRender = allSocialLinks.filter(link => {
            const label = (link.label || '').toLowerCase();
             // --- Only check the label ---
            return label.includes(searchTerm);
        });
    }

     // console.log(`Rendering ${listToRender.length} social links.`);

    listContainer.innerHTML = '';

    if (listToRender.length > 0) {
        listToRender.forEach(link => {
            if (typeof renderSocialLinkAdminListItem === 'function' && typeof handleDeleteSocialLink === 'function' && typeof openEditSocialLinkModal === 'function') {
                renderSocialLinkAdminListItem(listContainer, link.id, link.label, link.url, link.order, handleDeleteSocialLink, openEditSocialLinkModal);
            } else {
                 console.error("Error: renderSocialLinkAdminListItem or its handlers are missing!");
                 listContainer.innerHTML = '<p class="error">Rendering function error.</p>';
                 return;
            }
        });
    } else {
        if (searchTerm) {
            listContainer.innerHTML = `<p>No social links found matching "${searchTerm}".</p>`;
        } else {
             listContainer.innerHTML = `<p>No social links found.</p>`;
        }
    }
    if (countElement) { countElement.textContent = `(${listToRender.length})`; }
}


   // --- Function to Handle Adding a New Social Link ---
   async function handleAddSocialLink(event) {
       event.preventDefault();
       if (!addSocialLinkForm) return;

       const labelInput = addSocialLinkForm.querySelector('#social-link-label');
       const urlInput = addSocialLinkForm.querySelector('#social-link-url');
       const orderInput = addSocialLinkForm.querySelector('#social-link-order');

       const label = labelInput?.value.trim();
       const url = urlInput?.value.trim();
       const orderStr = orderInput?.value.trim();
       const order = parseInt(orderStr);

       if (!label || !url || !orderStr || isNaN(order) || order < 0) {
           showAdminStatus("Invalid input for Social Link. Check required fields and ensure Order is a non-negative number.", true);
           return;
       }

       // Simple check for valid URL structure
       try {
           new URL(url); // This will throw an error if the URL is invalid
       } catch (_) {
           showAdminStatus("Invalid URL format. Please enter a valid URL starting with http:// or https://", true);
           return;
       }

       const linkData = {
           label: label,
           url: url,
           order: order,
           createdAt: serverTimestamp()
       };

       showAdminStatus("Adding social link...");
       try {
           const docRef = await addDoc(socialLinksCollectionRef, linkData);
           console.log("Social link added with ID:", docRef.id);
           // Optionally: await updateMetadataTimestamp('socialLinks');
           showAdminStatus("Social link added successfully.", false);
           addSocialLinkForm.reset(); // Reset the form
           loadSocialLinksAdmin(); // Reload the list

       } catch (error) {
           console.error("Error adding social link:", error);
           showAdminStatus(`Error adding social link: ${error.message}`, true);
       }
   }

   // --- Function to Handle Deleting a Social Link ---
   async function handleDeleteSocialLink(docId, listItemElement) {
       if (!confirm("Are you sure you want to permanently delete this social link?")) {
           return;
       }

       showAdminStatus("Deleting social link...");
       try {
           await deleteDoc(doc(db, 'social_links', docId));
           // Optionally: await updateMetadataTimestamp('socialLinks');
           showAdminStatus("Social link deleted successfully.", false);
           loadSocialLinksAdmin(); // Reload list

       } catch (error) {
           console.error(`Error deleting social link (ID: ${docId}):`, error);
           showAdminStatus(`Error deleting social link: ${error.message}`, true);
       }
   }


   // --- Function to Open and Populate the Edit Social Link Modal ---
   function openEditSocialLinkModal(docId) {
       if (!editSocialLinkModal || !editSocialLinkForm) {
           console.error("Edit social link modal elements not found.");
           showAdminStatus("UI Error: Cannot open edit form.", true);
           return;
       }

       const docRef = doc(db, 'social_links', docId);
       showEditSocialLinkStatus("Loading link data..."); // Show status inside modal

       getDoc(docRef).then(docSnap => {
           if (docSnap.exists()) {
               const data = docSnap.data();
               editSocialLinkForm.setAttribute('data-doc-id', docId); // Store doc ID on the form
               if (editSocialLinkLabelInput) editSocialLinkLabelInput.value = data.label || '';
               if (editSocialLinkUrlInput) editSocialLinkUrlInput.value = data.url || '';
               if (editSocialLinkOrderInput) editSocialLinkOrderInput.value = data.order ?? '';

               editSocialLinkModal.style.display = 'block';
               showEditSocialLinkStatus(""); // Clear loading message
           } else {
               showAdminStatus("Error: Could not load link data for editing.", true);
                showEditSocialLinkStatus("Error: Link not found.", true); // Show error inside modal
           }
       }).catch(error => {
           console.error("Error getting link document for edit:", error);
           showAdminStatus(`Error loading link data: ${error.message}`, true);
           showEditSocialLinkStatus(`Error: ${error.message}`, true);
       });
   }

   // --- Function to Close the Edit Social Link Modal ---
   function closeEditSocialLinkModal() {
       if (editSocialLinkModal) editSocialLinkModal.style.display = 'none';
       if (editSocialLinkForm) editSocialLinkForm.reset();
       editSocialLinkForm?.removeAttribute('data-doc-id');
       if (editSocialLinkStatusMessage) editSocialLinkStatusMessage.textContent = ''; // Clear status message inside modal
   }

   // --- Function to Handle Updating a Social Link from the Edit Modal ---
   async function handleUpdateSocialLink(event) {
       event.preventDefault();
       if (!editSocialLinkForm) return;

       const docId = editSocialLinkForm.getAttribute('data-doc-id');
       if (!docId) {
           showEditSocialLinkStatus("Error: Missing document ID for update.", true);
           return;
       }

       const label = editSocialLinkLabelInput?.value.trim();
       const url = editSocialLinkUrlInput?.value.trim();
       const orderStr = editSocialLinkOrderInput?.value.trim();
       const order = parseInt(orderStr);

       if (!label || !url || !orderStr || isNaN(order) || order < 0) {
           showEditSocialLinkStatus("Invalid input. Check required fields and ensure Order is non-negative.", true);
           return;
       }
        // Simple URL validation
       try { new URL(url); } catch (_) {
           showEditSocialLinkStatus("Invalid URL format.", true);
           return;
       }

       const updatedData = {
           label: label,
           url: url,
           order: order,
           lastModified: serverTimestamp()
       };

       showEditSocialLinkStatus("Saving changes...");
       try {
           const docRef = doc(db, 'social_links', docId);
           await updateDoc(docRef, updatedData);
           // Optionally: await updateMetadataTimestamp('socialLinks');
           showAdminStatus("Social link updated successfully.", false); // Show main status
           closeEditSocialLinkModal();
           loadSocialLinksAdmin(); // Reload the list

       } catch (error) {
           console.error(`Error updating social link (ID: ${docId}):`, error);
           showEditSocialLinkStatus(`Error saving: ${error.message}`, true); // Show error in modal
           showAdminStatus(`Error updating social link: ${error.message}`, true); // Also show main status
       }
   }

// --- Attach Event Listeners for Forms ---

    // Add Shoutout Forms
    if (addShoutoutTiktokForm) { //
        addShoutoutTiktokForm.addEventListener('submit', (e) => { //
            e.preventDefault(); // Prevent default submission
            handleAddShoutout('tiktok', addShoutoutTiktokForm); // Call handler
        });
    }
    if (addShoutoutInstagramForm) { //
        addShoutoutInstagramForm.addEventListener('submit', (e) => { //
            e.preventDefault(); //
            handleAddShoutout('instagram', addShoutoutInstagramForm); //
        });
    }
    if (addShoutoutYoutubeForm) { //
        addShoutoutYoutubeForm.addEventListener('submit', (e) => { //
            e.preventDefault(); //
            handleAddShoutout('youtube', addShoutoutYoutubeForm); //
        });
    }

    // Profile Save Form
    if (profileForm) { //
        profileForm.addEventListener('submit', saveProfileData); // Call handler on submit
    }

    // Edit Shoutout Form (in the modal)
    if (editForm) { //
        editForm.addEventListener('submit', handleUpdateShoutout); // Call handler on submit
    }

    // Maintenance Mode Toggle Listener
    if (maintenanceModeToggle) { //
        maintenanceModeToggle.addEventListener('change', (e) => { //
            const isEnabled = e.target.checked; // Get the new checked state
            saveMaintenanceModeStatus(isEnabled); // Call the save function
        });
    }

    // *** Search Input Event Listeners ***
    if (searchInputTiktok) { //
        searchInputTiktok.addEventListener('input', () => { //
            if (typeof displayFilteredShoutouts === 'function') { //
                displayFilteredShoutouts('tiktok'); // Filter TikTok list as user types
            }
        });
    }
     if (searchInputInstagram) { //
        searchInputInstagram.addEventListener('input', () => { //
            if (typeof displayFilteredShoutouts === 'function') { //
                displayFilteredShoutouts('instagram'); // Filter Instagram list as user types
            }
        });
    }
    if (searchInputYoutube) { //
        searchInputYoutube.addEventListener('input', () => { //
            if (typeof displayFilteredShoutouts === 'function') { //
                displayFilteredShoutouts('youtube'); // Filter YouTube list as user types
            }
        });
    }
    // *** END Search Listeners ***

// --- ADD THESE FUNCTIONS ---

    // Renders the HTML for the president section preview (NO INLINE STYLES)
    function renderPresidentPreview(data) {
        // Use default values if data is missing
        const name = data.name || 'N/A';
        const born = data.born || 'N/A';
        const height = data.height || 'N/A';
        const party = data.party || 'N/A';
        const term = data.term || 'N/A';
        const vp = data.vp || 'N/A';
        const imageUrl = data.imageUrl || 'images/default-president.jpg'; // Use a default image path

        // Construct the HTML using only classes defined in admin.css (or your main css)
        return `
            <section class="president-section">
                <div class="president-info">
                    <img src="${imageUrl}" alt="President ${name}" class="president-photo" onerror="this.src='images/default-president.jpg'; this.alt='Photo Missing';">
                    <div class="president-details">
                        <h3 class="president-name">${name}</h3>
                        <p><strong>Born:</strong> ${born}</p>
                        <p><strong>Height:</strong> ${height}</p>
                        <p><strong>Party:</strong> ${party}</p>
                        <p class="presidential-term"><strong>Term:</strong> ${term}</p>
                        <p><strong>VP:</strong> ${vp}</p>
                    </div>
                </div>
            </section>`;
    }

    // Reads president form inputs and updates the preview area
    function updatePresidentPreview() {
        // Use the previously defined constants for the input elements and preview area
        if (!presidentForm || !presidentPreviewArea) return; // Exit if elements aren't found

        const presidentData = {
            name: presidentNameInput?.value.trim() || "",
            born: presidentBornInput?.value.trim() || "",
            height: presidentHeightInput?.value.trim() || "",
            party: presidentPartyInput?.value.trim() || "",
            term: presidentTermInput?.value.trim() || "",
            vp: presidentVpInput?.value.trim() || "",
            imageUrl: presidentImageUrlInput?.value.trim() || ""
        };

        try {
            // Ensure the rendering function exists before calling it
            if (typeof renderPresidentPreview === 'function') {
                 const previewHTML = renderPresidentPreview(presidentData);
                 presidentPreviewArea.innerHTML = previewHTML;
            } else {
                 console.error("renderPresidentPreview function is not defined!");
                 presidentPreviewArea.innerHTML = '<p class="error"><small>Preview engine error.</small></p>';
            }
        } catch (e) {
            console.error("Error rendering president preview:", e);
            presidentPreviewArea.innerHTML = '<p class="error"><small>Error generating preview.</small></p>';
        }
    }
    // -------------

    // --- ADD THESE FUNCTIONS ---

    // Function to Load President Data into Admin Form
    async function loadPresidentData() {
        // Use the constants defined earlier for the form and input elements
        if (!auth || !auth.currentUser) { console.warn("Auth not ready for loading president data."); return; }
        if (!presidentForm) { console.log("President form element not found."); return; }

        console.log("Attempting to load president data from:", presidentDocRef.path);
        try {
            const docSnap = await getDoc(presidentDocRef); // Use presidentDocRef
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("Loaded president data:", data);
                // Populate the form fields
                if(presidentNameInput) presidentNameInput.value = data.name || '';
                if(presidentBornInput) presidentBornInput.value = data.born || '';
                if(presidentHeightInput) presidentHeightInput.value = data.height || '';
                if(presidentPartyInput) presidentPartyInput.value = data.party || '';
                if(presidentTermInput) presidentTermInput.value = data.term || '';
                if(presidentVpInput) presidentVpInput.value = data.vp || '';
                if(presidentImageUrlInput) presidentImageUrlInput.value = data.imageUrl || '';
            } else {
                console.warn(`President document ('${presidentDocRef.path}') not found. Form cleared.`);
                if (presidentForm) presidentForm.reset(); // Clear form if no data
            }
            // Update the preview after loading/clearing data
            if (typeof updatePresidentPreview === 'function') {
                updatePresidentPreview();
            }
        } catch (error) {
            console.error("Error loading president data:", error);
            showPresidentStatus("Error loading president data.", true); // Use the specific status func
            if (presidentForm) presidentForm.reset();
             // Update preview even on error (shows default/empty)
            if (typeof updatePresidentPreview === 'function') {
                updatePresidentPreview();
            }
        }
    }

    // Function to Save President Data
    async function savePresidentData(event) {
        event.preventDefault(); // Prevent default form submission behavior
        // Use the constants defined earlier for the form and input elements
        if (!auth || !auth.currentUser) { showPresidentStatus("Error: Not logged in.", true); return; }
        if (!presidentForm) return;

        // Create data object from form inputs
        const newData = {
            name: presidentNameInput?.value.trim() || "",
            born: presidentBornInput?.value.trim() || "",
            height: presidentHeightInput?.value.trim() || "",
            party: presidentPartyInput?.value.trim() || "",
            term: presidentTermInput?.value.trim() || "",
            vp: presidentVpInput?.value.trim() || "",
            imageUrl: presidentImageUrlInput?.value.trim() || "",
            lastUpdated: serverTimestamp() // Add a timestamp
        };

        showPresidentStatus("Saving president info..."); // Use specific status func
        try {
            // Use setDoc with merge: true to create or update the document
            await setDoc(presidentDocRef, newData, { merge: true }); // Use presidentDocRef
            console.log("President data saved to:", presidentDocRef.path);
            showPresidentStatus("President info updated successfully!", false);
        } catch (error) {
            console.error("Error saving president data:", error);
            showPresidentStatus(`Error saving president info: ${error.message}`, true);
        }
    }
    // -------------

     // Attach Event Listeners for President Form Preview and Submission
    if (presidentForm) {
        const presidentPreviewInputs = [
            presidentNameInput, presidentBornInput, presidentHeightInput,
            presidentPartyInput, presidentTermInput, presidentVpInput, presidentImageUrlInput
        ];
        // Add listeners to update preview on input
        presidentPreviewInputs.forEach(inputElement => {
            if (inputElement) {
                inputElement.addEventListener('input', () => {
                    if (typeof updatePresidentPreview === 'function') {
                        updatePresidentPreview();
                    } else {
                        console.error("updatePresidentPreview function is not defined!");
                    }
                });
            }
        });

        // Add listener for form submission (Save)
        presidentForm.addEventListener('submit', savePresidentData);
    }
    // -------------

    

// --- ADD THIS FUNCTION ---
    // Displays status messages in the president section's status area
    function showPresidentStatus(message, isError = false) {
        if (!presidentStatusMessage) { console.warn("President status message element not found"); showAdminStatus(message, isError); return; } // Fallback to main admin status
        presidentStatusMessage.textContent = message;
        presidentStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
        // Clear message after 5 seconds
        setTimeout(() => { if (presidentStatusMessage) { presidentStatusMessage.textContent = ''; presidentStatusMessage.className = 'status-message'; } }, 5000);
    }
    
   // --- Useful Links Event Listeners ---
    if (addUsefulLinkForm) { //
        addUsefulLinkForm.addEventListener('submit', handleAddUsefulLink); //
    }
    if (editUsefulLinkForm) { //
        editUsefulLinkForm.addEventListener('submit', handleUpdateUsefulLink); //
    }
    if (cancelEditLinkButton) { // X close button
        cancelEditLinkButton.addEventListener('click', closeEditUsefulLinkModal); //
    }
    if (cancelEditLinkButtonSecondary) { // Secondary Cancel button
        cancelEditLinkButtonSecondary.addEventListener('click', closeEditUsefulLinkModal); //
    }

   // --- Social Links Event Listeners ---
   if (addSocialLinkForm) {
       addSocialLinkForm.addEventListener('submit', handleAddSocialLink);
   }
   if (editSocialLinkForm) {
       editSocialLinkForm.addEventListener('submit', handleUpdateSocialLink);
   }
   if (cancelEditSocialLinkButton) { // X close button
       cancelEditSocialLinkButton.addEventListener('click', closeEditSocialLinkModal);
   }
   if (cancelEditSocialLinkButtonSecondary) { // Secondary Cancel button
       cancelEditSocialLinkButtonSecondary.addEventListener('click', closeEditSocialLinkModal);
   }


    // Function to render a single Disability Link item in the admin list
    function renderDisabilityAdminListItem(container, docId, name, url, order, deleteHandler, editHandler) {
        if (!container) {
             console.warn("Disabilities list container not found during render.");
             return;
        }

        const itemDiv = document.createElement('div');
        itemDiv.className = 'list-item-admin'; // Use the same class as other list items
        itemDiv.setAttribute('data-id', docId);

        // Basic validation for URL before creating the visit link
        let displayUrl = url || 'N/A';
        let visitUrl = '#';
        try {
            if (url) {
                visitUrl = new URL(url).href; // Ensures it's a valid structure
            }
        } catch (e) {
            console.warn(`Invalid URL for disability link ${docId}: ${url}`);
            displayUrl += " (Invalid URL)";
        }

        itemDiv.innerHTML = `
            <div class="item-content">
                <div class="item-details">
                    <strong>${name || 'N/A'}</strong>
                    <span>(${displayUrl})</span>
                    <small>Order: ${order ?? 'N/A'}</small>
                </div>
            </div>
            <div class="item-actions">
                <a href="${visitUrl}" target="_blank" rel="noopener noreferrer" class="direct-link small-button" title="Visit Info Link" ${visitUrl === '#' ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>
                    <i class="fas fa-external-link-alt"></i> Visit
                </a>
                <button type="button" class="edit-button small-button">Edit</button>
                <button type="button" class="delete-button small-button">Delete</button>
            </div>`;

        // Add event listeners for Edit and Delete buttons
        const editButton = itemDiv.querySelector('.edit-button');
        if (editButton) editButton.addEventListener('click', () => editHandler(docId)); // Pass docId to edit handler

        const deleteButton = itemDiv.querySelector('.delete-button');
        if (deleteButton) deleteButton.addEventListener('click', () => deleteHandler(docId, itemDiv)); // Pass docId and the element to delete handler

        container.appendChild(itemDiv);
    }

    // Function to show status messages inside the Edit Disability modal
    function showEditDisabilityStatus(message, isError = false) {
        // Uses the 'editDisabilityStatusMessage' element const defined earlier
        if (!editDisabilityStatusMessage) { console.warn("Edit disability status message element not found"); return; }
        editDisabilityStatusMessage.textContent = message;
        editDisabilityStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
        // Clear message after 3 seconds
        setTimeout(() => { if (editDisabilityStatusMessage) { editDisabilityStatusMessage.textContent = ''; editDisabilityStatusMessage.className = 'status-message'; } }, 3000);
    }

    // *** CORRECTED Function to Load Disabilities ***
async function loadDisabilitiesAdmin() {
    if (!disabilitiesListAdmin) { console.error("Disabilities list container missing."); return; }
    if (disabilitiesCount) disabilitiesCount.textContent = '';
    disabilitiesListAdmin.innerHTML = `<p>Loading disability links...</p>`;
    allDisabilities = []; // Clear the global array

    try {
        const disabilityQuery = query(disabilitiesCollectionRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(disabilityQuery);

        // Populate the global array
        querySnapshot.forEach((doc) => {
            allDisabilities.push({ id: doc.id, ...doc.data() }); // Store data in the array
        });
        console.log(`Stored ${allDisabilities.length} disability links.`);

        // Call the filter function to display initially (will show all)
        displayFilteredDisabilities();

    } catch (error) {
        console.error("Error loading disabilities:", error);
        let errorMsg = "Error loading disabilities.";
        if (error.code === 'failed-precondition') {
            errorMsg = "Error: Missing Firestore index for disabilities (order).";
            showAdminStatus(errorMsg, true);
        } else {
            showAdminStatus(errorMsg + `: ${error.message}`, true);
        }
        disabilitiesListAdmin.innerHTML = `<p class="error">${errorMsg}</p>`;
        if (disabilitiesCount) disabilitiesCount.textContent = '(Error)';
    }
}

    // Function to Handle Adding a New Disability Link
    async function handleAddDisability(event) {
        event.preventDefault(); // Prevent default form submission
        // Use const defined earlier for the add form
        if (!addDisabilityForm) return;

        // Get values from the add disability form
        const nameInput = addDisabilityForm.querySelector('#disability-name');
        const urlInput = addDisabilityForm.querySelector('#disability-url');
        const orderInput = addDisabilityForm.querySelector('#disability-order');

        const name = nameInput?.value.trim();
        const url = urlInput?.value.trim();
        const orderStr = orderInput?.value.trim();
        const order = parseInt(orderStr);

        // Basic validation
        if (!name || !url || !orderStr || isNaN(order) || order < 0) {
            showAdminStatus("Invalid input for Disability Link. Check required fields and ensure Order is non-negative.", true);
            return;
        }
        // Basic URL validation
        try {
            new URL(url);
        } catch (_) {
            showAdminStatus("Invalid URL format. Please enter a valid URL.", true);
            return;
        }

        const disabilityData = {
            name: name,
            url: url,
            order: order,
            createdAt: serverTimestamp() // Add a timestamp
        };

        showAdminStatus("Adding disability link...");
        try {
            // Use the disabilitiesCollectionRef defined earlier
            const docRef = await addDoc(disabilitiesCollectionRef, disabilityData);
            console.log("Disability link added with ID:", docRef.id);
            showAdminStatus("Disability link added successfully.", false);
            addDisabilityForm.reset(); // Reset the form
            loadDisabilitiesAdmin(); // Reload the list

        } catch (error) {
            console.error("Error adding disability link:", error);
            showAdminStatus(`Error adding disability link: ${error.message}`, true);
        }
    }

    // Function to Handle Deleting a Disability Link
    async function handleDeleteDisability(docId, listItemElement) {
        if (!confirm("Are you sure you want to permanently delete this disability link?")) {
            return; // Do nothing if user cancels
        }

        showAdminStatus("Deleting disability link...");
        try {
             // Use the disabilitiesCollectionRef defined earlier
            await deleteDoc(doc(db, 'disabilities', docId));
            showAdminStatus("Disability link deleted successfully.", false);
            loadDisabilitiesAdmin(); // Reload list is simplest

        } catch (error) {
            console.error(`Error deleting disability link (ID: ${docId}):`, error);
            showAdminStatus(`Error deleting disability link: ${error.message}`, true);
        }
    }

     // Function to Open and Populate the Edit Disability Modal
    function openEditDisabilityModal(docId) {
        // Use consts defined earlier for modal elements
        if (!editDisabilityModal || !editDisabilityForm) {
            console.error("Edit disability modal elements not found.");
            showAdminStatus("UI Error: Cannot open edit form.", true);
            return;
        }

        // Use the disabilitiesCollectionRef defined earlier
        const docRef = doc(db, 'disabilities', docId);
        showEditDisabilityStatus("Loading disability data..."); // Use specific status func

        getDoc(docRef).then(docSnap => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                editDisabilityForm.setAttribute('data-doc-id', docId); // Store doc ID on the form
                // Populate modal inputs using consts defined earlier
                if (editDisabilityNameInput) editDisabilityNameInput.value = data.name || '';
                if (editDisabilityUrlInput) editDisabilityUrlInput.value = data.url || '';
                if (editDisabilityOrderInput) editDisabilityOrderInput.value = data.order ?? '';

                editDisabilityModal.style.display = 'block'; // Show the modal
                showEditDisabilityStatus(""); // Clear loading message
            } else {
                showAdminStatus("Error: Could not load disability data for editing.", true);
                showEditDisabilityStatus("Error: Link not found.", true); // Show error inside modal
            }
        }).catch(error => {
            console.error("Error getting disability document for edit:", error);
            showAdminStatus(`Error loading disability data: ${error.message}`, true);
            showEditDisabilityStatus(`Error: ${error.message}`, true);
        });
    }

    // Function to Close the Edit Disability Modal
    function closeEditDisabilityModal() {
        // Use consts defined earlier
        if (editDisabilityModal) editDisabilityModal.style.display = 'none';
        if (editDisabilityForm) editDisabilityForm.reset();
        editDisabilityForm?.removeAttribute('data-doc-id');
        if (editDisabilityStatusMessage) editDisabilityStatusMessage.textContent = ''; // Clear status message inside modal
    }

    // Function to Handle Updating a Disability Link from the Edit Modal
    async function handleUpdateDisability(event) {
        event.preventDefault(); // Prevent default form submission
        // Use consts defined earlier
        if (!editDisabilityForm) return;

        const docId = editDisabilityForm.getAttribute('data-doc-id');
        if (!docId) {
            showEditDisabilityStatus("Error: Missing document ID for update.", true);
            return;
        }

        // Get updated values from modal inputs
        const name = editDisabilityNameInput?.value.trim();
        const url = editDisabilityUrlInput?.value.trim();
        const orderStr = editDisabilityOrderInput?.value.trim();
        const order = parseInt(orderStr);

        // Validation
        if (!name || !url || !orderStr || isNaN(order) || order < 0) {
            showEditDisabilityStatus("Invalid input. Check required fields and ensure Order is non-negative.", true);
            return;
        }
        // Basic URL validation
        try { new URL(url); } catch (_) {
            showEditDisabilityStatus("Invalid URL format.", true);
            return;
        }

        const updatedData = {
            name: name,
            url: url,
            order: order,
            lastModified: serverTimestamp() // Add modification timestamp
        };

        showEditDisabilityStatus("Saving changes...");
        try {
            // Use the disabilitiesCollectionRef defined earlier
            const docRef = doc(db, 'disabilities', docId);
            await updateDoc(docRef, updatedData);
            showAdminStatus("Disability link updated successfully.", false); // Show main status
            closeEditDisabilityModal(); // Close modal on success
            loadDisabilitiesAdmin(); // Reload the list in the admin panel

        } catch (error) {
            console.error(`Error updating disability link (ID: ${docId}):`, error);
            showEditDisabilityStatus(`Error saving: ${error.message}`, true); // Show error in modal
            showAdminStatus(`Error updating disability link: ${error.message}`, true); // Also show main status
        }
    }

       // --- Attach Event Listeners for Section Forms & Modals ---

    // Profile Save Form
    if (profileForm) { profileForm.addEventListener('submit', saveProfileData); }

    // Maintenance Mode Toggle
    if (maintenanceModeToggle) { maintenanceModeToggle.addEventListener('change', (e) => { saveMaintenanceModeStatus(e.target.checked); }); }

    // President Form & Preview (Added)
    if (presidentForm) {
        const presidentPreviewInputs = [ presidentNameInput, presidentBornInput, presidentHeightInput, presidentPartyInput, presidentTermInput, presidentVpInput, presidentImageUrlInput ];
        // Add listeners to update preview on input
        presidentPreviewInputs.forEach(inputElement => {
            if (inputElement) {
                inputElement.addEventListener('input', () => {
                    if (typeof updatePresidentPreview === 'function') {
                        updatePresidentPreview();
                    } else { console.error("updatePresidentPreview function missing!"); }
                });
            }
        });
        // Add listener for form submission (Save)
        presidentForm.addEventListener('submit', savePresidentData);
    }

    // Add Shoutout Forms
    if (addShoutoutTiktokForm) { addShoutoutTiktokForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('tiktok', addShoutoutTiktokForm); }); }
    if (addShoutoutInstagramForm) { addShoutoutInstagramForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('instagram', addShoutoutInstagramForm); }); }
    if (addShoutoutYoutubeForm) { addShoutoutYoutubeForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('youtube', addShoutoutYoutubeForm); }); }

    // Edit Shoutout Form (in modal) & Close Button
    if (editForm) { editForm.addEventListener('submit', handleUpdateShoutout); }
    if (cancelEditButton) { cancelEditButton.addEventListener('click', closeEditModal); }


    // Useful Links Forms & Modals
    if (addUsefulLinkForm) { addUsefulLinkForm.addEventListener('submit', handleAddUsefulLink); }
    if (editUsefulLinkForm) { editUsefulLinkForm.addEventListener('submit', handleUpdateUsefulLink); }
    if (cancelEditLinkButton) { cancelEditLinkButton.addEventListener('click', closeEditUsefulLinkModal); }
    if (cancelEditLinkButtonSecondary) { cancelEditLinkButtonSecondary.addEventListener('click', closeEditUsefulLinkModal); }

    // Social Links Forms & Modals
    if (addSocialLinkForm) { addSocialLinkForm.addEventListener('submit', handleAddSocialLink); }
    if (editSocialLinkForm) { editSocialLinkForm.addEventListener('submit', handleUpdateSocialLink); }
    if (cancelEditSocialLinkButton) { cancelEditSocialLinkButton.addEventListener('click', closeEditSocialLinkModal); }
    if (cancelEditSocialLinkButtonSecondary) { cancelEditSocialLinkButtonSecondary.addEventListener('click', closeEditSocialLinkModal); }

    // Disabilities Forms & Modals (Added)
    if (addDisabilityForm) { addDisabilityForm.addEventListener('submit', handleAddDisability); }
    if (editDisabilityForm) { editDisabilityForm.addEventListener('submit', handleUpdateDisability); }
    if (cancelEditDisabilityButton) { cancelEditDisabilityButton.addEventListener('click', closeEditDisabilityModal); }
    if (cancelEditDisabilityButtonSecondary) { cancelEditDisabilityButtonSecondary.addEventListener('click', closeEditDisabilityModal); }


    // --- Attach Event Listeners for Search & Previews ---

    // Search Input Listeners
    if (searchInputTiktok) { searchInputTiktok.addEventListener('input', () => { if (typeof displayFilteredShoutouts === 'function') { displayFilteredShoutouts('tiktok'); } }); }
    if (searchInputInstagram) { searchInputInstagram.addEventListener('input', () => { if (typeof displayFilteredShoutouts === 'function') { displayFilteredShoutouts('instagram'); } }); }
    if (searchInputYoutube) { searchInputYoutube.addEventListener('input', () => { if (typeof displayFilteredShoutouts === 'function') { displayFilteredShoutouts('youtube'); } }); }

    // Helper function to attach preview listeners (Shoutouts)
    function attachPreviewListeners(formElement, platform, formType) { if (!formElement) return; const previewInputs = [ 'username', 'nickname', 'bio', 'profilePic', 'isVerified', 'followers', 'subscribers', 'coverPhoto' ]; previewInputs.forEach(name => { const inputElement = formElement.querySelector(`[name="${name}"]`); if (inputElement) { const eventType = (inputElement.type === 'checkbox') ? 'change' : 'input'; inputElement.addEventListener(eventType, () => { if (typeof updateShoutoutPreview === 'function') { updateShoutoutPreview(formType, platform); } else { console.error("updateShoutoutPreview missing!"); } }); } }); }
    // Attach shoutout preview listeners
    if (addShoutoutTiktokForm) attachPreviewListeners(addShoutoutTiktokForm, 'tiktok', 'add');
    if (addShoutoutInstagramForm) attachPreviewListeners(addShoutoutInstagramForm, 'instagram', 'add');
    if (addShoutoutYoutubeForm) attachPreviewListeners(addShoutoutYoutubeForm, 'youtube', 'add');
    if (editForm) { const editPreviewInputs = [ editUsernameInput, editNicknameInput, editBioInput, editProfilePicInput, editIsVerifiedInput, editFollowersInput, editSubscribersInput, editCoverPhotoInput ]; editPreviewInputs.forEach(el => { if (el) { const eventType = (el.type === 'checkbox') ? 'change' : 'input'; el.addEventListener(eventType, () => { const currentPlatform = editForm.getAttribute('data-platform'); if (currentPlatform && typeof updateShoutoutPreview === 'function') { updateShoutoutPreview('edit', currentPlatform); } else if (!currentPlatform) { console.warn("Edit form platform not set."); } else { console.error("updateShoutoutPreview missing!"); } }); } }); }

    // Profile Pic URL Preview Listener
    if (profilePicUrlInput && adminPfpPreview) { profilePicUrlInput.addEventListener('input', () => { const url = profilePicUrlInput.value.trim(); if (url) { adminPfpPreview.src = url; adminPfpPreview.style.display = 'inline-block'; } else { adminPfpPreview.style.display = 'none'; } }); adminPfpPreview.onerror = () => { console.warn("Preview image load failed:", adminPfpPreview.src); adminPfpPreview.style.display = 'none'; profilePicUrlInput.classList.add('input-error'); }; profilePicUrlInput.addEventListener('focus', () => { profilePicUrlInput.classList.remove('input-error'); }); }

    // Combined Window Click Listener for Closing Modals
    window.addEventListener('click', (event) => {
        if (event.target === editModal) { closeEditModal(); }
        if (event.target === editUsefulLinkModal) { closeEditUsefulLinkModal(); }
        if (event.target === editSocialLinkModal) { closeEditSocialLinkModal(); }
        if (event.target === editDisabilityModal) { closeEditDisabilityModal(); } // Handles Disability Modal
    });

// --- Ensure this is the closing }); for the main DOMContentLoaded listener ---
}); // End DOMContentLoaded Event Listener
