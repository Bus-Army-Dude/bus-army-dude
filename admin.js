// admin.js (Version includes Business Hours CRUD + Login Fixes + Logout-on-Refresh)

// *** Import Firebase services from your corrected init file ***
import { db, auth } from './firebase-init.js'; // Ensure path is correct

// Import Firebase functions
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc, serverTimestamp, getDoc, query, orderBy, where, limit } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
// Import Auth functions including persistence types
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserNonePersistence } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

// *** Global Variable for Client-Side Filtering ***
let allShoutouts = { tiktok: [], instagram: [], youtube: [] }; // Stores the full lists for filtering

document.addEventListener('DOMContentLoaded', async () => { // Made listener async for persistence
    // First, check if db and auth were successfully imported/initialized
    if (!db || !auth) {
        console.error("Firestore (db) or Auth not initialized correctly. Check firebase-init.js and imports.");
        alert("FATAL ERROR: Firebase services failed to load. Admin panel disabled.");
        return; // Stop executing if Firebase isn't ready
    }

    // *** Set Auth Persistence to None (Logout on Refresh/Close) ***
    try {
        await setPersistence(auth, browserNonePersistence);
        console.log("Firebase Auth persistence set to 'none'. User will be logged out on refresh.");
    } catch (error) {
        console.error("Error setting auth persistence:", error);
        alert(`Warning: Could not set auth persistence setting (${error.code}). Login might persist across refreshes.`);
    }
    // **************************************************************

    console.log("Admin DOM Loaded. Setting up UI and CRUD functions.");

    // --- Firestore References ---
    const profileDocRef = doc(db, "site_config", "mainProfile");
    const shoutoutsMetaRef = doc(db, 'siteConfig', 'shoutoutsMetadata');
    const usefulLinksCollectionRef = collection(db, "useful_links");
    const socialLinksCollectionRef = collection(db, "social_links");
    const presidentDocRef = doc(db, "site_config", "currentPresident");
    const disabilitiesCollectionRef = collection(db, "disabilities");
    // --- References for Business Hours ---
    const businessInfoDocRef = doc(db, "site_config", "business_info"); // For regular hours
    const holidaysCollectionRef = collection(db, "holidays");
    const tempClosuresCollectionRef = collection(db, "temporary_closures");


    // --- Inactivity Logout Variables ---
    let inactivityTimer;
    let expirationTime;
    let displayIntervalId;
    const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];

    // --- DOM Element References ---
    const loginSection = document.getElementById('login-section');
    const adminContent = document.getElementById('admin-content');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const authStatus = document.getElementById('auth-status');
    const adminGreeting = document.getElementById('admin-greeting');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const adminStatusElement = document.getElementById('admin-status');
    const nextButton = document.getElementById('next-button');
    const emailGroup = document.getElementById('email-group');
    const passwordGroup = document.getElementById('password-group');
    const loginButton = document.getElementById('login-button');
    const timerDisplayElement = document.getElementById('inactivity-timer-display');

    // Profile Management Elements
    const profileForm = document.getElementById('profile-form');
    const profileUsernameInput = document.getElementById('profile-username');
    const profilePicUrlInput = document.getElementById('profile-pic-url');
    const profileBioInput = document.getElementById('profile-bio');
    const profileStatusInput = document.getElementById('profile-status');
    const profileStatusMessage = document.getElementById('profile-status-message');
    const adminPfpPreview = document.getElementById('admin-pfp-preview');

    // Disabilities Management Elements
    const addDisabilityForm = document.getElementById('add-disability-form');
    const disabilitiesListAdmin = document.getElementById('disabilities-list-admin');
    const disabilitiesCount = document.getElementById('disabilities-count');
    const editDisabilityModal = document.getElementById('edit-disability-modal');
    const editDisabilityForm = document.getElementById('edit-disability-form');
    const cancelEditDisabilityButton = document.getElementById('cancel-edit-disability-button');
    const cancelEditDisabilityButtonSecondary = document.getElementById('cancel-edit-disability-button-secondary');
    const editDisabilityNameInput = document.getElementById('edit-disability-name');
    const editDisabilityUrlInput = document.getElementById('edit-disability-url');
    const editDisabilityOrderInput = document.getElementById('edit-disability-order');
    const editDisabilityStatusMessage = document.getElementById('edit-disability-status-message');

    // Site Settings Elements
    const maintenanceModeToggle = document.getElementById('maintenance-mode-toggle');
    const settingsStatusMessage = document.getElementById('settings-status-message');

    // Shoutout Elements
    const addShoutoutTiktokForm = document.getElementById('add-shoutout-tiktok-form');
    const shoutoutsTiktokListAdmin = document.getElementById('shoutouts-tiktok-list-admin');
    const addShoutoutInstagramForm = document.getElementById('add-shoutout-instagram-form');
    const shoutoutsInstagramListAdmin = document.getElementById('shoutouts-instagram-list-admin');
    const addShoutoutYoutubeForm = document.getElementById('add-shoutout-youtube-form');
    const shoutoutsYoutubeListAdmin = document.getElementById('shoutouts-youtube-list-admin');
    const searchInputTiktok = document.getElementById('search-tiktok');
    const searchInputInstagram = document.getElementById('search-instagram');
    const searchInputYoutube = document.getElementById('search-youtube');
    const editModal = document.getElementById('edit-shoutout-modal');
    const editForm = document.getElementById('edit-shoutout-form');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    const editUsernameInput = document.getElementById('edit-username');
    const editNicknameInput = document.getElementById('edit-nickname');
    const editOrderInput = document.getElementById('edit-order');
    const editIsVerifiedInput = document.getElementById('edit-isVerified');
    const editBioInput = document.getElementById('edit-bio');
    const editProfilePicInput = document.getElementById('edit-profilePic');
    const editIsEnabledInput = document.getElementById('edit-isEnabled');
    const editFollowersInput = document.getElementById('edit-followers');
    const editSubscribersInput = document.getElementById('edit-subscribers');
    const editCoverPhotoInput = document.getElementById('edit-coverPhoto');
    const editPlatformSpecificDiv = document.getElementById('edit-platform-specific');
    const addTiktokPreview = document.getElementById('add-tiktok-preview');
    const addInstagramPreview = document.getElementById('add-instagram-preview');
    const addYoutubePreview = document.getElementById('add-youtube-preview');
    const editShoutoutPreview = document.getElementById('edit-shoutout-preview');

    // Useful Links Elements
    const addUsefulLinkForm = document.getElementById('add-useful-link-form');
    const usefulLinksListAdmin = document.getElementById('useful-links-list-admin');
    const usefulLinksCount = document.getElementById('useful-links-count');
    const editUsefulLinkModal = document.getElementById('edit-useful-link-modal');
    const editUsefulLinkForm = document.getElementById('edit-useful-link-form');
    const cancelEditLinkButton = document.getElementById('cancel-edit-link-button');
    const cancelEditLinkButtonSecondary = document.getElementById('cancel-edit-link-button-secondary');
    const editLinkLabelInput = document.getElementById('edit-link-label');
    const editLinkUrlInput = document.getElementById('edit-link-url');
    const editLinkOrderInput = document.getElementById('edit-link-order');
    const editLinkStatusMessage = document.getElementById('edit-link-status-message');

    // Social Links Elements
    const addSocialLinkForm = document.getElementById('add-social-link-form');
    const socialLinksListAdmin = document.getElementById('social-links-list-admin');
    const socialLinksCount = document.getElementById('social-links-count');
    const editSocialLinkModal = document.getElementById('edit-social-link-modal');
    const editSocialLinkForm = document.getElementById('edit-social-link-form');
    const cancelEditSocialLinkButton = document.getElementById('cancel-edit-social-link-button');
    const cancelEditSocialLinkButtonSecondary = document.getElementById('cancel-edit-social-link-button-secondary');
    const editSocialLinkLabelInput = document.getElementById('edit-social-link-label');
    const editSocialLinkUrlInput = document.getElementById('edit-social-link-url');
    const editSocialLinkOrderInput = document.getElementById('edit-social-link-order');
    const editSocialLinkStatusMessage = document.getElementById('edit-social-link-status-message');

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

    // --- Business Hours DOM Element References ---
    const regularHoursForm = document.getElementById('regular-hours-form');
    const regularHoursStatusMessage = document.getElementById('regular-hours-status-message');
    const hoursSundayOpenInput = document.getElementById('hours-sunday-open');
    const hoursSundayCloseInput = document.getElementById('hours-sunday-close');
    const hoursMondayOpenInput = document.getElementById('hours-monday-open');
    const hoursMondayCloseInput = document.getElementById('hours-monday-close');
    const hoursTuesdayOpenInput = document.getElementById('hours-tuesday-open');
    const hoursTuesdayCloseInput = document.getElementById('hours-tuesday-close');
    const hoursWednesdayOpenInput = document.getElementById('hours-wednesday-open');
    const hoursWednesdayCloseInput = document.getElementById('hours-wednesday-close');
    const hoursThursdayOpenInput = document.getElementById('hours-thursday-open');
    const hoursThursdayCloseInput = document.getElementById('hours-thursday-close');
    const hoursFridayOpenInput = document.getElementById('hours-friday-open');
    const hoursFridayCloseInput = document.getElementById('hours-friday-close');
    const hoursSaturdayOpenInput = document.getElementById('hours-saturday-open');
    const hoursSaturdayCloseInput = document.getElementById('hours-saturday-close');
    const addHolidayForm = document.getElementById('add-holiday-form');
    const holidaysListAdmin = document.getElementById('holidays-list-admin');
    const holidaysCount = document.getElementById('holidays-count');
    const holidaysStatusMessage = document.getElementById('holidays-status-message');
    const addTempClosureForm = document.getElementById('add-temp-closure-form');
    const tempClosuresListAdmin = document.getElementById('temp-closures-list-admin');
    const tempClosuresCount = document.getElementById('temp-closures-count');
    const tempClosuresStatusMessage = document.getElementById('temp-closures-status-message');


    // --- Helper Functions ---
    function showAdminStatus(message, isError = false) {
        if (!adminStatusElement) { console.warn("Admin status element not found"); return; }
        adminStatusElement.textContent = message;
        adminStatusElement.className = `status-message ${isError ? 'error' : 'success'}`;
        setTimeout(() => { if (adminStatusElement) { adminStatusElement.textContent = ''; adminStatusElement.className = 'status-message'; } }, 5000);
    }
    function showProfileStatus(message, isError = false) {
        if (!profileStatusMessage) { console.warn("Profile status message element not found"); showAdminStatus(message, isError); return; }
        profileStatusMessage.textContent = message;
        profileStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
        setTimeout(() => { if (profileStatusMessage) { profileStatusMessage.textContent = ''; profileStatusMessage.className = 'status-message'; } }, 5000);
    }
    function showSettingsStatus(message, isError = false) {
        if (!settingsStatusMessage) { console.warn("Settings status message element not found"); showAdminStatus(message, isError); return; }
        settingsStatusMessage.textContent = message;
        settingsStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
        setTimeout(() => { if (settingsStatusMessage) { settingsStatusMessage.textContent = ''; settingsStatusMessage.style.display = 'none'; } }, 3000);
        settingsStatusMessage.style.display = 'block';
    }
    function showEditLinkStatus(message, isError = false) {
        if (!editLinkStatusMessage) { console.warn("Edit link status message element not found"); return; }
        editLinkStatusMessage.textContent = message;
        editLinkStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
        setTimeout(() => { if (editLinkStatusMessage) { editLinkStatusMessage.textContent = ''; editLinkStatusMessage.className = 'status-message'; } }, 3000);
    }
    function showEditSocialLinkStatus(message, isError = false) {
       if (!editSocialLinkStatusMessage) { console.warn("Edit social link status message element not found"); return; }
       editSocialLinkStatusMessage.textContent = message;
       editSocialLinkStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
       setTimeout(() => { if (editSocialLinkStatusMessage) { editSocialLinkStatusMessage.textContent = ''; editSocialLinkStatusMessage.className = 'status-message'; } }, 3000);
    }
    function showEditDisabilityStatus(message, isError = false) {
        if (!editDisabilityStatusMessage) { console.warn("Edit disability status message element not found"); return; }
        editDisabilityStatusMessage.textContent = message;
        editDisabilityStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
        setTimeout(() => { if (editDisabilityStatusMessage) { editDisabilityStatusMessage.textContent = ''; editDisabilityStatusMessage.className = 'status-message'; } }, 3000);
    }
    function showPresidentStatus(message, isError = false) {
        if (!presidentStatusMessage) { console.warn("President status message element not found"); showAdminStatus(message, isError); return; }
        presidentStatusMessage.textContent = message;
        presidentStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
        setTimeout(() => { if (presidentStatusMessage) { presidentStatusMessage.textContent = ''; presidentStatusMessage.className = 'status-message'; } }, 5000);
    }
    // --- Business Hours Status Message Functions ---
    function showRegularHoursStatus(message, isError = false) {
        if (!regularHoursStatusMessage) { console.warn("Regular hours status element missing"); return; }
        regularHoursStatusMessage.textContent = message;
        regularHoursStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
        setTimeout(() => { if (regularHoursStatusMessage) { regularHoursStatusMessage.textContent = ''; regularHoursStatusMessage.className = 'status-message'; } }, 5000);
    }
    function showHolidaysStatus(message, isError = false) {
        if (!holidaysStatusMessage) { console.warn("Holidays status element missing"); return; }
        holidaysStatusMessage.textContent = message;
        holidaysStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
        setTimeout(() => { if (holidaysStatusMessage) { holidaysStatusMessage.textContent = ''; holidaysStatusMessage.className = 'status-message'; } }, 5000);
    }
    function showTempClosuresStatus(message, isError = false) {
        if (!tempClosuresStatusMessage) { console.warn("Temp closures status element missing"); return; }
        tempClosuresStatusMessage.textContent = message;
        tempClosuresStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
        setTimeout(() => { if (tempClosuresStatusMessage) { tempClosuresStatusMessage.textContent = ''; tempClosuresStatusMessage.className = 'status-message'; } }, 5000);
    }

   // ==================================================
    // === Load/Render Functions for All Sections ===
    // ==================================================

    // --- Profile ---
    async function loadProfileData() {
        if (!auth || !auth.currentUser) { console.warn("Auth not ready for loading profile."); return; }
        if (!profileForm) { console.log("Profile form element not found."); return; }
        if (!maintenanceModeToggle) { console.warn("Maintenance mode toggle element not found."); }
        console.log("Attempting to load profile data from:", profileDocRef.path);
        try {
            const docSnap = await getDoc(profileDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("Loaded profile data:", data);
                if(profileUsernameInput) profileUsernameInput.value = data.username || '';
                if(profilePicUrlInput) profilePicUrlInput.value = data.profilePicUrl || '';
                if(profileBioInput) profileBioInput.value = data.bio || '';
                if(profileStatusInput) profileStatusInput.value = data.status || 'offline';
                if(maintenanceModeToggle) {
                     maintenanceModeToggle.checked = data.isMaintenanceModeEnabled || false;
                     maintenanceModeToggle.disabled = false;
                }
                if (adminPfpPreview && data.profilePicUrl) {
                     adminPfpPreview.src = data.profilePicUrl;
                     adminPfpPreview.style.display = 'inline-block';
                } else if (adminPfpPreview) {
                     adminPfpPreview.src = '';
                     adminPfpPreview.style.display = 'none';
                }
            } else {
                 console.warn(`Profile document ('${profileDocRef.path}') not found. Displaying defaults.`);
                 if (profileForm) profileForm.reset();
                 if (profileStatusInput) profileStatusInput.value = 'offline';
                 if(maintenanceModeToggle) {
                     maintenanceModeToggle.checked = false;
                     maintenanceModeToggle.disabled = false;
                 }
                 if(adminPfpPreview) adminPfpPreview.style.display = 'none';
            }
        } catch (error) {
             console.error("Error loading profile data:", error);
             showProfileStatus("Error loading profile data.", true);
             if (profileForm) profileForm.reset();
             if (profileStatusInput) profileStatusInput.value = 'offline';
             if(maintenanceModeToggle) {
                 maintenanceModeToggle.checked = false;
                 maintenanceModeToggle.disabled = true;
             }
             if(adminPfpPreview) adminPfpPreview.style.display = 'none';
        }
    }

    // --- President Info ---
    function renderPresidentPreview(data) {
        const name = data?.name || 'N/A';
        const born = data?.born || 'N/A';
        const height = data?.height || 'N/A';
        const party = data?.party || 'N/A';
        const term = data?.term || 'N/A';
        const vp = data?.vp || 'N/A';
        const imageUrl = data?.imageUrl || 'images/default-president.jpg';
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
    function updatePresidentPreview() {
        if (!presidentForm || !presidentPreviewArea) return;
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
            if (typeof renderPresidentPreview === 'function') {
                 const previewHTML = renderPresidentPreview(presidentData);
                 presidentPreviewArea.innerHTML = previewHTML;
            } else { console.error("renderPresidentPreview function is not defined!"); presidentPreviewArea.innerHTML = '<p class="error"><small>Preview engine error.</small></p>'; }
        } catch (e) { console.error("Error rendering president preview:", e); presidentPreviewArea.innerHTML = '<p class="error"><small>Error generating preview.</small></p>'; }
    }
    async function loadPresidentData() {
        if (!auth || !auth.currentUser) { console.warn("Auth not ready for loading president data."); return; }
        if (!presidentForm) { console.log("President form element not found."); return; }
        console.log("Attempting to load president data from:", presidentDocRef.path);
        try {
            const docSnap = await getDoc(presidentDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("Loaded president data:", data);
                if(presidentNameInput) presidentNameInput.value = data.name || '';
                if(presidentBornInput) presidentBornInput.value = data.born || '';
                if(presidentHeightInput) presidentHeightInput.value = data.height || '';
                if(presidentPartyInput) presidentPartyInput.value = data.party || '';
                if(presidentTermInput) presidentTermInput.value = data.term || '';
                if(presidentVpInput) presidentVpInput.value = data.vp || '';
                if(presidentImageUrlInput) presidentImageUrlInput.value = data.imageUrl || '';
            } else {
                console.warn(`President document ('${presidentDocRef.path}') not found. Form cleared.`);
                if (presidentForm) presidentForm.reset();
            }
            if (typeof updatePresidentPreview === 'function') updatePresidentPreview();
        } catch (error) {
            console.error("Error loading president data:", error);
            showPresidentStatus("Error loading president data.", true);
            if (presidentForm) presidentForm.reset();
            if (typeof updatePresidentPreview === 'function') updatePresidentPreview();
        }
    }

    // --- Disabilities ---
    function renderDisabilityAdminListItem(container, docId, name, url, order, deleteHandler, editHandler) {
        if (!container) { console.warn("Disabilities list container not found during render."); return; }
        const itemDiv = document.createElement('div');
        itemDiv.className = 'list-item-admin';
        itemDiv.setAttribute('data-id', docId);
        let displayUrl = url || 'N/A'; let visitUrl = '#';
        try { if (url) { visitUrl = new URL(url).href; } } catch (e) { console.warn(`Invalid URL for disability link ${docId}: ${url}`); displayUrl += " (Invalid URL)"; }
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
        const editButton = itemDiv.querySelector('.edit-button');
        if (editButton) editButton.addEventListener('click', () => editHandler(docId));
        const deleteButton = itemDiv.querySelector('.delete-button');
        if (deleteButton) deleteButton.addEventListener('click', () => deleteHandler(docId)); // Pass only docId now
        container.appendChild(itemDiv);
    }
    function openEditDisabilityModal(docId) {
        if (!editDisabilityModal || !editDisabilityForm) { console.error("Edit disability modal elements not found."); showAdminStatus("UI Error: Cannot open edit form.", true); return; }
        const docRef = doc(db, 'disabilities', docId);
        showEditDisabilityStatus("Loading disability data...");
        getDoc(docRef).then(docSnap => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                editDisabilityForm.setAttribute('data-doc-id', docId);
                if (editDisabilityNameInput) editDisabilityNameInput.value = data.name || '';
                if (editDisabilityUrlInput) editDisabilityUrlInput.value = data.url || '';
                if (editDisabilityOrderInput) editDisabilityOrderInput.value = data.order ?? '';
                editDisabilityModal.style.display = 'block';
                showEditDisabilityStatus("");
            } else { showAdminStatus("Error: Could not load disability data for editing.", true); showEditDisabilityStatus("Error: Link not found.", true); }
        }).catch(error => { console.error("Error getting disability document for edit:", error); showAdminStatus(`Error loading disability data: ${error.message}`, true); showEditDisabilityStatus(`Error: ${error.message}`, true); });
    }
    function closeEditDisabilityModal() {
        if (editDisabilityModal) editDisabilityModal.style.display = 'none';
        if (editDisabilityForm) editDisabilityForm.reset();
        editDisabilityForm?.removeAttribute('data-doc-id');
        if (editDisabilityStatusMessage) editDisabilityStatusMessage.textContent = '';
    }
    // *** CORRECTED Function Definition (Included from Chunk 1 for clarity) ***
    async function loadDisabilitiesAdmin() {
       if (!disabilitiesListAdmin) { console.error("Disabilities list container not found."); return; }
       if (disabilitiesCount) disabilitiesCount.textContent = '';
       disabilitiesListAdmin.innerHTML = `<p>Loading disability links...</p>`;
       try {
           const disabilityQuery = query(disabilitiesCollectionRef, orderBy("order", "asc"));
           const querySnapshot = await getDocs(disabilityQuery);
           disabilitiesListAdmin.innerHTML = '';
           if (querySnapshot.empty) {
               disabilitiesListAdmin.innerHTML = '<p>No disability links found.</p>';
               if (disabilitiesCount) disabilitiesCount.textContent = '(0)';
           } else {
               querySnapshot.forEach((doc) => {
                   const data = doc.data();
                   if (typeof renderDisabilityAdminListItem === 'function') {
                       renderDisabilityAdminListItem( disabilitiesListAdmin, doc.id, data.name, data.url, data.order, handleDeleteDisability, openEditDisabilityModal );
                   } else { console.error("renderDisabilityAdminListItem function is not defined!"); disabilitiesListAdmin.innerHTML = '<p class="error">Error rendering list items.</p>'; return; }
               });
               if (disabilitiesCount) disabilitiesCount.textContent = `(${querySnapshot.size})`;
           }
           console.log(`Loaded ${querySnapshot.size} disability links.`);
       } catch (error) {
           console.error("Error loading disability links:", error);
            if (error.code === 'failed-precondition') {
                disabilitiesListAdmin.innerHTML = `<p class="error">Error: Missing Firestore index for disabilities (order).</p>`;
                showAdminStatus("Error loading disabilities: Missing database index. Check console.", true);
           } else {
               disabilitiesListAdmin.innerHTML = `<p class="error">Error loading disability links.</p>`;
               showAdminStatus("Error loading disability links.", true);
           }
           if (disabilitiesCount) disabilitiesCount.textContent = '(Error)';
       }
    }

    // --- Shoutouts ---
    function renderTikTokCard(account) { /* ... existing function ... */ }
    function renderInstagramCard(account) { /* ... existing function ... */ }
    function renderYouTubeCard(account) { /* ... existing function ... */ }
    function updateShoutoutPreview(formType, platform) { /* ... existing function ... */ }
    function renderAdminListItem(container, docId, platform, username, nickname, order, deleteHandler, editHandler) { /* ... existing function ... */ }
    function displayFilteredShoutouts(platform) { /* ... existing function ... */ }
    function openEditModal(docId, platform) { /* ... existing function ... */ }
    function closeEditModal() { /* ... existing function ... */ }
    function getShoutoutsMetadataRef() { return doc(db, 'siteConfig', 'shoutoutsMetadata'); }
    async function updateMetadataTimestamp(platform) { /* ... existing function ... */ }
    async function loadShoutoutsAdmin(platform) { /* ... existing function ... */ }

    // --- Useful Links ---
    function renderUsefulLinkAdminListItem(container, docId, label, url, order, deleteHandler, editHandler) {
         if (!container) return;
         const itemDiv = document.createElement('div');
         itemDiv.className = 'list-item-admin'; itemDiv.setAttribute('data-id', docId);
         let displayUrl = url || 'N/A'; let visitUrl = '#'; try { if (url) { visitUrl = new URL(url).href; } } catch (e) { console.warn(`Invalid URL: ${url}`); displayUrl += " (Invalid)"; }
         itemDiv.innerHTML = `
             <div class="item-content"><div class="item-details"><strong>${label || 'N/A'}</strong><span>(${displayUrl})</span><small>Order: ${order ?? 'N/A'}</small></div></div>
             <div class="item-actions"><a href="${visitUrl}" target="_blank" rel="noopener noreferrer" class="direct-link small-button" title="Visit Link" ${visitUrl === '#' ? 'style="pointer-events: none; opacity: 0.5;"' : ''}><i class="fas fa-external-link-alt"></i> Visit</a><button type="button" class="edit-button small-button">Edit</button><button type="button" class="delete-button small-button">Delete</button></div>`;
         const editButton = itemDiv.querySelector('.edit-button'); if (editButton) editButton.addEventListener('click', () => editHandler(docId));
         const deleteButton = itemDiv.querySelector('.delete-button'); if (deleteButton) deleteButton.addEventListener('click', () => deleteHandler(docId)); // Pass only docId
         container.appendChild(itemDiv);
     }
    function openEditUsefulLinkModal(docId) { /* ... existing function ... */ }
    function closeEditUsefulLinkModal() { /* ... existing function ... */ }
    async function loadUsefulLinksAdmin() {
        if (!usefulLinksListAdmin) { console.error("Useful links list container not found."); return; }
        if (usefulLinksCount) usefulLinksCount.textContent = ''; usefulLinksListAdmin.innerHTML = `<p>Loading useful links...</p>`;
        try {
            const linkQuery = query(usefulLinksCollectionRef, orderBy("order", "asc"));
            const querySnapshot = await getDocs(linkQuery);
            usefulLinksListAdmin.innerHTML = '';
            if (querySnapshot.empty) { usefulLinksListAdmin.innerHTML = '<p>No useful links found.</p>'; if (usefulLinksCount) usefulLinksCount.textContent = '(0)'; }
            else { querySnapshot.forEach((doc) => { const data = doc.data(); renderUsefulLinkAdminListItem(usefulLinksListAdmin, doc.id, data.label, data.url, data.order, handleDeleteUsefulLink, openEditUsefulLinkModal); }); if (usefulLinksCount) usefulLinksCount.textContent = `(${querySnapshot.size})`; }
            console.log(`Loaded ${querySnapshot.size} useful links.`);
        } catch (error) { console.error("Error loading useful links:", error); usefulLinksListAdmin.innerHTML = `<p class="error">Error loading useful links.</p>`; if (usefulLinksCount) usefulLinksCount.textContent = '(Error)'; showAdminStatus("Error loading useful links.", true); }
    }

    // --- Social Links ---
    function renderSocialLinkAdminListItem(container, docId, label, url, order, deleteHandler, editHandler) {
         if (!container) return;
         const itemDiv = document.createElement('div');
         itemDiv.className = 'list-item-admin'; itemDiv.setAttribute('data-id', docId);
         let displayUrl = url || 'N/A'; let visitUrl = '#'; try { if (url) { visitUrl = new URL(url).href; } } catch (e) { console.warn(`Invalid URL: ${url}`); displayUrl += " (Invalid)"; }
         itemDiv.innerHTML = `
             <div class="item-content"><div class="item-details"><strong>${label || 'N/A'}</strong><span>(${displayUrl})</span><small>Order: ${order ?? 'N/A'}</small></div></div>
             <div class="item-actions"><a href="${visitUrl}" target="_blank" rel="noopener noreferrer" class="direct-link small-button" title="Visit Link" ${visitUrl === '#' ? 'style="pointer-events: none; opacity: 0.5;"' : ''}><i class="fas fa-external-link-alt"></i> Visit</a><button type="button" class="edit-button small-button">Edit</button><button type="button" class="delete-button small-button">Delete</button></div>`;
         const editButton = itemDiv.querySelector('.edit-button'); if (editButton) editButton.addEventListener('click', () => editHandler(docId));
         const deleteButton = itemDiv.querySelector('.delete-button'); if (deleteButton) deleteButton.addEventListener('click', () => deleteHandler(docId)); // Pass only docId
         container.appendChild(itemDiv);
     }
    function openEditSocialLinkModal(docId) { /* ... existing function ... */ }
    function closeEditSocialLinkModal() { /* ... existing function ... */ }
    async function loadSocialLinksAdmin() {
        if (!socialLinksListAdmin) { console.error("Social links list container not found."); return; }
        if (socialLinksCount) socialLinksCount.textContent = ''; socialLinksListAdmin.innerHTML = `<p>Loading social links...</p>`;
        try {
            const linkQuery = query(socialLinksCollectionRef, orderBy("order", "asc"));
            const querySnapshot = await getDocs(linkQuery);
            socialLinksListAdmin.innerHTML = '';
            if (querySnapshot.empty) { socialLinksListAdmin.innerHTML = '<p>No social links found.</p>'; if (socialLinksCount) socialLinksCount.textContent = '(0)'; }
            else { querySnapshot.forEach((doc) => { const data = doc.data(); renderSocialLinkAdminListItem( socialLinksListAdmin, doc.id, data.label, data.url, data.order, handleDeleteSocialLink, openEditSocialLinkModal ); }); if (socialLinksCount) socialLinksCount.textContent = `(${querySnapshot.size})`; }
            console.log(`Loaded ${querySnapshot.size} social links.`);
        } catch (error) {
            console.error("Error loading social links:", error);
            if (error.code === 'failed-precondition') { socialLinksListAdmin.innerHTML = `<p class="error">Error: Missing Firestore index for social links (order).</p>`; showAdminStatus("Error loading social links: Missing index.", true); }
            else { socialLinksListAdmin.innerHTML = `<p class="error">Error loading social links.</p>`; showAdminStatus("Error loading social links.", true); }
            if (socialLinksCount) socialLinksCount.textContent = '(Error)';
        }
    }

    // --- Business Hours Load Functions & Render Helpers ---
    async function loadRegularHoursAdmin() {
        if (!regularHoursForm) { console.log("Regular hours form not found."); return; }
        console.log("Attempting to load regular hours from:", businessInfoDocRef.path);
        try {
            const docSnap = await getDoc(businessInfoDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("Loaded regular hours:", data);
                if (hoursSundayOpenInput) hoursSundayOpenInput.value = data.sunday_open || ''; if (hoursSundayCloseInput) hoursSundayCloseInput.value = data.sunday_close || '';
                if (hoursMondayOpenInput) hoursMondayOpenInput.value = data.monday_open || ''; if (hoursMondayCloseInput) hoursMondayCloseInput.value = data.monday_close || '';
                if (hoursTuesdayOpenInput) hoursTuesdayOpenInput.value = data.tuesday_open || ''; if (hoursTuesdayCloseInput) hoursTuesdayCloseInput.value = data.tuesday_close || '';
                if (hoursWednesdayOpenInput) hoursWednesdayOpenInput.value = data.wednesday_open || ''; if (hoursWednesdayCloseInput) hoursWednesdayCloseInput.value = data.wednesday_close || '';
                if (hoursThursdayOpenInput) hoursThursdayOpenInput.value = data.thursday_open || ''; if (hoursThursdayCloseInput) hoursThursdayCloseInput.value = data.thursday_close || '';
                if (hoursFridayOpenInput) hoursFridayOpenInput.value = data.friday_open || ''; if (hoursFridayCloseInput) hoursFridayCloseInput.value = data.friday_close || '';
                if (hoursSaturdayOpenInput) hoursSaturdayOpenInput.value = data.saturday_open || ''; if (hoursSaturdayCloseInput) hoursSaturdayCloseInput.value = data.saturday_close || '';
            } else { console.warn(`Business info document ('${businessInfoDocRef.path}') not found.`); if (regularHoursForm) regularHoursForm.reset(); }
        } catch (error) { console.error("Error loading regular hours:", error); showRegularHoursStatus("Error loading regular hours.", true); if (regularHoursForm) regularHoursForm.reset(); }
    }
    function renderHolidayAdminListItem(container, docId, date, name, hours) {
        if (!container) return;
        const itemDiv = document.createElement('div'); itemDiv.className = 'list-item-admin'; itemDiv.setAttribute('data-id', docId);
        itemDiv.innerHTML = `
            <div class="item-content"><div class="item-details"><strong>${name || 'N/A'}</strong> (${date || 'N/A'})<span>Hours: ${hours || 'N/A'}</span></div></div>
            <div class="item-actions"><button type="button" class="delete-button small-button" data-id="${docId}">Delete</button></div>`;
        const deleteButton = itemDiv.querySelector('.delete-button');
        if (deleteButton) { deleteButton.addEventListener('click', () => handleDeleteHoliday(docId)); } // handleDeleteHoliday defined later
        container.appendChild(itemDiv);
    }
    async function loadHolidaysAdmin() {
        if (!holidaysListAdmin) { console.error("Holidays list container missing."); return; }
        holidaysListAdmin.innerHTML = '<p>Loading holidays...</p>'; if (holidaysCount) holidaysCount.textContent = '';
        try {
            const holidayQuery = query(holidaysCollectionRef, orderBy("date", "desc"));
            const querySnapshot = await getDocs(holidayQuery);
            holidaysListAdmin.innerHTML = '';
            if (querySnapshot.empty) { holidaysListAdmin.innerHTML = '<p>No holidays found.</p>'; if (holidaysCount) holidaysCount.textContent = '(0)'; }
            else { querySnapshot.forEach(doc => { const data = doc.data(); renderHolidayAdminListItem(holidaysListAdmin, doc.id, data.date, data.name, data.hours); }); if (holidaysCount) holidaysCount.textContent = `(${querySnapshot.size})`; }
            console.log(`Loaded ${querySnapshot.size} holidays.`);
        } catch (error) {
             console.error("Error loading holidays:", error);
             if (error.code === 'failed-precondition') { holidaysListAdmin.innerHTML = `<p class="error">Error: Missing Firestore index for holidays (date).</p>`; showHolidaysStatus("Error loading holidays: Missing index.", true); }
             else { holidaysListAdmin.innerHTML = '<p class="error">Error loading holidays.</p>'; showHolidaysStatus("Error loading holidays.", true); }
             if (holidaysCount) holidaysCount.textContent = '(Error)';
        }
    }
    function renderTempClosureAdminListItem(container, docId, date, startTime, endTime, reason) {
         if (!container) return;
        const itemDiv = document.createElement('div'); itemDiv.className = 'list-item-admin'; itemDiv.setAttribute('data-id', docId);
        const formatTime12hr = (timeStr) => { /* ... formatting logic from previous response ... */ if (!timeStr || !timeStr.includes(':')) return 'N/A'; try { const [hours, minutes] = timeStr.split(':'); const h = parseInt(hours); const period = h >= 12 ? 'PM' : 'AM'; const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h; return `${displayHour}:${minutes} ${period}`; } catch (e) { console.warn("Error formatting time:", timeStr, e); return 'Invalid Time'; } };
        itemDiv.innerHTML = `
            <div class="item-content"><div class="item-details"><strong>${date || 'N/A'}</strong>: ${formatTime12hr(startTime)} - ${formatTime12hr(endTime)}<span>Reason: ${reason || 'N/A'}</span></div></div>
            <div class="item-actions"><button type="button" class="delete-button small-button" data-id="${docId}">Delete</button></div>`;
        const deleteButton = itemDiv.querySelector('.delete-button');
        if (deleteButton) { deleteButton.addEventListener('click', () => handleDeleteTempClosure(docId)); } // handleDeleteTempClosure defined later
        container.appendChild(itemDiv);
    }
    async function loadTempClosuresAdmin() {
        if (!tempClosuresListAdmin) { console.error("Temporary closures list container missing."); return; }
        tempClosuresListAdmin.innerHTML = '<p>Loading temporary closures...</p>'; if (tempClosuresCount) tempClosuresCount.textContent = '';
        try {
            const closureQuery = query(tempClosuresCollectionRef, orderBy("date", "desc"), limit(20)); // Limit for performance
            const querySnapshot = await getDocs(closureQuery);
            tempClosuresListAdmin.innerHTML = '';
            if (querySnapshot.empty) { tempClosuresListAdmin.innerHTML = '<p>No temporary closures found.</p>'; if (tempClosuresCount) tempClosuresCount.textContent = '(0)'; }
            else { querySnapshot.forEach(doc => { const data = doc.data(); renderTempClosureAdminListItem(tempClosuresListAdmin, doc.id, data.date, data.startTime, data.endTime, data.reason); }); if (tempClosuresCount) tempClosuresCount.textContent = `(${querySnapshot.size})`; }
             console.log(`Loaded ${querySnapshot.size} temporary closures.`);
        } catch (error) {
            console.error("Error loading temporary closures:", error);
             if (error.code === 'failed-precondition') { tempClosuresListAdmin.innerHTML = `<p class="error">Error: Missing Firestore index for temporary closures (date).</p>`; showTempClosuresStatus("Error loading closures: Missing index.", true); }
             else { tempClosuresListAdmin.innerHTML = '<p class="error">Error loading temporary closures.</p>'; showTempClosuresStatus("Error loading temporary closures.", true); }
            if (tempClosuresCount) tempClosuresCount.textContent = '(Error)';
        }
    }

    // ============================================================
    // === Save/Update/Add/Delete Functions (Non-Business Hours) ===
    // ============================================================

    // --- Profile ---
    async function saveProfileData(event) {
        event.preventDefault();
        if (!auth || !auth.currentUser) { showProfileStatus("Error: Not logged in.", true); return; }
        if (!profileForm) return;
        const newData = {
            username: profileUsernameInput?.value.trim() || "",
            profilePicUrl: profilePicUrlInput?.value.trim() || "",
            bio: profileBioInput?.value.trim() || "",
            status: profileStatusInput?.value || "offline",
            lastUpdated: serverTimestamp()
            // isMaintenanceModeEnabled is handled separately
        };
        showProfileStatus("Saving profile...");
        try {
            await setDoc(profileDocRef, newData, { merge: true });
            console.log("Profile data saved to:", profileDocRef.path);
            showProfileStatus("Profile updated successfully!", false);
            // Reload lists for consistency
            if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin();

            // Optionally update preview immediately
            if (adminPfpPreview && newData.profilePicUrl) {
                adminPfpPreview.src = newData.profilePicUrl;
                adminPfpPreview.style.display = 'inline-block';
            } else if (adminPfpPreview) {
                 adminPfpPreview.src = '';
                 adminPfpPreview.style.display = 'none';
            }
        } catch (error) {
            console.error("Error saving profile data:", error);
            showProfileStatus(`Error saving profile: ${error.message}`, true);
        }
    }

    // --- Site Settings ---
    async function saveMaintenanceModeStatus(isEnabled) {
        if (!auth || !auth.currentUser) { showAdminStatus("Error: Not logged in.", true); if(maintenanceModeToggle) maintenanceModeToggle.checked = !isEnabled; return; }
        const statusElement = settingsStatusMessage || adminStatusElement;
        if (statusElement) { statusElement.textContent = "Saving setting..."; statusElement.className = "status-message"; statusElement.style.display = 'block'; }
        try {
            await setDoc(profileDocRef, { isMaintenanceModeEnabled: isEnabled }, { merge: true });
            console.log("Maintenance mode status saved:", isEnabled);
            const message = `Maintenance mode ${isEnabled ? 'enabled' : 'disabled'}.`;
            if (statusElement === settingsStatusMessage && settingsStatusMessage) { showSettingsStatus(message, false); }
            else { showAdminStatus(message, false); }
            // Reload lists for consistency
            if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin();

        } catch (error) {
            console.error("Error saving maintenance mode status:", error);
            const errorMsg = `Error saving setting: ${error.message}`;
            if (statusElement === settingsStatusMessage && settingsStatusMessage) { showSettingsStatus(errorMsg, true); }
            else { showAdminStatus(`Error saving maintenance mode: ${error.message}`, true); }
            if(maintenanceModeToggle) maintenanceModeToggle.checked = !isEnabled;
        }
    }

    // --- President Info ---
    async function savePresidentData(event) {
        event.preventDefault();
        if (!auth || !auth.currentUser) { showPresidentStatus("Error: Not logged in.", true); return; }
        if (!presidentForm) return;
        const newData = {
            name: presidentNameInput?.value.trim() || "", born: presidentBornInput?.value.trim() || "",
            height: presidentHeightInput?.value.trim() || "", party: presidentPartyInput?.value.trim() || "",
            term: presidentTermInput?.value.trim() || "", vp: presidentVpInput?.value.trim() || "",
            imageUrl: presidentImageUrlInput?.value.trim() || "", lastUpdated: serverTimestamp()
        };
        showPresidentStatus("Saving president info...");
        try {
            await setDoc(presidentDocRef, newData, { merge: true });
            console.log("President data saved to:", presidentDocRef.path);
            showPresidentStatus("President info updated successfully!", false);
            // Reload lists for consistency
            if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin();

        } catch (error) {
            console.error("Error saving president data:", error);
            showPresidentStatus(`Error saving president info: ${error.message}`, true);
        }
    }

    // --- Disabilities ---
    async function handleAddDisability(event) {
        event.preventDefault(); if (!addDisabilityForm) return;
        const nameInput = addDisabilityForm.querySelector('#disability-name');
        const urlInput = addDisabilityForm.querySelector('#disability-url');
        const orderInput = addDisabilityForm.querySelector('#disability-order');
        const name = nameInput?.value.trim(); const url = urlInput?.value.trim();
        const orderStr = orderInput?.value.trim(); const order = parseInt(orderStr);
        if (!name || !url || !orderStr || isNaN(order) || order < 0) { showAdminStatus("Invalid input for Disability Link...", true); return; }
        try { new URL(url); } catch (_) { showAdminStatus("Invalid URL format.", true); return; }
        const disabilityData = { name: name, url: url, order: order, createdAt: serverTimestamp() };
        showAdminStatus("Adding disability link...");
        try {
            const docRef = await addDoc(disabilitiesCollectionRef, disabilityData);
            console.log("Disability link added with ID:", docRef.id);
            showAdminStatus("Disability link added successfully.", false);
            addDisabilityForm.reset();
            loadDisabilitiesAdmin(); // Reload this list
        } catch (error) { console.error("Error adding disability link:", error); showAdminStatus(`Error adding disability link: ${error.message}`, true); }
    }
    async function handleDeleteDisability(docId) { // Takes only docId now
        if (!confirm("Are you sure you want to permanently delete this disability link?")) { return; }
        showAdminStatus("Deleting disability link...");
        try {
            await deleteDoc(doc(db, 'disabilities', docId));
            showAdminStatus("Disability link deleted successfully.", false);
            loadDisabilitiesAdmin(); // Reload this list
        } catch (error) { console.error(`Error deleting disability link (ID: ${docId}):`, error); showAdminStatus(`Error deleting disability link: ${error.message}`, true); }
    }
    async function handleUpdateDisability(event) {
         event.preventDefault(); if (!editDisabilityForm) return;
         const docId = editDisabilityForm.getAttribute('data-doc-id'); if (!docId) { showEditDisabilityStatus("Error: Missing document ID.", true); return; }
         const name = editDisabilityNameInput?.value.trim(); const url = editDisabilityUrlInput?.value.trim();
         const orderStr = editDisabilityOrderInput?.value.trim(); const order = parseInt(orderStr);
         if (!name || !url || !orderStr || isNaN(order) || order < 0) { showEditDisabilityStatus("Invalid input...", true); return; }
         try { new URL(url); } catch (_) { showEditDisabilityStatus("Invalid URL format.", true); return; }
         const updatedData = { name: name, url: url, order: order, lastModified: serverTimestamp() };
         showEditDisabilityStatus("Saving changes...");
         try {
             const docRef = doc(db, 'disabilities', docId); await updateDoc(docRef, updatedData);
             showAdminStatus("Disability link updated successfully.", false); // Show main status
             closeEditDisabilityModal();
             loadDisabilitiesAdmin(); // Reload this list
         } catch (error) { console.error(`Error updating disability link (ID: ${docId}):`, error); showEditDisabilityStatus(`Error saving: ${error.message}`, true); showAdminStatus(`Error updating disability link: ${error.message}`, true); }
     }

    // --- Shoutouts ---
    async function handleAddShoutout(platform, formElement) {
        if (!formElement) { console.error("Form element missing"); return; }
        const username = formElement.querySelector(`#${platform}-username`)?.value.trim();
        const nickname = formElement.querySelector(`#${platform}-nickname`)?.value.trim();
        const orderStr = formElement.querySelector(`#${platform}-order`)?.value.trim();
        const order = parseInt(orderStr);
        if (!username || !nickname || !orderStr || isNaN(order) || order < 0) { showAdminStatus(`Invalid input for ${platform}...`, true); return; }
        try { // Duplicate Check
            const shoutoutsCol = collection(db, 'shoutouts');
            const duplicateCheckQuery = query(shoutoutsCol, where("platform", "==", platform), where("username", "==", username), limit(1));
            const querySnapshot = await getDocs(duplicateCheckQuery);
            if (!querySnapshot.empty) { showAdminStatus(`Error: Username '@${username}' on platform '${platform}' already exists.`, true); return; }
            // Add Logic
            const accountData = { platform: platform, username: username, nickname: nickname, order: order, isVerified: formElement.querySelector(`#${platform}-isVerified`)?.checked || false, bio: formElement.querySelector(`#${platform}-bio`)?.value.trim() || null, profilePic: formElement.querySelector(`#${platform}-profilePic`)?.value.trim() || null, createdAt: serverTimestamp(), isEnabled: true };
            if (platform === 'youtube') { accountData.subscribers = formElement.querySelector(`#${platform}-subscribers`)?.value.trim() || 'N/A'; accountData.coverPhoto = formElement.querySelector(`#${platform}-coverPhoto`)?.value.trim() || null; }
            else { accountData.followers = formElement.querySelector(`#${platform}-followers`)?.value.trim() || 'N/A'; }
            const docRef = await addDoc(collection(db, 'shoutouts'), accountData);
            console.log("Shoutout added with ID:", docRef.id); await updateMetadataTimestamp(platform);
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout added.`, false); formElement.reset();
            const previewArea = formElement.querySelector(`#add-${platform}-preview`); if (previewArea) { previewArea.innerHTML = '<p><small>Preview will appear here.</small></p>'; }
            if (typeof loadShoutoutsAdmin === 'function') loadShoutoutsAdmin(platform); // Reload list
        } catch (error) { console.error(`Error adding ${platform} shoutout:`, error); showAdminStatus(`Error adding ${platform}: ${error.message}`, true); }
    }
    async function handleUpdateShoutout(event) {
        event.preventDefault(); if (!editForm) return;
        const docId = editForm.getAttribute('data-doc-id'); const platform = editForm.getAttribute('data-platform');
        if (!docId || !platform) { showAdminStatus("Error: Missing data for update.", true); return; }
        const username = editUsernameInput?.value.trim(); const nickname = editNicknameInput?.value.trim();
        const orderStr = editOrderInput?.value.trim(); const order = parseInt(orderStr);
        if (!username || !nickname || !orderStr || isNaN(order) || order < 0) { showAdminStatus(`Update Error: Invalid input...`, true); return; }
        const updatedData = { username: username, nickname: nickname, order: order, isVerified: editIsVerifiedInput?.checked || false, bio: editBioInput?.value.trim() || null, profilePic: editProfilePicInput?.value.trim() || null, lastModified: serverTimestamp() };
        if (platform === 'youtube') { updatedData.subscribers = editSubscribersInput?.value.trim() || 'N/A'; updatedData.coverPhoto = editCoverPhotoInput?.value.trim() || null; }
        else { updatedData.followers = editFollowersInput?.value.trim() || 'N/A'; }
        showAdminStatus("Updating shoutout...");
        try {
            const docRef = doc(db, 'shoutouts', docId); await updateDoc(docRef, updatedData); await updateMetadataTimestamp(platform);
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout updated.`, false);
            if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin(); // Reload disabilities
            if (typeof closeEditModal === 'function') closeEditModal();
            if (typeof loadShoutoutsAdmin === 'function') loadShoutoutsAdmin(platform);
        } catch (error) { console.error(`Error updating ${platform} shoutout (ID: ${docId}):`, error); showAdminStatus(`Error updating ${platform}: ${error.message}`, true); }
    }
    async function handleDeleteShoutout(docId, platform) { // Takes docId and platform now
        if (!confirm(`Are you sure you want to permanently delete this ${platform} shoutout?`)) { return; }
        showAdminStatus("Deleting shoutout...");
        try {
            await deleteDoc(doc(db, 'shoutouts', docId)); await updateMetadataTimestamp(platform);
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout deleted.`, false);
            if (typeof loadShoutoutsAdmin === 'function') loadShoutoutsAdmin(platform); // Reload list
            if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin(); // Reload disabilities
        } catch (error) { console.error(`Error deleting ${platform} shoutout (ID: ${docId}):`, error); showAdminStatus(`Error deleting ${platform}: ${error.message}`, true); }
    }

    // --- Useful Links ---
    async function handleAddUsefulLink(event) {
         event.preventDefault(); if (!addUsefulLinkForm) return;
         const labelInput = addUsefulLinkForm.querySelector('#link-label'); const urlInput = addUsefulLinkForm.querySelector('#link-url'); const orderInput = addUsefulLinkForm.querySelector('#link-order');
         const label = labelInput?.value.trim(); const url = urlInput?.value.trim(); const orderStr = orderInput?.value.trim(); const order = parseInt(orderStr);
         if (!label || !url || !orderStr || isNaN(order) || order < 0) { showAdminStatus("Invalid input for Useful Link...", true); return; }
         try { new URL(url); } catch (_) { showAdminStatus("Invalid URL format.", true); return; }
         const linkData = { label: label, url: url, order: order, createdAt: serverTimestamp() };
         showAdminStatus("Adding useful link...");
         try {
             const docRef = await addDoc(usefulLinksCollectionRef, linkData); console.log("Useful link added with ID:", docRef.id);
             showAdminStatus("Useful link added successfully.", false); addUsefulLinkForm.reset();
             loadUsefulLinksAdmin(); // Reload this list
             if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin(); // Reload disabilities
         } catch (error) { console.error("Error adding useful link:", error); showAdminStatus(`Error adding useful link: ${error.message}`, true); }
     }
    async function handleDeleteUsefulLink(docId) { // Takes only docId now
        if (!confirm("Are you sure you want to permanently delete this useful link?")) { return; }
        showAdminStatus("Deleting useful link...");
        try {
            await deleteDoc(doc(db, 'useful_links', docId));
            showAdminStatus("Useful link deleted successfully.", false);
            loadUsefulLinksAdmin(); // Reload this list
            if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin(); // Reload disabilities
        } catch (error) { console.error(`Error deleting useful link (ID: ${docId}):`, error); showAdminStatus(`Error deleting useful link: ${error.message}`, true); }
    }
    async function handleUpdateUsefulLink(event) {
        event.preventDefault(); if (!editUsefulLinkForm) return;
        const docId = editUsefulLinkForm.getAttribute('data-doc-id'); if (!docId) { showEditLinkStatus("Error: Missing document ID.", true); return; }
        const label = editLinkLabelInput?.value.trim(); const url = editLinkUrlInput?.value.trim(); const orderStr = editLinkOrderInput?.value.trim(); const order = parseInt(orderStr);
        if (!label || !url || !orderStr || isNaN(order) || order < 0) { showEditLinkStatus("Invalid input...", true); return; }
        try { new URL(url); } catch (_) { showEditLinkStatus("Invalid URL format.", true); return; }
        const updatedData = { label: label, url: url, order: order, lastModified: serverTimestamp() };
        showEditLinkStatus("Saving changes...");
        try {
            const docRef = doc(db, 'useful_links', docId); await updateDoc(docRef, updatedData);
            showAdminStatus("Useful link updated successfully.", false);
            closeEditUsefulLinkModal();
            loadUsefulLinksAdmin(); // Reload this list
            if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin(); // Reload disabilities
        } catch (error) { console.error(`Error updating useful link (ID: ${docId}):`, error); showEditLinkStatus(`Error saving: ${error.message}`, true); showAdminStatus(`Error updating useful link: ${error.message}`, true); }
    }

     // --- Social Links ---
     async function handleAddSocialLink(event) {
         event.preventDefault(); if (!addSocialLinkForm) return;
         const labelInput = addSocialLinkForm.querySelector('#social-link-label'); const urlInput = addSocialLinkForm.querySelector('#social-link-url'); const orderInput = addSocialLinkForm.querySelector('#social-link-order');
         const label = labelInput?.value.trim(); const url = urlInput?.value.trim(); const orderStr = orderInput?.value.trim(); const order = parseInt(orderStr);
         if (!label || !url || !orderStr || isNaN(order) || order < 0) { showAdminStatus("Invalid input for Social Link...", true); return; }
         try { new URL(url); } catch (_) { showAdminStatus("Invalid URL format.", true); return; }
         const linkData = { label: label, url: url, order: order, createdAt: serverTimestamp() };
         showAdminStatus("Adding social link...");
         try {
             const docRef = await addDoc(socialLinksCollectionRef, linkData); console.log("Social link added with ID:", docRef.id);
             showAdminStatus("Social link added successfully.", false); addSocialLinkForm.reset();
             loadSocialLinksAdmin(); // Reload this list
             if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin(); // Reload disabilities
         } catch (error) { console.error("Error adding social link:", error); showAdminStatus(`Error adding social link: ${error.message}`, true); }
     }
     async function handleDeleteSocialLink(docId) { // Takes only docId now
        if (!confirm("Are you sure you want to permanently delete this social link?")) { return; }
        showAdminStatus("Deleting social link...");
        try {
            await deleteDoc(doc(db, 'social_links', docId));
            showAdminStatus("Social link deleted successfully.", false);
            loadSocialLinksAdmin(); // Reload this list
            if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin(); // Reload disabilities
        } catch (error) { console.error(`Error deleting social link (ID: ${docId}):`, error); showAdminStatus(`Error deleting social link: ${error.message}`, true); }
    }
     async function handleUpdateSocialLink(event) {
        event.preventDefault(); if (!editSocialLinkForm) return;
        const docId = editSocialLinkForm.getAttribute('data-doc-id'); if (!docId) { showEditSocialLinkStatus("Error: Missing document ID.", true); return; }
        const label = editSocialLinkLabelInput?.value.trim(); const url = editSocialLinkUrlInput?.value.trim(); const orderStr = editSocialLinkOrderInput?.value.trim(); const order = parseInt(orderStr);
        if (!label || !url || !orderStr || isNaN(order) || order < 0) { showEditSocialLinkStatus("Invalid input...", true); return; }
        try { new URL(url); } catch (_) { showEditSocialLinkStatus("Invalid URL format.", true); return; }
        const updatedData = { label: label, url: url, order: order, lastModified: serverTimestamp() };
        showEditSocialLinkStatus("Saving changes...");
        try {
            const docRef = doc(db, 'social_links', docId); await updateDoc(docRef, updatedData);
            showAdminStatus("Social link updated successfully.", false);
            closeEditSocialLinkModal();
            loadSocialLinksAdmin(); // Reload this list
            if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin(); // Reload disabilities
        } catch (error) { console.error(`Error updating social link (ID: ${docId}):`, error); showEditSocialLinkStatus(`Error saving: ${error.message}`, true); showAdminStatus(`Error updating social link: ${error.message}`, true); }
    }

    // ============================================================
    // === Save/Add/Delete Functions (Business Hours Section) ===
    // ============================================================

    // --- Function to Save Regular Hours ---
    async function saveRegularHours(event) {
        event.preventDefault();
        if (!regularHoursForm) { console.error("Regular hours form element not found."); return; }
        if (!auth || !auth.currentUser) { showRegularHoursStatus("Error: Not logged in.", true); return; }

        const getValueOrDefault = (element) => element?.value.trim() || "Closed";
        const hoursData = {
            sunday_open: getValueOrDefault(hoursSundayOpenInput), sunday_close: getValueOrDefault(hoursSundayCloseInput),
            monday_open: getValueOrDefault(hoursMondayOpenInput), monday_close: getValueOrDefault(hoursMondayCloseInput),
            tuesday_open: getValueOrDefault(hoursTuesdayOpenInput), tuesday_close: getValueOrDefault(hoursTuesdayCloseInput),
            wednesday_open: getValueOrDefault(hoursWednesdayOpenInput), wednesday_close: getValueOrDefault(hoursWednesdayCloseInput),
            thursday_open: getValueOrDefault(hoursThursdayOpenInput), thursday_close: getValueOrDefault(hoursThursdayCloseInput),
            friday_open: getValueOrDefault(hoursFridayOpenInput), friday_close: getValueOrDefault(hoursFridayCloseInput),
            saturday_open: getValueOrDefault(hoursSaturdayOpenInput), saturday_close: getValueOrDefault(hoursSaturdayCloseInput),
            lastUpdated: serverTimestamp()
        };

        // Basic time format validation
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i;
        let isValid = true;
        for (const key in hoursData) {
            if (key !== 'lastUpdated') {
                 const value = hoursData[key];
                 if (value.toLowerCase() !== 'closed' && !timeRegex.test(value)) {
                     isValid = false;
                     showRegularHoursStatus(`Invalid format for ${key.replace(/_/g, ' ')}. Use HH:MM AM/PM or Closed.`, true);
                     break;
                 }
            }
        }
        if (!isValid) return;

        showRegularHoursStatus("Saving regular hours...");
        try {
            await setDoc(businessInfoDocRef, hoursData, { merge: true });
            console.log("Regular hours saved to:", businessInfoDocRef.path);
            showRegularHoursStatus("Regular hours saved successfully!", false);
            // Reload lists for consistency
            if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin();

        } catch (error) {
            console.error("Error saving regular hours:", error);
            showRegularHoursStatus(`Error saving hours: ${error.message}`, true);
        }
    }

    // --- Function to Handle Adding a New Holiday ---
    async function handleAddHoliday(event) {
        event.preventDefault();
        if (!addHolidayForm) return;
        if (!auth || !auth.currentUser) { showHolidaysStatus("Error: Not logged in.", true); return; }

        const dateInput = addHolidayForm.querySelector('#holiday-date');
        const nameInput = addHolidayForm.querySelector('#holiday-name');
        const hoursInput = addHolidayForm.querySelector('#holiday-specific-hours');

        const date = dateInput?.value;
        const name = nameInput?.value.trim();
        const hours = hoursInput?.value.trim();

        if (!date || !name || !hours) {
            showHolidaysStatus("Please fill out all fields for the holiday.", true);
            return;
        }

        // Optional: Add validation for hours format if needed

        const holidayData = { date, name, hours, createdAt: serverTimestamp() };

        showHolidaysStatus("Adding holiday...");
        try {
            const docRef = await addDoc(holidaysCollectionRef, holidayData);
            console.log("Holiday added with ID:", docRef.id);
            showHolidaysStatus("Holiday added successfully.", false);
            addHolidayForm.reset();
            loadHolidaysAdmin(); // Reload the holiday list
            if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin(); // Reload disabilities

        } catch (error) {
            console.error("Error adding holiday:", error);
            showHolidaysStatus(`Error adding holiday: ${error.message}`, true);
        }
    }

    // --- Function to Handle Deleting a Holiday ---
    async function handleDeleteHoliday(docId) {
        if (!confirm("Are you sure you want to permanently delete this holiday entry?")) { return; }
        if (!auth || !auth.currentUser) { showHolidaysStatus("Error: Not logged in.", true); return; }

        showHolidaysStatus("Deleting holiday...");
        try {
            await deleteDoc(doc(db, 'holidays', docId));
            showHolidaysStatus("Holiday deleted successfully.", false);
            loadHolidaysAdmin(); // Reload the holiday list
            if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin(); // Reload disabilities

        } catch (error) {
            console.error(`Error deleting holiday (ID: ${docId}):`, error);
            showHolidaysStatus(`Error deleting holiday: ${error.message}`, true);
        }
    }

    // --- Function to Handle Adding a New Temporary Closure ---
    async function handleAddTempClosure(event) {
        event.preventDefault();
        if (!addTempClosureForm) return;
        if (!auth || !auth.currentUser) { showTempClosuresStatus("Error: Not logged in.", true); return; }

        const dateInput = addTempClosureForm.querySelector('#temp-closure-date');
        const startTimeInput = addTempClosureForm.querySelector('#temp-closure-start-time');
        const endTimeInput = addTempClosureForm.querySelector('#temp-closure-end-time');
        const reasonInput = addTempClosureForm.querySelector('#temp-closure-reason');

        const date = dateInput?.value;
        const startTime = startTimeInput?.value; // HH:MM (24hr format from input type="time")
        const endTime = endTimeInput?.value;   // HH:MM (24hr format)
        const reason = reasonInput?.value.trim();

        if (!date || !startTime || !endTime || !reason) {
            showTempClosuresStatus("Please fill out all fields for the temporary closure.", true);
            return;
        }

        // Basic validation: end time should be after start time
        if (startTime >= endTime) {
             showTempClosuresStatus("End time must be after start time.", true);
             return;
        }

        const closureData = {
            date,
            startTime, // Store as HH:MM
            endTime,   // Store as HH:MM
            reason,
            createdAt: serverTimestamp()
        };

        showTempClosuresStatus("Adding temporary closure...");
        try {
            const docRef = await addDoc(tempClosuresCollectionRef, closureData);
            console.log("Temporary closure added with ID:", docRef.id);
            showTempClosuresStatus("Temporary closure added successfully.", false);
            addTempClosureForm.reset();
            loadTempClosuresAdmin(); // Reload the closures list
            if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin(); // Reload disabilities

        } catch (error) {
            console.error("Error adding temporary closure:", error);
            showTempClosuresStatus(`Error adding closure: ${error.message}`, true);
        }
    }

     // --- Function to Handle Deleting a Temporary Closure ---
    async function handleDeleteTempClosure(docId) {
        if (!confirm("Are you sure you want to permanently delete this temporary closure entry?")) { return; }
        if (!auth || !auth.currentUser) { showTempClosuresStatus("Error: Not logged in.", true); return; }

        showTempClosuresStatus("Deleting temporary closure...");
        try {
            await deleteDoc(doc(db, 'temporary_closures', docId));
            showTempClosuresStatus("Temporary closure deleted successfully.", false);
            loadTempClosuresAdmin(); // Reload the closures list
            if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin(); // Reload disabilities

        } catch (error) {
            console.error(`Error deleting temporary closure (ID: ${docId}):`, error);
            showTempClosuresStatus(`Error deleting closure: ${error.message}`, true);
        }
    } 

        // ==================================================
    // === Authentication & Event Listeners ===
    // ==================================================

    // --- Inactivity Logout & Timer Display Functions ---
    function updateTimerDisplay() {
        if (!timerDisplayElement) return;
        const now = Date.now();
        const remainingMs = expirationTime - now;
        if (remainingMs <= 0) { timerDisplayElement.textContent = "00:00"; clearInterval(displayIntervalId); }
        else { const remainingSeconds = Math.round(remainingMs / 1000); const minutes = Math.floor(remainingSeconds / 60); const seconds = remainingSeconds % 60; timerDisplayElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; }
    }
    function logoutDueToInactivity() {
        console.log("Logging out due to inactivity.");
        clearTimeout(inactivityTimer); clearInterval(displayIntervalId); if (timerDisplayElement) timerDisplayElement.textContent = '';
        removeActivityListeners();
        signOut(auth).catch((error) => { console.error("Error during inactivity logout:", error); });
    }
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer); clearInterval(displayIntervalId);
        expirationTime = Date.now() + INACTIVITY_TIMEOUT_MS;
        inactivityTimer = setTimeout(logoutDueToInactivity, INACTIVITY_TIMEOUT_MS);
        if (timerDisplayElement) { updateTimerDisplay(); displayIntervalId = setInterval(updateTimerDisplay, 1000); }
    }
    function addActivityListeners() {
        console.log("Adding activity listeners for inactivity timer.");
        activityEvents.forEach(eventName => { document.addEventListener(eventName, resetInactivityTimer, true); });
    }
    function removeActivityListeners() {
        console.log("Removing activity listeners for inactivity timer.");
        clearTimeout(inactivityTimer); clearInterval(displayIntervalId); if (timerDisplayElement) timerDisplayElement.textContent = '';
        activityEvents.forEach(eventName => { document.removeEventListener(eventName, resetInactivityTimer, true); });
    }

    // --- 'Next' Button Logic ---
    if (nextButton && emailInput && authStatus && emailGroup && passwordGroup && loginButton) {
        nextButton.addEventListener('click', () => {
            const userEmail = emailInput.value.trim();
            if (!userEmail) { authStatus.textContent = 'Please enter your email address.'; authStatus.className = 'status-message error'; authStatus.style.display = 'block'; return; }
            authStatus.textContent = `Welcome back, ${userEmail}`; authStatus.className = 'status-message'; authStatus.style.display = 'block';
            emailGroup.style.display = 'none'; nextButton.style.display = 'none';
            passwordGroup.style.display = 'block'; loginButton.style.display = 'inline-block';
            if(passwordInput) { passwordInput.focus(); }
        });
    } else { console.warn("Missing elements for 'Next' button functionality."); }

    // --- Authentication State Listener ---
    onAuthStateChanged(auth, user => {
        if (user) { // User is signed in
            console.log("User logged in:", user.email);
            if (loginSection) loginSection.style.display = 'none';
            if (adminContent) adminContent.style.display = 'block';
            if (logoutButton) logoutButton.style.display = 'inline-block';
            if (adminGreeting) adminGreeting.textContent = `Logged in as: ${user.email}`;
            if (authStatus) { authStatus.textContent = ''; authStatus.className = 'status-message'; authStatus.style.display = 'none'; }
            if (adminStatusElement) { adminStatusElement.textContent = ''; adminStatusElement.className = 'status-message'; }

            // Load ALL initial data
            if (typeof loadProfileData === 'function') loadProfileData();
            if (typeof loadPresidentData === 'function') loadPresidentData();
            if (typeof loadDisabilitiesAdmin === 'function') loadDisabilitiesAdmin();
            if (typeof loadUsefulLinksAdmin === 'function') loadUsefulLinksAdmin();
            if (typeof loadSocialLinksAdmin === 'function') loadSocialLinksAdmin();
            if (typeof loadShoutoutsAdmin === 'function') { loadShoutoutsAdmin('tiktok'); loadShoutoutsAdmin('instagram'); loadShoutoutsAdmin('youtube'); }
            // Load Business Hours Data
            if (typeof loadRegularHoursAdmin === 'function') loadRegularHoursAdmin();
            if (typeof loadHolidaysAdmin === 'function') loadHolidaysAdmin();
            if (typeof loadTempClosuresAdmin === 'function') loadTempClosuresAdmin();

            // Start inactivity timer
            resetInactivityTimer();
            addActivityListeners();

        } else { // User is signed out
            console.log("User logged out.");
            if (loginSection) loginSection.style.display = 'block';
            if (adminContent) adminContent.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'none';
            if (adminGreeting) adminGreeting.textContent = '';
            if (typeof closeEditModal === 'function') closeEditModal();
            if (typeof closeEditUsefulLinkModal === 'function') closeEditUsefulLinkModal();
            if (typeof closeEditSocialLinkModal === 'function') closeEditSocialLinkModal();
            if (typeof closeEditDisabilityModal === 'function') closeEditDisabilityModal();
            // Reset login form
            if (emailGroup) emailGroup.style.display = 'block';
            if (passwordGroup) passwordGroup.style.display = 'none';
            if (nextButton) nextButton.style.display = 'inline-block';
            if (loginButton) loginButton.style.display = 'none';
            if (authStatus) { authStatus.textContent = ''; authStatus.style.display = 'none'; }
            if (loginForm) loginForm.reset();
            // Stop inactivity timer
            removeActivityListeners();
        }
    });

    // --- Login Form Submission Handler ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value; const password = passwordInput.value;
            if (!email || !password) { /* ... validation code ... */ if (passwordGroup && passwordGroup.style.display !== 'none' && !password) { if (authStatus) { authStatus.textContent = 'Please enter your password.'; authStatus.className = 'status-message error'; authStatus.style.display = 'block';} } else if (!email) { if (authStatus) { authStatus.textContent = 'Please enter your email.'; authStatus.className = 'status-message error'; authStatus.style.display = 'block';} } else { if (authStatus) { authStatus.textContent = 'Please enter email and password.'; authStatus.className = 'status-message error'; authStatus.style.display = 'block';} } return; }
            if (authStatus) { authStatus.textContent = 'Logging in...'; authStatus.className = 'status-message'; authStatus.style.display = 'block'; }

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => { console.log("Login successful via form submission."); })
                .catch((error) => {
                    console.error("Login failed:", error.code, error.message);
                    let errorMessage = 'Invalid email or password.';
                    if (error.code === 'auth/invalid-email') { errorMessage = 'Invalid email format.'; }
                    else if (error.code === 'auth/user-disabled') { errorMessage = 'This account has been disabled.'; }
                    else if (error.code === 'auth/invalid-credential') { errorMessage = 'Invalid email or password.'; }
                    else if (error.code === 'auth/too-many-requests') { errorMessage = 'Access temporarily disabled due to too many failed login attempts.'; }
                    else { errorMessage = `An unexpected error occurred (${error.code}).`; }
                    if (authStatus) { authStatus.textContent = `Login Failed: ${errorMessage}`; authStatus.className = 'status-message error'; authStatus.style.display = 'block'; }
                });
        });
    }

    // --- Logout Button Handler ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Logout button clicked.");
            removeActivityListeners(); // Stop inactivity timer first
            signOut(auth).then(() => { console.log("User signed out via button."); })
                         .catch((error) => { console.error("Logout failed:", error); showAdminStatus(`Logout Failed: ${error.message}`, true); });
        });
    }

    // ========================================
    // === Attach ALL Event Listeners Below ===
    // ========================================

    // Profile Save Form
    if (profileForm) { profileForm.addEventListener('submit', saveProfileData); }

    // Maintenance Mode Toggle
    if (maintenanceModeToggle) { maintenanceModeToggle.addEventListener('change', (e) => { saveMaintenanceModeStatus(e.target.checked); }); }

    // President Form & Preview
    if (presidentForm) {
        const presidentPreviewInputs = [ presidentNameInput, presidentBornInput, presidentHeightInput, presidentPartyInput, presidentTermInput, presidentVpInput, presidentImageUrlInput ];
        presidentPreviewInputs.forEach(inputElement => {
            if (inputElement) { inputElement.addEventListener('input', updatePresidentPreview); } // Simplified listener attachment
        });
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

    // Disabilities Forms & Modals
    if (addDisabilityForm) { addDisabilityForm.addEventListener('submit', handleAddDisability); }
    if (editDisabilityForm) { editDisabilityForm.addEventListener('submit', handleUpdateDisability); }
    if (cancelEditDisabilityButton) { cancelEditDisabilityButton.addEventListener('click', closeEditDisabilityModal); }
    if (cancelEditDisabilityButtonSecondary) { cancelEditDisabilityButtonSecondary.addEventListener('click', closeEditDisabilityModal); }

    // --- Business Hours Forms ---
    if (regularHoursForm) { regularHoursForm.addEventListener('submit', saveRegularHours); }
    if (addHolidayForm) { addHolidayForm.addEventListener('submit', handleAddHoliday); }
    if (addTempClosureForm) { addTempClosureForm.addEventListener('submit', handleAddTempClosure); }
    // Note: Delete buttons for holidays/closures are attached dynamically in render functions

    // --- Search Input Listeners ---
    if (searchInputTiktok) { searchInputTiktok.addEventListener('input', () => { if (typeof displayFilteredShoutouts === 'function') { displayFilteredShoutouts('tiktok'); } }); }
    if (searchInputInstagram) { searchInputInstagram.addEventListener('input', () => { if (typeof displayFilteredShoutouts === 'function') { displayFilteredShoutouts('instagram'); } }); }
    if (searchInputYoutube) { searchInputYoutube.addEventListener('input', () => { if (typeof displayFilteredShoutouts === 'function') { displayFilteredShoutouts('youtube'); } }); }

    // --- Preview Listeners ---
    // Helper function to attach preview listeners (Shoutouts)
    function attachPreviewListeners(formElement, platform, formType) { if (!formElement) return; const previewInputs = [ 'username', 'nickname', 'bio', 'profilePic', 'isVerified', 'followers', 'subscribers', 'coverPhoto' ]; previewInputs.forEach(name => { const inputElement = formElement.querySelector(`[name="${name}"]`); if (inputElement) { const eventType = (inputElement.type === 'checkbox') ? 'change' : 'input'; inputElement.addEventListener(eventType, () => { if (typeof updateShoutoutPreview === 'function') { updateShoutoutPreview(formType, platform); } else { console.error("updateShoutoutPreview missing!"); } }); } }); }
    // Attach shoutout preview listeners
    if (addShoutoutTiktokForm) attachPreviewListeners(addShoutoutTiktokForm, 'tiktok', 'add');
    if (addShoutoutInstagramForm) attachPreviewListeners(addShoutoutInstagramForm, 'instagram', 'add');
    if (addShoutoutYoutubeForm) attachPreviewListeners(addShoutoutYoutubeForm, 'youtube', 'add');
    if (editForm) { const editPreviewInputs = [ editUsernameInput, editNicknameInput, editBioInput, editProfilePicInput, editIsVerifiedInput, editFollowersInput, editSubscribersInput, editCoverPhotoInput ]; editPreviewInputs.forEach(el => { if (el) { const eventType = (el.type === 'checkbox') ? 'change' : 'input'; el.addEventListener(eventType, () => { const currentPlatform = editForm.getAttribute('data-platform'); if (currentPlatform && typeof updateShoutoutPreview === 'function') { updateShoutoutPreview('edit', currentPlatform); } else if (!currentPlatform) { console.warn("Edit form platform not set."); } else { console.error("updateShoutoutPreview missing!"); } }); } }); }

    // --- Combined Window Click Listener for Closing Modals ---
    window.addEventListener('click', (event) => {
        if (event.target === editModal) { closeEditModal(); }
        if (event.target === editUsefulLinkModal) { closeEditUsefulLinkModal(); }
        if (event.target === editSocialLinkModal) { closeEditSocialLinkModal(); }
        if (event.target === editDisabilityModal) { closeEditDisabilityModal(); }
        // Add edit modals for holidays/closures here if implemented
    });

}); // End DOMContentLoaded Event Listener (MUST be the very last line)                      
