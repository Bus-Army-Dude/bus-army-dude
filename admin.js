// admin.js (Corrected Version - Includes All Features Discussed)

// *** Import Firebase services from your corrected init file ***
import { db, auth } from './firebase-init.js'; // Ensure path is correct

// Import Firebase functions (Corrected: includes 'where', 'query', 'orderBy', 'limit')
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc, serverTimestamp, getDoc, query, orderBy, where, limit } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

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
    // Added reference for edit modal's enable/disable toggle
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

    // Firestore Reference for Profile
    const profileDocRef = doc(db, "site_config", "mainProfile");

    // --- Inactivity Logout Variables ---
    let inactivityTimer;
    let expirationTime;
    let displayIntervalId;
    const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];


// --- Helper Functions ---
    function showAdminStatus(message, isError = false) {
        if (!adminStatusElement) { console.warn("Admin status element not found"); return; }
        adminStatusElement.textContent = message;
        adminStatusElement.className = `status-message ${isError ? 'error' : 'success'}`;
        // Clear message after 5 seconds
        setTimeout(() => { if (adminStatusElement) { adminStatusElement.textContent = ''; adminStatusElement.className = 'status-message'; } }, 5000);
    }

    function showProfileStatus(message, isError = false) {
        if (!profileStatusMessage) { console.warn("Profile status element not found"); showAdminStatus(message, isError); return; } // Fallback to admin status
        profileStatusMessage.textContent = message;
        profileStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
         // Clear message after 5 seconds
        setTimeout(() => { if (profileStatusMessage) { profileStatusMessage.textContent = ''; profileStatusMessage.className = 'status-message'; } }, 5000);
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
                // Populate general fields
                if (editUsernameInput) editUsernameInput.value = data.username || '';
                if (editNicknameInput) editNicknameInput.value = data.nickname || '';
                if (editOrderInput) editOrderInput.value = data.order ?? ''; // Use nullish coalescing
                if (editIsVerifiedInput) editIsVerifiedInput.checked = data.isVerified || false;
                if (editBioInput) editBioInput.value = data.bio || '';
                if (editProfilePicInput) editProfilePicInput.value = data.profilePic || '';
                 // Populate isEnabled toggle (Add this when implementing Disable/Enable feature)
                // if (editIsEnabledInput) editIsEnabledInput.checked = data.isEnabled ?? true; // Assuming default is true if field missing

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
                 // Reset and hide preview area initially (JS for preview will handle showing it)
                const previewArea = document.getElementById('edit-shoutout-preview');
                 if(previewArea) {
                     previewArea.innerHTML = '<p><small>Preview will appear here.</small></p>';
                 }

                editModal.style.display = 'block'; // Show modal
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
        if (editForm) editForm.reset(); // Reset form fields
        editForm?.removeAttribute('data-doc-id'); // Clear stored data
        editForm?.removeAttribute('data-platform');
    }

    // Event listeners for closing the modal
    if (cancelEditButton) cancelEditButton.addEventListener('click', closeEditModal);
    // Close modal if user clicks outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            closeEditModal();
        }
    });

 // --- MODIFIED: renderAdminListItem Function (Includes Direct Link) ---
    // This function creates the HTML for a single item in the admin shoutout list
    function renderAdminListItem(container, docId, platform, username, nickname, order, deleteHandler, editHandler) {
        if (!container) { console.warn("List container not found for platform:", platform); return; }

        const itemDiv = document.createElement('div');
        itemDiv.className = 'list-item-admin'; // Base class
        itemDiv.setAttribute('data-id', docId);

        // Add 'disabled-item' class later based on the 'isEnabled' field when that feature is implemented
        // Example: if (!account.isEnabled) itemDiv.classList.add('disabled-item');

        // Construct direct link URL based on platform
        let directLinkUrl = '#'; // Default placeholder
        let safeUsername = username || ''; // Ensure username is not null/undefined

        if (platform === 'tiktok' && safeUsername) {
            directLinkUrl = `https://tiktok.com/@${encodeURIComponent(safeUsername)}`;
        } else if (platform === 'instagram' && safeUsername) {
            directLinkUrl = `https://instagram.com/${encodeURIComponent(safeUsername)}`;
        } else if (platform === 'youtube' && safeUsername) {
            // Construct YouTube URL (ensure 'username' is the handle like '@MrBeast')
            // Note: If username doesn't start with '@', you might need to adjust this logic
            let youtubeHandle = safeUsername.startsWith('@') ? safeUsername : `@${safeUsername}`;
            directLinkUrl = `https://youtube.com/$${encodeURIComponent(youtubeHandle)}`;
        }

        // Build inner HTML - Structure includes item details and action buttons
        // NOTE: A checkbox for bulk actions will be added here later if needed
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
                {/* Add Enable/Disable toggle button later if needed */}
            </div>`;

        // Add event listeners for Edit and Delete buttons
        const editButton = itemDiv.querySelector('.edit-button');
        if (editButton) editButton.addEventListener('click', () => editHandler(docId, platform));

        const deleteButton = itemDiv.querySelector('.delete-button');
        if (deleteButton) deleteButton.addEventListener('click', () => deleteHandler(docId, platform, itemDiv));

        // Add the completed item to the list container
        container.appendChild(itemDiv);
    }
    // --- END MODIFIED: renderAdminListItem Function ---

// --- Function to Load Profile Data into Admin Form ---
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
                 console.log("Profile document does not exist yet. Form will show placeholders/defaults.");
                 // Optionally reset form fields explicitly here if needed
                 // profileForm.reset(); // Uncomment to reset form if doc doesn't exist
                 if(adminPfpPreview) adminPfpPreview.style.display = 'none'; // Hide preview
            }
        } catch (error) {
             console.error("Error loading profile data:", error);
             showProfileStatus("Error loading profile data.", true);
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
        };
    }

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
            loadProfileData(); // Load site profile data
            // Load shoutout lists for each platform
            if (typeof loadShoutoutsAdmin === 'function') {
                 if (shoutoutsTiktokListAdmin) loadShoutoutsAdmin('tiktok');
                 if (shoutoutsInstagramListAdmin) loadShoutoutsAdmin('instagram');
                 if (shoutoutsYoutubeListAdmin) loadShoutoutsAdmin('youtube');
            } else {
                 console.error("loadShoutoutsAdmin function is not defined!");
                 showAdminStatus("Error: Cannot load shoutout data.", true);
            }

            // Start the inactivity timer now that the user is logged in
            resetInactivityTimer();
            addActivityListeners();

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
                    // Login successful - onAuthStateChanged will handle the UI updates
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
                });
        });
    }

    // Logout Button Event Listener
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Logout button clicked.");
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
    function getMetadataRef() {
        // Ensure 'siteConfig' collection name is correct in your Firestore
        return doc(db, 'siteConfig', 'shoutoutsMetadata');
    }

    // Updates the 'lastUpdatedTime' field in the metadata document for a specific platform
    async function updateMetadataTimestamp(platform) {
         const metaRef = getMetadataRef();
         try {
             // Use setDoc with merge: true to create/update the timestamp field
             await setDoc(metaRef, {
                 [`lastUpdatedTime_${platform}`]: serverTimestamp() // Dynamically set field name
             }, { merge: true });
             console.log(`Metadata timestamp updated for ${platform}.`);
         } catch (error) {
             // Log error but don't necessarily block user with admin status message
             console.error(`Error updating timestamp for ${platform}:`, error);
             showAdminStatus(`Warning: Could not update site timestamp for ${platform}.`, true);
         }
    }

    // --- MODIFIED: loadShoutoutsAdmin Function (Uses indexed query) ---
    // Loads and displays the list of shoutouts for a given platform in the admin panel
    async function loadShoutoutsAdmin(platform) {
        const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`);
        const countElement = document.getElementById(`${platform}-count`);

        if (!listContainer) {
            console.error(`List container not found for platform: ${platform}`);
            return;
        }
        if (countElement) countElement.textContent = ''; // Clear count initially
        listContainer.innerHTML = `<p>Loading ${platform} shoutouts...</p>`; // Show loading message

        try {
            // Query shoutouts collection, filtering by platform and ordering by 'order'
            const shoutoutsCol = collection(db, 'shoutouts');
            // This query requires the composite index (platform, order) created in Firebase console
             const shoutoutQuery = query(
                shoutoutsCol,
                where("platform", "==", platform), // Filter by the platform string (e.g., 'tiktok')
                orderBy("order", "asc")           // Order by the 'order' field ascending
            );

            const querySnapshot = await getDocs(shoutoutQuery); // Execute the query
            listContainer.innerHTML = ''; // Clear loading message
            let count = 0; // Initialize count for this platform

            // Loop through the fetched documents
            querySnapshot.forEach(docSnapshot => {
                const account = docSnapshot.data(); // Get document data
                count++; // Increment count

                // Extract necessary fields for rendering the list item
                const nickname = account.nickname || 'N/A';
                const username = account.username || 'N/A'; // Username needed for direct link
                const order = account.order ?? 'N/A'; // Use nullish coalescing for order

                // Call function to render the individual list item HTML
                // Passes necessary data including username for the direct link
                if (typeof renderAdminListItem === 'function') {
                    renderAdminListItem(
                        listContainer,
                        docSnapshot.id, // Document ID
                        platform,
                        username, // Pass username
                        nickname, // Pass nickname
                        order,    // Pass order
                        handleDeleteShoutout, // Pass delete handler function
                        openEditModal         // Pass edit handler function
                    );
                } else {
                    console.error("renderAdminListItem function is not defined!");
                }
            });

            // Update the count display (e.g., "(5)")
            if (countElement) {
                countElement.textContent = `(${count})`;
            }
            // Show message if no shoutouts were found for this platform
            if (count === 0) {
                listContainer.innerHTML = `<p>No ${platform} shoutouts found.</p>`;
            }

        } catch (error) {
            console.error(`Error loading ${platform} shoutouts:`, error);
            // Specific check for the 'failed-precondition' error (missing index)
            if (error.code === 'failed-precondition') {
                 listContainer.innerHTML = `<p class="error">Error: Missing Firestore index for this query. Please create it using the link in the developer console (F12).</p>`;
                 showAdminStatus(`Error loading ${platform}: Missing database index. Check console.`, true);
            } else {
                 // Generic error message
                 listContainer.innerHTML = `<p class="error">Error loading ${platform} shoutouts.</p>`;
                 showAdminStatus(`Failed to load ${platform} data: ${error.message}`, true);
            }
            // Update count display to show error state
            if (countElement) {
                countElement.textContent = '(Error)';
            }
        }
    }
    // --- END MODIFIED: loadShoutoutsAdmin Function ---

// --- MODIFIED: handleAddShoutout Function (Includes Duplicate Check) ---
    async function handleAddShoutout(platform, formElement) {
        if (!formElement) return; // Exit if form element is missing

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
                limit(1) // Only need to know if at least one exists
            );

            const querySnapshot = await getDocs(duplicateCheckQuery);

            // If the snapshot is not empty, a duplicate was found
            if (!querySnapshot.empty) {
                showAdminStatus(`Error: A shoutout for username '@${username}' on platform '${platform}' already exists.`, true);
                return; // Stop execution, do not add duplicate
            }
            // --- End Duplicate Check ---


            // --- Existing Add Logic (Now runs only if no duplicate found) ---
            // Construct the data object to be saved
            const accountData = {
                platform: platform,
                username: username,
                nickname: nickname,
                order: order,
                isVerified: formElement.querySelector(`#${platform}-isVerified`)?.checked || false,
                bio: formElement.querySelector(`#${platform}-bio`)?.value.trim() || null, // Use null if empty
                profilePic: formElement.querySelector(`#${platform}-profilePic`)?.value.trim() || null, // Use null if empty
                createdAt: serverTimestamp()
                // NOTE: isEnabled field (for Disable/Enable feature) will be added later
            };

            // Add platform-specific fields
            if (platform === 'youtube') {
                accountData.subscribers = formElement.querySelector(`#${platform}-subscribers`)?.value.trim() || 'N/A';
                accountData.coverPhoto = formElement.querySelector(`#${platform}-coverPhoto`)?.value.trim() || null;
            } else { // TikTok or Instagram
                accountData.followers = formElement.querySelector(`#${platform}-followers`)?.value.trim() || 'N/A';
            }

            // Proceed to add the document to Firestore
            const docRef = await addDoc(collection(db, 'shoutouts'), accountData);
            console.log("Shoutout added with ID:", docRef.id);
            await updateMetadataTimestamp(platform); // Update last updated time for the site
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout added successfully.`, false);
            formElement.reset(); // Reset the form fields
            // Reset preview area if implemented later
            // const previewArea = formElement.querySelector(`#add-${platform}-preview`);
            // if (previewArea) previewArea.innerHTML = '<p><small>Preview will appear here as you type.</small></p>';

            // Reload the list to show the new item
            if (typeof loadShoutoutsAdmin === 'function') {
                loadShoutoutsAdmin(platform);
            }

        } catch (error) {
            // Handle potential errors during duplicate check query or adding the document
            console.error(`Error adding ${platform} shoutout:`, error);
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
            // Add isEnabled field later: isEnabled: editIsEnabledInput?.checked ?? true,
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

            // Remove the item directly from the list in the UI for immediate feedback
            if (listItemElement) {
                 listItemElement.remove();
                 // Reload is still good practice to ensure count is updated accurately
                 if (typeof loadShoutoutsAdmin === 'function') loadShoutoutsAdmin(platform);
            } else if (typeof loadShoutoutsAdmin === 'function') {
                 // Fallback reload if element wasn't passed
                 loadShoutoutsAdmin(platform);
            }
        } catch (error) {
            console.error(`Error deleting ${platform} shoutout (ID: ${docId}):`, error);
            showAdminStatus(`Error deleting ${platform} shoutout: ${error.message}`, true);
        }
    }

// --- Attach Event Listeners for Forms ---

    // Add Shoutout Forms
    if (addShoutoutTiktokForm) {
        addShoutoutTiktokForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default submission
            handleAddShoutout('tiktok', addShoutoutTiktokForm); // Call handler
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
        profileForm.addEventListener('submit', saveProfileData); // Call handler on submit
    }

    // Edit Shoutout Form (in the modal)
    if (editForm) {
        editForm.addEventListener('submit', handleUpdateShoutout); // Call handler on submit
    }

    // Add listeners for other new features here later (e.g., search inputs, bulk delete buttons, etc.)

}); // End DOMContentLoaded Event Listener                          
