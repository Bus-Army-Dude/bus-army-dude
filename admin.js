// admin.js (Version includes Bulk Delete + Previous Features)

// *** Import Firebase services from your corrected init file ***
import { db, auth } from './firebase-init.js'; // Ensure path is correct

// Import Firebase functions (Adding 'writeBatch' for bulk delete)
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc, serverTimestamp, getDoc, query, orderBy, where, limit, Timestamp, writeBatch } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

// *** Global Variable for Client-Side Filtering ***
let allShoutouts = { tiktok: [], instagram: [], youtube: [] }; // Stores the full lists for filtering

document.addEventListener('DOMContentLoaded', () => {
    // First, check if db and auth were successfully imported/initialized
    if (!db || !auth) {
         console.error("Firestore (db) or Auth not initialized correctly. Check firebase-init.js and imports.");
         alert("FATAL ERROR: Firebase services failed to load. Admin panel disabled.");
         return; // Stop executing if Firebase isn't ready
    }
    console.log("Admin DOM Loaded. Setting up UI and CRUD functions.");

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
    const addShoutoutTiktokForm = document.getElementById('add-shoutout-tiktok-form');
    const shoutoutsTiktokListAdmin = document.getElementById('shoutouts-tiktok-list-admin');
    const addShoutoutInstagramForm = document.getElementById('add-shoutout-instagram-form');
    const shoutoutsInstagramListAdmin = document.getElementById('shoutouts-instagram-list-admin');
    const addShoutoutYoutubeForm = document.getElementById('add-shoutout-youtube-form');
    const shoutoutsYoutubeListAdmin = document.getElementById('shoutouts-youtube-list-admin');
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
    const profileForm = document.getElementById('profile-form');
    const profileUsernameInput = document.getElementById('profile-username');
    const profilePicUrlInput = document.getElementById('profile-pic-url');
    const profileBioInput = document.getElementById('profile-bio');
    const profileStatusInput = document.getElementById('profile-status');
    const profileStatusMessage = document.getElementById('profile-status-message');
    const adminPfpPreview = document.getElementById('admin-pfp-preview');
    const timerDisplayElement = document.getElementById('inactivity-timer-display');
    const nextButton = document.getElementById('next-button');
    const emailGroup = document.getElementById('email-group');
    const passwordGroup = document.getElementById('password-group');
    const loginButton = document.getElementById('login-button');
    const maintenanceModeToggle = document.getElementById('maintenance-mode-toggle');
    const settingsStatusMessage = document.getElementById('settings-status-message');
    const searchInputTiktok = document.getElementById('search-tiktok');
    const searchInputInstagram = document.getElementById('search-instagram');
    const searchInputYoutube = document.getElementById('search-youtube');
    const addTiktokPreview = document.getElementById('add-tiktok-preview');
    const addInstagramPreview = document.getElementById('add-instagram-preview');
    const addYoutubePreview = document.getElementById('add-youtube-preview');
    const editShoutoutPreview = document.getElementById('edit-shoutout-preview');
    // *** References for Bulk Delete Buttons ***
    const deleteSelectedTiktokBtn = document.getElementById('delete-selected-tiktok');
    const deleteSelectedInstagramBtn = document.getElementById('delete-selected-instagram');
    const deleteSelectedYoutubeBtn = document.getElementById('delete-selected-youtube');


    // Firestore Reference for Profile / Site Config
    const profileDocRef = doc(db, "site_config", "mainProfile");
    // Reference for Shoutout Metadata (used for timestamps)
    const shoutoutsMetaRef = doc(db, 'siteConfig', 'shoutoutsMetadata');


    // --- Inactivity Logout Variables ---
    let inactivityTimer;
    let expirationTime;
    let displayIntervalId;
    const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];

// --- Helper Functions ---
    // Displays status messages in the main admin status area
    function showAdminStatus(message, isError = false) {
        if (!adminStatusElement) { console.warn("Admin status element not found"); return; }
        adminStatusElement.textContent = message;
        adminStatusElement.className = `status-message ${isError ? 'error' : 'success'}`;
        // Clear message after 5 seconds
        setTimeout(() => { if (adminStatusElement) { adminStatusElement.textContent = ''; adminStatusElement.className = 'status-message'; } }, 5000);
    }

    // Displays status messages in the profile section's status area
    function showProfileStatus(message, isError = false) {
        if (!profileStatusMessage) { console.warn("Profile status message element not found"); showAdminStatus(message, isError); return; } // Fallback to admin status
        profileStatusMessage.textContent = message;
        profileStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
         // Clear message after 5 seconds
        setTimeout(() => { if (profileStatusMessage) { profileStatusMessage.textContent = ''; profileStatusMessage.className = 'status-message'; } }, 5000);
    }

    // Displays status messages in the site settings section's status area
    function showSettingsStatus(message, isError = false) {
        if (!settingsStatusMessage) { console.warn("Settings status message element not found"); showAdminStatus(message, isError); return; } // Fallback to admin status
        settingsStatusMessage.textContent = message;
        settingsStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
         // Clear message after a few seconds
        setTimeout(() => { if (settingsStatusMessage) { settingsStatusMessage.textContent = ''; settingsStatusMessage.style.display = 'none'; } }, 3000);
        // Ensure success/error message is visible briefly
        settingsStatusMessage.style.display = 'block';
    }

// --- Edit Modal Logic ---
    // Opens the modal and populates it with data for the selected shoutout
    function openEditModal(docId, platform) {
        if (!editModal || !editForm) { console.error("Edit modal/form not found."); showAdminStatus("UI Error: Cannot open edit form.", true); return; }
        editForm.setAttribute('data-doc-id', docId); // Store ID and platform on the form
        editForm.setAttribute('data-platform', platform);
        const docRef = doc(db, 'shoutouts', docId); // Reference to the specific shoutout doc

        getDoc(docRef).then(docSnap => { // Fetch the document
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Populate general fields
                if (editUsernameInput) editUsernameInput.value = data.username || '';
                if (editNicknameInput) editNicknameInput.value = data.nickname || '';
                if (editOrderInput) editOrderInput.value = data.order ?? '';
                if (editIsVerifiedInput) editIsVerifiedInput.checked = data.isVerified || false;
                if (editBioInput) editBioInput.value = data.bio || '';
                if (editProfilePicInput) editProfilePicInput.value = data.profilePic || '';
                // Populate enable/disable toggle (for future feature)
                // if (editIsEnabledInput) editIsEnabledInput.checked = data.isEnabled ?? true;

                // Handle platform-specific fields visibility and values
                const followersDiv = editPlatformSpecificDiv?.querySelector('.edit-followers-group');
                const subscribersDiv = editPlatformSpecificDiv?.querySelector('.edit-subscribers-group');
                const coverPhotoDiv = editPlatformSpecificDiv?.querySelector('.edit-coverphoto-group');

                // Hide all platform-specific sections first
                if (followersDiv) followersDiv.style.display = 'none';
                if (subscribersDiv) subscribersDiv.style.display = 'none';
                if (coverPhotoDiv) coverPhotoDiv.style.display = 'none';

                // Show and populate the relevant section
                if (platform === 'youtube') {
                    if (editSubscribersInput) editSubscribersInput.value = data.subscribers || 'N/A';
                    if (editCoverPhotoInput) editCoverPhotoInput.value = data.coverPhoto || '';
                    if (subscribersDiv) subscribersDiv.style.display = 'block';
                    if (coverPhotoDiv) coverPhotoDiv.style.display = 'block';
                } else { // TikTok or Instagram
                    if (editFollowersInput) editFollowersInput.value = data.followers || 'N/A';
                    if (followersDiv) followersDiv.style.display = 'block';
                }

                // Reset and hide preview area initially
                const previewArea = document.getElementById('edit-shoutout-preview');
                 if(previewArea) {
                     previewArea.innerHTML = '<p><small>Generating preview...</small></p>'; // Placeholder
                     // Trigger initial preview update now that form is populated
                     if (typeof updateShoutoutPreview === 'function') {
                        updateShoutoutPreview('edit', platform);
                     }
                 }

                editModal.style.display = 'block'; // Show the modal
            } else {
                 showAdminStatus("Error: Could not load data for editing. Document not found.", true);
            }
        }).catch(error => {
             console.error("Error getting document for edit:", error);
             showAdminStatus(`Error loading data: ${error.message}`, true);
         });
    }

    // Closes the edit modal and resets the form
    function closeEditModal() {
        if (editModal) editModal.style.display = 'none';
        if (editForm) editForm.reset(); // Reset form fields
        editForm?.removeAttribute('data-doc-id'); // Clear stored data
        editForm?.removeAttribute('data-platform');
         // Also clear the edit preview area
         if(editShoutoutPreview) {
             editShoutoutPreview.innerHTML = '<p><small>Preview will appear here.</small></p>';
         }
    }

    // Event listeners for closing the modal (X button and clicking outside)
    if (cancelEditButton) cancelEditButton.addEventListener('click', closeEditModal);
    window.addEventListener('click', (event) => {
        // Close modal only if the direct click target is the modal backdrop itself
        if (event.target === editModal) {
            closeEditModal();
        }
    });

// --- MODIFIED: renderAdminListItem Function (Includes Direct Link & Bulk Delete Checkbox) ---
    function renderAdminListItem(container, docId, platform, username, nickname, order, deleteHandler, editHandler) {
        // The 'isEnabled' status will be passed here later when implementing that feature
        if (!container) { console.warn("List container not found for platform:", platform); return; }

        const itemDiv = document.createElement('div');
        itemDiv.className = 'list-item-admin'; // Base class
        itemDiv.setAttribute('data-id', docId);

        // Construct direct link URL based on platform
        let directLinkUrl = '#'; // Default placeholder
        let safeUsername = username || ''; // Ensure username is not null/undefined

        if (platform === 'tiktok' && safeUsername) {
            directLinkUrl = `https://tiktok.com/@${encodeURIComponent(safeUsername)}`;
        } else if (platform === 'instagram' && safeUsername) {
            directLinkUrl = `https://instagram.com/${encodeURIComponent(safeUsername)}`;
        } else if (platform === 'youtube' && safeUsername) {
            let youtubeHandle = safeUsername.startsWith('@') ? safeUsername : `@${safeUsername}`;
            directLinkUrl = `https://www.youtube.com/@${encodeURIComponent(youtubeHandle)}`;
        }

        // Build inner HTML - Added checkbox for bulk actions
        itemDiv.innerHTML = `
            <div class="item-content">
                 <input type="checkbox" class="shoutout-checkbox" data-doc-id="${docId}" aria-label="Select shoutout for ${nickname}">

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
            </div>`;

        // Add event listeners for Edit and Delete buttons
        const editButton = itemDiv.querySelector('.edit-button');
        if (editButton) editButton.addEventListener('click', () => editHandler(docId, platform));

        const deleteButton = itemDiv.querySelector('.delete-button');
        if (deleteButton) deleteButton.addEventListener('click', () => deleteHandler(docId, platform, itemDiv));

        // Note: Add event listener for checkbox if needed for select-all functionality later

        // Add the completed item to the list container
        container.appendChild(itemDiv);
    }
    // --- END MODIFIED: renderAdminListItem Function ---

// --- Copied Shoutout Card Rendering Functions (from displayShoutouts.js) ---
    // NOTE: Ensure image paths ('check.png', 'images/default-profile.jpg') are accessible
    //       from the admin page, or use absolute paths / different logic.

    function renderTikTokCard(account) {
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
        // Consider using a relative path like './check.png' if the image is in the same folder as admin.html
        // or an absolute path like '/images/check.png' if it's relative to the site root.
        const verifiedBadge = isVerified ? '<img src="check.png" alt="Verified" class="verified-badge">' : ''; //

        // This HTML structure uses classes defined in your styles.css (or potentially admin.css if copied)
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

function renderInstagramCard(account) {
        // Use default values if account data is missing
        const profilePic = account.profilePic || 'images/default-profile.jpg'; // Default image path
        const username = account.username || 'N/A';
        const nickname = account.nickname || 'N/A';
        const bio = account.bio || ''; // Default to empty string
        const followers = account.followers || 'N/A';
        const isVerified = account.isVerified || false;
        // Construct profile URL safely
        const profileUrl = username !== 'N/A' ? `https://instagram.com/${encodeURIComponent(username)}` : '#';
         // Correct path for admin context might be needed for instagramcheck.png
         // Ensure this image exists relative to admin.html or update path
         const verifiedBadge = isVerified ? '<img src="instagramcheck.png" alt="Verified" class="instagram-verified-badge">' : ''; // Uses specific class from display CSS

         // This HTML structure uses classes defined in your styles.css (or potentially admin.css if copied)
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
             </div>`;
       }

function renderYouTubeCard(account) {
        // Use default values if account data is missing
        const profilePic = account.profilePic || 'images/default-profile.jpg'; // Default image path
        const username = account.username || 'N/A'; // YouTube handle
        const nickname = account.nickname || 'N/A'; // Channel name
        const bio = account.bio || '';
        const subscribers = account.subscribers || 'N/A';
        const coverPhoto = account.coverPhoto || null; // May not exist
        const isVerified = account.isVerified || false;
        // Construct channel URL safely using the handle
        let safeUsername = username;
        if (username !== 'N/A' && !username.startsWith('@')) {
            safeUsername = `@${username}`; // Prepend @ if missing for handle URL
        }
        // Ensure this URL structure works for YouTube handles
        const channelUrl = username !== 'N/A' ? `https://youtube.com/$${encodeURIComponent(safeUsername)}` : '#'; // Updated structure if needed, original used /0
        // Correct path for admin context might be needed for youtubecheck.png
        // Ensure this image exists relative to admin.html or update path
        const verifiedBadge = isVerified ? '<img src="youtubecheck.png" alt="Verified" class="youtube-verified-badge">' : ''; // Uses specific class from display CSS

        // This HTML structure uses classes defined in your styles.css (or potentially admin.css if copied)
        return `
            <div class="youtube-creator-card"> {/* Note: Uses classes from display CSS */}
                ${coverPhoto ? `<img src="${coverPhoto}" alt="${nickname} Cover Photo" class="youtube-cover-photo" onerror="this.style.display='none'">` : ''}
                <img src="${profilePic}" alt="${nickname}" class="youtube-creator-pic" onerror="this.onerror=null; this.src='images/default-profile.jpg';">
                <div class="youtube-creator-info">
                    <div class="youtube-creator-header"><h3>${nickname} ${verifiedBadge}</h3></div>
                    <div class="username-container"><p class="youtube-creator-username">@${username}</p></div>
                    <p class="youtube-creator-bio">${bio}</p>
                    <p class="youtube-subscriber-count">${subscribers} Subscribers</p>
                    <a href="${channelUrl}" target="_blank" rel="noopener noreferrer" class="youtube-visit-profile"> Visit Channel </a>
                </div>
            </div>`;
    }
    // --- END Copied Rendering Functions ---

// *** FUNCTION: Displays Filtered Shoutouts (for Search Bar) ***
    // This function takes the platform name, filters the globally stored list,
    // and renders only the matching items based on search input.
    function displayFilteredShoutouts(platform) {
        // Get the correct list container, count element, and search input for the given platform
        const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`);
        const countElement = document.getElementById(`${platform}-count`);
        const searchInput = document.getElementById(`search-${platform}`); // Get the specific search input

        // Safety checks for required elements and data
        if (!listContainer || !searchInput || !allShoutouts || !allShoutouts[platform]) {
            console.error(`Missing elements or data for filtering platform: ${platform}.`);
            if(listContainer) listContainer.innerHTML = `<p class="error">Error displaying filtered list (elements/data missing).</p>`;
            return;
        }

        const searchTerm = searchInput.value.trim().toLowerCase(); // Get current search term, lowercase
        const fullList = allShoutouts[platform]; // Get the full list stored earlier for this platform

        // Filter the full list based on the search term
        const filteredList = fullList.filter(account => {
            // Check if search term is empty (show all) or if it matches nickname or username
            if (!searchTerm) {
                return true; // Show all if search is empty
            }
            // Ensure properties exist before calling toLowerCase
            const nickname = (account.nickname || '').toLowerCase();
            const username = (account.username || '').toLowerCase();
            return nickname.includes(searchTerm) || username.includes(searchTerm);
        });

        // Clear the current list display before rendering filtered items
        listContainer.innerHTML = '';

        // Render the filtered items by calling renderAdminListItem for each
        if (filteredList.length > 0) {
            filteredList.forEach(account => {
                // Ensure renderAdminListItem exists before calling
                if (typeof renderAdminListItem === 'function') {
                    renderAdminListItem(
                        listContainer,
                        account.id, // Pass the document ID
                        platform,
                        account.username, // Pass username
                        account.nickname, // Pass nickname
                        account.order,    // Pass order
                        // account.isEnabled, // Pass status later if needed for styling disabled items
                        handleDeleteShoutout, // Pass delete handler
                        openEditModal         // Pass edit handler
                    );
                } else {
                     console.error("renderAdminListItem function is not defined during filtering!");
                     // Avoid infinite loop if render fails
                     listContainer.innerHTML = `<p class="error">Critical Error: Rendering function missing.</p>`;
                     return; // Stop rendering this list
                }
            });
        } else {
            // Display appropriate 'not found' message
            if (searchTerm) { // If search term exists but no results
                listContainer.innerHTML = `<p>No shoutouts found matching "${searchInput.value}".</p>`;
            } else { // If no search term and list was initially empty
                listContainer.innerHTML = `<p>No ${platform} shoutouts found.</p>`;
            }
        }

        // Update the count display based on the filtered list length
        if (countElement) {
            countElement.textContent = `(${filteredList.length})`;
        }
    }
    // *** END displayFilteredShoutouts FUNCTION ***

// --- MODIFIED: Function to Load Profile Data into Admin Form (Includes Maintenance Mode) ---
    async function loadProfileData() {
        // Ensure user is logged in before attempting to load
        if (!auth || !auth.currentUser) {
            console.warn("Auth not ready or user not logged in when trying to load profile.");
            return;
        }
        if (!profileForm) { // Check if the profile form exists in the DOM
            console.log("Profile form element not found.");
            return;
        }
        // Also check if maintenance toggle exists before trying to use it
        if (!maintenanceModeToggle) {
             console.warn("Maintenance mode toggle element not found.");
        }

        console.log("Attempting to load profile data from:", profileDocRef.path);
        try {
            const docSnap = await getDoc(profileDocRef); // Fetch the profile document

            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("Loaded profile data:", data);

                // Populate form fields with fetched data or defaults
                if(profileUsernameInput) profileUsernameInput.value = data.username || '';
                if(profilePicUrlInput) profilePicUrlInput.value = data.profilePicUrl || '';
                if(profileBioInput) profileBioInput.value = data.bio || '';
                if(profileStatusInput) profileStatusInput.value = data.status || 'offline'; // Default to 'offline' if not set

                // Set maintenance toggle state
                if(maintenanceModeToggle) {
                     maintenanceModeToggle.checked = data.isMaintenanceModeEnabled || false; // Set toggle based on Firestore data (default false if missing)
                     maintenanceModeToggle.disabled = false; // Ensure it's enabled if data loaded
                }

                // Update profile picture preview
                if (adminPfpPreview && data.profilePicUrl) {
                     adminPfpPreview.src = data.profilePicUrl;
                     adminPfpPreview.style.display = 'inline-block'; // Show preview
                } else if (adminPfpPreview) {
                     adminPfpPreview.src = ''; // Clear src if no URL
                     adminPfpPreview.style.display = 'none'; // Hide preview
                }
            } else {
                 // Handle case where the profile document doesn't exist yet
                 console.warn(`Profile document ('${profileDocRef.path}') not found. Displaying defaults.`);
                 if (profileForm) profileForm.reset(); // Reset main profile form fields
                 if (profileStatusInput) profileStatusInput.value = 'offline'; // Explicitly set default status

                 // Default maintenance toggle state
                 if(maintenanceModeToggle) {
                     maintenanceModeToggle.checked = false; // Default to false if doc missing
                     maintenanceModeToggle.disabled = false; // Ensure enabled
                 }
                 if(adminPfpPreview) adminPfpPreview.style.display = 'none'; // Hide preview
            }
        } catch (error) {
             console.error("Error loading profile data:", error);
             showProfileStatus("Error loading profile data.", true);
             // Set defaults and disable toggle on error
             if (profileForm) profileForm.reset();
             if (profileStatusInput) profileStatusInput.value = 'offline';
             if(maintenanceModeToggle) {
                 maintenanceModeToggle.checked = false;
                 maintenanceModeToggle.disabled = true; // Disable toggle on error
             }
             if(adminPfpPreview) adminPfpPreview.style.display = 'none';
        }
    }


    // --- Function to Save Profile Data ---
    async function saveProfileData(event) {
        event.preventDefault(); // Prevent default form submission
        // Ensure user is logged in
        if (!auth || !auth.currentUser) {
            showProfileStatus("Error: Not logged in.", true);
            return;
        }
        if (!profileForm) return; // Should not happen if loaded, but safety check

        // Gather data from form fields
        const newData = {
            username: profileUsernameInput?.value.trim() || "",
            profilePicUrl: profilePicUrlInput?.value.trim() || "",
            bio: profileBioInput?.value.trim() || "",
            status: profileStatusInput?.value || "offline", // Ensure a default value
            lastUpdated: serverTimestamp() // Add a timestamp for the update
            // Note: Maintenance mode is saved by its own function/listener
        };

        showProfileStatus("Saving profile..."); // Provide user feedback
        try {
            // Use setDoc with merge: true to create or update the document
            await setDoc(profileDocRef, newData, { merge: true });
            console.log("Profile data saved to:", profileDocRef.path);
            showProfileStatus("Profile updated successfully!", false);

            // Optionally update the preview image immediately after saving a new URL
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
    if (profilePicUrlInput && adminPfpPreview) {
        profilePicUrlInput.addEventListener('input', () => {
            const url = profilePicUrlInput.value.trim();
            if (url) {
                adminPfpPreview.src = url;
                adminPfpPreview.style.display = 'inline-block';
            } else {
                adminPfpPreview.style.display = 'none';
            }
        });
        // Handle image loading errors for the preview
        adminPfpPreview.onerror = () => {
            console.warn("Preview image failed to load from URL:", adminPfpPreview.src);
            // Optionally show a placeholder or hide the preview on error
            // adminPfpPreview.src = 'path/to/error-placeholder.png';
             adminPfpPreview.style.display = 'none';
             profilePicUrlInput.classList.add('input-error'); // Add error class to input
        };
         // Remove error class when input changes
         profilePicUrlInput.addEventListener('focus', () => {
            profilePicUrlInput.classList.remove('input-error');
         });
    }

// *** FUNCTION TO SAVE Maintenance Mode Status ***
    async function saveMaintenanceModeStatus(isEnabled) {
        // Ensure user is logged in
        if (!auth || !auth.currentUser) {
            showAdminStatus("Error: Not logged in. Cannot save settings.", true); // Use main admin status
            // Revert checkbox state visually if save fails due to auth issue
            if(maintenanceModeToggle) maintenanceModeToggle.checked = !isEnabled;
            return;
        }

        // Use the specific status message area for settings, fallback to main admin status
        const statusElement = settingsStatusMessage || adminStatusElement;

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
                isMaintenanceModeEnabled: isEnabled // Save the boolean value (true/false)
            }, { merge: true });

            console.log("Maintenance mode status saved:", isEnabled);

            // Show success message using the dedicated settings status element or fallback
             if (statusElement === settingsStatusMessage && settingsStatusMessage) { // Check if we are using the specific element
                 showSettingsStatus(`Maintenance mode ${isEnabled ? 'enabled' : 'disabled'}.`, false); // Uses the settings-specific display/clear logic
             } else { // Fallback if specific element wasn't found initially
                showAdminStatus(`Maintenance mode ${isEnabled ? 'enabled' : 'disabled'}.`, false);
             }

             // Log this action (If logging function existed)
             // if(typeof logAdminActivity === 'function') {
             //    logAdminActivity(isEnabled ? "Enabled Maintenance Mode" : "Disabled Maintenance Mode");
             // }

        } catch (error) {
            console.error("Error saving maintenance mode status:", error);
            // Show error message in the specific status area or fallback
            if (statusElement === settingsStatusMessage && settingsStatusMessage) {
                 showSettingsStatus(`Error saving setting: ${error.message}`, true);
            } else {
                showAdminStatus(`Error saving maintenance mode: ${error.message}`, true);
            }
            // Revert checkbox state visually on error
             if(maintenanceModeToggle) maintenanceModeToggle.checked = !isEnabled;
        }
    }
    // *** END FUNCTION ***

// --- Inactivity Logout & Timer Display Functions ---

    // Updates the countdown timer display
    function updateTimerDisplay() {
        if (!timerDisplayElement) return; // Exit if display element doesn't exist
        const now = Date.now();
        const remainingMs = expirationTime - now; // Calculate remaining time

        if (remainingMs <= 0) { // If time is up
            timerDisplayElement.textContent = "00:00"; // Show zero
            clearInterval(displayIntervalId); // Stop the interval timer
        } else {
            // Calculate remaining minutes and seconds
            const remainingSeconds = Math.round(remainingMs / 1000);
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            // Format as MM:SS and update display
            timerDisplayElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }

    // Function called when the inactivity timeout is reached
    function logoutDueToInactivity() {
        console.log("Logging out due to inactivity.");
        clearTimeout(inactivityTimer); // Clear the master timeout
        clearInterval(displayIntervalId); // Clear the display update interval
        if (timerDisplayElement) timerDisplayElement.textContent = ''; // Clear display
        removeActivityListeners(); // Remove event listeners to prevent resetting timer after logout
        // Sign the user out using Firebase Auth
        signOut(auth).catch((error) => {
             console.error("Error during inactivity logout:", error);
             // Optionally show a message, though user might already be gone
             // showAdminStatus("Logged out due to inactivity.", false);
        });
        // Note: The onAuthStateChanged listener will handle hiding admin content
    }

    // Resets the inactivity timer whenever user activity is detected
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer); // Clear existing timeout
        clearInterval(displayIntervalId); // Clear existing display interval

        // Set the new expiration time
        expirationTime = Date.now() + INACTIVITY_TIMEOUT_MS;
        // Set the main timeout to trigger logout
        inactivityTimer = setTimeout(logoutDueToInactivity, INACTIVITY_TIMEOUT_MS);

        // Start updating the visual timer display every second
        if (timerDisplayElement) {
             updateTimerDisplay(); // Update display immediately
             displayIntervalId = setInterval(updateTimerDisplay, 1000); // Update every second
        }
    }

    // Adds event listeners for various user activities
    function addActivityListeners() {
        console.log("Adding activity listeners for inactivity timer.");
        // Listen for any specified events on the document
        activityEvents.forEach(eventName => {
            document.addEventListener(eventName, resetInactivityTimer, true); // Use capture phase
        });
    }

    // Removes the activity event listeners
    function removeActivityListeners() {
        console.log("Removing activity listeners for inactivity timer.");
        // Clear timers just in case
        clearTimeout(inactivityTimer);
        clearInterval(displayIntervalId);
        if (timerDisplayElement) timerDisplayElement.textContent = ''; // Clear display

        // Remove listeners for specified events
        activityEvents.forEach(eventName => {
            document.removeEventListener(eventName, resetInactivityTimer, true); // Use capture phase
        });
    }

// --- 'Next' Button Logic ---
    // Handles the first step of the two-step login
    if (nextButton && emailInput && authStatus && emailGroup && passwordGroup && loginButton) {
        nextButton.addEventListener('click', () => {
            const userEmail = emailInput.value.trim(); // Get entered email

            // Check if email field is empty
            if (!userEmail) {
                 authStatus.textContent = 'Please enter your email address.';
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
            emailGroup.style.display = 'none';
            nextButton.style.display = 'none';

            // Show password field and the actual Login button
            passwordGroup.style.display = 'block';
            loginButton.style.display = 'inline-block'; // Or 'block' depending on layout

            // Focus the password input for better UX
            if(passwordInput) {
                 passwordInput.focus();
            }
        });
    } else {
         // Log warning if any elements for the two-step login are missing
         console.warn("Could not find all necessary elements for the 'Next' button functionality (Next Button, Email Input, Auth Status, Email Group, Password Group, Login Button).");
    }

// --- Authentication Logic ---
    // Listener for changes in authentication state (login/logout)
    onAuthStateChanged(auth, user => {
        if (user) {
            // User is signed in
            console.log("User logged in:", user.email);
            if (loginSection) loginSection.style.display = 'none'; // Hide login form
            if (adminContent) adminContent.style.display = 'block'; // Show admin content
            if (logoutButton) logoutButton.style.display = 'inline-block'; // Show logout button
            if (adminGreeting) adminGreeting.textContent = `Logged in as: ${user.email}`; // Show user email

            // Clear any previous login status messages
            if (authStatus) { authStatus.textContent = ''; authStatus.className = 'status-message'; authStatus.style.display = 'none'; }
            if (adminStatusElement) { adminStatusElement.textContent = ''; adminStatusElement.className = 'status-message'; }

            // Load initial data for the admin panel
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
             // Load activity log (if function exists - currently removed)
             // if (typeof loadAndDisplayActivityLog === 'function') loadAndDisplayActivityLog();

            // Start the inactivity timer now that the user is logged in
            resetInactivityTimer();
            addActivityListeners();

            // Log the login event (Check if logging function exists)
            // if(typeof logAdminActivity === 'function') {
            //      logAdminActivity("Logged In");
            // }

        } else {
            // User is signed out
            console.log("User logged out.");
            if (loginSection) loginSection.style.display = 'block'; // Show login form
            if (adminContent) adminContent.style.display = 'none'; // Hide admin content
            if (logoutButton) logoutButton.style.display = 'none'; // Hide logout button
            if (adminGreeting) adminGreeting.textContent = ''; // Clear greeting
            if (typeof closeEditModal === 'function') closeEditModal(); // Close edit modal if open

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
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission
            const email = emailInput.value;
            const password = passwordInput.value;

            // Re-validate inputs (especially password as email was checked by 'Next')
            if (!email || !password) {
                 // Check which field is missing in the current state
                 if (passwordGroup && passwordGroup.style.display !== 'none' && !password) {
                     if (authStatus) { authStatus.textContent = 'Please enter your password.'; authStatus.className = 'status-message error'; authStatus.style.display = 'block';}
                 } else if (!email) { // Should ideally not happen in two-step flow, but check anyway
                     if (authStatus) { authStatus.textContent = 'Please enter your email.'; authStatus.className = 'status-message error'; authStatus.style.display = 'block';}
                 } else { // Generic message if validation fails unexpectedly
                     if (authStatus) { authStatus.textContent = 'Please enter email and password.'; authStatus.className = 'status-message error'; authStatus.style.display = 'block';}
                 }
                 return; // Stop if validation fails
            }

            // Show "Logging in..." message
            if (authStatus) {
                authStatus.textContent = 'Logging in...';
                authStatus.className = 'status-message'; // Reset style
                authStatus.style.display = 'block';
            }

            // Attempt Firebase sign-in
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Login successful - onAuthStateChanged will handle the UI updates and logging
                    console.log("Login successful via form submission.");
                    // No need to clear authStatus here, onAuthStateChanged does it.
                 })
                .catch((error) => {
                    // Handle login errors
                    console.error("Login failed:", error.code, error.message);
                    let errorMessage = 'Invalid email or password.'; // Default error
                    // Map specific Firebase Auth error codes to user-friendly messages
                    if (error.code === 'auth/invalid-email') { errorMessage = 'Invalid email format.'; }
                    else if (error.code === 'auth/user-disabled') { errorMessage = 'This account has been disabled.'; }
                    else if (error.code === 'auth/invalid-credential') { errorMessage = 'Invalid email or password.'; } // Covers wrong password, user not found
                    else if (error.code === 'auth/too-many-requests') { errorMessage = 'Access temporarily disabled due to too many failed login attempts. Please try again later.'; }
                    else { errorMessage = `An unexpected error occurred (${error.code}).`; } // Fallback

                    // Display the specific error message
                    if (authStatus) {
                        authStatus.textContent = `Login Failed: ${errorMessage}`;
                        authStatus.className = 'status-message error';
                        authStatus.style.display = 'block';
                    }
                    // Log failed login attempt (if function exists)
                    // if(typeof logAdminActivity === 'function') {
                    //      logAdminActivity("Login Failed", { error: error.code, emailAttempted: email });
                    // }
                });
        });
    }

    // Logout Button Event Listener
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Logout button clicked.");
            // Log the action *before* signing out (if function exists)
            // if(typeof logAdminActivity === 'function') {
            //    logAdminActivity("Logged Out Manually");
            // }
            removeActivityListeners(); // Stop inactivity timer first
            signOut(auth).then(() => {
                 // Sign-out successful - onAuthStateChanged handles UI updates
                 console.log("User signed out via button.");
             }).catch((error) => {
                 // Handle potential logout errors
                 console.error("Logout failed:", error);
                 showAdminStatus(`Logout Failed: ${error.message}`, true); // Show error in admin area
             });
        });
    }

// --- Shoutouts Load/Add/Delete/Update ---

    // Helper function to get the reference to the metadata document
    // Used for storing last updated timestamps
    function getShoutoutsMetadataRef() {
        // Using 'siteConfig' collection and 'shoutoutsMetadata' document ID
        // Ensure this document exists or is created if needed
        return doc(db, 'siteConfig', 'shoutoutsMetadata');
    }

    // Updates the 'lastUpdatedTime' field in the metadata document for a specific platform
    // Called after adding, updating, or deleting a shoutout
    async function updateMetadataTimestamp(platform) {
         const metaRef = getShoutoutsMetadataRef(); // Use the dedicated helper
         try {
             // Use setDoc with merge: true to create/update the timestamp field
             await setDoc(metaRef, {
                 [`lastUpdatedTime_${platform}`]: serverTimestamp() // Dynamically set field name like 'lastUpdatedTime_tiktok'
             }, { merge: true });
             console.log(`Metadata timestamp updated for ${platform}.`);
         } catch (error) {
             // Log error but don't necessarily block user with admin status message
             console.error(`Error updating timestamp for ${platform}:`, error);
             showAdminStatus(`Warning: Could not update site timestamp for ${platform}.`, true);
         }
    }

    // --- UPDATED: loadShoutoutsAdmin Function (Stores data, calls filter function) ---
    async function loadShoutoutsAdmin(platform) {
        const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`);
        const countElement = document.getElementById(`${platform}-count`);

        if (!listContainer) {
            console.error(`List container not found for platform: ${platform}`);
            return;
        }
        if (countElement) countElement.textContent = ''; // Clear count initially
        listContainer.innerHTML = `<p>Loading ${platform} shoutouts...</p>`; // Show loading message

        // Ensure the global storage for this platform exists and is clear
        // Check if allShoutouts itself is defined before accessing platform key
        if (typeof allShoutouts !== 'undefined' && allShoutouts && allShoutouts.hasOwnProperty(platform)) {
             allShoutouts[platform] = [];
        } else {
            console.error(`allShoutouts variable or platform key '${platform}' is missing or not initialized.`);
             // Attempt to initialize if missing - ensure allShoutouts is declared globally (let allShoutouts = {...};)
             if (typeof allShoutouts === 'undefined' || !allShoutouts) {
                 allShoutouts = { tiktok: [], instagram: [], youtube: [] };
             } else if (!allShoutouts.hasOwnProperty(platform)) {
                 allShoutouts[platform] = [];
             }
        }


        try {
            // Query shoutouts collection, filtering by platform and ordering by 'order'
            const shoutoutsCol = collection(db, 'shoutouts');
            // This query requires the composite index (platform ASC/DESC, order ASC) created in Firebase console
             const shoutoutQuery = query(
                shoutoutsCol,
                where("platform", "==", platform), // Filter by the platform string (e.g., 'tiktok')
                orderBy("order", "asc")           // Order by the 'order' field ascending
            );

            const querySnapshot = await getDocs(shoutoutQuery); // Execute the query
            console.log(`Workspaceed ${querySnapshot.size} ${platform} documents.`);

            // Store fetched data in the global variable 'allShoutouts'
            querySnapshot.forEach((docSnapshot) => {
                // Store the full data object along with the Firestore document ID
                allShoutouts[platform].push({ id: docSnapshot.id, ...docSnapshot.data() });
            });

            // *** Call the filtering/display function to initially render the list ***
            // This function will handle applying any current search term and rendering
            if (typeof displayFilteredShoutouts === 'function') {
                displayFilteredShoutouts(platform);
            } else {
                 // Fallback if the function isn't defined yet (should not happen if chunks added correctly)
                 console.error(`displayFilteredShoutouts function is not yet defined when loading ${platform}`);
                 listContainer.innerHTML = `<p class="error">Error initializing display function.</p>`;
                 if (countElement) countElement.textContent = '(Error)';
            }


        } catch (error) {
            console.error(`Error loading ${platform} shoutouts:`, error);
            if (error.code === 'failed-precondition') {
                 listContainer.innerHTML = `<p class="error">Error: Missing Firestore index for this query. Please create it using the link in the developer console (F12).</p>`;
                 showAdminStatus(`Error loading ${platform}: Missing database index. Check console.`, true);
            } else {
                 // Generic error message
                 listContainer.innerHTML = `<p class="error">Error loading ${platform} shoutouts.</p>`;
                 showAdminStatus(`Failed to load ${platform} data: ${error.message}`, true);
            }
            if (countElement) countElement.textContent = '(Error)';
        }
    }
    // --- END UPDATED: loadShoutoutsAdmin Function ---

// --- MODIFIED: handleAddShoutout Function (Includes Duplicate Check) ---
    async function handleAddShoutout(platform, formElement) {
        if (!formElement) { console.error("Form element not provided to handleAddShoutout"); return; }

        // Get form values
        const username = formElement.querySelector(`#${platform}-username`)?.value.trim();
        const nickname = formElement.querySelector(`#${platform}-nickname`)?.value.trim();
        const orderStr = formElement.querySelector(`#${platform}-order`)?.value.trim();
        const order = parseInt(orderStr);

        // Basic input validation
        if (!username || !nickname || !orderStr || isNaN(order) || order < 0) {
            showAdminStatus(`Invalid input for ${platform}. Check required fields and ensure Order is a non-negative number.`, true);
            return;
        }

        // Duplicate Check Logic
        try {
            // Construct a query to check for existing shoutout with the same username and platform
            const shoutoutsCol = collection(db, 'shoutouts');
            const duplicateCheckQuery = query(
                shoutoutsCol,
                where("platform", "==", platform),
                where("username", "==", username),
                limit(1)
            );

            console.log(`Checking for duplicate: platform=${platform}, username=${username}`);
            const querySnapshot = await getDocs(duplicateCheckQuery);

            // If the snapshot is not empty, a duplicate was found
            if (!querySnapshot.empty) {
                console.warn("Duplicate found for", platform, username);
                showAdminStatus(`Error: A shoutout for username '@${username}' on platform '${platform}' already exists.`, true);
                return; // Stop execution, do not add duplicate
            }
            console.log("No duplicate found. Proceeding to add.");
            // --- End Duplicate Check ---


            // --- Add Logic ---
            const accountData = {
                platform: platform,
                username: username,
                nickname: nickname,
                order: order,
                isVerified: formElement.querySelector(`#${platform}-isVerified`)?.checked || false,
                bio: formElement.querySelector(`#${platform}-bio`)?.value.trim() || null,
                profilePic: formElement.querySelector(`#${platform}-profilePic`)?.value.trim() || null,
                createdAt: serverTimestamp(),
                isEnabled: true // Default new shoutouts to enabled
            };

            // Add platform-specific fields
            if (platform === 'youtube') {
                accountData.subscribers = formElement.querySelector(`#${platform}-subscribers`)?.value.trim() || 'N/A';
                accountData.coverPhoto = formElement.querySelector(`#${platform}-coverPhoto`)?.value.trim() || null;
            } else {
                accountData.followers = formElement.querySelector(`#${platform}-followers`)?.value.trim() || 'N/A';
            }

            const docRef = await addDoc(collection(db, 'shoutouts'), accountData);
            console.log("Shoutout added with ID:", docRef.id);
            await updateMetadataTimestamp(platform);
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout added successfully.`, false);
            formElement.reset(); // Reset the form fields

            // Reset preview area after adding
            const previewArea = formElement.querySelector(`#add-${platform}-preview`);
            if (previewArea && typeof updateShoutoutPreview === 'function') {
                // Instead of just clearing, call updatePreview to show empty state
                updateShoutoutPreview('add', platform);
                // previewArea.innerHTML = '<p><small>Preview will appear here as you type.</small></p>';
            }


            if (typeof loadShoutoutsAdmin === 'function') {
                loadShoutoutsAdmin(platform); // Reload the list
            }

        } catch (error) {
            console.error(`Error in handleAddShoutout for ${platform}:`, error);
            showAdminStatus(`Error adding ${platform} shoutout: ${error.message}`, true);
        }
    }


    // --- Function to Handle Updates from Edit Modal ---
    async function handleUpdateShoutout(event) {
        event.preventDefault(); // Prevent default form submission
        if (!editForm) return; // Exit if form element is missing

        const docId = editForm.getAttribute('data-doc-id');
        const platform = editForm.getAttribute('data-platform');

        if (!docId || !platform) {
            showAdminStatus("Error: Missing document ID or platform for update.", true);
            return;
        }

        // Get updated values from the edit form
        const username = editUsernameInput?.value.trim();
        const nickname = editNicknameInput?.value.trim();
        const orderStr = editOrderInput?.value.trim();
        const order = parseInt(orderStr);

        // Basic validation
        if (!username || !nickname || !orderStr || isNaN(order) || order < 0) {
            showAdminStatus(`Update Error: Invalid input. Check required fields and ensure Order is non-negative.`, true);
            return;
        }

        // Construct the object with updated data
        const updatedData = {
            username: username,
            nickname: nickname,
            order: order,
            isVerified: editIsVerifiedInput?.checked || false,
            bio: editBioInput?.value.trim() || null,
            profilePic: editProfilePicInput?.value.trim() || null,
            // isEnabled: editIsEnabledInput?.checked ?? true, // Add later if implementing per-item toggle
            lastModified: serverTimestamp() // Add a timestamp for the modification
        };

        // Add platform-specific fields
        if (platform === 'youtube') {
            updatedData.subscribers = editSubscribersInput?.value.trim() || 'N/A';
            updatedData.coverPhoto = editCoverPhotoInput?.value.trim() || null;
        } else { // TikTok or Instagram
            updatedData.followers = editFollowersInput?.value.trim() || 'N/A';
        }

        // Update the document in Firestore
        showAdminStatus("Updating shoutout..."); // Feedback
        try {
            const docRef = doc(db, 'shoutouts', docId);
            await updateDoc(docRef, updatedData); // Perform the update
            await updateMetadataTimestamp(platform); // Update site timestamp
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout updated successfully.`, false);
            if (typeof closeEditModal === 'function') closeEditModal(); // Close the modal
            if (typeof loadShoutoutsAdmin === 'function') loadShoutoutsAdmin(platform); // Reload the list
        } catch (error) {
            console.error(`Error updating ${platform} shoutout (ID: ${docId}):`, error);
            showAdminStatus(`Error updating ${platform} shoutout: ${error.message}`, true);
        }
    }


    // --- Function to Handle Deleting a Shoutout ---
    async function handleDeleteShoutout(docId, platform, listItemElement) {
        // Confirm deletion with the user
        if (!confirm(`Are you sure you want to permanently delete this ${platform} shoutout? This cannot be undone.`)) {
            return; // Do nothing if user cancels
        }

        showAdminStatus("Deleting shoutout..."); // Feedback
        try {
            // Delete the document from Firestore
            await deleteDoc(doc(db, 'shoutouts', docId));
            await updateMetadataTimestamp(platform); // Update site timestamp
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout deleted successfully.`, false);

            // Reload the list - this is the simplest way to update the UI
            // and ensure the 'allShoutouts' array is also updated for filtering.
            if (typeof loadShoutoutsAdmin === 'function') {
                loadShoutoutsAdmin(platform);
            }

        } catch (error) {
            console.error(`Error deleting ${platform} shoutout (ID: ${docId}):`, error);
            showAdminStatus(`Error deleting ${platform} shoutout: ${error.message}`, true);
        }
    }

// *** NEW FUNCTION: Handles Bulk Deletion ***
    async function handleBulkDelete(platform) {
        const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`);
        if (!listContainer) {
            console.error(`Cannot perform bulk delete: List container not found for ${platform}`);
            showAdminStatus(`Error: Could not find list for ${platform}.`, true);
            return;
        }

        // Find all checked checkboxes within this platform's list container
        const checkedCheckboxes = listContainer.querySelectorAll('.shoutout-checkbox:checked');

        if (checkedCheckboxes.length === 0) {
            showAdminStatus("No shoutouts selected for deletion.", false); // Not an error, just info
            return;
        }

        // Get the document IDs from the data-doc-id attribute of checked checkboxes
        const idsToDelete = Array.from(checkedCheckboxes).map(cb => cb.getAttribute('data-doc-id'));

        // Confirmation dialog
        if (!confirm(`Are you sure you want to delete ${idsToDelete.length} selected ${platform} shoutout(s)? This action cannot be undone.`)) {
            return; // Abort if user cancels
        }

        showAdminStatus(`Deleting ${idsToDelete.length} shoutout(s)...`);

        try {
            // Use a Firestore batched write for atomic deletion
            const batch = writeBatch(db);
            idsToDelete.forEach(docId => {
                if (docId) { // Ensure ID is valid
                     const docRef = doc(db, 'shoutouts', docId);
                     batch.delete(docRef);
                } else {
                     console.warn("Found checkbox with missing doc ID during bulk delete.");
                }
            });

            // Commit the batch
            await batch.commit();

            console.log(`${idsToDelete.length} documents deleted successfully.`);
            showAdminStatus(`${idsToDelete.length} ${platform} shoutout(s) deleted successfully.`, false);

            // Log the action (if function existed)
            // if(typeof logAdminActivity === 'function') {
            //     logAdminActivity(`Bulk Deleted ${platform} Shoutouts`, { count: idsToDelete.length, ids: idsToDelete });
            // }

            // Reload the list to reflect changes
            if (typeof loadShoutoutsAdmin === 'function') {
                loadShoutoutsAdmin(platform);
            }

        } catch (error) {
            console.error(`Error during bulk delete for ${platform}:`, error);
            showAdminStatus(`Error deleting shoutouts: ${error.message}`, true);
        }
    }
    // *** END handleBulkDelete FUNCTION ***

// --- Attach Event Listeners for Forms ---

    // Add Shoutout Forms (Submit Actions)
    if (addShoutoutTiktokForm) {
        addShoutoutTiktokForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAddShoutout('tiktok', addShoutoutTiktokForm);
        });
    }
    if (addShoutoutInstagramForm) {
        addShoutoutInstagramForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAddShoutout('instagram', addShoutoutInstagramForm);
        });
    }
    if (addShoutoutYoutubeForm) {
        addShoutoutYoutubeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAddShoutout('youtube', addShoutoutYoutubeForm);
        });
    }

    // Profile Save Form
    if (profileForm) {
        profileForm.addEventListener('submit', saveProfileData);
    }

    // Edit Shoutout Form (in the modal) - Submit Action
    if (editForm) {
        editForm.addEventListener('submit', handleUpdateShoutout);
    }

    // Maintenance Mode Toggle Listener
    if (maintenanceModeToggle) {
        maintenanceModeToggle.addEventListener('change', (e) => {
            const isEnabled = e.target.checked;
            saveMaintenanceModeStatus(isEnabled);
        });
    }

    // Search Input Event Listeners
    if (searchInputTiktok) {
        searchInputTiktok.addEventListener('input', () => { displayFilteredShoutouts('tiktok'); });
    }
     if (searchInputInstagram) {
        searchInputInstagram.addEventListener('input', () => { displayFilteredShoutouts('instagram'); });
    }
    if (searchInputYoutube) {
        searchInputYoutube.addEventListener('input', () => { displayFilteredShoutouts('youtube'); });
    }

    // Preview Event Listeners
    // Helper function to attach preview listeners
    function attachPreviewListeners(formElement, platform, formType) {
        if (!formElement) return;
        const previewInputs = ['username', 'nickname', 'bio', 'profilePic', 'isVerified', 'followers', 'subscribers', 'coverPhoto'];
        previewInputs.forEach(inputName => {
            const inputElement = formElement.querySelector(`[name="${inputName}"]`);
            if (inputElement) {
                const eventType = (inputElement.type === 'checkbox') ? 'change' : 'input';
                inputElement.addEventListener(eventType, () => {
                    if (typeof updateShoutoutPreview === 'function') {
                        updateShoutoutPreview(formType, platform);
                    }
                });
            }
        });
    }
    // Attach listeners to Add/Edit forms
    if (addShoutoutTiktokForm) attachPreviewListeners(addShoutoutTiktokForm, 'tiktok', 'add');
    if (addShoutoutInstagramForm) attachPreviewListeners(addShoutoutInstagramForm, 'instagram', 'add');
    if (addShoutoutYoutubeForm) attachPreviewListeners(addShoutoutYoutubeForm, 'youtube', 'add');
    if (editForm) { // Attach listeners specifically for edit form inputs
         const editPreviewInputs = [editUsernameInput, editNicknameInput, editBioInput, editProfilePicInput, editIsVerifiedInput, editFollowersInput, editSubscribersInput, editCoverPhotoInput];
         editPreviewInputs.forEach(inputElement => {
            if (inputElement) {
                const eventType = (inputElement.type === 'checkbox') ? 'change' : 'input';
                inputElement.addEventListener(eventType, () => {
                     const currentPlatform = editForm.getAttribute('data-platform');
                     if (currentPlatform && typeof updateShoutoutPreview === 'function') {
                        updateShoutoutPreview('edit', currentPlatform);
                     }
                });
            }
         });
         // Also trigger preview when modal opens (added in openEditModal function)
    }


    // *** NEW: Bulk Delete Button Event Listeners ***
    if (deleteSelectedTiktokBtn) {
        deleteSelectedTiktokBtn.addEventListener('click', () => {
            handleBulkDelete('tiktok');
        });
    }
    if (deleteSelectedInstagramBtn) {
        deleteSelectedInstagramBtn.addEventListener('click', () => {
            handleBulkDelete('instagram');
        });
    }
    if (deleteSelectedYoutubeBtn) {
        deleteSelectedYoutubeBtn.addEventListener('click', () => {
            handleBulkDelete('youtube');
        });
    }
    // *** END Bulk Delete Listeners ***

}); // End DOMContentLoaded Event Listener
