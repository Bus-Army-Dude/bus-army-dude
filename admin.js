// admin.js (Corrected to import from firebase-init.js)

// *** Import Firebase services from your corrected init file ***
import { db, auth } from './firebase-init.js'; // Ensure path is correct

// Import Firebase functions
// *** NOTE: initializeApp is NO LONGER needed here ***
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
// NOTE: db and auth are now imported, not created here.

// *** REMOVED the duplicate Firebase initialization block that was here ***

document.addEventListener('DOMContentLoaded', () => {
    // First, check if db and auth were successfully imported/initialized
    if (!db || !auth) {
         console.error("Firestore (db) or Auth not initialized correctly. Check firebase-init.js and imports.");
         alert("FATAL ERROR: Firebase services failed to load. Admin panel disabled.");
         // Optionally disable UI elements further
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

    // Shoutout Forms & Lists
    const addShoutoutTiktokForm = document.getElementById('add-shoutout-tiktok-form');
    const shoutoutsTiktokListAdmin = document.getElementById('shoutouts-tiktok-list-admin');
    const addShoutoutInstagramForm = document.getElementById('add-shoutout-instagram-form');
    const shoutoutsInstagramListAdmin = document.getElementById('shoutouts-instagram-list-admin');
    const addShoutoutYoutubeForm = document.getElementById('add-shoutout-youtube-form');
    const shoutoutsYoutubeListAdmin = document.getElementById('shoutouts-youtube-list-admin');

    // Edit Modal Elements
    const editModal = document.getElementById('edit-shoutout-modal');
    const editForm = document.getElementById('edit-shoutout-form');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    const editUsernameInput = document.getElementById('edit-username');
    const editNicknameInput = document.getElementById('edit-nickname');
    const editOrderInput = document.getElementById('edit-order');
    const editIsVerifiedInput = document.getElementById('edit-isVerified');
    const editBioInput = document.getElementById('edit-bio'); // Used by shoutout edit
    const editProfilePicInput = document.getElementById('edit-profilePic'); // Used by shoutout edit
    const editFollowersInput = document.getElementById('edit-followers');
    const editSubscribersInput = document.getElementById('edit-subscribers');
    const editCoverPhotoInput = document.getElementById('edit-coverPhoto');
    const editPlatformSpecificDiv = document.getElementById('edit-platform-specific');

    // Profile Management Elements
    const profileForm = document.getElementById('profile-form');
    const profileUsernameInput = document.getElementById('profile-username');
    const profilePicUrlInput = document.getElementById('profile-pic-url');
    const profileBioInput = document.getElementById('profile-bio'); // Different from editBioInput
    const profileStatusInput = document.getElementById('profile-status');
    const profileStatusMessage = document.getElementById('profile-status-message');
    const adminPfpPreview = document.getElementById('admin-pfp-preview');

    // *** ADD THESE: Social Links CRUD Elements ***
    const addSocialLinkForm = document.getElementById('add-social-link-form');
    const addSocialNameInput = document.getElementById('add-social-platformName');
    const addSocialUrlInput = document.getElementById('add-social-url');
    const addSocialOrderInput = document.getElementById('add-social-order');
    const addSocialLinkStatus = document.getElementById('add-social-link-status');
    const socialLinksListAdmin = document.getElementById('social-links-list-admin');

    const editSocialLinkModal = document.getElementById('edit-social-link-modal');
    const editSocialLinkForm = document.getElementById('edit-social-link-form');
    const cancelEditSocialLinkButton = document.getElementById('cancel-edit-social-link-button');
    const editSocialNameInput = document.getElementById('edit-social-platformName');
    const editSocialUrlInput = document.getElementById('edit-social-url');
    const editSocialOrderInput = document.getElementById('edit-social-order');
    const editSocialLinkStatus = document.getElementById('edit-social-link-status');

    // Firestore Reference for Profile
    const profileDocRef = doc(db, "site_config", "mainProfile");
    const socialLinksColRef = collection(db, "site_config", "mainProfile", "socialLinks");


    // --- Helper Functions ---
    function showAdminStatus(message, isError = false) {
       if (!adminStatusElement) {
            console.warn("Admin status element not found");
            return;
        }
        adminStatusElement.textContent = message;
        adminStatusElement.className = `status-message ${isError ? 'error' : 'success'}`;
        setTimeout(() => {
            if (adminStatusElement) {
                adminStatusElement.textContent = '';
                adminStatusElement.className = 'status-message';
            }
        }, 5000);
    }

    // Function to display profile-specific status messages
     function showProfileStatus(message, isError = false) {
       if (!profileStatusMessage) {
           console.warn("Profile status element not found");
            showAdminStatus(message, isError); // Fallback
           return;
       }
       profileStatusMessage.textContent = message;
       profileStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
       setTimeout(() => {
           if (profileStatusMessage) {
               profileStatusMessage.textContent = '';
               profileStatusMessage.className = 'status-message';
           }
       }, 5000);
   }

     function showSocialLinkStatus(message, isError = false, element = addSocialLinkStatus) {
        if (!element) { console.warn("Status element not found for social link message"); return; }
        element.textContent = message;
        element.className = `status-message ${isError ? 'error' : 'success'}`;
        setTimeout(() => { if (element) { element.textContent = ''; element.className = 'status-message'; } }, 5000);
    }

    // --- Edit Modal Logic ---
    function openEditModal(docId, platform) {
       if (!editModal || !editForm) {
            console.error("Edit modal or form not found in the DOM.");
            showAdminStatus("UI Error: Cannot open edit form.", true);
            return;
        }
        editForm.setAttribute('data-doc-id', docId);
        editForm.setAttribute('data-platform', platform);
        const docRef = doc(db, 'shoutouts', docId); // Assumes shoutouts collection
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
                } else { // TikTok or Instagram
                    if (editFollowersInput) editFollowersInput.value = data.followers || 'N/A';
                    if (followersDiv) followersDiv.style.display = 'block';
                }
                editModal.style.display = 'block';
            } else {
                console.error("Document not found for editing:", docId);
                showAdminStatus("Error: Could not load data for editing.", true);
            }
        }).catch(error => {
            console.error("Error fetching document for edit:", error);
            showAdminStatus(`Error loading data: ${error.message}`, true);
        });
    }

    function closeEditModal() {
       if (editModal) editModal.style.display = 'none';
       if (editForm) editForm.reset();
       editForm?.removeAttribute('data-doc-id');
       editForm?.removeAttribute('data-platform');
    }

    if (cancelEditButton) {
        cancelEditButton.addEventListener('click', closeEditModal);
    }
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            closeEditModal();
        }
    });

    // Render list item with Edit and Delete buttons
    function renderAdminListItem(container, docId, platform, contentHtml, deleteHandler, editHandler) {
       if (!container) {
           console.warn("List container not found for rendering item");
           return;
       }
       const itemDiv = document.createElement('div');
       itemDiv.className = 'list-item-admin';
       itemDiv.setAttribute('data-id', docId);
       itemDiv.innerHTML = `
           <div class="item-content">${contentHtml}</div>
           <div class="item-actions">
               <button type="button" class="edit-button small-button">Edit</button>
               <button type="button" class="delete-button small-button">Delete</button>
           </div>
       `;
       const editButton = itemDiv.querySelector('.edit-button');
       if (editButton) {
           editButton.addEventListener('click', () => editHandler(docId, platform));
       } else {
           console.warn("Could not find edit button in rendered list item for ID:", docId);
       }
       const deleteButton = itemDiv.querySelector('.delete-button');
       if (deleteButton) {
           deleteButton.addEventListener('click', () => deleteHandler(docId, platform, itemDiv));
       } else {
           console.warn("Could not find delete button in rendered list item for ID:", docId);
       }
       container.appendChild(itemDiv);
    }


    // --- Function to Load Profile Data into Admin Form ---
    async function loadProfileData() {
        // Check auth first within the function using the imported 'auth'
        if (!auth || !auth.currentUser) { // Check if auth is initialized and user exists
            console.warn("Auth not ready or user not logged in, cannot load profile data.");
            return;
        }
        if (!profileForm) {
            console.log("Profile management section not found in DOM.");
            return;
        }
        console.log("Attempting to load profile data...");

        try {
            const docSnap = await getDoc(profileDocRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("Loaded profile data:", data);
                if(profileUsernameInput) profileUsernameInput.value = data.username || '';
                if(profilePicUrlInput) profilePicUrlInput.value = data.profilePicUrl || '';
                if(profileBioInput) profileBioInput.value = data.bio || '';
                if(profileStatusInput) profileStatusInput.value = data.status || 'offline';

                // Handle optional preview image
                if (adminPfpPreview && data.profilePicUrl) {
                     adminPfpPreview.src = data.profilePicUrl;
                     adminPfpPreview.style.display = 'inline-block';
                } else if (adminPfpPreview) {
                     adminPfpPreview.style.display = 'none';
                }

            } else {
                console.log("Profile document ('site_config/mainProfile') does not exist yet.");
                 if(profileUsernameInput) profileUsernameInput.value = '';
                 if(profilePicUrlInput) profilePicUrlInput.value = '';
                 if(profileBioInput) profileBioInput.value = '';
                 if(profileStatusInput) profileStatusInput.value = 'offline';
                 if (adminPfpPreview) adminPfpPreview.style.display = 'none';
            }
        } catch (error) {
            console.error("Error loading profile data:", error);
            showProfileStatus("Error loading profile data.", true);
        }
    }


    // --- Function to Save Profile Data ---
    async function saveProfileData(event) {
        event.preventDefault();
        if (!auth || !auth.currentUser) { // Check if auth is initialized and user exists
            showProfileStatus("Error: Not logged in.", true);
            return;
        }
        if (!profileForm) return;

        const newData = {
            username: profileUsernameInput?.value.trim() || "",
            profilePicUrl: profilePicUrlInput?.value.trim() || "",
            bio: profileBioInput?.value.trim() || "",
            status: profileStatusInput?.value || "offline",
            lastUpdated: serverTimestamp()
        };

        showProfileStatus("Saving profile...");

        try {
            // Use the imported 'db' instance
            await setDoc(profileDocRef, newData, { merge: true });
            console.log("Profile data saved successfully.");
            showProfileStatus("Profile updated successfully!", false);
        } catch (error) {
            console.error("Error saving profile data:", error);
            showProfileStatus(`Error saving profile: ${error.message}`, true);
        }
    }

    // --- Load and Display Social Links in Admin List ---
    async function loadSocialLinksAdmin() {
        if (!socialLinksListAdmin) { console.error("Social links list container not found."); return; }
        console.log("Loading social links for admin list...");
        socialLinksListAdmin.innerHTML = '<p>Loading...</p>';

        try {
            // Query to get links ordered by the 'order' field
            const q = query(socialLinksColRef, orderBy("order", "asc"));
            const querySnapshot = await getDocs(q);
            socialLinksListAdmin.innerHTML = ''; // Clear loading message
            let count = 0;
            querySnapshot.forEach((doc) => {
                count++;
                // Pass data to a function that creates the list item HTML
                renderSocialLinkAdminItem(socialLinksListAdmin, doc.id, doc.data());
            });
            if (count === 0) {
                socialLinksListAdmin.innerHTML = '<p>No social links added yet.</p>';
            }
            console.log(`Loaded ${count} social links.`);
        } catch (error) {
            console.error("Error loading social links:", error);
            socialLinksListAdmin.innerHTML = '<p class="error">Error loading social links.</p>';
            showAdminStatus("Error loading social links.", true); // Use general status for loading errors
        }
    }

     // --- Render Single Social Link Item for Admin List ---
     function renderSocialLinkAdminItem(container, docId, linkData) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'list-item-admin social-link-item';
        itemDiv.setAttribute('data-id', docId);

        const displayName = linkData.platformName || 'N/A';
        const displayUrl = linkData.url || 'No URL';
        const displayOrder = linkData.order ?? 'N/A';

        // Removed Icon display as per your HTML
        itemDiv.innerHTML = `
            <div class="item-content">
                <strong>${displayName}</strong> (Order: ${displayOrder})<br>
                <small style="word-break: break-all;">URL: ${displayUrl}</small>
            </div>
            <div class="item-actions">
                <button type="button" class="edit-social-link-button small-button" data-id="${docId}">Edit</button>
                <button type="button" class="delete-social-link-button small-button" data-id="${docId}">Delete</button>
            </div>
        `;
        container.appendChild(itemDiv);
    }

    // --- Add New Social Link ---
    async function handleAddSocialLink(event) {
        event.preventDefault();
        if (!addSocialLinkForm) return;

        const platformName = addSocialNameInput.value.trim();
        const url = addSocialUrlInput.value.trim();
        const orderStr = addSocialOrderInput.value.trim();
        const order = parseInt(orderStr);

        // Validation (No Icon Class)
        if (!platformName || !url || !orderStr || isNaN(order) || order < 0) {
            showSocialLinkStatus("Please fill in Name, URL, and a valid Order.", true);
            return;
        }

        // Data to save (No Icon Class)
        const newLinkData = { platformName, url, order, createdAt: serverTimestamp() };

        showSocialLinkStatus("Adding link...");
        try {
            const docRef = await addDoc(socialLinksColRef, newLinkData);
            console.log("Social link added with ID:", docRef.id);
            showSocialLinkStatus("Social link added successfully.", false);
            addSocialLinkForm.reset(); // Clear form
            loadSocialLinksAdmin(); // Refresh list
        } catch (error) {
            console.error("Error adding social link:", error);
            showSocialLinkStatus(`Error adding link: ${error.message}`, true);
        }
    }

    // --- Delete Social Link ---
     async function handleDeleteSocialLink(docId) {
        if (!docId) return;
        if (!confirm(`Are you sure you want to delete this social link?`)) return;

        showAdminStatus("Deleting link..."); // Use general status
        try {
            // Construct the correct reference to the document in the subcollection
            const linkDocRef = doc(db, "site_config", "mainProfile", "socialLinks", docId);
            await deleteDoc(linkDocRef);
            console.log("Social link deleted:", docId);
            showAdminStatus("Social link deleted successfully.", false);
            loadSocialLinksAdmin(); // Refresh list
        } catch (error) {
            console.error("Error deleting social link:", error);
            showAdminStatus(`Error deleting link: ${error.message}`, true);
        }
    }

     // --- Open Edit Social Link Modal ---
    async function openEditSocialLinkModal(docId) {
        if (!editSocialLinkModal || !editSocialLinkForm) { console.error("Edit social link modal missing."); return; }

        editSocialLinkForm.setAttribute('data-doc-id', docId);
        console.log("Opening edit modal for social link:", docId);

        try {
            // Construct the correct reference
            const linkDocRef = doc(db, "site_config", "mainProfile", "socialLinks", docId);
            const docSnap = await getDoc(linkDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Populate modal fields (No Icon Class)
                if(editSocialNameInput) editSocialNameInput.value = data.platformName || '';
                if(editSocialUrlInput) editSocialUrlInput.value = data.url || '';
                if(editSocialOrderInput) editSocialOrderInput.value = data.order ?? '';

                editSocialLinkModal.style.display = 'block';
            } else {
                console.error("Social link document not found for editing:", docId);
                showAdminStatus("Error: Could not load social link data for editing.", true);
            }
        } catch (error) {
            console.error("Error fetching social link for edit:", error);
            showAdminStatus(`Error loading link data: ${error.message}`, true);
        }
    }

    // --- Close Edit Social Link Modal ---
    function closeEditSocialLinkModal() {
        if(editSocialLinkModal) editSocialLinkModal.style.display = 'none';
        if(editSocialLinkForm) editSocialLinkForm.reset();
        editSocialLinkForm?.removeAttribute('data-doc-id');
    }

    // --- Update Social Link (Handles Edit Modal Form Submission) ---
    async function handleUpdateSocialLink(event) {
         event.preventDefault();
         if (!editSocialLinkForm) return;
         const docId = editSocialLinkForm.getAttribute('data-doc-id');
         if (!docId) { showSocialLinkStatus("Error: No document ID found for update.", true, editSocialLinkStatus); return; }

         // Validate required fields (No Icon Class)
         const platformName = editSocialNameInput?.value.trim();
         const url = editSocialUrlInput?.value.trim();
         const orderStr = editSocialOrderInput?.value.trim();
         const order = parseInt(orderStr);

         if (!platformName || !url || !orderStr || isNaN(order) || order < 0) {
             showSocialLinkStatus("Update Error: Fill in Name, URL, and Order.", true, editSocialLinkStatus);
             return;
         }

         // Data to update (No Icon Class)
         const updatedLinkData = { platformName, url, order };

         showSocialLinkStatus("Saving changes...", false, editSocialLinkStatus);
         try {
             const linkDocRef = doc(db, "site_config", "mainProfile", "socialLinks", docId);
             await updateDoc(linkDocRef, updatedLinkData); // Use updateDoc for existing docs
             console.log("Social link updated:", docId);
             showSocialLinkStatus("Changes saved successfully!", false, editSocialLinkStatus);
             closeEditSocialLinkModal();
             loadSocialLinksAdmin(); // Refresh list
         } catch (error) {
              console.error("Error updating social link:", error);
             showSocialLinkStatus(`Error saving changes: ${error.message}`, true, editSocialLinkStatus);
         }
    }

    // --- Authentication Logic ---
    // Use the imported 'auth' instance
    onAuthStateChanged(auth, user => {
        if (user) {
            // User is signed in
            if (loginSection) loginSection.style.display = 'none';
            if (adminContent) adminContent.style.display = 'block';
            if (logoutButton) logoutButton.style.display = 'inline-block';
            if (adminGreeting) adminGreeting.textContent = `Logged in as: ${user.email}`;
            if (authStatus) { authStatus.textContent = ''; authStatus.className = 'status-message'; }
            if (adminStatusElement) { adminStatusElement.textContent = ''; adminStatusElement.className = 'status-message'; }

            // --- Load ALL data AFTER login ---
            loadProfileData(); // Load profile data
            // Load shoutout data (ensure these functions exist and work)
            if (typeof loadShoutoutsAdmin === 'function') {
                 if (shoutoutsTiktokListAdmin) loadShoutoutsAdmin('tiktok');
                 if (shoutoutsInstagramListAdmin) loadShoutoutsAdmin('instagram');
                 if (shoutoutsYoutubeListAdmin) loadShoutoutsAdmin('youtube');
            } else {
                console.error("loadShoutoutsAdmin function is not defined!");
            }

        } else {
            // User is signed out
            if (loginSection) loginSection.style.display = 'block';
            if (adminContent) adminContent.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'none';
            if (adminGreeting) adminGreeting.textContent = '';
            if (typeof closeEditModal === 'function') closeEditModal();
        }
    });

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;
            if (!email || !password) {
                if (authStatus) {
                    authStatus.textContent = 'Please enter email and password.';
                    authStatus.className = 'status-message error';
                }
                return;
            }
             if (authStatus) {
                authStatus.textContent = 'Logging in...';
                authStatus.className = 'status-message';
            }
            // Use the imported 'auth' instance
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log("Login successful for:", userCredential.user.email);
                     if (authStatus) { authStatus.textContent = ''; authStatus.className = 'status-message'; }
                })
                .catch((error) => {
                    console.error("Login failed:", error.code, error.message);
                    let errorMessage = 'Invalid email or password.';
                    // ... (your existing error message mapping) ...
                    if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email format.';
                    else if (error.code === 'auth/user-disabled') errorMessage = 'This user account has been disabled.';
                    else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') errorMessage = 'Invalid email or password.';
                    else if (error.code === 'auth/too-many-requests') errorMessage = 'Too many login attempts. Please try again later.';
                    else errorMessage = `An unexpected error occurred (${error.code}).`;

                     if (authStatus) {
                        authStatus.textContent = `Login Failed: ${errorMessage}`;
                        authStatus.className = 'status-message error';
                    }
                });
        });
    }

    // Logout Button
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Use the imported 'auth' instance
            signOut(auth).then(() => {
                console.log("User signed out successfully.");
            }).catch((error) => {
                console.error("Logout failed:", error);
                showAdminStatus(`Logout Failed: ${error.message}`, true);
            });
        });
    }

    // --- Shoutouts Load/Add/Delete/Update ---
    // These functions seem mostly okay, just ensure 'db' is the imported one

    function getMetadataRef() {
         return doc(db, 'site_config', 'shoutoutsMetadata');
    }

    async function updateMetadataTimestamp(platform) {
         const metaRef = getMetadataRef();
         try {
             await setDoc(metaRef, { [`lastUpdatedTime_${platform}`]: serverTimestamp() }, { merge: true });
             console.log(`Metadata timestamp updated for ${platform}.`);
         } catch (error) {
             console.error(`Error updating metadata timestamp for ${platform}:`, error);
             showAdminStatus(`Warning: Could not update timestamp for ${platform}.`, true);
         }
    }

    async function loadShoutoutsAdmin(platform) {
        const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`);
        if (!listContainer) return;
        listContainer.innerHTML = `<p>Loading ${platform} shoutouts...</p>`;
        try {
            const querySnapshot = await getDocs(collection(db, 'shoutouts')); // Use imported 'db'
            listContainer.innerHTML = '';
            let hasResults = false;
            querySnapshot.forEach(docSnapshot => { // Ensure 'doc' function isn't shadowed
                const account = docSnapshot.data();
                if (account.platform === platform) {
                    hasResults = true;
                    const nickname = account.nickname || 'No Nickname';
                    const username = account.username || 'No Username';
                    const order = account.order ?? 'N/A';
                    const content = `<strong>${nickname}</strong> (@${username}) - Order: ${order}`;
                    if (typeof renderAdminListItem === 'function') {
                        renderAdminListItem( listContainer, docSnapshot.id, platform, content, handleDeleteShoutout, openEditModal );
                    }
                }
            });
            if (!hasResults) {
                listContainer.innerHTML = `<p>No ${platform} shoutouts found.</p>`;
            }
        } catch (error) {
            console.error(`Error loading ${platform} shoutouts:`, error);
            listContainer.innerHTML = `<p class="error">Error loading ${platform} shoutouts.</p>`;
            showAdminStatus(`Failed to load ${platform} data: ${error.message}`, true);
        }
    }

    async function handleAddShoutout(platform, formElement) {
       if (!formElement) return;
        const username = formElement.querySelector(`#${platform}-username`)?.value.trim();
        const nickname = formElement.querySelector(`#${platform}-nickname`)?.value.trim();
        const orderStr = formElement.querySelector(`#${platform}-order`)?.value.trim();
        const order = parseInt(orderStr);

        if (!username || !nickname || !orderStr || isNaN(order) || order < 0) {
           showAdminStatus(`Please provide Username, Nickname, and a valid non-negative Order number for ${platform}.`, true);
           return;
       }
       const accountData = { /* ... construct data ... */
            platform: platform, username: username, nickname: nickname, order: order,
            isVerified: formElement.querySelector(`#${platform}-isVerified`)?.checked || false,
            bio: formElement.querySelector(`#${platform}-bio`)?.value.trim() || null,
            profilePic: formElement.querySelector(`#${platform}-profilePic`)?.value.trim() || null,
            createdAt: serverTimestamp()
       };
       if (platform === 'youtube') {
           accountData.subscribers = formElement.querySelector(`#${platform}-subscribers`)?.value.trim() || 'N/A';
           accountData.coverPhoto = formElement.querySelector(`#${platform}-coverPhoto`)?.value.trim() || null;
       } else {
           accountData.followers = formElement.querySelector(`#${platform}-followers`)?.value.trim() || 'N/A';
       }
       try {
           const docRef = await addDoc(collection(db, 'shoutouts'), accountData); // Use imported 'db'
           console.log("Shoutout added with ID: ", docRef.id);
           await updateMetadataTimestamp(platform);
           showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout added.`, false);
           formElement.reset();
           if (typeof loadShoutoutsAdmin === 'function') loadShoutoutsAdmin(platform);
       } catch (error) {
           console.error(`Error adding ${platform} shoutout:`, error);
           showAdminStatus(`Error adding ${platform} shoutout: ${error.message}`, true);
       }
    }

    async function handleUpdateShoutout(event) {
        event.preventDefault();
        if (!editForm) return;
        const docId = editForm.getAttribute('data-doc-id');
        const platform = editForm.getAttribute('data-platform');
        if (!docId || !platform) { /* ... error handling ... */
            showAdminStatus("Error: Missing document ID or platform for update.", true);
            return;
        }
        const username = editUsernameInput?.value.trim();
        const nickname = editNicknameInput?.value.trim();
        const orderStr = editOrderInput?.value.trim();
        const order = parseInt(orderStr);
        if (!username || !nickname || !orderStr || isNaN(order) || order < 0) { /* ... error handling ... */
             showAdminStatus(`Update Error: Please provide Username, Nickname, and a valid non-negative Order number.`, true);
             return;
        }
        const updatedData = { /* ... construct data ... */
            username: username, nickname: nickname, order: order,
            isVerified: editIsVerifiedInput?.checked || false,
            bio: editBioInput?.value.trim() || null,
            profilePic: editProfilePicInput?.value.trim() || null,
        };
         if (platform === 'youtube') {
            updatedData.subscribers = editSubscribersInput?.value.trim() || 'N/A';
            updatedData.coverPhoto = editCoverPhotoInput?.value.trim() || null;
        } else {
            updatedData.followers = editFollowersInput?.value.trim() || 'N/A';
        }
        try {
            const docRef = doc(db, 'shoutouts', docId); // Use imported 'db'
            await updateDoc(docRef, updatedData);
            await updateMetadataTimestamp(platform);
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout updated.`, false);
            if (typeof closeEditModal === 'function') closeEditModal();
            if (typeof loadShoutoutsAdmin === 'function') loadShoutoutsAdmin(platform);
        } catch (error) {
            console.error(`Error updating ${platform} shoutout (ID: ${docId}):`, error);
            showAdminStatus(`Error updating ${platform} shoutout: ${error.message}`, true);
        }
    }

    if (editForm) {
        editForm.addEventListener('submit', handleUpdateShoutout);
    }

    async function handleDeleteShoutout(docId, platform, listItemElement) {
        if (!confirm(`Are you sure you want to delete this ${platform} shoutout?`)) return;
        try {
            await deleteDoc(doc(db, 'shoutouts', docId)); // Use imported 'db'
            await updateMetadataTimestamp(platform);
            showAdminStatus(`${platform} shoutout deleted.`, false);
            if (listItemElement) listItemElement.remove(); else if (typeof loadShoutoutsAdmin === 'function') loadShoutoutsAdmin(platform);
            // Check if list empty
            const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`);
            if (listContainer && listContainer.children.length === 0) {
                 listContainer.innerHTML = `<p>No ${platform} shoutouts found.</p>`;
            }
        } catch (error) {
            console.error(`Error deleting ${platform} shoutout (ID: ${docId}):`, error);
            showAdminStatus(`Error deleting ${platform} shoutout: ${error.message}`, true);
        }
    }

    // === ADDED START: Event Listeners for Social Links ===
    if (addSocialLinkForm) {
        addSocialLinkForm.addEventListener('submit', handleAddSocialLink);
        console.log("Add Social Link listener attached.");
    } else {
         console.warn("Add Social Link form not found.");
    }

    // Edit/Delete Button Clicks (using Event Delegation on the list container)
    if (socialLinksListAdmin) {
        socialLinksListAdmin.addEventListener('click', (event) => {
            const target = event.target; // The actual element clicked

            // Check if an Edit button within the list was clicked
            if (target.classList.contains('edit-social-link-button')) {
                const linkId = target.dataset.id; // Get ID from the button's data-id
                if (linkId) {
                    openEditSocialLinkModal(linkId);
                } else {
                    console.error("Edit button clicked but missing data-id attribute.");
                }
            }
            // Check if a Delete button within the list was clicked
            else if (target.classList.contains('delete-social-link-button')) {
                const linkId = target.dataset.id; // Get ID from the button's data-id
                if (linkId) {
                    handleDeleteSocialLink(linkId);
                } else {
                     console.error("Delete button clicked but missing data-id attribute.");
                }
            }
        });
        console.log("Social Link Edit/Delete listeners attached.");
    }

     // Edit Modal Form Submission
     if (editSocialLinkForm) {
        editSocialLinkForm.addEventListener('submit', handleUpdateSocialLink);
        console.log("Edit Social Link Modal save listener attached.");
    } else {
         console.warn("Edit Social Link modal form not found.");
    }

     // Edit Modal Cancel/Close Button
     if (cancelEditSocialLinkButton) {
         cancelEditSocialLinkButton.addEventListener('click', closeEditSocialLinkModal);
     }
      // Close modal if user clicks outside content
      window.addEventListener('click', (event) => {
        if (event.target === editSocialLinkModal) {
            closeEditSocialLinkModal();
        }
    });

    // --- Attach Event Listeners for Add Forms ---
    if (addShoutoutTiktokForm) addShoutoutTiktokForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('tiktok', addShoutoutTiktokForm); });
    if (addShoutoutInstagramForm) addShoutoutInstagramForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('instagram', addShoutoutInstagramForm); });
    if (addShoutoutYoutubeForm) addShoutoutYoutubeForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('youtube', addShoutoutYoutubeForm); });

    // --- Attach Event Listener for Profile Form ---
    if (profileForm) {
        profileForm.addEventListener('submit', saveProfileData);
        console.log("Profile save listener attached.");
    } else {
         console.warn("Profile form not found, save listener not attached.");
    }

}); // End DOMContentLoaded
