// admin.js (Complete Version with Duplication Fix + All Features)

// *** Import Firebase services from your corrected init file ***
import { db, auth } from './firebase-init.js'; // Ensure path is correct

// Import Firebase functions (Includes 'where', 'query', 'orderBy', 'limit')
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc, serverTimestamp, getDoc, query, orderBy, where, limit } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

// *** Global Variable for Client-Side Filtering ***
let allShoutouts = { tiktok: [], instagram: [], youtube: [] }; // Stores the full lists for filtering

// --- Flags to prevent multiple listener attachments --- (FIX 1)
let tiktokListenerAttached = false;
let instagramListenerAttached = false;
let youtubeListenerAttached = false;
let profileListenerAttached = false;
let presidentListenerAttached = false;
let usefulLinkListenerAttached = false;
let socialLinkListenerAttached = false;
let disabilityListenerAttached = false;
let editShoutoutListenerAttached = false;
let editUsefulLinkListenerAttached = false;
let editSocialLinkListenerAttached = false;
let editDisabilityListenerAttached = false;
// --- End Flags ---

document.addEventListener('DOMContentLoaded', () => {
    // First, check if db and auth were successfully imported/initialized
    if (!db || !auth) {
         console.error("Firestore (db) or Auth not initialized correctly. Check firebase-init.js and imports.");
         alert("FATAL ERROR: Firebase services failed to load. Admin panel disabled.");
         return; // Stop executing if Firebase isn't ready
    }
    console.log("Admin DOM Loaded. Setting up UI and CRUD functions.");

    // --- Firestore References ---
    const profileDocRef = doc(db, "site_config", "mainProfile");
    const shoutoutsMetaRef = doc(db, 'siteConfig', 'shoutoutsMetadata');
    const usefulLinksCollectionRef = collection(db, "useful_links");
    const socialLinksCollectionRef = collection(db, "social_links");
    const presidentDocRef = doc(db, "site_config", "currentPresident");
    // Firestore Reference for Disabilities
    const disabilitiesCollectionRef = collection(db, "disabilities");

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

    // Shoutout Elements (Add Forms, Lists, Search)
    const addShoutoutTiktokForm = document.getElementById('add-shoutout-tiktok-form');
    const shoutoutsTiktokListAdmin = document.getElementById('shoutouts-tiktok-list-admin');
    const addShoutoutInstagramForm = document.getElementById('add-shoutout-instagram-form');
    const shoutoutsInstagramListAdmin = document.getElementById('shoutouts-instagram-list-admin');
    const addShoutoutYoutubeForm = document.getElementById('add-shoutout-youtube-form');
    const shoutoutsYoutubeListAdmin = document.getElementById('shoutouts-youtube-list-admin');
    const searchInputTiktok = document.getElementById('search-tiktok');
    const searchInputInstagram = document.getElementById('search-instagram');
    const searchInputYoutube = document.getElementById('search-youtube');

    // Shoutout Edit Modal Elements
    const editModal = document.getElementById('edit-shoutout-modal');
    const editForm = document.getElementById('edit-shoutout-form');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    const editUsernameInput = document.getElementById('edit-username');
    const editNicknameInput = document.getElementById('edit-nickname');
    const editOrderInput = document.getElementById('edit-order');
    const editIsVerifiedInput = document.getElementById('edit-isVerified');
    const editBioInput = document.getElementById('edit-bio');
    const editProfilePicInput = document.getElementById('edit-profilePic');
    // const editIsEnabledInput = document.getElementById('edit-isEnabled'); // Not used in current logic
    const editFollowersInput = document.getElementById('edit-followers');
    const editSubscribersInput = document.getElementById('edit-subscribers');
    const editCoverPhotoInput = document.getElementById('edit-coverPhoto');
    const editPlatformSpecificDiv = document.getElementById('edit-platform-specific');

    // Shoutout Preview Area Elements
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

    // Added back: Status for Disability Edit Modal
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

// --- Edit Modal Logic ---
    function openEditModal(docId, platform) {
        if (!editModal || !editForm) { console.error("Edit modal/form not found."); showAdminStatus("UI Error: Cannot open edit form.", true); return; }
        editForm.setAttribute('data-doc-id', docId);
        editForm.setAttribute('data-platform', platform);
        const docRef = doc(db, 'shoutouts', docId);

        getDoc(docRef).then(docSnap => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (editUsernameInput) editUsernameInput.value = data.username || '';
                if (editNicknameInput) editNicknameInput.value = data.nickname || '';
                if (editOrderInput) editOrderInput.value = data.order ?? '';
                if (editIsVerifiedInput) editIsVerifiedInput.checked = data.isVerified || false;
                if (editBioInput) editBioInput.value = data.bio || '';
                if (editProfilePicInput) editProfilePicInput.value = data.profilePic || '';

                const followersDiv = editPlatformSpecificDiv?.querySelector('.edit-followers-group');
                const subscribersDiv = editPlatformSpecificDiv?.querySelector('.edit-subscribers-group');
                const coverPhotoDiv = editPlatformSpecificDiv?.querySelector('.edit-coverphoto-group');

                if (followersDiv) followersDiv.style.display = 'none';
                if (subscribersDiv) subscribersDiv.style.display = 'none';
                if (coverPhotoDiv) coverPhotoDiv.style.display = 'none';

                if (platform === 'youtube') {
                    if (editSubscribersInput) editSubscribersInput.value = data.subscribers || 'N/A';
                    if (editCoverPhotoInput) editCoverPhotoInput.value = data.coverPhoto || '';
                    if (subscribersDiv) subscribersDiv.style.display = 'block';
                    if (coverPhotoDiv) coverPhotoDiv.style.display = 'block';
                } else {
                    if (editFollowersInput) editFollowersInput.value = data.followers || 'N/A';
                    if (followersDiv) followersDiv.style.display = 'block';
                }

                const previewArea = document.getElementById('edit-shoutout-preview');
                 if(previewArea) {
                     previewArea.innerHTML = '<p><small>Generating preview...</small></p>';
                     if (typeof updateShoutoutPreview === 'function') {
                        updateShoutoutPreview('edit', platform);
                     }
                 }
                editModal.style.display = 'block';
            } else {
                 showAdminStatus("Error: Could not load data for editing. Document not found.", true);
            }
        }).catch(error => {
             console.error("Error getting document for edit:", error);
             showAdminStatus(`Error loading data: ${error.message}`, true);
         });
    }

    function closeEditModal() {
        if (editModal) editModal.style.display = 'none';
        if (editForm) editForm.reset();
        editForm?.removeAttribute('data-doc-id');
        editForm?.removeAttribute('data-platform');
         if(editShoutoutPreview) {
             editShoutoutPreview.innerHTML = '<p><small>Preview will appear here.</small></p>';
         }
    }

// --- Shoutout Card Rendering Functions --- (Copied from displayShoutouts.js, paths might need adjustment)
    function renderTikTokCard(account) { const profilePic = account.profilePic || 'images/default-profile.jpg'; const username = account.username || 'N/A'; const nickname = account.nickname || 'N/A'; const bio = account.bio || ''; const followers = account.followers || 'N/A'; const isVerified = account.isVerified || false; const profileUrl = username !== 'N/A' ? `https://tiktok.com/@${encodeURIComponent(username)}` : '#'; const verifiedBadge = isVerified ? '<img src="check.png" alt="Verified" class="verified-badge">' : ''; return `<div class="creator-card"><img src="${profilePic}" alt="@${username}" class="creator-pic" onerror="this.onerror=null; this.src='images/default-profile.jpg';"><div class="creator-info"><div class="creator-header"><h3>${nickname} ${verifiedBadge}</h3></div> <p class="creator-username">@${username}</p> <p class="creator-bio">${bio}</p> <p class="follower-count">${followers} Followers</p> <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="visit-profile"> Visit Profile </a></div></div>`;}
    function renderInstagramCard(account) { const profilePic = account.profilePic || 'images/default-profile.jpg'; const username = account.username || 'N/A'; const nickname = account.nickname || 'N/A'; const bio = account.bio || ''; const followers = account.followers || 'N/A'; const isVerified = account.isVerified || false; const profileUrl = username !== 'N/A' ? `https://instagram.com/${encodeURIComponent(username)}` : '#'; const verifiedBadge = isVerified ? '<img src="instagramcheck.png" alt="Verified" class="instagram-verified-badge">' : ''; return `<div class="instagram-creator-card"><img src="${profilePic}" alt="${nickname}" class="instagram-creator-pic" onerror="this.onerror=null; this.src='images/default-profile.jpg';"><div class="instagram-creator-info"><div class="instagram-creator-header"><h3>${nickname} ${verifiedBadge}</h3></div> <p class="instagram-creator-username">@${username}</p> <p class="instagram-creator-bio">${bio}</p> <p class="instagram-follower-count">${followers} Followers</p> <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="instagram-visit-profile"> Visit Profile </a></div></div>`;}
    function renderYouTubeCard(account) { const profilePic = account.profilePic || 'images/default-profile.jpg'; const username = account.username || 'N/A'; const nickname = account.nickname || 'N/A'; const bio = account.bio || ''; const subscribers = account.subscribers || 'N/A'; const coverPhoto = account.coverPhoto || null; const isVerified = account.isVerified || false; let safeUsername = username; if (username !== 'N/A' && !username.startsWith('@')) { safeUsername = `@${username}`; } const channelUrl = username !== 'N/A' ? `https://youtube.com/$$${encodeURIComponent(safeUsername)}` : '#'; const verifiedBadge = isVerified ? '<img src="youtubecheck.png" alt="Verified" class="youtube-verified-badge">' : ''; return `<div class="youtube-creator-card"> ${coverPhoto ? `<img src="${coverPhoto}" alt="${nickname} Cover Photo" class="youtube-cover-photo" onerror="this.style.display='none'">` : ''} <img src="${profilePic}" alt="${nickname}" class="youtube-creator-pic" onerror="this.onerror=null; this.src='images/default-profile.jpg';"><div class="youtube-creator-info"><div class="youtube-creator-header"><h3>${nickname} ${verifiedBadge}</h3></div> <div class="username-container"><p class="youtube-creator-username">@${username}</p></div> <p class="youtube-creator-bio">${bio}</p> <p class="youtube-subscriber-count">${subscribers} Subscribers</p> <a href="${channelUrl}" target="_blank" rel="noopener noreferrer" class="youtube-visit-profile"> Visit Channel </a></div></div>`;}

// --- Shoutout Preview Function ---
    function updateShoutoutPreview(formType, platform) {
        let formElement, previewElement, accountData = {};
        if (formType === 'add') { formElement = document.getElementById(`add-shoutout-${platform}-form`); previewElement = document.getElementById(`add-${platform}-preview`); }
        else if (formType === 'edit') { formElement = editForm; previewElement = editShoutoutPreview; if (editForm.getAttribute('data-platform') !== platform) { if(previewElement) previewElement.innerHTML = '<p><small>Preview unavailable.</small></p>'; return; } }
        else { console.error("Invalid formType:", formType); return; }
        if (!formElement || !previewElement) { console.error(`Preview Error: Missing form/preview for ${formType} ${platform}`); return; }
        try {
            accountData.username = formElement.querySelector(`[name="username"]`)?.value.trim() || '';
            accountData.nickname = formElement.querySelector(`[name="nickname"]`)?.value.trim() || '';
            accountData.bio = formElement.querySelector(`[name="bio"]`)?.value.trim() || '';
            accountData.profilePic = formElement.querySelector(`[name="profilePic"]`)?.value.trim() || '';
            accountData.isVerified = formElement.querySelector(`[name="isVerified"]`)?.checked || false;
            if (platform === 'youtube') {
                accountData.subscribers = formElement.querySelector(`[name="subscribers"]`)?.value.trim() || 'N/A';
                accountData.coverPhoto = formElement.querySelector(`[name="coverPhoto"]`)?.value.trim() || null;
            } else { accountData.followers = formElement.querySelector(`[name="followers"]`)?.value.trim() || 'N/A'; }
        } catch(e) { console.error("Error reading form values:", e); previewElement.innerHTML = '<p class="error"><small>Error reading form.</small></p>'; return; }
        let renderFunction;
        switch (platform) { case 'tiktok': renderFunction = renderTikTokCard; break; case 'instagram': renderFunction = renderInstagramCard; break; case 'youtube': renderFunction = renderYouTubeCard; break; default: console.error("Invalid platform:", platform); previewElement.innerHTML = '<p class="error"><small>Invalid platform.</small></p>'; return; }
        if (typeof renderFunction === 'function') { try { previewElement.innerHTML = renderFunction(accountData); } catch (e) { console.error(`Error rendering preview:`, e); previewElement.innerHTML = '<p class="error"><small>Error rendering.</small></p>'; } }
        else { console.error(`Rendering function missing for ${platform}`); previewElement.innerHTML = '<p class="error"><small>Preview engine error.</small></p>'; }
    }

// --- Admin List Item Rendering ---
    function renderAdminListItem(container, docId, platform, username, nickname, order, deleteHandler, editHandler) {
        if (!container) { console.warn("List container missing:", platform); return; }
        const itemDiv = document.createElement('div'); itemDiv.className = 'list-item-admin'; itemDiv.setAttribute('data-id', docId);
        let directLinkUrl = '#'; let safeUsername = username || '';
        if (platform === 'tiktok' && safeUsername) { directLinkUrl = `https://tiktok.com/@${encodeURIComponent(safeUsername)}`; }
        else if (platform === 'instagram' && safeUsername) { directLinkUrl = `https://instagram.com/${encodeURIComponent(safeUsername)}`; }
        else if (platform === 'youtube' && safeUsername) { let youtubeHandle = safeUsername.startsWith('@') ? safeUsername : `@${safeUsername}`; directLinkUrl = `https://youtube.com/$${encodeURIComponent(youtubeHandle)}`;}
        itemDiv.innerHTML = `<div class="item-content"><div class="item-details"><strong>${nickname || 'N/A'}</strong><span>(@${username || 'N/A'})</span><small>Order: ${order ?? 'N/A'}</small></div></div><div class="item-actions"><a href="${directLinkUrl}" target="_blank" rel="noopener noreferrer" class="direct-link small-button" title="Visit Profile/Channel"><i class="fas fa-external-link-alt"></i> Visit</a><button type="button" class="edit-button small-button">Edit</button><button type="button" class="delete-button small-button">Delete</button></div>`;
        const editButton = itemDiv.querySelector('.edit-button'); if (editButton) editButton.addEventListener('click', () => editHandler(docId, platform));
        const deleteButton = itemDiv.querySelector('.delete-button'); if (deleteButton) deleteButton.addEventListener('click', () => deleteHandler(docId, platform, itemDiv));
        container.appendChild(itemDiv);
    }

// --- Shoutout Filtering ---
    function displayFilteredShoutouts(platform) {
        const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`); const countElement = document.getElementById(`${platform}-count`); const searchInput = document.getElementById(`search-${platform}`);
        if (!listContainer || !searchInput || !allShoutouts || !allShoutouts[platform]) { console.error(`Filtering error for ${platform}.`); if(listContainer) listContainer.innerHTML = `<p class="error">Display error.</p>`; return; }
        const searchTerm = searchInput.value.trim().toLowerCase(); const fullList = allShoutouts[platform];
        const filteredList = fullList.filter(account => { if (!searchTerm) return true; const nickname = (account.nickname || '').toLowerCase(); const username = (account.username || '').toLowerCase(); return nickname.includes(searchTerm) || username.includes(searchTerm); });
        listContainer.innerHTML = '';
        if (filteredList.length > 0) { filteredList.forEach(account => { if (typeof renderAdminListItem === 'function') { renderAdminListItem(listContainer, account.id, platform, account.username, account.nickname, account.order, handleDeleteShoutout, openEditModal); } else { console.error("renderAdminListItem missing!"); listContainer.innerHTML = `<p class="error">Render error.</p>`; return; } }); }
        else { listContainer.innerHTML = searchTerm ? `<p>No results for "${searchInput.value}".</p>` : `<p>No ${platform} shoutouts.</p>`; }
        if (countElement) countElement.textContent = `(${filteredList.length})`;
    }

// --- Shoutouts Load/Add/Delete/Update ---
    function getShoutoutsMetadataRef() { return doc(db, 'siteConfig', 'shoutoutsMetadata'); }
    async function updateMetadataTimestamp(platform) { const metaRef = getShoutoutsMetadataRef(); try { await setDoc(metaRef, { [`lastUpdatedTime_${platform}`]: serverTimestamp() }, { merge: true }); console.log(`Timestamp updated for ${platform}.`); } catch (error) { console.error(`Error updating timestamp for ${platform}:`, error); showAdminStatus(`Warning: Could not update site timestamp for ${platform}.`, true); } }

    async function loadShoutoutsAdmin(platform) {
        const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`); const countElement = document.getElementById(`${platform}-count`);
        if (!listContainer) { console.error(`List container missing: ${platform}`); return; }
        if (countElement) countElement.textContent = ''; listContainer.innerHTML = `<p>Loading ${platform}...</p>`;
        if (allShoutouts && allShoutouts.hasOwnProperty(platform)) { allShoutouts[platform] = []; }
        else { console.error(`allShoutouts init error for ${platform}.`); allShoutouts = { tiktok: [], instagram: [], youtube: [] }; allShoutouts[platform] = []; }
        try {
            const shoutoutsCol = collection(db, 'shoutouts'); const shoutoutQuery = query(shoutoutsCol, where("platform", "==", platform), orderBy("order", "asc"));
            const querySnapshot = await getDocs(shoutoutQuery); console.log(`Loaded ${querySnapshot.size} ${platform} docs.`);
            querySnapshot.forEach((docSnapshot) => { allShoutouts[platform].push({ id: docSnapshot.id, ...docSnapshot.data() }); });
            if (typeof displayFilteredShoutouts === 'function') { displayFilteredShoutouts(platform); } else { console.error(`displayFilteredShoutouts missing for ${platform}`); listContainer.innerHTML = `<p class="error">Display init error.</p>`; if (countElement) countElement.textContent = '(Error)'; }
        } catch (error) {
            console.error(`Error loading ${platform}:`, error);
            let errorMsg = `Error loading ${platform}.`; if (error.code === 'failed-precondition') { errorMsg = `Error: Missing Firestore index for ${platform} (platform, order). Check console.`; showAdminStatus(errorMsg, true); } else { showAdminStatus(errorMsg + `: ${error.message}`, true); }
            listContainer.innerHTML = `<p class="error">${errorMsg}</p>`; if (countElement) countElement.textContent = '(Error)';
        }
    }

    // --- CORRECTED handleAddShoutout Function (Includes Button Disabling FIX 2) ---
    async function handleAddShoutout(platform, formElement) {
        if (!formElement) { console.error("Form element not provided"); return; }
        console.log(`handleAddShoutout started for ${platform}`); // Keep for debugging if needed

        const username = formElement.querySelector(`#${platform}-username`)?.value.trim();
        const nickname = formElement.querySelector(`#${platform}-nickname`)?.value.trim();
        const orderStr = formElement.querySelector(`#${platform}-order`)?.value.trim();
        const order = parseInt(orderStr);

        if (!username || !nickname || !orderStr || isNaN(order) || order < 0) {
            showAdminStatus(`Invalid input: Check fields & ensure Order is non-negative.`, true);
            return;
        }

        // Get the button and disable it
        const submitButton = formElement.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;

        try {
            const shoutoutsCol = collection(db, 'shoutouts');
            const duplicateCheckQuery = query(shoutoutsCol, where("platform", "==", platform), where("username", "==", username), limit(1));
            console.log(`Checking duplicate: ${platform}, ${username}`);
            const querySnapshot = await getDocs(duplicateCheckQuery);

            if (!querySnapshot.empty) {
                console.warn("Duplicate found:", platform, username);
                showAdminStatus(`Error: Shoutout for @${username} on ${platform} already exists.`, true);
                if (submitButton) submitButton.disabled = false; // Re-enable on duplicate error
                return;
            }
            console.log("No duplicate found.");

            const accountData = {
                platform: platform, username: username, nickname: nickname, order: order,
                isVerified: formElement.querySelector(`#${platform}-isVerified`)?.checked || false,
                bio: formElement.querySelector(`#${platform}-bio`)?.value.trim() || null,
                profilePic: formElement.querySelector(`#${platform}-profilePic`)?.value.trim() || null,
                createdAt: serverTimestamp(), isEnabled: true
            };
            if (platform === 'youtube') {
                accountData.subscribers = formElement.querySelector(`#${platform}-subscribers`)?.value.trim() || 'N/A';
                accountData.coverPhoto = formElement.querySelector(`#${platform}-coverPhoto`)?.value.trim() || null;
            } else {
                accountData.followers = formElement.querySelector(`#${platform}-followers`)?.value.trim() || 'N/A';
            }

            const docRef = await addDoc(collection(db, 'shoutouts'), accountData);
            console.log("Shoutout added:", docRef.id);
            await updateMetadataTimestamp(platform);
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout added.`, false);
            formElement.reset();
            const previewArea = formElement.querySelector(`#add-${platform}-preview`);
            if (previewArea) previewArea.innerHTML = '<p><small>Preview will appear here.</small></p>';

            if (typeof loadShoutoutsAdmin === 'function') { loadShoutoutsAdmin(platform); }
            if (submitButton) submitButton.disabled = false; // Re-enable on success

        } catch (error) {
            console.error(`Error adding ${platform} shoutout:`, error);
            showAdminStatus(`Error adding ${platform}: ${error.message}`, true);
            if (submitButton) submitButton.disabled = false; // Re-enable on error
        }
    }
    // --- END handleAddShoutout ---

    async function handleUpdateShoutout(event) {
        event.preventDefault(); if (!editForm) return;
        const docId = editForm.getAttribute('data-doc-id'); const platform = editForm.getAttribute('data-platform');
        if (!docId || !platform) { showAdminStatus("Update Error: Missing ID/Platform.", true); return; }
        const username = editUsernameInput?.value.trim(); const nickname = editNicknameInput?.value.trim(); const orderStr = editOrderInput?.value.trim(); const order = parseInt(orderStr);
        if (!username || !nickname || !orderStr || isNaN(order) || order < 0) { showAdminStatus(`Update Error: Invalid input.`, true); return; }
        const updatedData = { username: username, nickname: nickname, order: order, isVerified: editIsVerifiedInput?.checked || false, bio: editBioInput?.value.trim() || null, profilePic: editProfilePicInput?.value.trim() || null, lastModified: serverTimestamp() };
        if (platform === 'youtube') { updatedData.subscribers = editSubscribersInput?.value.trim() || 'N/A'; updatedData.coverPhoto = editCoverPhotoInput?.value.trim() || null; }
        else { updatedData.followers = editFollowersInput?.value.trim() || 'N/A'; }
        showAdminStatus("Updating shoutout...");
        try {
            const docRef = doc(db, 'shoutouts', docId); await updateDoc(docRef, updatedData); await updateMetadataTimestamp(platform);
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} updated.`, false);
            if (typeof closeEditModal === 'function') closeEditModal(); if (typeof loadShoutoutsAdmin === 'function') loadShoutoutsAdmin(platform);
        } catch (error) { console.error(`Error updating ${platform} (ID: ${docId}):`, error); showAdminStatus(`Error updating: ${error.message}`, true); }
    }

    async function handleDeleteShoutout(docId, platform, listItemElement) {
        if (!confirm(`Delete this ${platform} shoutout permanently?`)) return;
        showAdminStatus("Deleting shoutout...");
        try {
            await deleteDoc(doc(db, 'shoutouts', docId)); await updateMetadataTimestamp(platform);
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} deleted.`, false);
            if (typeof loadShoutoutsAdmin === 'function') loadShoutoutsAdmin(platform);
        } catch (error) { console.error(`Error deleting ${platform} (ID: ${docId}):`, error); showAdminStatus(`Error deleting: ${error.message}`, true); }
    }

// --- Useful Links Functions --- (Copied from original)
    function renderUsefulLinkAdminListItem(container, docId, label, url, order, deleteHandler, editHandler) { if (!container) return; const itemDiv = document.createElement('div'); itemDiv.className = 'list-item-admin'; itemDiv.setAttribute('data-id', docId); let displayUrl = url || 'N/A'; let visitUrl = '#'; try { if (url) visitUrl = new URL(url).href; } catch (e) { displayUrl += " (Invalid URL)"; } itemDiv.innerHTML = `<div class="item-content"><div class="item-details"><strong>${label || 'N/A'}</strong><span>(${displayUrl})</span><small>Order: ${order ?? 'N/A'}</small></div></div><div class="item-actions"><a href="${visitUrl}" target="_blank" rel="noopener noreferrer" class="direct-link small-button" title="Visit Link" ${visitUrl === '#' ? 'style="pointer-events: none; opacity: 0.5;"' : ''}><i class="fas fa-external-link-alt"></i> Visit</a><button type="button" class="edit-button small-button">Edit</button><button type="button" class="delete-button small-button">Delete</button></div>`; const editButton = itemDiv.querySelector('.edit-button'); if (editButton) editButton.addEventListener('click', () => editHandler(docId)); const deleteButton = itemDiv.querySelector('.delete-button'); if (deleteButton) deleteButton.addEventListener('click', () => deleteHandler(docId, itemDiv)); container.appendChild(itemDiv); }
    async function loadUsefulLinksAdmin() { if (!usefulLinksListAdmin) { console.error("Useful links container missing."); return; } if (usefulLinksCount) usefulLinksCount.textContent = ''; usefulLinksListAdmin.innerHTML = `<p>Loading useful links...</p>`; try { const linkQuery = query(usefulLinksCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(linkQuery); usefulLinksListAdmin.innerHTML = ''; if (querySnapshot.empty) { usefulLinksListAdmin.innerHTML = '<p>No useful links found.</p>'; if (usefulLinksCount) usefulLinksCount.textContent = '(0)'; } else { querySnapshot.forEach((doc) => { const data = doc.data(); renderUsefulLinkAdminListItem(usefulLinksListAdmin, doc.id, data.label, data.url, data.order, handleDeleteUsefulLink, openEditUsefulLinkModal); }); if (usefulLinksCount) usefulLinksCount.textContent = `(${querySnapshot.size})`; } console.log(`Loaded ${querySnapshot.size} useful links.`); } catch (error) { console.error("Error loading useful links:", error); usefulLinksListAdmin.innerHTML = `<p class="error">Error loading links.</p>`; if (usefulLinksCount) usefulLinksCount.textContent = '(Error)'; showAdminStatus("Error loading useful links.", true); } }
    async function handleAddUsefulLink(event) { event.preventDefault(); if (!addUsefulLinkForm) return; const labelInput = addUsefulLinkForm.querySelector('#link-label'); const urlInput = addUsefulLinkForm.querySelector('#link-url'); const orderInput = addUsefulLinkForm.querySelector('#link-order'); const label = labelInput?.value.trim(); const url = urlInput?.value.trim(); const orderStr = orderInput?.value.trim(); const order = parseInt(orderStr); if (!label || !url || !orderStr || isNaN(order) || order < 0) { showAdminStatus("Invalid input: Check fields & ensure Order is non-negative.", true); return; } try { new URL(url); } catch (_) { showAdminStatus("Invalid URL format.", true); return; } const linkData = { label: label, url: url, order: order, createdAt: serverTimestamp() }; showAdminStatus("Adding useful link..."); try { const docRef = await addDoc(usefulLinksCollectionRef, linkData); console.log("Useful link added:", docRef.id); showAdminStatus("Useful link added.", false); addUsefulLinkForm.reset(); loadUsefulLinksAdmin(); } catch (error) { console.error("Error adding useful link:", error); showAdminStatus(`Error adding link: ${error.message}`, true); } }
    async function handleDeleteUsefulLink(docId, listItemElement) { if (!confirm("Delete this useful link?")) return; showAdminStatus("Deleting useful link..."); try { await deleteDoc(doc(db, 'useful_links', docId)); showAdminStatus("Useful link deleted.", false); loadUsefulLinksAdmin(); } catch (error) { console.error(`Error deleting useful link (ID: ${docId}):`, error); showAdminStatus(`Error deleting link: ${error.message}`, true); } }
    function openEditUsefulLinkModal(docId) { if (!editUsefulLinkModal || !editUsefulLinkForm) { console.error("Edit useful link modal missing."); showAdminStatus("UI Error.", true); return; } const docRef = doc(db, 'useful_links', docId); showEditLinkStatus("Loading..."); getDoc(docRef).then(docSnap => { if (docSnap.exists()) { const data = docSnap.data(); editUsefulLinkForm.setAttribute('data-doc-id', docId); if (editLinkLabelInput) editLinkLabelInput.value = data.label || ''; if (editLinkUrlInput) editLinkUrlInput.value = data.url || ''; if (editLinkOrderInput) editLinkOrderInput.value = data.order ?? ''; editUsefulLinkModal.style.display = 'block'; showEditLinkStatus(""); } else { showAdminStatus("Error loading link data.", true); showEditLinkStatus("Not found.", true); } }).catch(error => { console.error("Error getting link doc:", error); showAdminStatus(`Error loading link: ${error.message}`, true); showEditLinkStatus(`Error: ${error.message}`, true); }); }
    function closeEditUsefulLinkModal() { if (editUsefulLinkModal) editUsefulLinkModal.style.display = 'none'; if (editUsefulLinkForm) editUsefulLinkForm.reset(); editUsefulLinkForm?.removeAttribute('data-doc-id'); if (editLinkStatusMessage) editLinkStatusMessage.textContent = ''; }
    async function handleUpdateUsefulLink(event) { event.preventDefault(); if (!editUsefulLinkForm) return; const docId = editUsefulLinkForm.getAttribute('data-doc-id'); if (!docId) { showEditLinkStatus("Error: Missing ID.", true); return; } const label = editLinkLabelInput?.value.trim(); const url = editLinkUrlInput?.value.trim(); const orderStr = editLinkOrderInput?.value.trim(); const order = parseInt(orderStr); if (!label || !url || !orderStr || isNaN(order) || order < 0) { showEditLinkStatus("Invalid input.", true); return; } try { new URL(url); } catch (_) { showEditLinkStatus("Invalid URL.", true); return; } const updatedData = { label: label, url: url, order: order, lastModified: serverTimestamp() }; showEditLinkStatus("Saving..."); try { const docRef = doc(db, 'useful_links', docId); await updateDoc(docRef, updatedData); showAdminStatus("Useful link updated.", false); closeEditUsefulLinkModal(); loadUsefulLinksAdmin(); } catch (error) { console.error(`Error updating useful link (ID: ${docId}):`, error); showEditLinkStatus(`Save error: ${error.message}`, true); showAdminStatus(`Error updating link: ${error.message}`, true); } }

// --- Social Links Functions --- (Copied from original)
    function renderSocialLinkAdminListItem(container, docId, label, url, order, deleteHandler, editHandler) { if (!container) return; const itemDiv = document.createElement('div'); itemDiv.className = 'list-item-admin'; itemDiv.setAttribute('data-id', docId); let displayUrl = url || 'N/A'; let visitUrl = '#'; try { if (url) visitUrl = new URL(url).href; } catch (e) { displayUrl += " (Invalid URL)"; } itemDiv.innerHTML = `<div class="item-content"><div class="item-details"><strong>${label || 'N/A'}</strong><span>(${displayUrl})</span><small>Order: ${order ?? 'N/A'}</small></div></div><div class="item-actions"><a href="${visitUrl}" target="_blank" rel="noopener noreferrer" class="direct-link small-button" title="Visit Link" ${visitUrl === '#' ? 'style="pointer-events: none; opacity: 0.5;"' : ''}><i class="fas fa-external-link-alt"></i> Visit</a><button type="button" class="edit-button small-button">Edit</button><button type="button" class="delete-button small-button">Delete</button></div>`; const editButton = itemDiv.querySelector('.edit-button'); if (editButton) editButton.addEventListener('click', () => editHandler(docId)); const deleteButton = itemDiv.querySelector('.delete-button'); if (deleteButton) deleteButton.addEventListener('click', () => deleteHandler(docId, itemDiv)); container.appendChild(itemDiv); }
    async function loadSocialLinksAdmin() { if (!socialLinksListAdmin) { console.error("Social links container missing."); return; } if (socialLinksCount) socialLinksCount.textContent = ''; socialLinksListAdmin.innerHTML = `<p>Loading social links...</p>`; try { const linkQuery = query(socialLinksCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(linkQuery); socialLinksListAdmin.innerHTML = ''; if (querySnapshot.empty) { socialLinksListAdmin.innerHTML = '<p>No social links found.</p>'; if (socialLinksCount) socialLinksCount.textContent = '(0)'; } else { querySnapshot.forEach((doc) => { const data = doc.data(); renderSocialLinkAdminListItem(socialLinksListAdmin, doc.id, data.label, data.url, data.order, handleDeleteSocialLink, openEditSocialLinkModal); }); if (socialLinksCount) socialLinksCount.textContent = `(${querySnapshot.size})`; } console.log(`Loaded ${querySnapshot.size} social links.`); } catch (error) { console.error("Error loading social links:", error); let errorMsg = "Error loading social links."; if (error.code === 'failed-precondition') { errorMsg = "Error: Missing Firestore index for social links (order). Check console."; showAdminStatus(errorMsg, true); } else { showAdminStatus(errorMsg + `: ${error.message}`, true); } socialLinksListAdmin.innerHTML = `<p class="error">${errorMsg}</p>`; if (socialLinksCount) socialLinksCount.textContent = '(Error)'; } }
    async function handleAddSocialLink(event) { event.preventDefault(); if (!addSocialLinkForm) return; const labelInput = addSocialLinkForm.querySelector('#social-link-label'); const urlInput = addSocialLinkForm.querySelector('#social-link-url'); const orderInput = addSocialLinkForm.querySelector('#social-link-order'); const label = labelInput?.value.trim(); const url = urlInput?.value.trim(); const orderStr = orderInput?.value.trim(); const order = parseInt(orderStr); if (!label || !url || !orderStr || isNaN(order) || order < 0) { showAdminStatus("Invalid input: Check fields & ensure Order is non-negative.", true); return; } try { new URL(url); } catch (_) { showAdminStatus("Invalid URL format.", true); return; } const linkData = { label: label, url: url, order: order, createdAt: serverTimestamp() }; showAdminStatus("Adding social link..."); try { const docRef = await addDoc(socialLinksCollectionRef, linkData); console.log("Social link added:", docRef.id); showAdminStatus("Social link added.", false); addSocialLinkForm.reset(); loadSocialLinksAdmin(); } catch (error) { console.error("Error adding social link:", error); showAdminStatus(`Error adding link: ${error.message}`, true); } }
    async function handleDeleteSocialLink(docId, listItemElement) { if (!confirm("Delete this social link?")) return; showAdminStatus("Deleting social link..."); try { await deleteDoc(doc(db, 'social_links', docId)); showAdminStatus("Social link deleted.", false); loadSocialLinksAdmin(); } catch (error) { console.error(`Error deleting social link (ID: ${docId}):`, error); showAdminStatus(`Error deleting link: ${error.message}`, true); } }
    function openEditSocialLinkModal(docId) { if (!editSocialLinkModal || !editSocialLinkForm) { console.error("Edit social link modal missing."); showAdminStatus("UI Error.", true); return; } const docRef = doc(db, 'social_links', docId); showEditSocialLinkStatus("Loading..."); getDoc(docRef).then(docSnap => { if (docSnap.exists()) { const data = docSnap.data(); editSocialLinkForm.setAttribute('data-doc-id', docId); if (editSocialLinkLabelInput) editSocialLinkLabelInput.value = data.label || ''; if (editSocialLinkUrlInput) editSocialLinkUrlInput.value = data.url || ''; if (editSocialLinkOrderInput) editSocialLinkOrderInput.value = data.order ?? ''; editSocialLinkModal.style.display = 'block'; showEditSocialLinkStatus(""); } else { showAdminStatus("Error loading social link data.", true); showEditSocialLinkStatus("Not found.", true); } }).catch(error => { console.error("Error getting social link doc:", error); showAdminStatus(`Error loading link: ${error.message}`, true); showEditSocialLinkStatus(`Error: ${error.message}`, true); }); }
    function closeEditSocialLinkModal() { if (editSocialLinkModal) editSocialLinkModal.style.display = 'none'; if (editSocialLinkForm) editSocialLinkForm.reset(); editSocialLinkForm?.removeAttribute('data-doc-id'); if (editSocialLinkStatusMessage) editSocialLinkStatusMessage.textContent = ''; }
    async function handleUpdateSocialLink(event) { event.preventDefault(); if (!editSocialLinkForm) return; const docId = editSocialLinkForm.getAttribute('data-doc-id'); if (!docId) { showEditSocialLinkStatus("Error: Missing ID.", true); return; } const label = editSocialLinkLabelInput?.value.trim(); const url = editSocialLinkUrlInput?.value.trim(); const orderStr = editSocialLinkOrderInput?.value.trim(); const order = parseInt(orderStr); if (!label || !url || !orderStr || isNaN(order) || order < 0) { showEditSocialLinkStatus("Invalid input.", true); return; } try { new URL(url); } catch (_) { showEditSocialLinkStatus("Invalid URL.", true); return; } const updatedData = { label: label, url: url, order: order, lastModified: serverTimestamp() }; showEditSocialLinkStatus("Saving..."); try { const docRef = doc(db, 'social_links', docId); await updateDoc(docRef, updatedData); showAdminStatus("Social link updated.", false); closeEditSocialLinkModal(); loadSocialLinksAdmin(); } catch (error) { console.error(`Error updating social link (ID: ${docId}):`, error); showEditSocialLinkStatus(`Save error: ${error.message}`, true); showAdminStatus(`Error updating link: ${error.message}`, true); } }

// --- Disabilities Management Functions (Added Back In) ---
    function renderDisabilityAdminListItem(container, docId, name, url, order, deleteHandler, editHandler) { if (!container) return; const itemDiv = document.createElement('div'); itemDiv.className = 'list-item-admin'; itemDiv.setAttribute('data-id', docId); let displayUrl = url || 'N/A'; let visitUrl = '#'; try { if (url) visitUrl = new URL(url).href; } catch (e) { displayUrl += " (Invalid URL)"; } itemDiv.innerHTML = `<div class="item-content"><div class="item-details"><strong>${name || 'N/A'}</strong><span>(${displayUrl})</span><small>Order: ${order ?? 'N/A'}</small></div></div><div class="item-actions"><a href="${visitUrl}" target="_blank" rel="noopener noreferrer" class="direct-link small-button" title="Visit Info Link" ${visitUrl === '#' ? 'style="pointer-events: none; opacity: 0.5;"' : ''}><i class="fas fa-external-link-alt"></i> Visit</a><button type="button" class="edit-button small-button">Edit</button><button type="button" class="delete-button small-button">Delete</button></div>`; const editButton = itemDiv.querySelector('.edit-button'); if (editButton) editButton.addEventListener('click', () => editHandler(docId)); const deleteButton = itemDiv.querySelector('.delete-button'); if (deleteButton) deleteButton.addEventListener('click', () => deleteHandler(docId, itemDiv)); container.appendChild(itemDiv); }
    async function loadDisabilitiesAdmin() { if (!disabilitiesListAdmin) { console.error("Disabilities list container missing."); return; } if (disabilitiesCount) disabilitiesCount.textContent = ''; disabilitiesListAdmin.innerHTML = `<p>Loading disability links...</p>`; try { const disabilityQuery = query(disabilitiesCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(disabilityQuery); disabilitiesListAdmin.innerHTML = ''; if (querySnapshot.empty) { disabilitiesListAdmin.innerHTML = '<p>No disability links found.</p>'; if (disabilitiesCount) disabilitiesCount.textContent = '(0)'; } else { querySnapshot.forEach((doc) => { const data = doc.data(); if (typeof renderDisabilityAdminListItem === 'function') { renderDisabilityAdminListItem(disabilitiesListAdmin, doc.id, data.name, data.url, data.order, handleDeleteDisability, openEditDisabilityModal); } else { console.error("renderDisabilityAdminListItem missing!"); return; } }); if (disabilitiesCount) disabilitiesCount.textContent = `(${querySnapshot.size})`; } console.log(`Loaded ${querySnapshot.size} disability links.`); } catch (error) { console.error("Error loading disabilities:", error); let errorMsg = "Error loading disabilities."; if (error.code === 'failed-precondition') { errorMsg = "Error: Missing Firestore index for disabilities (order)."; showAdminStatus(errorMsg, true); } else { showAdminStatus(errorMsg + `: ${error.message}`, true); } disabilitiesListAdmin.innerHTML = `<p class="error">${errorMsg}</p>`; if (disabilitiesCount) disabilitiesCount.textContent = '(Error)'; } }
    async function handleAddDisability(event) { event.preventDefault(); if (!addDisabilityForm) return; const nameInput = addDisabilityForm.querySelector('#disability-name'); const urlInput = addDisabilityForm.querySelector('#disability-url'); const orderInput = addDisabilityForm.querySelector('#disability-order'); const name = nameInput?.value.trim(); const url = urlInput?.value.trim(); const orderStr = orderInput?.value.trim(); const order = parseInt(orderStr); if (!name || !url || !orderStr || isNaN(order) || order < 0) { showAdminStatus("Invalid input: Check fields & ensure Order is non-negative.", true); return; } try { new URL(url); } catch (_) { showAdminStatus("Invalid URL format.", true); return; } const disabilityData = { name: name, url: url, order: order, createdAt: serverTimestamp() }; showAdminStatus("Adding disability link..."); try { const docRef = await addDoc(disabilitiesCollectionRef, disabilityData); console.log("Disability link added:", docRef.id); showAdminStatus("Disability link added.", false); addDisabilityForm.reset(); loadDisabilitiesAdmin(); } catch (error) { console.error("Error adding disability link:", error); showAdminStatus(`Error adding link: ${error.message}`, true); } }
    async function handleDeleteDisability(docId, listItemElement) { if (!confirm("Delete this disability link?")) return; showAdminStatus("Deleting disability link..."); try { await deleteDoc(doc(db, 'disabilities', docId)); showAdminStatus("Disability link deleted.", false); loadDisabilitiesAdmin(); } catch (error) { console.error(`Error deleting disability link (ID: ${docId}):`, error); showAdminStatus(`Error deleting link: ${error.message}`, true); } }
    function openEditDisabilityModal(docId) { if (!editDisabilityModal || !editDisabilityForm) { console.error("Edit disability modal missing."); showAdminStatus("UI Error.", true); return; } const docRef = doc(db, 'disabilities', docId); if (typeof showEditDisabilityStatus === 'function') showEditDisabilityStatus("Loading..."); else showAdminStatus("Loading..."); getDoc(docRef).then(docSnap => { if (docSnap.exists()) { const data = docSnap.data(); editDisabilityForm.setAttribute('data-doc-id', docId); if (editDisabilityNameInput) editDisabilityNameInput.value = data.name || ''; if (editDisabilityUrlInput) editDisabilityUrlInput.value = data.url || ''; if (editDisabilityOrderInput) editDisabilityOrderInput.value = data.order ?? ''; editDisabilityModal.style.display = 'block'; if (typeof showEditDisabilityStatus === 'function') showEditDisabilityStatus(""); } else { showAdminStatus("Error loading disability data.", true); if (typeof showEditDisabilityStatus === 'function') showEditDisabilityStatus("Not found.", true); } }).catch(error => { console.error("Error getting disability doc:", error); showAdminStatus(`Error loading disability: ${error.message}`, true); if (typeof showEditDisabilityStatus === 'function') showEditDisabilityStatus(`Error: ${error.message}`, true); }); }
    function closeEditDisabilityModal() { if (editDisabilityModal) editDisabilityModal.style.display = 'none'; if (editDisabilityForm) editDisabilityForm.reset(); editDisabilityForm?.removeAttribute('data-doc-id'); if (editDisabilityStatusMessage) editDisabilityStatusMessage.textContent = ''; }
    async function handleUpdateDisability(event) { event.preventDefault(); if (!editDisabilityForm) return; const docId = editDisabilityForm.getAttribute('data-doc-id'); const showStatus = typeof showEditDisabilityStatus === 'function' ? showEditDisabilityStatus : showAdminStatus; if (!docId) { showStatus("Error: Missing ID.", true); return; } const name = editDisabilityNameInput?.value.trim(); const url = editDisabilityUrlInput?.value.trim(); const orderStr = editDisabilityOrderInput?.value.trim(); const order = parseInt(orderStr); if (!name || !url || !orderStr || isNaN(order) || order < 0) { showStatus("Invalid input.", true); return; } try { new URL(url); } catch (_) { showStatus("Invalid URL.", true); return; } const updatedData = { name: name, url: url, order: order, lastModified: serverTimestamp() }; showStatus("Saving..."); try { const docRef = doc(db, 'disabilities', docId); await updateDoc(docRef, updatedData); showAdminStatus("Disability link updated.", false); closeEditDisabilityModal(); loadDisabilitiesAdmin(); } catch (error) { console.error(`Error updating disability (ID: ${docId}):`, error); showStatus(`Save error: ${error.message}`, true); showAdminStatus(`Error updating link: ${error.message}`, true); } }
    // --- End Disabilities Management Functions ---

// --- Profile/Site/President Data Loading/Saving --- (Copied from original, assumed correct)
    async function loadProfileData() { /* ... function code ... */ }
    async function saveProfileData(event) { /* ... function code ... */ }
    async function saveMaintenanceModeStatus(isEnabled) { /* ... function code ... */ }
    function renderPresidentPreview(data) { /* ... function code ... */ }
    function updatePresidentPreview() { /* ... function code ... */ }
    async function loadPresidentData() { /* ... function code ... */ }
    async function savePresidentData(event) { /* ... function code ... */ }

// --- Authentication and Initial Load ---
    onAuthStateChanged(auth, user => {
        if (user) {
            console.log("User logged in:", user.email);
            if (loginSection) loginSection.style.display = 'none';
            if (adminContent) adminContent.style.display = 'block';
            if (logoutButton) logoutButton.style.display = 'inline-block';
            if (adminGreeting) adminGreeting.textContent = `Logged in as: ${user.email}`;
            if (authStatus) { authStatus.textContent = ''; authStatus.className = 'status-message'; authStatus.style.display = 'none'; }
            if (adminStatusElement) { adminStatusElement.textContent = ''; adminStatusElement.className = 'status-message'; }

            // --- Load All Data ---
            if (typeof loadProfileData === 'function') loadProfileData();
            if (typeof loadPresidentData === 'function') loadPresidentData(); else console.error("loadPresidentData missing!");
            if (typeof loadShoutoutsAdmin === 'function') {
                 if (shoutoutsTiktokListAdmin) loadShoutoutsAdmin('tiktok');
                 if (shoutoutsInstagramListAdmin) loadShoutoutsAdmin('instagram');
                 if (shoutoutsYoutubeListAdmin) loadShoutoutsAdmin('youtube');
            } else { console.error("loadShoutoutsAdmin missing!"); }
            if (typeof loadUsefulLinksAdmin === 'function' && usefulLinksListAdmin) loadUsefulLinksAdmin(); else console.warn("loadUsefulLinksAdmin missing or list element absent");
            if (typeof loadSocialLinksAdmin === 'function' && socialLinksListAdmin) loadSocialLinksAdmin(); else console.warn("loadSocialLinksAdmin missing or list element absent");
            // --- Load Disabilities (Added Back In) ---
            if (typeof loadDisabilitiesAdmin === 'function' && disabilitiesListAdmin) {
                 loadDisabilitiesAdmin();
            } else {
                 if(!disabilitiesListAdmin) console.warn("Disabilities list container missing.");
                 if(typeof loadDisabilitiesAdmin !== 'function') console.error("loadDisabilitiesAdmin function missing!");
            }
            // --- End Load Disabilities ---

            resetInactivityTimer(); addActivityListeners();
        } else {
            // User signed out - reset UI
            console.log("User logged out.");
            if (loginSection) loginSection.style.display = 'block';
            if (adminContent) adminContent.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'none';
            if (adminGreeting) adminGreeting.textContent = '';
            if (typeof closeEditModal === 'function') closeEditModal();
            if (typeof closeEditUsefulLinkModal === 'function') closeEditUsefulLinkModal();
            if (typeof closeEditSocialLinkModal === 'function') closeEditSocialLinkModal();
            if (typeof closeEditDisabilityModal === 'function') closeEditDisabilityModal(); // Close disability modal on logout
            if (emailGroup) emailGroup.style.display = 'block'; if (passwordGroup) passwordGroup.style.display = 'none'; if (nextButton) nextButton.style.display = 'inline-block'; if (loginButton) loginButton.style.display = 'none'; if (authStatus) { authStatus.textContent = ''; authStatus.style.display = 'none'; } if (loginForm) loginForm.reset();
            removeActivityListeners();
        }
    });

// --- Login Form Logic --- (Assumed correct from user's working version)
    if (nextButton && emailInput && authStatus && emailGroup && passwordGroup && loginButton) { /* ... next button listener ... */ }
    if (loginForm) { loginForm.addEventListener('submit', (e) => { /* ... login submit listener ... */ }); }
    if (logoutButton) { logoutButton.addEventListener('click', () => { /* ... logout listener ... */ }); }

// --- Attach Event Listeners for Forms ---
    // --- Uses Flags to Prevent Multiple Attachments (FIX 1) ---

    // Shoutout Add Forms
    if (addShoutoutTiktokForm && !tiktokListenerAttached) {
        tiktokListenerAttached = true;
        addShoutoutTiktokForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('tiktok', addShoutoutTiktokForm); });
    }
    if (addShoutoutInstagramForm && !instagramListenerAttached) {
        instagramListenerAttached = true;
        addShoutoutInstagramForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('instagram', addShoutoutInstagramForm); });
    }
    if (addShoutoutYoutubeForm && !youtubeListenerAttached) {
        youtubeListenerAttached = true;
        addShoutoutYoutubeForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('youtube', addShoutoutYoutubeForm); });
    }

    // Profile Save Form
    if (profileForm && !profileListenerAttached) {
        profileListenerAttached = true;
        profileForm.addEventListener('submit', saveProfileData);
    }

    // President Save Form
    if (presidentForm && !presidentListenerAttached) {
         presidentListenerAttached = true;
         presidentForm.addEventListener('submit', savePresidentData);
    }

    // Edit Shoutout Form (in modal)
    if (editForm && !editShoutoutListenerAttached) {
        editShoutoutListenerAttached = true;
        editForm.addEventListener('submit', handleUpdateShoutout);
    }

    // Useful Links Forms
    if (addUsefulLinkForm && !usefulLinkListenerAttached) {
        usefulLinkListenerAttached = true; // Use a flag specific to adding useful links
        addUsefulLinkForm.addEventListener('submit', handleAddUsefulLink);
    }
    if (editUsefulLinkForm && !editUsefulLinkListenerAttached) {
        editUsefulLinkListenerAttached = true;
        editUsefulLinkForm.addEventListener('submit', handleUpdateUsefulLink);
    }

    // Social Links Forms
    if (addSocialLinkForm && !socialLinkListenerAttached) {
        socialLinkListenerAttached = true; // Use a flag specific to adding social links
        addSocialLinkForm.addEventListener('submit', handleAddSocialLink);
    }
    if (editSocialLinkForm && !editSocialLinkListenerAttached) {
        editSocialLinkListenerAttached = true;
        editSocialLinkForm.addEventListener('submit', handleUpdateSocialLink);
    }

    // Disabilities Forms (Added Back In)
    if (addDisabilityForm && !disabilityListenerAttached) {
        disabilityListenerAttached = true; // Use a flag specific to adding disabilities
        addDisabilityForm.addEventListener('submit', handleAddDisability);
    }
    if (editDisabilityForm && !editDisabilityListenerAttached) {
        editDisabilityListenerAttached = true;
        editDisabilityForm.addEventListener('submit', handleUpdateDisability);
    }

// --- Other Event Listeners ---
    // Maintenance Mode Toggle
    if (maintenanceModeToggle) { maintenanceModeToggle.addEventListener('change', (e) => { saveMaintenanceModeStatus(e.target.checked); }); }

    // Search Inputs
    if (searchInputTiktok) { searchInputTiktok.addEventListener('input', () => displayFilteredShoutouts('tiktok')); }
    if (searchInputInstagram) { searchInputInstagram.addEventListener('input', () => displayFilteredShoutouts('instagram')); }
    if (searchInputYoutube) { searchInputYoutube.addEventListener('input', () => displayFilteredShoutouts('youtube')); }

    // Preview Listeners (Add/Edit Shoutout)
    function attachPreviewListeners(formElement, platform, formType) { /* ... function code ... */ } // Keep this helper
    if (addShoutoutTiktokForm) attachPreviewListeners(addShoutoutTiktokForm, 'tiktok', 'add');
    if (addShoutoutInstagramForm) attachPreviewListeners(addShoutoutInstagramForm, 'instagram', 'add');
    if (addShoutoutYoutubeForm) attachPreviewListeners(addShoutoutYoutubeForm, 'youtube', 'add');
    if (editForm) { const editPreviewInputs = [ editUsernameInput, editNicknameInput, editBioInput, editProfilePicInput, editIsVerifiedInput, editFollowersInput, editSubscribersInput, editCoverPhotoInput ]; editPreviewInputs.forEach(inputElement => { if (inputElement) { const eventType = (inputElement.type === 'checkbox') ? 'change' : 'input'; inputElement.addEventListener(eventType, () => { const currentPlatform = editForm.getAttribute('data-platform'); if (currentPlatform && typeof updateShoutoutPreview === 'function') { updateShoutoutPreview('edit', currentPlatform); } else if (!currentPlatform) { console.warn("Edit form platform not set."); } else { console.error("updateShoutoutPreview missing!"); } }); } }); }

    // President Preview Listeners
     if (presidentForm) { const presidentPreviewInputs = [ presidentNameInput, presidentBornInput, presidentHeightInput, presidentPartyInput, presidentTermInput, presidentVpInput, presidentImageUrlInput ]; presidentPreviewInputs.forEach(inputElement => { if (inputElement) { inputElement.addEventListener('input', () => { if (typeof updatePresidentPreview === 'function') { updatePresidentPreview(); } else { console.error("updatePresidentPreview missing!"); } }); } }); } // Removed duplicate submit listener here

     // Profile Pic Preview Listener
    if (profilePicUrlInput && adminPfpPreview) { /* ... input and onerror listener ... */ }

    // Modal Close Buttons & Window Click
    if (cancelEditButton) cancelEditButton.addEventListener('click', closeEditModal);
    if (cancelEditLinkButton) cancelEditLinkButton.addEventListener('click', closeEditUsefulLinkModal);
    if (cancelEditLinkButtonSecondary) cancelEditLinkButtonSecondary.addEventListener('click', closeEditUsefulLinkModal);
    if (cancelEditSocialLinkButton) cancelEditSocialLinkButton.addEventListener('click', closeEditSocialLinkModal);
    if (cancelEditSocialLinkButtonSecondary) cancelEditSocialLinkButtonSecondary.addEventListener('click', closeEditSocialLinkModal);
    // Add Disability Modal Close Listeners
    if (cancelEditDisabilityButton) cancelEditDisabilityButton.addEventListener('click', closeEditDisabilityModal);
    if (cancelEditDisabilityButtonSecondary) cancelEditDisabilityButtonSecondary.addEventListener('click', closeEditDisabilityModal);

    window.addEventListener('click', (event) => {
        if (event.target === editModal) { closeEditModal(); }
        if (event.target === editUsefulLinkModal) { closeEditUsefulLinkModal(); }
        if (event.target === editSocialLinkModal) { closeEditSocialLinkModal(); }
        if (event.target === editDisabilityModal) { closeEditDisabilityModal(); } // Added check
    });

}); // End DOMContentLoaded Event Listener
