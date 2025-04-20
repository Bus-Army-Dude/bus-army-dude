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
let allActivityLogEntries = []; // Global variable for client-side filtering
let allTechItems = []; // For Tech section
let allFaqs = [];

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

    // Reference for Faq Info
    const faqsCollectionRef = collection(db, "faqs");

    // Firestore Reference for Disabilities
    const disabilitiesCollectionRef = collection(db, "disabilities");

    // Firestore Reference for Tech
    const techItemsCollectionRef = collection(db, "tech_items"); // Tech collection ref

    // --- Inactivity Logout Variables ---
    let inactivityTimer; //
    let expirationTime; //
    let displayIntervalId; //
    const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll']; //

    let isAddingShoutout = false; // Flag to prevent double submissions

    // --- Activity Log Listeners ---
    const refreshLogBtn = document.getElementById('refresh-log-button');
    if (refreshLogBtn) {
        refreshLogBtn.addEventListener('click', loadActivityLog); // Refresh reloads all
    }

    const searchLogInput = document.getElementById('search-activity-log');
    if (searchLogInput) {
        // Use 'input' to filter as the user types
        searchLogInput.addEventListener('input', displayFilteredActivityLog);
    }

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

    // FAQ Management Elements
    const addFaqForm = document.getElementById('add-faq-form');
    const faqListAdmin = document.getElementById('faq-list-admin');
    const faqCount = document.getElementById('faq-count');
    const searchFaqInput = document.getElementById('search-faq');
    const editFaqModal = document.getElementById('edit-faq-modal');
    const editFaqForm = document.getElementById('edit-faq-form');
    const cancelEditFaqButton = document.getElementById('cancel-edit-faq-button');
    const cancelEditFaqButtonSecondary = document.getElementById('cancel-edit-faq-button-secondary');
    const editFaqStatusMessage = document.getElementById('edit-faq-status-message');
    const editFaqQuestionInput = document.getElementById('edit-faq-question'); // Specific input refs
    const editFaqAnswerInput = document.getElementById('edit-faq-answer');
    const editFaqOrderInput = document.getElementById('edit-faq-order');

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
    const hideTikTokSectionToggle = document.getElementById('hide-tiktok-section-toggle'); //
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

    // Tech Management Elements
    const addTechItemForm = document.getElementById('add-tech-item-form'); // Declared
    const techItemsListAdmin = document.getElementById('tech-items-list-admin');
    const techItemsCount = document.getElementById('tech-items-count');
    const searchTechItemsInput = document.getElementById('search-tech-items');
    const editTechItemModal = document.getElementById('edit-tech-item-modal');
    const editTechItemForm = document.getElementById('edit-tech-item-form');
    const cancelEditTechButton = document.getElementById('cancel-edit-tech-button');
    const cancelEditTechButtonSecondary = document.getElementById('cancel-edit-tech-button-secondary');
    const editTechStatusMessage = document.getElementById('edit-tech-status-message');
    const addTechItemPreview = document.getElementById('add-tech-item-preview');
    const editTechItemPreview = document.getElementById('edit-tech-item-preview');

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

    // Add Shoutout Forms using the helper
    addSubmitListenerOnce(addShoutoutTiktokForm, () => handleAddShoutout('tiktok', addShoutoutTiktokForm));
    addSubmitListenerOnce(addShoutoutInstagramForm, () => handleAddShoutout('instagram', addShoutoutInstagramForm));
    addSubmitListenerOnce(addShoutoutYoutubeForm, () => handleAddShoutout('youtube', addShoutoutYoutubeForm));


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

    // Helper to safely add submit listener only once
    function addSubmitListenerOnce(formElement, handler) {
      if (!formElement) {
        console.warn("Attempted to add listener to non-existent form:", formElement);
        return;
      }
      // Use a unique property name to avoid potential conflicts
      const listenerAttachedFlag = '__busArmyDudeAdminSubmitListenerAttached__';

      // Get the existing handler reference if it was stored, otherwise create it
      let submitHandlerWrapper = formElement[listenerAttachedFlag + '_handler'];

      if (!submitHandlerWrapper) {
          submitHandlerWrapper = (e) => {
              e.preventDefault(); // Prevent default submission
              console.log(`DEBUG: Submit event triggered for ${formElement.id}`);
              handler();          // Call the original handler logic
          };
          // Store the handler reference on the element
          formElement[listenerAttachedFlag + '_handler'] = submitHandlerWrapper;
          console.log(`DEBUG: Created submit handler wrapper for ${formElement.id}`);
      }

      // --- Logic to add/skip ---
      if (!formElement[listenerAttachedFlag]) { // Check if the flag is NOT set
        formElement.addEventListener('submit', submitHandlerWrapper);
        formElement[listenerAttachedFlag] = true; // Mark listener as attached by setting the flag
        console.log(`DEBUG: Added submit listener to ${formElement.id}`);
      } else {
         console.log(`DEBUG: Submit listener flag already set for ${formElement.id}, skipping addEventListener.`);
      }
    }
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

    async function handleClearActivityLog() {
    // *** STRONG CONFIRMATION ***
    if (!confirm("ARE YOU ABSOLUTELY SURE you want to delete ALL activity log entries?\n\nThis action cannot be undone!")) {
        return; // Stop if user cancels
    }
    // Second confirmation for extra safety
    if (!confirm("SECOND CONFIRMATION: Really delete everything in the log?")) {
        return;
    }

    const clearButton = document.getElementById('clear-log-button'); // Get button for disabling
    if (clearButton) clearButton.disabled = true; // Disable button during operation
    showAdminStatus("Clearing activity log... This may take a moment.", false);

    try {
        const activityLogCollectionRef = collection(db, "activity_log");
        // Fetch all document IDs (or full docs - getDocs is simpler here for client-side loop)
        // WARNING: Inefficient for very large collections! Consider Cloud Function instead.
        const querySnapshot = await getDocs(activityLogCollectionRef);

        if (querySnapshot.empty) {
             showAdminStatus("Activity log is already empty.", false);
             if (clearButton) clearButton.disabled = false;
             loadActivityLog(); // Refresh display
             return;
        }

        // Create an array of delete promises
        const deletePromises = [];
        querySnapshot.forEach((doc) => {
            deletePromises.push(deleteDoc(doc.ref));
        });

        // Wait for all delete operations to complete
        await Promise.all(deletePromises);

        console.log(`Successfully deleted ${deletePromises.length} log entries.`);
        showAdminStatus("Activity log cleared successfully.", false);
        logAdminActivity('ACTIVITY_LOG_CLEARED', { count: deletePromises.length }); // Log the clear action itself

    } catch (error) {
        console.error("Error clearing activity log:", error);
        showAdminStatus(`Error clearing activity log: ${error.message}`, true);
    } finally {
         if (clearButton) clearButton.disabled = false; // Re-enable button
         loadActivityLog(); // Refresh the displayed log (should be empty)
    }
}

    // ==================================
// == ACTIVITY LOG IMPLEMENTATION ===
// ==================================

let allActivityLogEntries = []; // Global variable for client-side filtering

/**
 * Logs an admin activity to the 'activity_log' Firestore collection.
 * @param {string} actionType - A code representing the action (e.g., 'UPDATE_PROFILE').
 * @param {object} details - An object containing relevant details about the action.
 */
async function logAdminActivity(actionType, details = {}) {
    // Ensure Firestore functions are imported at the top of admin.js
    // Ensure 'auth', 'db', 'collection', 'addDoc', 'serverTimestamp' are available
    if (!auth.currentUser) {
        console.warn("Cannot log activity: No user logged in.");
        return;
    }

    const logEntry = {
        timestamp: serverTimestamp(),
        adminEmail: auth.currentUser.email || 'Unknown Email',
        adminUid: auth.currentUser.uid,
        actionType: actionType,
        details: details
    };

    try {
        // *** Make sure 'activityLogCollectionRef' is defined globally or get it here ***
        const activityLogCollectionRef = collection(db, "activity_log"); // Define reference here if not global
        await addDoc(activityLogCollectionRef, logEntry);
        console.log(`Activity logged: ${actionType}`, details);
    } catch (error) {
        console.error("Error writing to activity log:", error);
        // Optionally use showAdminStatus("Warning: Could not write to activity log.", true);
    }
}

/**
 * Renders a single log entry into an HTML element with improved structure.
 * @param {object} logData - The data object for one log entry.
 * @returns {HTMLDivElement} - The div element representing the log entry.
 */
function renderLogEntry(logData) {
    const logEntryDiv = document.createElement('div');
    logEntryDiv.className = 'log-entry'; // Main container class

    const timestampStr = logData.timestamp?.toDate?.().toLocaleString() ?? 'No timestamp';
    const adminIdentifier = logData.adminEmail || logData.adminUid || 'Unknown Admin';
    const actionType = logData.actionType || 'UNKNOWN_ACTION';

    // Build HTML for details section more carefully
    let detailsHtmlContent = '';
    if (logData.details && typeof logData.details === 'object' && Object.keys(logData.details).length > 0) {
        for (const key in logData.details) {
            if (Object.hasOwnProperty.call(logData.details, key)) {
                let value = logData.details[key];
                let valueStr = '';
                // Check if it's our specific 'changes' object format
                if (typeof value === 'object' && value !== null && value.hasOwnProperty('to')) {
                     // valueStr = `set to: ${JSON.stringify(value.to)}`;
                     // Make it slightly more readable for simple values
                     const toValue = value.to;
                     if (typeof toValue === 'string' || typeof toValue === 'number' || typeof toValue === 'boolean') {
                        valueStr = `set to: "${String(toValue)}"`;
                     } else {
                        valueStr = `set to: ${JSON.stringify(toValue)}`; // Fallback for complex objects/arrays
                     }
                } else {
                     valueStr = JSON.stringify(value); // Fallback for other details structures
                }

                // Basic sanitization to prevent HTML injection
                const safeKey = key.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                const safeValueStr = valueStr.replace(/</g, "&lt;").replace(/>/g, "&gt;");

                detailsHtmlContent += `<div class="detail-item"><strong>${safeKey}:</strong> ${safeValueStr}</div>`;
            }
        }
    } else if (logData.details != null) { // Handle non-object details
         detailsHtmlContent = `<div class="detail-item">${String(logData.details).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
    }

    // Assemble the final entry structure
    logEntryDiv.innerHTML = `
        <div class="log-meta"><small>${timestampStr} - ${adminIdentifier}</small></div>
        <div class="log-action"><strong>Action:</strong> <span>${actionType}</span></div>
        ${detailsHtmlContent ? `<div class="log-details"><small class="details-label">Details:</small><div class="details-content">${detailsHtmlContent}</div></div>` : ''}
    `; // Use divs for structure

    return logEntryDiv;
}

/**
 * Filters the globally stored log entries and renders them to the list container.
 */
function displayFilteredActivityLog() {
    // Get elements needed - ensure they exist in your DOM references or get them here
    const logListContainer = document.getElementById('activity-log-list');
    const searchInput = document.getElementById('search-activity-log');
    const logCountElement = document.getElementById('activity-log-count');

    // Add checks for elements existence at the beginning
    if (!logListContainer || !searchInput || !logCountElement) {
        console.error("Log display/search elements missing in displayFilteredActivityLog.");
        if(logListContainer) logListContainer.innerHTML = "<p class='error'>Log display elements missing.</p>";
        return;
    }

    const searchTerm = searchInput.value.trim().toLowerCase();
    logListContainer.innerHTML = ''; // Clear previous entries

    const filteredLogs = allActivityLogEntries.filter(log => {
        if (!searchTerm) return true; // Show all if search is empty

        const timestampStr = log.timestamp?.toDate?.().toLocaleString()?.toLowerCase() ?? '';
        const email = (log.adminEmail || '').toLowerCase();
        const action = (log.actionType || '').toLowerCase();
        const details = JSON.stringify(log.details || {}).toLowerCase();

        return email.includes(searchTerm) ||
               action.includes(searchTerm) ||
               details.includes(searchTerm) ||
               timestampStr.includes(searchTerm);
    });

    if (filteredLogs.length === 0) {
        logListContainer.innerHTML = searchTerm ? `<p>No log entries found matching "${searchTerm}".</p>` : '<p>No activity log entries found.</p>';
    } else {
        filteredLogs.forEach(logData => {
             // Check if renderLogEntry exists before calling
            if (typeof renderLogEntry === 'function') {
                 const entryElement = renderLogEntry(logData);
                 logListContainer.appendChild(entryElement);
            } else {
                 console.error("renderLogEntry function is missing!");
                 logListContainer.innerHTML = '<p class="error">Error rendering log entries.</p>';
                 return false; // Stop loop if renderer is missing
             }
        });
    }
    logCountElement.textContent = `(${filteredLogs.length})`;
}

/**
 * Fetches recent activity logs from Firestore, stores them globally, and triggers display.
 */
async function loadActivityLog() {
    // Get elements needed - ensure they exist in your DOM references or get them here
    const logListContainer = document.getElementById('activity-log-list');
    const logCountElement = document.getElementById('activity-log-count');
    const searchInput = document.getElementById('search-activity-log');

    // Add checks for elements existence at the beginning
    if (!logListContainer || !logCountElement || !searchInput) {
         console.error("Required elements for loadActivityLog are missing.");
         if(logListContainer) logListContainer.innerHTML = '<p class="error">Error: Log display elements missing.</p>';
         return;
    }
    searchInput.value = ''; // Reset search on load
    logListContainer.innerHTML = '<p>Loading activity log...</p>';
    logCountElement.textContent = '(...)';
    allActivityLogEntries = []; // Clear global store

    try {
        // Ensure Firestore functions are imported (collection, query, orderBy, limit, getDocs)
        const activityLogCollectionRef = collection(db, "activity_log"); // Define or ensure global reference
        const logQuery = query(activityLogCollectionRef, orderBy("timestamp", "desc"), limit(50)); // Load recent 50
        const querySnapshot = await getDocs(logQuery);

        querySnapshot.forEach(doc => {
            allActivityLogEntries.push({ id: doc.id, ...doc.data() });
        });

        console.log(`Loaded ${allActivityLogEntries.length} log entries.`);
        displayFilteredActivityLog(); // Display the fetched logs

    } catch (error) {
        console.error("Error loading activity log:", error);
        logListContainer.innerHTML = `<p class="error">Error loading activity log: ${error.message}</p>`;
        logCountElement.textContent = '(Error)';
        // Use showAdminStatus if available and desired
        if (typeof showAdminStatus === 'function') {
             showAdminStatus(`Failed to load activity log: ${error.message}`, true);
        }
    }
}

// ========================================
// == END ACTIVITY LOG IMPLEMENTATION =====
// ========================================

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
            console.log(`DEBUG: displayFilteredShoutouts clearing list for ${platform} at ${new Date().toLocaleTimeString()}`); // <-- ADD THIS LINE
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

// --- MODIFIED: Function to Load Profile Data into Admin Form (Includes Maintenance Mode AND Hide TikTok Toggle) ---
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
        // Also check if toggles exist before trying to use them
        if (!maintenanceModeToggle) { //
            console.warn("Maintenance mode toggle element not found."); //
        }
        // <<< ADD THIS CHECK >>>
        if (!hideTikTokSectionToggle) {
            console.warn("Hide TikTok section toggle element not found.");
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

                // <<< START: Load Hide TikTok Toggle State >>>
                if (hideTikTokSectionToggle) {
                    hideTikTokSectionToggle.checked = data.hideTikTokSection || false; // Default to false if missing
                    hideTikTokSectionToggle.disabled = false; // Ensure enabled
                }
                // <<< END: Load Hide TikTok Toggle State >>>


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
                 // <<< START: Default Hide TikTok Toggle State >>>
                if (hideTikTokSectionToggle) {
                    hideTikTokSectionToggle.checked = false; // Default to false if doc missing
                    hideTikTokSectionToggle.disabled = false; // Ensure enabled
                }
                 // <<< END: Default Hide TikTok Toggle State >>>

                if(adminPfpPreview) adminPfpPreview.style.display = 'none'; // Hide preview
            }
        } catch (error) { //
            console.error("Error loading profile data:", error); //
            showProfileStatus("Error loading profile data.", true); //
            // Set defaults and disable toggles on error
            if (profileForm) profileForm.reset(); //
            if (profileStatusInput) profileStatusInput.value = 'offline'; //
            if(maintenanceModeToggle) { //
                maintenanceModeToggle.checked = false; //
                maintenanceModeToggle.disabled = true; // Disable toggle on error
            }
             // <<< START: Disable Hide TikTok Toggle on Error >>>
            if (hideTikTokSectionToggle) {
                hideTikTokSectionToggle.checked = false;
                hideTikTokSectionToggle.disabled = true; // Disable toggle on error
            }
             // <<< END: Disable Hide TikTok Toggle on Error >>>

            if(adminPfpPreview) adminPfpPreview.style.display = 'none'; //
        }
    }


    // --- Function to Save Profile Data (with Logging) ---
    async function saveProfileData(event) {
        event.preventDefault();
        if (!auth || !auth.currentUser) { showProfileStatus("Error: Not logged in.", true); return; }
        if (!profileForm) return;
        console.log("Attempting to save profile data..."); // Debug log

        const newData = {
            username: profileUsernameInput?.value.trim() || "",
            profilePicUrl: profilePicUrlInput?.value.trim() || "",
            bio: profileBioInput?.value.trim() || "",
            status: profileStatusInput?.value || "offline",
        };

        showProfileStatus("Saving profile...");
        try {
            await setDoc(profileDocRef, { ...newData, lastUpdated: serverTimestamp() }, { merge: true });
            console.log("Profile data save successful:", profileDocRef.path);
            showProfileStatus("Profile updated successfully!", false);

            // *** Log Activity ***
            if (typeof logAdminActivity === 'function') {
                 logAdminActivity('UPDATE_PROFILE', { fieldsUpdated: Object.keys(newData) });
            } else { console.error("logAdminActivity function not found!");}

            // Update preview image
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

// *** NEW FUNCTION TO SAVE Hide TikTok Section Status ***
    async function saveHideTikTokSectionStatus(isEnabled) {
        // Ensure user is logged in
        if (!auth || !auth.currentUser) {
            showAdminStatus("Error: Not logged in. Cannot save settings.", true); // Use main admin status
            // Revert checkbox state visually if save fails due to auth issue
            if(hideTikTokSectionToggle) hideTikTokSectionToggle.checked = !isEnabled;
            return;
        }

        // Use the specific status message area for settings, fallback to main admin status
        const statusElement = settingsStatusMessage || adminStatusElement; //

        // Show saving message
        if (statusElement) {
            statusElement.textContent = "Saving setting...";
            statusElement.className = "status-message"; // Reset style
            statusElement.style.display = 'block';
        }

        try {
            // Use profileDocRef (site_config/mainProfile) to store the flag
            // Use setDoc with merge: true to update only this field without overwriting others
            await setDoc(profileDocRef, {
                hideTikTokSection: isEnabled // Save the boolean value (true/false)
            }, { merge: true });

            console.log("Hide TikTok Section status saved:", isEnabled);

            // Show success message using the dedicated settings status element or fallback
            const message = `TikTok homepage section set to ${isEnabled ? 'hidden' : 'visible'}.`;
             if (statusElement === settingsStatusMessage && settingsStatusMessage) { // Check if we are using the specific element
                 showSettingsStatus(message, false); // Uses the settings-specific display/clear logic
             } else { // Fallback if specific element wasn't found initially
                 showAdminStatus(message, false);
             }

            // Log the activity
            if (typeof logAdminActivity === 'function') {
                 logAdminActivity('UPDATE_SITE_SETTINGS', { setting: 'hideTikTokSection', value: isEnabled });
             } else { console.warn("logAdminActivity function not found!"); }


        } catch (error) {
            console.error("Error saving Hide TikTok Section status:", error);
            // Show error message in the specific status area or fallback
            if (statusElement === settingsStatusMessage && settingsStatusMessage) {
                showSettingsStatus(`Error saving setting: ${error.message}`, true);
            } else {
                showAdminStatus(`Error saving Hide TikTok setting: ${error.message}`, true);
            }
            // Revert checkbox state visually on error
             if(hideTikTokSectionToggle) hideTikTokSectionToggle.checked = !isEnabled;
        }
    }
    // *** END NEW FUNCTION ***

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
        // Note: The StateChanged listener will handle hiding admin content
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
onAuthStateChanged(auth, user => {
    if (user) {
        // User is signed in
        console.log("User logged in:", user.email, "Name:", user.displayName); // Log name too
        if (loginSection) loginSection.style.display = 'none'; // Hide login form
        if (adminContent) adminContent.style.display = 'block'; // Show admin content
        if (logoutButton) logoutButton.style.display = 'inline-block'; // Show logout button

        // --- Updated Greeting Logic ---
        const displayName = user.displayName; // Get the display name from the User object
        const email = user.email;       // Get the email
        let greetingText = ''; // Initialize empty greeting string
        if (displayName) {
            greetingText = `Logged in as: ${displayName}`;
            if (email) {
                greetingText += ` (${email})`;
            }
        } else if (email) {
            greetingText = `Logged in as: ${email}`;
        } else {
            greetingText = `Logged in`;
        }
        if (adminGreeting) {
            adminGreeting.textContent = greetingText; // Set the text of the greeting element
        }
        // --- End Updated Greeting Logic ---


        // ****** Log the login event FIRST ******
        // This initiates the write to Firestore
        if (typeof logAdminActivity === 'function') {
            logAdminActivity('ADMIN_LOGIN', { email: user.email, uid: user.uid });
            // Note: We don't strictly NEED to await this for the fix,
            // as loadActivityLog is called later.
        } else {
            // This error indicates a problem with the core log function setup
            console.error("logAdminActivity function not found! Cannot log login event.");
        }

        // *** Load Tech Items (with extra logging) ***
        console.log("DEBUG: AuthState - Checking if loadTechItemsAdmin should run..."); // <<< ADD LOG
        if (typeof loadTechItemsAdmin === 'function' && techItemsListAdmin) {
            console.log("DEBUG: AuthState - Calling loadTechItemsAdmin NOW."); // <<< ADD LOG
            loadTechItemsAdmin();
            console.log("DEBUG: AuthState - loadTechItemsAdmin call finished (or is async)."); // <<< ADD LOG
        } else {
            // Log specific reasons if check fails
            if (typeof loadTechItemsAdmin !== 'function') {
                 console.error("DEBUG: AuthState - Cannot load Tech Items: loadTechItemsAdmin function MISSING!");
            }
             if (!techItemsListAdmin) {
                 console.error("DEBUG: AuthState - Cannot load Tech Items: techItemsListAdmin element MISSING!");
            }
             console.error("Could not load Tech Items - function or list element missing.");
            if(techItemsListAdmin) techItemsListAdmin.innerHTML = "<p class='error'>Failed to load tech item controller.</p>";
        }

         // *** Load FAQs <<< ADD THIS CALL >>> ***
        if (typeof loadFaqsAdmin === 'function' && faqListAdmin) {
             loadFaqsAdmin();
        } else {
             console.error("Could not load FAQs - function or list element missing.");
              if(faqListAdmin) faqListAdmin.innerHTML = "<p class='error'>Failed to load FAQ controller.</p>";
         }

        // --- FAQ Management Listeners --- <<< ADD THIS BLOCK START >>> ---
        if (addFaqForm) {
            addFaqForm.addEventListener('submit', handleAddFaq);
        }
        if (editFaqForm) {
            editFaqForm.addEventListener('submit', handleUpdateFaq);
        }
        if (cancelEditFaqButton) { // X close button
            cancelEditFaqButton.addEventListener('click', closeEditFaqModal);
        }
        if (cancelEditFaqButtonSecondary) { // Secondary cancel button
            cancelEditFaqButtonSecondary.addEventListener('click', closeEditFaqModal);
        }
        if (searchFaqInput) { // Search input for FAQs
            searchFaqInput.addEventListener('input', displayFilteredFaqs);
        }
        // <<< ADD THIS BLOCK END >>> ---


        // Clear any previous login status messages
        if (authStatus) { authStatus.textContent = ''; authStatus.className = 'status-message'; authStatus.style.display = 'none'; }
        if (adminStatusElement) { adminStatusElement.textContent = ''; adminStatusElement.className = 'status-message'; }

        // Load initial data for the admin panel SECTIONS (Profile, Shoutouts, Links, etc.)
        loadProfileData(); // Load site profile data (includes maintenance mode state now)
        // Load shoutout lists for each platform
        if (typeof loadShoutoutsAdmin === 'function') {
            if (shoutoutsTiktokListAdmin) loadShoutoutsAdmin('tiktok');
            if (shoutoutsInstagramListAdmin) loadShoutoutsAdmin('instagram');
            if (shoutoutsYoutubeListAdmin) loadShoutoutsAdmin('youtube');
        } else {
            console.error("loadShoutoutsAdmin function is not defined!");
            showAdminStatus("Error: Cannot load shoutout data.", true);
        }
        // *** Call loadUsefulLinksAdmin ***
        if (typeof loadUsefulLinksAdmin === 'function' && usefulLinksListAdmin) {
            loadUsefulLinksAdmin();
        }
        // *** Call loadSocialLinksAdmin ***
        if (typeof loadSocialLinksAdmin === 'function' && socialLinksListAdmin) {
             loadSocialLinksAdmin();
        }
        // *** Load Disabilities ***
        if (typeof loadDisabilitiesAdmin === 'function' && disabilitiesListAdmin) {
            loadDisabilitiesAdmin(); // <<< **** ENSURE THIS LINE IS PRESENT AND CORRECT ****
        } else {
            if(!disabilitiesListAdmin) console.warn("Disabilities list container missing during initial load.");
            if(typeof loadDisabilitiesAdmin !== 'function') console.error("loadDisabilitiesAdmin function missing during initial load!");
        }
        // *** Load President Data ***
        if (typeof loadPresidentData === 'function') {
            loadPresidentData(); // Load president data on login
        } else {
            console.error("loadPresidentData function is missing!");
            showAdminStatus("Error: Cannot load president data.", true);
        }

        // ****** Load the Activity Log LAST ******
        // Calling this after the other loads gives the ADMIN_LOGIN entry's
        // serverTimestamp a better chance to be resolved by Firestore.
        if (typeof loadActivityLog === 'function') {
            loadActivityLog();
        } else {
             console.error("loadActivityLog function is missing!");
             showAdminStatus("Error: Cannot load activity log.", true);
        }
        // --- End Load Activity Log ---


        // Start the inactivity timer now that the user is logged in
        resetInactivityTimer();
        addActivityListeners();

    } else {
        // User is signed out
        // (Keep the rest of your logout code here)
        console.log("User logged out.");
        if (loginSection) loginSection.style.display = 'block'; // Show login form
        if (adminContent) adminContent.style.display = 'none'; // Hide admin content
        if (logoutButton) logoutButton.style.display = 'none'; // Hide logout button
        if (adminGreeting) adminGreeting.textContent = ''; // Clear greeting
        if (typeof closeEditModal === 'function') closeEditModal(); // Close edit modal if open
        if (typeof closeEditUsefulLinkModal === 'function') closeEditUsefulLinkModal(); // Close useful link modal
        if (typeof closeEditSocialLinkModal === 'function') closeEditSocialLinkModal(); // Close social link modal
        if (typeof closeEditDisabilityModal === 'function') closeEditDisabilityModal(); // Close disability modal
        if (typeof closeEditFaqModal === 'function') closeEditFaqModal(); // <<< ADD THIS LINE

        // Reset the login form to its initial state (email input visible)
        if (emailGroup) emailGroup.style.display = 'block';
        if (passwordGroup) passwordGroup.style.display = 'none';
        if (nextButton) nextButton.style.display = 'inline-block'; // Or 'block'
        if (loginButton) loginButton.style.display = 'none';
        if (authStatus) { authStatus.textContent = ''; authStatus.style.display = 'none'; } // Clear status message
        if (loginForm) loginForm.reset(); // Clear email/password inputs

        // Stop inactivity timer and remove listeners
        removeActivityListeners();
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
        console.log(`DEBUG: loadShoutoutsAdmin called for ${platform} at ${new Date().toLocaleTimeString()}`); // <-- ADD THIS LINE


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

async function handleAddShoutout(platform, formElement) {
    console.log(`DEBUG: handleAddShoutout triggered for ${platform}.`);

    if (isAddingShoutout) {
        console.warn(`DEBUG: handleAddShoutout already running for ${platform}, ignoring duplicate call.`);
        return;
    }
    isAddingShoutout = true;
    console.log(`DEBUG: Set isAddingShoutout = true for ${platform}`);

    if (!formElement) {
        console.error("Form element not provided to handleAddShoutout");
        isAddingShoutout = false;
        return;
    }

    // Get form values (ensure all relevant fields are captured)
    const username = formElement.querySelector(`#${platform}-username`)?.value.trim();
    const nickname = formElement.querySelector(`#${platform}-nickname`)?.value.trim();
    const orderStr = formElement.querySelector(`#${platform}-order`)?.value.trim();
    const order = parseInt(orderStr);
    const isVerified = formElement.querySelector(`#${platform}-isVerified`)?.checked || false;
    const bio = formElement.querySelector(`#${platform}-bio`)?.value.trim() || null;
    const profilePic = formElement.querySelector(`#${platform}-profilePic`)?.value.trim() || null;
    let followers = 'N/A';
    let subscribers = 'N/A';
    let coverPhoto = null;
    if (platform === 'youtube') {
        subscribers = formElement.querySelector(`#${platform}-subscribers`)?.value.trim() || 'N/A';
        coverPhoto = formElement.querySelector(`#${platform}-coverPhoto`)?.value.trim() || null;
    } else {
        followers = formElement.querySelector(`#${platform}-followers`)?.value.trim() || 'N/A';
    }


    // Basic validation
    if (!username || !nickname || !orderStr || isNaN(order) || order < 0) {
        showAdminStatus(`Invalid input for ${platform}. Check required fields and ensure Order is a non-negative number.`, true);
        isAddingShoutout = false; // Reset flag
        return;
    }

    // Duplicate Check Logic
    try {
        const shoutoutsCol = collection(db, 'shoutouts');
        const duplicateCheckQuery = query(shoutoutsCol, where("platform", "==", platform), where("username", "==", username), limit(1));
        const querySnapshot = await getDocs(duplicateCheckQuery);

        if (!querySnapshot.empty) {
            console.warn("Duplicate found for", platform, username);
            showAdminStatus(`Error: A shoutout for username '@${username}' on platform '${platform}' already exists.`, true);
            isAddingShoutout = false; // Reset flag
            return;
        }
        console.log("No duplicate found. Proceeding to add.");

        // Prepare data
        const accountData = {
            platform: platform, username: username, nickname: nickname, order: order,
            isVerified: isVerified, bio: bio, profilePic: profilePic,
            createdAt: serverTimestamp(), isEnabled: true // Default to enabled
        };
        if (platform === 'youtube') {
            accountData.subscribers = subscribers;
            accountData.coverPhoto = coverPhoto;
        } else {
            accountData.followers = followers;
        }

        // Add document
        console.log(`DEBUG: Attempting addDoc for ${username}...`);
        const docRef = await addDoc(collection(db, 'shoutouts'), accountData);
        console.log(`DEBUG: addDoc SUCCESS for ${username}. New ID: ${docRef.id}`);

        // *** Log Activity *** <--- ADDED LOGGING HERE
        if (typeof logAdminActivity === 'function') {
            logAdminActivity('SHOUTOUT_ADD', {
                platform: platform,
                username: username,
                nickname: nickname,
                id: docRef.id
             });
        } else { console.warn("logAdminActivity function not found!"); }
        // ******************

        await updateMetadataTimestamp(platform); // Update timestamp
        showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout added successfully.`, false);
        formElement.reset();

        // Reset preview area
        const previewArea = formElement.querySelector(`#add-${platform}-preview`);
        if (previewArea) { previewArea.innerHTML = '<p><small>Preview will appear here as you type.</small></p>'; }

        if (typeof loadShoutoutsAdmin === 'function') {
            loadShoutoutsAdmin(platform); // Reload list
        } else { console.error("loadShoutoutsAdmin function missing after add!"); }

    } catch (error) {
        console.error(`Error during handleAddShoutout for ${platform}:`, error);
        showAdminStatus(`Error adding ${platform} shoutout: ${error.message}`, true);
        // Optionally log failure here too if desired
         if (typeof logAdminActivity === 'function') {
             logAdminActivity('SHOUTOUT_ADD_FAILED', { platform: platform, username: username, error: error.message });
         }
    } finally {
        setTimeout(() => {
            isAddingShoutout = false;
            console.log(`DEBUG: Reset isAddingShoutout = false for ${platform}`);
        }, 1500);
        console.log(`DEBUG: handleAddShoutout processing END for ${platform} at ${new Date().toLocaleTimeString()}`);
    }
}

    // --- Function to Handle Updates from Edit Modal (with DETAILED Logging) ---
    async function handleUpdateShoutout(event) {
        event.preventDefault();
        if (!editForm) return;
        const docId = editForm.getAttribute('data-doc-id');
        const platform = editForm.getAttribute('data-platform');
        if (!docId || !platform) { showAdminStatus("Error: Missing doc ID or platform for update.", true); return; }
        console.log(`Attempting to update shoutout (detailed log): ${platform} - ${docId}`);

        // 1. Get NEW data from form
        const username = editUsernameInput?.value.trim();
        const nickname = editNicknameInput?.value.trim();
        const orderStr = editOrderInput?.value.trim();
        const order = parseInt(orderStr);

        if (!username || !nickname || !orderStr || isNaN(order) || order < 0) {
             showAdminStatus(`Update Error: Invalid input...`, true); return;
        }

        const newDataFromForm = {
            username: username,
            nickname: nickname,
            order: order,
            isVerified: editIsVerifiedInput?.checked || false,
            bio: editBioInput?.value.trim() || null,
            profilePic: editProfilePicInput?.value.trim() || null,
        };
        if (platform === 'youtube') {
            newDataFromForm.subscribers = editSubscribersInput?.value.trim() || 'N/A';
            newDataFromForm.coverPhoto = editCoverPhotoInput?.value.trim() || null;
        } else {
            newDataFromForm.followers = editFollowersInput?.value.trim() || 'N/A';
        }

        showAdminStatus("Updating shoutout...");
        const docRef = doc(db, 'shoutouts', docId); // Define docRef once

        try {
            // 2. Get OLD data BEFORE saving
            let oldData = {};
            const oldDataSnap = await getDoc(docRef);
            if (oldDataSnap.exists()) {
                oldData = oldDataSnap.data();
                 console.log("DEBUG: Fetched old shoutout data:", oldData);
            } else {
                console.warn("Old shoutout data not found for comparison - this shouldn't happen on an update.");
            }

            // 3. Save NEW data
            await updateDoc(docRef, { ...newDataFromForm, lastModified: serverTimestamp() });
            console.log("Shoutout update successful:", docId);
            await updateMetadataTimestamp(platform);
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout updated successfully.`, false);

            // 4. Compare and find changes
            const changes = {};
            let hasChanges = false;
            for (const key in newDataFromForm) {
                // Special check for null/empty string equivalence if needed, otherwise direct compare
                if (oldData[key] !== newDataFromForm[key]) {
                    // Handle null/undefined vs empty string if necessary, e.g.:
                    // if ((oldData[key] ?? "") !== (newDataFromForm[key] ?? "")) {
                    changes[key] = { to: newDataFromForm[key] }; // Log only the new value for simplicity
                    hasChanges = true;
                }
            }

            // 5. Log ONLY actual changes
            if (hasChanges) {
                 console.log("DEBUG: Detected shoutout changes:", changes);
                 if (typeof logAdminActivity === 'function') {
                     logAdminActivity('SHOUTOUT_UPDATE', { id: docId, platform: platform, username: username, changes: changes });
                 } else { console.error("logAdminActivity function not found!");}
            } else {
                 console.log("DEBUG: Shoutout update saved, but no values actually changed.");
            }

            if (typeof closeEditModal === 'function') closeEditModal();
            if (typeof loadShoutoutsAdmin === 'function') loadShoutoutsAdmin(platform);

        } catch (error) {
            console.error(`Error updating ${platform} shoutout (ID: ${docId}):`, error);
            showAdminStatus(`Error updating ${platform} shoutout: ${error.message}`, true);
        }
    }


   // --- MODIFIED: Function to Handle Deleting a Shoutout (with Logging) ---
    async function handleDeleteShoutout(docId, platform, listItemElement) {
        // Confirm deletion with the user
        if (!confirm(`Are you sure you want to permanently delete this ${platform} shoutout? This cannot be undone.`)) {
            return; // Do nothing if user cancels
        }

        showAdminStatus("Deleting shoutout..."); // Feedback
        const docRef = doc(db, 'shoutouts', docId); // Define docRef once for fetching and deleting

        try {
            // *** Step 1: Fetch the data BEFORE deleting (for logging details) ***
            let detailsToLog = { platform: platform, id: docId, username: 'N/A', nickname: 'N/A' }; // Default info
            try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    detailsToLog.username = data.username || 'N/A'; // Get username if available
                    detailsToLog.nickname = data.nickname || 'N/A'; // Get nickname if available
                    console.log(`Preparing to delete shoutout: ${detailsToLog.nickname} (@${detailsToLog.username})`);
                } else {
                    // Document might already be gone? Log what we know.
                    console.warn(`Document ${docId} not found before deletion, logging ID and platform only.`);
                }
            } catch (fetchError) {
                 console.error(`Error fetching shoutout ${docId} data before deletion:`, fetchError);
                 // Continue with deletion attempt, log will have less detail
            }
            // *** End Fetch Data ***

            // *** Step 2: Delete the document from Firestore ***
            await deleteDoc(docRef);
            await updateMetadataTimestamp(platform); // Update site timestamp
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout deleted successfully.`, false);

            // *** Step 3: Log the Deletion Activity AFTER successful deletion ***
            if (typeof logAdminActivity === 'function') {
                logAdminActivity('SHOUTOUT_DELETE', detailsToLog); // Log the details gathered before deletion
            } else {
                console.error("logAdminActivity function not found! Cannot log deletion.");
            }
            // *** End Log Activity ***


            // Step 4: Reload the list to update UI and internal 'allShoutouts' array.
            if (typeof loadShoutoutsAdmin === 'function') {
                loadShoutoutsAdmin(platform);
            }

        } catch (error) {
            console.error(`Error deleting ${platform} shoutout (ID: ${docId}):`, error);
            showAdminStatus(`Error deleting ${platform} shoutout: ${error.message}`, true);

            // *** Optionally log the FAILED delete attempt ***
             if (typeof logAdminActivity === 'function') {
                 // Log failure with details gathered before attempting delete (if fetch worked)
                 logAdminActivity('SHOUTOUT_DELETE_FAILED', { ...detailsToLog, error: error.message });
             }
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

// --- Function to Handle Updating a Useful Link (with DETAILED Logging) ---
    async function handleUpdateUsefulLink(event) {
        event.preventDefault();
        if (!editUsefulLinkForm) return;
        const docId = editUsefulLinkForm.getAttribute('data-doc-id');
        if (!docId) { showEditLinkStatus("Error: Missing document ID...", true); return; }
        console.log("Attempting to update useful link (detailed log):", docId);

        // 1. Get NEW data from form
        const label = editLinkLabelInput?.value.trim();
        const url = editLinkUrlInput?.value.trim();
        const orderStr = editLinkOrderInput?.value.trim();
        const order = parseInt(orderStr);

        if (!label || !url || !orderStr || isNaN(order) || order < 0) { showEditLinkStatus("Invalid input...", true); return; }
        try { new URL(url); } catch (_) { showEditLinkStatus("Invalid URL format.", true); return; }

        const newDataFromForm = { label: label, url: url, order: order };

        showEditLinkStatus("Saving changes...");
        const docRef = doc(db, 'useful_links', docId); // Define once

        try {
            // 2. Get OLD data BEFORE saving
            let oldData = {};
            const oldDataSnap = await getDoc(docRef);
            if (oldDataSnap.exists()) { oldData = oldDataSnap.data(); }

            // 3. Save NEW data
            await updateDoc(docRef, { ...newDataFromForm, lastModified: serverTimestamp() });
            console.log("Useful link update successful:", docId);

            // 4. Compare and find changes
            const changes = {};
            let hasChanges = false;
            for (const key in newDataFromForm) {
                if (oldData[key] !== newDataFromForm[key]) {
                    changes[key] = { to: newDataFromForm[key] };
                    hasChanges = true;
                }
            }

            // 5. Log ONLY actual changes
            if (hasChanges) {
                 console.log("DEBUG: Detected useful link changes:", changes);
                 if (typeof logAdminActivity === 'function') {
                    logAdminActivity('USEFUL_LINK_UPDATE', { id: docId, label: label, changes: changes });
                 } else { console.error("logAdminActivity function not found!");}
            } else {
                 console.log("DEBUG: Useful link update saved, but no values changed.");
            }

            showAdminStatus("Useful link updated successfully.", false);
            closeEditUsefulLinkModal();
            loadUsefulLinksAdmin();

        } catch (error) {
            console.error(`Error updating useful link (ID: ${docId}):`, error);
            showEditLinkStatus(`Error saving: ${error.message}`, true);
            showAdminStatus(`Error updating useful link: ${error.message}`, true);
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

   // --- Function to Handle Updating a Social Link (with DETAILED Logging) ---
    async function handleUpdateSocialLink(event) {
        event.preventDefault();
        if (!editSocialLinkForm) return;
        const docId = editSocialLinkForm.getAttribute('data-doc-id');
        if (!docId) { showEditSocialLinkStatus("Error: Missing document ID...", true); return; }
        console.log("Attempting to update social link (detailed log):", docId);

        // 1. Get NEW data from form
        const label = editSocialLinkLabelInput?.value.trim();
        const url = editSocialLinkUrlInput?.value.trim();
        const orderStr = editSocialLinkOrderInput?.value.trim();
        const order = parseInt(orderStr);

        if (!label || !url || !orderStr || isNaN(order) || order < 0) { showEditSocialLinkStatus("Invalid input...", true); return; }
        try { new URL(url); } catch (_) { showEditSocialLinkStatus("Invalid URL format.", true); return; }

        const newDataFromForm = { label: label, url: url, order: order };
        showEditSocialLinkStatus("Saving changes...");
        const docRef = doc(db, 'social_links', docId); // Define once

        try {
            // 2. Get OLD data BEFORE saving
            let oldData = {};
            const oldDataSnap = await getDoc(docRef);
            if (oldDataSnap.exists()) { oldData = oldDataSnap.data(); }

            // 3. Save NEW data
            await updateDoc(docRef, { ...newDataFromForm, lastModified: serverTimestamp() });
            console.log("Social link update successful:", docId);

            // 4. Compare and find changes
            const changes = {};
            let hasChanges = false;
            for (const key in newDataFromForm) {
                if (oldData[key] !== newDataFromForm[key]) {
                    changes[key] = { to: newDataFromForm[key] };
                    hasChanges = true;
                }
            }

            // 5. Log ONLY actual changes
            if (hasChanges) {
                 console.log("DEBUG: Detected social link changes:", changes);
                 if (typeof logAdminActivity === 'function') {
                     logAdminActivity('SOCIAL_LINK_UPDATE', { id: docId, label: label, changes: changes });
                 } else { console.error("logAdminActivity function not found!");}
            } else {
                 console.log("DEBUG: Social link update saved, but no values changed.");
            }

            showAdminStatus("Social link updated successfully.", false);
            closeEditSocialLinkModal();
            loadSocialLinksAdmin();
        } catch (error) {
            console.error(`Error updating social link (ID: ${docId}):`, error);
            showEditSocialLinkStatus(`Error saving: ${error.message}`, true);
            showAdminStatus(`Error updating social link: ${error.message}`, true);
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

    // Maintenance Mode Toggle Listener (with defensive removal)
if (maintenanceModeToggle) {
    console.log("DEBUG: Preparing maintenance mode listener for:", maintenanceModeToggle);

    // Define the handler function separately so we can refer to it
    const handleMaintenanceToggle = (e) => {
        // console.log(`DEBUG: Maintenance 'change' event fired! Checked: ${e.target.checked}`); // You can remove this debug line later
        saveMaintenanceModeStatus(e.target.checked);
    };

    // Remove any potentially existing listener first to prevent duplicates
    maintenanceModeToggle.removeEventListener('change', handleMaintenanceToggle);

    // Add the listener using the named handler function
    maintenanceModeToggle.addEventListener('change', handleMaintenanceToggle);
    console.log("DEBUG: Added/Re-added maintenance mode listener."); // You can remove this debug line later

} else {
    console.log("DEBUG: Maintenance toggle element not found.");
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

   // --- Function to Save President Data (with DETAILED Logging) ---
    async function savePresidentData(event) {
        event.preventDefault();
        if (!auth || !auth.currentUser) { showPresidentStatus("Error: Not logged in.", true); return; }
        if (!presidentForm) return;
        console.log("Attempting to save president data (detailed log version)...");

        // 1. Get NEW data from form
        const newDataFromForm = {
            name: presidentNameInput?.value.trim() || "",
            born: presidentBornInput?.value.trim() || "",
            height: presidentHeightInput?.value.trim() || "",
            party: presidentPartyInput?.value.trim() || "",
            term: presidentTermInput?.value.trim() || "",
            vp: presidentVpInput?.value.trim() || "",
            imageUrl: presidentImageUrlInput?.value.trim() || "",
        };

        showPresidentStatus("Saving president info...");
        try {
            // 2. Get OLD data BEFORE saving
            let oldData = {};
            const oldDataSnap = await getDoc(presidentDocRef);
            if (oldDataSnap.exists()) {
                oldData = oldDataSnap.data();
                 console.log("DEBUG: Fetched old president data for comparison:", oldData);
            }

            // 3. Save NEW data
            await setDoc(presidentDocRef, { ...newDataFromForm, lastModified: serverTimestamp() }, { merge: true });
            console.log("President data save successful:", presidentDocRef.path);
            showPresidentStatus("President info updated successfully!", false);

            // 4. Compare old and new
            const changes = {};
            let hasChanges = false;
            for (const key in newDataFromForm) {
                if (oldData[key] !== newDataFromForm[key]) {
                    changes[key] = { to: newDataFromForm[key] };
                    hasChanges = true;
                }
            }

            // 5. Log ONLY actual changes
            if (hasChanges) {
                 console.log("DEBUG: Detected president info changes:", changes);
                 if (typeof logAdminActivity === 'function') {
                     logAdminActivity('UPDATE_PRESIDENT_INFO', { name: newDataFromForm.name, changes: changes });
                 } else { console.error("logAdminActivity function not found!");}
            } else {
                 console.log("DEBUG: President info save submitted, but no values changed.");
            }

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

    async function loadActivityLog() {
    // Ensure necessary DOM elements are defined earlier or get them here
    const logListContainer = document.getElementById('activity-log-list');
    const logCountElement = document.getElementById('activity-log-count');
    const searchInput = document.getElementById('search-activity-log');

    if (!logListContainer || !logCountElement || !searchInput) {
        console.error("Required elements for loadActivityLog are missing.");
        return;
    }

    // Reset search input visually when refreshing
    searchInput.value = '';

    logListContainer.innerHTML = '<p>Loading activity log...</p>';
    logCountElement.textContent = '(...)'; // Indicate loading count
    allActivityLogEntries = []; // Clear global store before fetching

    try {
        // Ensure Firestore functions (collection, query, orderBy, limit, getDocs) are imported
        const logCollectionRef = collection(db, "activity_log");
        const logQuery = query(logCollectionRef, orderBy("timestamp", "desc"), limit(50)); // Load recent 50
        const querySnapshot = await getDocs(logQuery);

        querySnapshot.forEach(doc => {
            allActivityLogEntries.push({ id: doc.id, ...doc.data() });
        });

        console.log(`Loaded ${allActivityLogEntries.length} log entries.`);
        // Call the display function initially (which will show all since search is cleared)
        displayFilteredActivityLog();

    } catch (error) {
        console.error("Error loading activity log:", error);
        logListContainer.innerHTML = '<p class="error">Error loading activity log.</p>';
        logCountElement.textContent = '(Error)';
        // Use showAdminStatus if available and desired
        if (typeof showAdminStatus === 'function') {
             showAdminStatus("Failed to load activity log.", true);
        }
    }
}   

function displayFilteredActivityLog() {
    // Ensure necessary DOM elements are defined earlier or get them here
    const logListContainer = document.getElementById('activity-log-list');
    const searchInput = document.getElementById('search-activity-log');
    const logCountElement = document.getElementById('activity-log-count');

    if (!logListContainer || !searchInput || !logCountElement) {
        console.error("Log display/search elements missing in displayFilteredActivityLog.");
        return;
    }

    const searchTerm = searchInput.value.trim().toLowerCase();
    logListContainer.innerHTML = ''; // Clear previous entries

    const filteredLogs = allActivityLogEntries.filter(log => {
        if (!searchTerm) return true; // Show all if search is empty

        const timestampStr = log.timestamp?.toDate?.().toLocaleString()?.toLowerCase() ?? '';
        const email = (log.adminEmail || '').toLowerCase();
        const action = (log.actionType || '').toLowerCase();
        const details = JSON.stringify(log.details || {}).toLowerCase(); // Search within stringified details

        return email.includes(searchTerm) ||
               action.includes(searchTerm) ||
               details.includes(searchTerm) ||
               timestampStr.includes(searchTerm);
    });

    if (filteredLogs.length === 0) {
        if (searchTerm) {
            logListContainer.innerHTML = `<p>No log entries found matching "${searchTerm}".</p>`;
        } else {
            logListContainer.innerHTML = '<p>No activity log entries found.</p>';
        }
    } else {
        filteredLogs.forEach(logData => {
            if (typeof renderLogEntry === 'function') {
                const entryElement = renderLogEntry(logData);
                logListContainer.appendChild(entryElement);
            } else {
                 console.error("renderLogEntry function is missing!");
                 logListContainer.innerHTML = '<p class="error">Error rendering log entries.</p>';
                 // Break the loop if rendering fails
                 return false;
            }
        });
    }

    // Update count
    logCountElement.textContent = `(${filteredLogs.length})`;
}

    // ========================================
    // == Tech Item Management Functions V2 ===
    // ========================================
    // (Add ALL the Tech functions here: renderTechItemAdminListItem, displayFilteredTechItems, loadTechItemsAdmin,
    //  handleAddTechItem, handleDeleteTechItem, openEditTechItemModal, closeEditTechItemModal, handleUpdateTechItem,
    //  renderTechItemPreview, updateTechItemPreview, attachTechPreviewListeners)

    /** Renders a single tech item in the admin list view */
    function renderTechItemAdminListItem(container, docId, itemData, deleteHandler, editHandler) {
        // ... (function code from previous response) ...
         if (!container) { console.warn("Tech list container missing for render"); return; }
         const itemDiv = document.createElement('div');
         itemDiv.className = 'list-item-admin';
         itemDiv.setAttribute('data-id', docId);
         itemDiv.innerHTML = `
             <div class="item-content">
                 <div class="item-details">
                     <strong>${itemData.name || 'N/A'}</strong>
                     <span>(${itemData.model || 'N/A'})</span>
                     <small>Order: ${itemData.order ?? 'N/A'} | OS: ${itemData.osVersion || '?'}</small>
                 </div>
             </div>
             <div class="item-actions">
                 <button type="button" class="edit-button small-button">Edit</button>
                 <button type="button" class="delete-button small-button">Delete</button>
             </div>`;
         const editButton = itemDiv.querySelector('.edit-button');
         if (editButton) editButton.addEventListener('click', () => editHandler(docId));
         const deleteButton = itemDiv.querySelector('.delete-button');
         if (deleteButton) deleteButton.addEventListener('click', () => deleteHandler(docId, itemDiv));
         container.appendChild(itemDiv);
    }

     /** Filters and displays tech items in the admin list based on search */
    function displayFilteredTechItems() {
        // ... (function code from previous response) ...
         if (!techItemsListAdmin || !searchTechItemsInput || typeof allTechItems === 'undefined') {
             console.error("Tech Items Filter Error: Missing elements/data.");
             if(techItemsListAdmin) techItemsListAdmin.innerHTML = `<p class="error">Error displaying tech list.</p>`;
             return;
         }
         const searchTerm = searchTechItemsInput.value.trim().toLowerCase();
         techItemsListAdmin.innerHTML = ''; // Clear list
         const filteredList = allTechItems.filter(item => {
             if (!searchTerm) return true;
             const name = (item.name || '').toLowerCase();
             const model = (item.model || '').toLowerCase();
             return name.includes(searchTerm) || model.includes(searchTerm);
         });
         if (filteredList.length > 0) {
             filteredList.forEach(item => {
                 renderTechItemAdminListItem(techItemsListAdmin, item.id, item, handleDeleteTechItem, openEditTechItemModal);
             });
         } else {
              techItemsListAdmin.innerHTML = searchTerm ? `<p>No tech items found matching "${searchTerm}".</p>` : '<p>No tech items added yet.</p>';
         }
         if (techItemsCount) { techItemsCount.textContent = `(${filteredList.length})`; }
    }

    /** Loads all tech items from Firestore, stores them globally, and triggers display */
    async function loadTechItemsAdmin() {
        // ... (function code from previous response) ...
         if (!techItemsListAdmin) { console.error("Tech items list container element missing."); return; }
         console.log("Loading tech items for admin...");
         if (techItemsCount) techItemsCount.textContent = '(...)'; // Indicate loading count
         techItemsListAdmin.innerHTML = `<p>Loading tech items...</p>`; // Loading message
         allTechItems = []; // Clear global array before fetching
         try {
             const techQuery = query(techItemsCollectionRef, orderBy("order", "asc")); // Order by display order
             const querySnapshot = await getDocs(techQuery);
             querySnapshot.forEach((doc) => {
                 allTechItems.push({ id: doc.id, ...doc.data() }); // Store ID with data
             });
             console.log(`Loaded ${allTechItems.length} tech items.`);
             displayFilteredTechItems(); // Initial display
         } catch (error) {
             console.error("Error loading tech items:", error);
              let errorMsg = "Error loading tech items.";
              if (error.code === 'failed-precondition') {
                  errorMsg = "Error: Missing Firestore index for tech items (order). Check console (F12) for link to create it.";
                  showAdminStatus(errorMsg, true);
              } else {
                  showAdminStatus(errorMsg + `: ${error.message}`, true);
              }
             techItemsListAdmin.innerHTML = `<p class="error">${errorMsg}</p>`;
             if (techItemsCount) techItemsCount.textContent = '(Error)';
         }
    }

    /** Handles adding a new tech item via the form */
    async function handleAddTechItem(event) {
        // ... (function code from previous response, INCLUDING activity log) ...
        event.preventDefault();
        if (!addTechItemForm) { console.error("Add tech form not found"); return; }
        const techData = {};
        const inputs = addTechItemForm.querySelectorAll('input[name], select[name], textarea[name]');
        let isValid = true;
        inputs.forEach(input => {
             const name = input.name; let value = input.value.trim();
             if (input.type === 'number') { value = input.value === '' ? null : parseFloat(input.value); if (input.value !== '' && isNaN(value)) { value = null; if (input.name === 'order' || input.name === 'batteryHealth' || input.name === 'batteryCycles') { showAdminStatus(`Invalid number entered for ${name}.`, true); isValid = false; } } else if (value !== null && value < 0 && (input.name === 'order' || input.name === 'batteryHealth' || input.name === 'batteryCycles')) { showAdminStatus(`${name} cannot be negative.`, true); isValid = false; } }
             techData[name] = value === '' ? null : value;
         });
         if (!techData.name || techData.order === null || techData.order < 0 || isNaN(techData.order)) { showAdminStatus("Device Name and a valid non-negative Order are required.", true); isValid = false; }
         if (!isValid) return;
         techData.createdAt = serverTimestamp();
         showAdminStatus("Adding tech item...");
         try {
             const docRef = await addDoc(techItemsCollectionRef, techData);
             console.log("Tech item added with ID:", docRef.id);
              if (typeof logAdminActivity === 'function') { logAdminActivity('TECH_ITEM_ADD', { name: techData.name, id: docRef.id }); } else { console.warn("logAdminActivity function not found!"); }
             showAdminStatus("Tech item added successfully.", false);
             addTechItemForm.reset();
             if (addTechItemPreview) { addTechItemPreview.innerHTML = '<p><small>Preview will appear here as you type.</small></p>'; }
             loadTechItemsAdmin();
         } catch (error) { console.error("Error adding tech item:", error); showAdminStatus(`Error adding tech item: ${error.message}`, true); }
    }

     /** Handles deleting a specified tech item */
    async function handleDeleteTechItem(docId, listItemElement) {
        // ... (function code from previous response, INCLUDING activity log) ...
        if (!confirm("Are you sure you want to permanently delete this tech item? This action cannot be undone.")) return;
         showAdminStatus("Deleting tech item...");
         let itemNameToLog = 'Unknown Item';
         try {
              const itemSnap = await getDoc(doc(db, 'tech_items', docId));
              if (itemSnap.exists()) itemNameToLog = itemSnap.data().name || 'Unknown Item';
             await deleteDoc(doc(db, 'tech_items', docId));
              if (typeof logAdminActivity === 'function') { logAdminActivity('TECH_ITEM_DELETE', { name: itemNameToLog, id: docId }); } else { console.warn("logAdminActivity function not found!"); }
             showAdminStatus("Tech item deleted successfully.", false);
             loadTechItemsAdmin();
         } catch (error) {
             console.error(`Error deleting tech item (ID: ${docId}):`, error);
              if (typeof logAdminActivity === 'function') { logAdminActivity('TECH_ITEM_DELETE_FAILED', { name: itemNameToLog, id: docId, error: error.message }); }
             showAdminStatus(`Error deleting tech item: ${error.message}`, true);
         }
    }

    /** Opens the Edit Tech Item modal and populates it with data */
    async function openEditTechItemModal(docId) {
        // ... (function code from previous response, INCLUDING triggering preview/listener attach) ...
         if (!editTechItemModal || !editTechItemForm) { console.error("Edit tech item modal elements not found."); showAdminStatus("UI Error: Cannot open edit form.", true); return; }
         showEditTechItemStatus("Loading item data...");
         if(editTechItemPreview) editTechItemPreview.innerHTML = '<p><small>Loading preview...</small></p>';
         try {
             const docRef = doc(db, 'tech_items', docId); const docSnap = await getDoc(docRef);
             if (docSnap.exists()) {
                 const data = docSnap.data(); editTechItemForm.setAttribute('data-doc-id', docId);
                 const inputs = editTechItemForm.querySelectorAll('input[name], select[name], textarea[name]');
                 inputs.forEach(input => { const name = input.name; if (data.hasOwnProperty(name)) { input.value = data[name] ?? ''; } else { input.value = ''; } });
                 editTechItemModal.style.display = 'block'; showEditTechItemStatus("");
                 updateTechItemPreview('edit'); attachTechPreviewListeners(editTechItemForm, 'edit');
             } else { showAdminStatus("Error: Could not load tech item data for editing (not found).", true); showEditTechItemStatus("Error: Item not found.", true); if(editTechItemPreview) editTechItemPreview.innerHTML = '<p class="error"><small>Item not found.</small></p>'; }
         } catch (error) { console.error("Error getting tech item document for edit:", error); showAdminStatus(`Error loading tech item data: ${error.message}`, true); showEditTechItemStatus(`Error: ${error.message}`, true); if(editTechItemPreview) editTechItemPreview.innerHTML = `<p class="error"><small>Error loading preview: ${error.message}</small></p>`; }
    }

     /** Closes the Edit Tech Item modal */
    function closeEditTechItemModal() {
        // ... (function code from previous response, INCLUDING resetting preview) ...
         if (editTechItemModal) editTechItemModal.style.display = 'none'; if (editTechItemForm) editTechItemForm.reset(); editTechItemForm?.removeAttribute('data-doc-id'); if (editTechStatusMessage) editTechStatusMessage.textContent = ''; if (editTechItemPreview) { editTechItemPreview.innerHTML = '<p><small>Preview will load when modal opens.</small></p>'; }
    }

     /** Handles updating a tech item from the edit modal */
    async function handleUpdateTechItem(event) {
        // ... (function code from previous response, INCLUDING activity log) ...
         event.preventDefault(); if (!editTechItemForm) {console.error("Edit tech form not found"); return;} const docId = editTechItemForm.getAttribute('data-doc-id'); if (!docId) { showEditTechItemStatus("Error: Missing document ID. Cannot save.", true); return; }
         const updatedData = {}; const inputs = editTechItemForm.querySelectorAll('input[name], select[name], textarea[name]'); let isValid = true; let techNameForLog = '';
          inputs.forEach(input => { const name = input.name; let value = input.value.trim(); if (input.type === 'number') { value = input.value === '' ? null : parseFloat(input.value); if (input.value !== '' && isNaN(value)) { value = null; if (input.name === 'order' || input.name === 'batteryHealth' || input.name === 'batteryCycles') { showEditTechItemStatus(`Invalid number entered for ${name}.`, true); isValid = false; } } else if (value !== null && value < 0 && (input.name === 'order' || input.name === 'batteryHealth' || input.name === 'batteryCycles')) { showEditTechItemStatus(`${name} cannot be negative.`, true); isValid = false; } } updatedData[name] = value === '' ? null : value; if (name === 'name') techNameForLog = value; });
          if (!updatedData.name || updatedData.order === null || updatedData.order < 0 || isNaN(updatedData.order)) { showEditTechItemStatus("Device Name and a valid non-negative Order are required.", true); isValid = false; } if (!isValid) return;
         updatedData.lastModified = serverTimestamp();
         showEditTechItemStatus("Saving changes...");
         try {
              const docRef = doc(db, 'tech_items', docId); let oldData = {}; const oldDataSnap = await getDoc(docRef); if (oldDataSnap.exists()) oldData = oldDataSnap.data();
             await updateDoc(docRef, updatedData);
              const changes = {}; let hasChanges = false;
              for (const key in updatedData) { if (key !== 'lastModified' && oldData[key] !== updatedData[key]) { changes[key] = { from: oldData[key] ?? null, to: updatedData[key] }; hasChanges = true; } }
              if (hasChanges && typeof logAdminActivity === 'function') { logAdminActivity('TECH_ITEM_UPDATE', { name: techNameForLog, id: docId, changes: changes }); } else if (hasChanges) { console.warn("logAdminActivity function not found!"); } else { console.log("Tech item updated, but no data fields changed value."); }
             showAdminStatus("Tech item updated successfully.", false); closeEditTechItemModal(); loadTechItemsAdmin();
         } catch (error) { console.error(`Error updating tech item (ID: ${docId}):`, error); showEditTechItemStatus(`Error saving: ${error.message}`, true); if (typeof logAdminActivity === 'function') { logAdminActivity('TECH_ITEM_UPDATE_FAILED', { name: techNameForLog, id: docId, error: error.message }); } }
    }

    // --- Tech Preview Rendering Functions ---
     /** Generates HTML for the tech item preview based on data object */
     function renderTechItemPreview(data) {
        // ... (function code from previous response) ...
         const name = data.name || 'Device Name'; const model = data.model || ''; const iconClass = data.iconClass || 'fas fa-question-circle'; const material = data.material || ''; const storage = data.storage || ''; const batteryCapacity = data.batteryCapacity || ''; const color = data.color || ''; const price = data.price ? `$${data.price}` : ''; const dateReleased = data.dateReleased || ''; const dateBought = data.dateBought || ''; const osVersion = data.osVersion || ''; const batteryHealth = data.batteryHealth !== null && !isNaN(data.batteryHealth) ? parseInt(data.batteryHealth, 10) : null; const batteryCycles = data.batteryCycles !== null && !isNaN(data.batteryCycles) ? data.batteryCycles : null; let batteryHtml = ''; if (batteryHealth !== null) { let batteryClass = ''; if (batteryHealth <= 20) batteryClass = 'critical'; else if (batteryHealth <= 50) batteryClass = 'low-power'; batteryHtml = `<div class="tech-detail"><i class="fas fa-heart"></i><span>Battery Health:</span></div><div class="battery-container"><div class="battery-icon ${batteryClass}"><div class="battery-level" style="width: ${batteryHealth}%;"></div><div class="battery-percentage">${batteryHealth}%</div></div></div>`; } let cyclesHtml = ''; if (batteryCycles !== null) { cyclesHtml = `<div class="tech-detail"><i class="fas fa-sync"></i><span>Battery Charge Cycles:</span> ${batteryCycles}</div>`; } return `<div class="tech-item"><h3><i class="${iconClass}"></i> ${name}</h3> ${model ? `<div class="tech-detail"><i class="fas fa-info-circle"></i><span>Model:</span> ${model}</div>` : ''} ${material ? `<div class="tech-detail"><i class="fas fa-layer-group"></i><span>Material:</span> ${material}</div>` : ''} ${storage ? `<div class="tech-detail"><i class="fas fa-hdd"></i><span>Storage:</span> ${storage}</div>` : ''} ${batteryCapacity ? `<div class="tech-detail"><i class="fas fa-battery-full"></i><span>Battery Capacity:</span> ${batteryCapacity}</div>` : ''} ${color ? `<div class="tech-detail"><i class="fas fa-palette"></i><span>Color:</span> ${color}</div>` : ''} ${price ? `<div class="tech-detail"><i class="fas fa-tag"></i><span>Price:</span> ${price}</div>` : ''} ${dateReleased ? `<div class="tech-detail"><i class="fas fa-calendar-plus"></i><span>Date Released:</span> ${dateReleased}</div>` : ''} ${dateBought ? `<div class="tech-detail"><i class="fas fa-shopping-cart"></i><span>Date Bought:</span> ${dateBought}</div>` : ''} ${osVersion ? `<div class="tech-detail"><i class="fab fa-apple"></i><span>OS Version:</span> ${osVersion}</div>` : ''} ${batteryHtml} ${cyclesHtml} </div>`;
     }

     /** Reads form data and updates the corresponding tech preview area */
     function updateTechItemPreview(formType) {
         // ... (function code from previous response) ...
          let formElement; let previewElement; if (formType === 'add') { formElement = addTechItemForm; previewElement = addTechItemPreview; } else if (formType === 'edit') { formElement = editTechItemForm; previewElement = editTechItemPreview; } else { return; } if (!formElement || !previewElement) { return; } const techData = {}; const inputs = formElement.querySelectorAll('input[name], select[name], textarea[name]'); inputs.forEach(input => { const name = input.name; let value = input.value.trim(); if (input.type === 'number') { value = input.value === '' ? null : parseFloat(input.value); if (isNaN(value)) value = null; } techData[name] = value === '' ? null : value; }); try { const previewHTML = renderTechItemPreview(techData); previewElement.innerHTML = previewHTML; } catch (e) { console.error("Error rendering tech preview:", e); previewElement.innerHTML = '<p class="error"><small>Error generating preview.</small></p>'; }
     }

     /** Attaches input/change listeners to tech form inputs to trigger preview updates */
     function attachTechPreviewListeners(formElement, formType) {
         // ... (function code from previous response) ...
          if (!formElement) return; const inputs = formElement.querySelectorAll('input[name], select[name], textarea[name]'); console.log(`Attaching preview listeners to ${inputs.length} inputs for ${formType} tech form.`); inputs.forEach(input => { const eventType = (input.type === 'checkbox' || input.type === 'select-one') ? 'change' : 'input'; const listenerFlag = `__techPreviewListener_${eventType}`; if (!input[listenerFlag]) { input.addEventListener(eventType, () => { updateTechItemPreview(formType); }); input[listenerFlag] = true; } });
     }


    // ==================================
    // == END Tech Item Functions =======
    // ==================================


    // ==================================
// ===== FAQ Management Functions =====
// ==================================

/** Shows status messages inside the FAQ edit modal */
function showEditFaqStatus(message, isError = false) {
    if (!editFaqStatusMessage) { console.warn("Edit FAQ status message element not found"); return; }
    editFaqStatusMessage.textContent = message;
    editFaqStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
    if (!isError) { setTimeout(() => { if (editFaqStatusMessage && editFaqStatusMessage.textContent === message) { editFaqStatusMessage.textContent = ''; editFaqStatusMessage.className = 'status-message'; } }, 3000); }
}

/** Renders a single FAQ item in the admin list */
function renderFaqAdminListItem(container, docId, faqData, deleteHandler, editHandler) {
     if (!container) { console.warn("FAQ list container missing"); return; }
     const itemDiv = document.createElement('div');
     itemDiv.className = 'list-item-admin';
     itemDiv.setAttribute('data-id', docId);
     const shortAnswer = (faqData.answer || '').substring(0, 100); // Snippet
     itemDiv.innerHTML = `
         <div class="item-content">
             <div class="item-details">
                 <strong><span class="math-inline">\{faqData\.question \|\| 'N/A'\}</strong\>
<p style="opacity: 0.8; font-style: italic;">{shortAnswer}${ (faqData.answer || '').length > 100 ? '...' : '' }</p>
<small>Order: ${faqData.order ?? 'N/A'}</small>
</div>
</div>
<div class="item-actions">
<button type="button" class="edit-button small-button">Edit</button>
<button type="button" class="delete-button small-button">Delete</button>
</div>`;
const editButton = itemDiv.querySelector('.edit-button');
if (editButton) editButton.addEventListener('click', () => editHandler(docId));
const deleteButton = itemDiv.querySelector('.delete-button');
if (deleteButton) deleteButton.addEventListener('click', () => deleteHandler(docId, itemDiv));
container.appendChild(itemDiv);
}

/** Filters and displays FAQs based on search */
function displayFilteredFaqs() {
     if (!faqListAdmin || !searchFaqInput || typeof allFaqs === 'undefined') { return; }
     const searchTerm = searchFaqInput.value.trim().toLowerCase();
     faqListAdmin.innerHTML = '';
     const filteredList = allFaqs.filter(faq => {
         if (!searchTerm) return true;
         const question = (faq.question || '').toLowerCase();
         const answer = (faq.answer || '').toLowerCase();
         return question.includes(searchTerm) || answer.includes(searchTerm);
     });
     if (filteredList.length > 0) {
         filteredList.forEach(faq => renderFaqAdminListItem(faqListAdmin, faq.id, faq, handleDeleteFaq, openEditFaqModal));
     } else { faqListAdmin.innerHTML = searchTerm ? `<p>No FAQs found matching "${searchTerm}".</p>` : '<p>No FAQs added yet.</p>'; }
     if (faqCount) { faqCount.textContent = `(${filteredList.length})`; }
}

/** Loads FAQs from Firestore */
async function loadFaqsAdmin() {
     if (!faqListAdmin) { console.error("FAQ list container missing."); return; }
     console.log("Loading FAQs for admin...");
     if (faqCount) faqCount.textContent = '(...)';
     faqListAdmin.innerHTML = `<p>Loading FAQs...</p>`;
     allFaqs = [];
     try {
         const faqQuery = query(faqsCollectionRef, orderBy("order", "asc"));
         const querySnapshot = await getDocs(faqQuery);
         querySnapshot.forEach((doc) => { allFaqs.push({ id: doc.id, ...doc.data() }); });
         console.log(`Loaded ${allFaqs.length} FAQs.`);
         displayFilteredFaqs();
     } catch (error) {
         console.error("Error loading FAQs:", error);
         let errorMsg = "Error loading FAQs."; if (error.code === 'failed-precondition') errorMsg = "Error: Missing Firestore index for FAQs (order). Check console.";
         showAdminStatus(errorMsg, true); faqListAdmin.innerHTML = `<p class="error">${errorMsg}</p>`; if (faqCount) faqCount.textContent = '(Error)';
     }
}

/** Handles adding a new FAQ */
async function handleAddFaq(event) {
     event.preventDefault();
     if (!addFaqForm) return;
     const questionInput = addFaqForm.querySelector('#faq-question');
     const answerInput = addFaqForm.querySelector('#faq-answer');
     const orderInput = addFaqForm.querySelector('#faq-order');
     const question = questionInput?.value.trim();
     const answer = answerInput?.value.trim();
     const orderStr = orderInput?.value.trim();
     const order = parseInt(orderStr);

     if (!question || !answer || !orderStr || isNaN(order) || order < 0) { showAdminStatus("Question, Answer, and a valid non-negative Order are required.", true); return; }
     const faqData = { question, answer, order, createdAt: serverTimestamp() };
     showAdminStatus("Adding FAQ...");
     try {
         const docRef = await addDoc(faqsCollectionRef, faqData);
         console.log("FAQ added with ID:", docRef.id);
         logAdminActivity('FAQ_ADD', { question: question, id: docRef.id });
         showAdminStatus("FAQ added successfully.", false);
         addFaqForm.reset();
         loadFaqsAdmin();
     } catch (error) { console.error("Error adding FAQ:", error); showAdminStatus(`Error adding FAQ: ${error.message}`, true); }
}

/** Handles deleting an FAQ */
async function handleDeleteFaq(docId, listItemElement) {
     if (!confirm("Are you sure you want to permanently delete this FAQ?")) return;
     showAdminStatus("Deleting FAQ...");
     let questionToLog = 'Unknown Question';
     try {
         const faqSnap = await getDoc(doc(db, 'faqs', docId));
         if (faqSnap.exists()) questionToLog = faqSnap.data().question || 'Unknown Question';
         await deleteDoc(doc(db, 'faqs', docId));
         logAdminActivity('FAQ_DELETE', { question: questionToLog, id: docId });
         showAdminStatus("FAQ deleted successfully.", false);
         loadFaqsAdmin();
     } catch (error) {
         console.error(`Error deleting FAQ (ID: ${docId}):`, error);
         logAdminActivity('FAQ_DELETE_FAILED', { question: questionToLog, id: docId, error: error.message });
         showAdminStatus(`Error deleting FAQ: ${error.message}`, true);
     }
}

/** Opens and populates the edit FAQ modal */
async function openEditFaqModal(docId) {
     if (!editFaqModal || !editFaqForm) { console.error("Edit FAQ modal elements missing."); return; }
     showEditFaqStatus("Loading FAQ data...");
     try {
         const docRef = doc(db, 'faqs', docId);
         const docSnap = await getDoc(docRef);
         if (docSnap.exists()) {
             const data = docSnap.data();
             editFaqForm.setAttribute('data-doc-id', docId);
             if(editFaqQuestionInput) editFaqQuestionInput.value = data.question || '';
             if(editFaqAnswerInput) editFaqAnswerInput.value = data.answer || '';
             if(editFaqOrderInput) editFaqOrderInput.value = data.order ?? '';
             editFaqModal.style.display = 'block';
             showEditFaqStatus("");
         } else { showAdminStatus("Error loading FAQ data (not found).", true); showEditFaqStatus("Error: FAQ not found.", true); }
     } catch (error) { console.error("Error getting FAQ doc for edit:", error); showAdminStatus(`Error loading FAQ: ${error.message}`, true); showEditFaqStatus(`Error: ${error.message}`, true); }
}

/** Closes the edit FAQ modal */
function closeEditFaqModal() {
     if (editFaqModal) editFaqModal.style.display = 'none';
     if (editFaqForm) editFaqForm.reset();
     editFaqForm?.removeAttribute('data-doc-id');
     if (editFaqStatusMessage) editFaqStatusMessage.textContent = '';
}

/** Handles updating an FAQ from the edit modal */
async function handleUpdateFaq(event) {
     event.preventDefault();
     if (!editFaqForm) return;
     const docId = editFaqForm.getAttribute('data-doc-id');
     if (!docId) { showEditFaqStatus("Error: Missing document ID.", true); return; }
     const question = editFaqQuestionInput?.value.trim();
     const answer = editFaqAnswerInput?.value.trim();
     const orderStr = editFaqOrderInput?.value.trim();
     const order = parseInt(orderStr);
     if (!question || !answer || !orderStr || isNaN(order) || order < 0) { showEditFaqStatus("Question, Answer, and valid Order required.", true); return; }
     const updatedData = { question, answer, order, lastModified: serverTimestamp() };
     showEditFaqStatus("Saving changes...");
     try {
         const docRef = doc(db, 'faqs', docId);
         let oldData = {}; const oldDataSnap = await getDoc(docRef); if (oldDataSnap.exists()) oldData = oldDataSnap.data(); // Get old data for log
         await updateDoc(docRef, updatedData);
         // Log changes
         const changes = {}; let hasChanges = false;
         for (const key in updatedData) { if (key !== 'lastModified' && oldData[key] !== updatedData[key]) { changes[key] = { from: oldData[key] ?? null, to: updatedData[key] }; hasChanges = true; } }
         if (hasChanges) { logAdminActivity('FAQ_UPDATE', { id: docId, question: question, changes: changes }); }
         else { console.log("FAQ updated but no values changed."); }
         showAdminStatus("FAQ updated successfully.", false);
         closeEditFaqModal();
         loadFaqsAdmin();
     } catch (error) { console.error(`Error updating FAQ (ID: ${docId}):`, error); showEditFaqStatus(`Error saving: ${error.message}`, true); logAdminActivity('FAQ_UPDATE_FAILED', { id: docId, question: question, error: error.message }); }
}

// ==================================
// === END FAQ Management Functions ===
// ==================================

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

    /** Displays status messages in the tech edit modal */
     function showEditTechItemStatus(message, isError = false) {
         if (!editTechStatusMessage) { console.warn("Edit tech status message element not found"); return; }
         editTechStatusMessage.textContent = message;
         editTechStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
         if (!isError) setTimeout(() => { if (editTechStatusMessage && editTechStatusMessage.textContent === message) { editTechStatusMessage.textContent = ''; editTechStatusMessage.className = 'status-message'; } }, 3000);
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

    // --- Function to Handle Updating a Disability Link (with DETAILED Logging) ---
    async function handleUpdateDisability(event) {
        event.preventDefault();
        if (!editDisabilityForm) return;
        const docId = editDisabilityForm.getAttribute('data-doc-id');
        if (!docId) { showEditDisabilityStatus("Error: Missing document ID...", true); return; }
        console.log("Attempting to update disability link (detailed log):", docId);

        // 1. Get NEW data from form
        const name = editDisabilityNameInput?.value.trim();
        const url = editDisabilityUrlInput?.value.trim();
        const orderStr = editDisabilityOrderInput?.value.trim();
        const order = parseInt(orderStr);

        if (!name || !url || !orderStr || isNaN(order) || order < 0) { showEditDisabilityStatus("Invalid input...", true); return; }
        try { new URL(url); } catch (_) { showEditDisabilityStatus("Invalid URL format.", true); return; }

        const newDataFromForm = { name: name, url: url, order: order };
        showEditDisabilityStatus("Saving changes...");
        const docRef = doc(db, 'disabilities', docId); // Define once

        try {
            // 2. Get OLD data BEFORE saving
            let oldData = {};
            const oldDataSnap = await getDoc(docRef);
            if (oldDataSnap.exists()) { oldData = oldDataSnap.data(); }

            // 3. Save NEW data
            await updateDoc(docRef, { ...newDataFromForm, lastModified: serverTimestamp() });
            console.log("Disability link update successful:", docId);

            // 4. Compare and find changes
            const changes = {};
            let hasChanges = false;
            for (const key in newDataFromForm) {
                if (oldData[key] !== newDataFromForm[key]) {
                    changes[key] = { to: newDataFromForm[key] };
                    hasChanges = true;
                }
            }

             // 5. Log ONLY actual changes
            if (hasChanges) {
                console.log("DEBUG: Detected disability link changes:", changes);
                 if (typeof logAdminActivity === 'function') {
                    logAdminActivity('DISABILITY_LINK_UPDATE', { id: docId, name: name, changes: changes });
                 } else { console.error("logAdminActivity function not found!");}
            } else {
                 console.log("DEBUG: Disability link update saved, but no values changed.");
            }

            showAdminStatus("Disability link updated successfully.", false);
            closeEditDisabilityModal();
            loadDisabilitiesAdmin();

        } catch (error) {
            console.error(`Error updating disability link (ID: ${docId}):`, error);
            showEditDisabilityStatus(`Error saving: ${error.message}`, true);
            showAdminStatus(`Error updating disability link: ${error.message}`, true);
        }
    }

       // --- Attach Event Listeners for Section Forms & Modals ---

    // Profile Save Form
    if (profileForm) { profileForm.addEventListener('submit', saveProfileData); }

    // Maintenance Mode Toggle
    if (maintenanceModeToggle) { maintenanceModeToggle.addEventListener('change', (e) => { saveMaintenanceModeStatus(e.target.checked); }); }

    // Hide TikTok Toggle
    if (hideTikTokSectionToggle) { hideTikTokSectionToggle.addEventListener('change', (e) => { saveHideTikTokSectionStatus(e.target.checked); }); }
    
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

    // --- Tech Management Listeners --- <<< PASTE HERE >>> ---
     if (addTechItemForm) {
        addTechItemForm.addEventListener('submit', handleAddTechItem);
        // Attach preview listeners for the add form on initial load
        attachTechPreviewListeners(addTechItemForm, 'add');
     }
     if (editTechItemForm) {
        editTechItemForm.addEventListener('submit', handleUpdateTechItem);
        // Note: Preview listeners for edit form are attached in openEditTechItemModal
     }
      if (cancelEditTechButton) {
        cancelEditTechButton.addEventListener('click', closeEditTechItemModal);
     }
     if (cancelEditTechButtonSecondary) {
        cancelEditTechButtonSecondary.addEventListener('click', closeEditTechItemModal);
     }
     if (searchTechItemsInput) {
        searchTechItemsInput.addEventListener('input', displayFilteredTechItems);
     }

    // --- Activity Log Listeners (Add this one) ---
    const clearLogBtn = document.getElementById('clear-log-button');
    if (clearLogBtn) {
        clearLogBtn.addEventListener('click', handleClearActivityLog);
    } else {
        console.warn("Clear log button not found.");
    }

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
        if (event.target === editTechItemModal) { closeEditTechItemModal(); } // Tech modal close
        if (event.target === editFaqModal) { closeEditFaqModal(); } // <<< ADD THIS LINE
    });

// --- Ensure this is the closing }); for the main DOMContentLoaded listener ---
}); // End DOMContentLoaded Event Listener
