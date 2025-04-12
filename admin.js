// admin.js (Corrected to use 'siteConfig' path for metadata)

// *** Import Firebase services from your corrected init file ***
import { db, auth } from './firebase-init.js'; // Ensure path is correct

// Import Firebase functions
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

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

    // Firestore Reference for Profile
    // Assuming profile data is under 'site_config' as per displayShoutouts.js
    // If profile is ALSO under 'siteConfig', change this path too!
    const profileDocRef = doc(db, "site_config", "mainProfile");


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
            // Using profileDocRef defined earlier (which uses 'site_config')
            // ** If your ACTUAL profile data is under 'siteConfig', change profileDocRef definition **
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
            lastUpdated: serverTimestamp() // Timestamp for profile itself
        };

        showProfileStatus("Saving profile...");

        try {
            // Use the imported 'db' instance and profileDocRef
            await setDoc(profileDocRef, newData, { merge: true });
            console.log("Profile data saved successfully.");
            showProfileStatus("Profile updated successfully!", false);
        } catch (error) {
            console.error("Error saving profile data:", error);
            showProfileStatus(`Error saving profile: ${error.message}`, true);
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

    // CORRECTED function to get reference to the metadata document
    function getMetadataRef() {
        // Use 'siteConfig' to match database structure and displayShoutouts.js
        return doc(db, 'siteConfig', 'shoutoutsMetadata');
    }

    // Function to update the timestamp in the metadata document
    async function updateMetadataTimestamp(platform) {
         const metaRef = getMetadataRef(); // Uses the corrected path now
         try {
             await setDoc(metaRef, { [`lastUpdatedTime_${platform}`]: serverTimestamp() }, { merge: true });
             console.log(`Metadata timestamp updated for ${platform}.`);
         } catch (error) {
             console.error(`Error updating metadata timestamp for ${platform}:`, error);
             showAdminStatus(`Warning: Could not update timestamp for ${platform}.`, true);
         }
    }

    // Load shoutouts for the admin list view
    async function loadShoutoutsAdmin(platform) {
        const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`);
        // --- ADDED: Get reference to the count span ---
        const countElement = document.getElementById(`${platform}-count`);

        if (!listContainer) return;

        // --- ADDED: Clear previous count ---
        if (countElement) countElement.textContent = '';

        listContainer.innerHTML = `<p>Loading ${platform} shoutouts...</p>`;

        try {
            const querySnapshot = await getDocs(collection(db, 'shoutouts')); // Use imported 'db'
            listContainer.innerHTML = ''; // Clear loading message

            // --- MODIFIED: Use a counter instead of just hasResults ---
            let count = 0; // Initialize count for this platform

            querySnapshot.forEach(docSnapshot => {
                const account = docSnapshot.data();
                if (account.platform === platform) {
                    count++; // Increment count if platform matches
                    const nickname = account.nickname || 'No Nickname';
                    const username = account.username || 'No Username';
                    const order = account.order ?? 'N/A';
                    const content = `<strong>${nickname}</strong> (@${username}) - Order: ${order}`;
                    if (typeof renderAdminListItem === 'function') {
                        renderAdminListItem( listContainer, docSnapshot.id, platform, content, handleDeleteShoutout, openEditModal );
                    }
                }
            });

            // --- ADDED: Update the count display ---
            if (countElement) {
                countElement.textContent = `(${count})`; // Display the count
            }

            // --- MODIFIED: Use the calculated count to check if empty ---
            if (count === 0) {
                listContainer.innerHTML = `<p>No ${platform} shoutouts found.</p>`;
            }

        } catch (error) {
            console.error(`Error loading ${platform} shoutouts:`, error);
            listContainer.innerHTML = `<p class="error">Error loading ${platform} shoutouts.</p>`;
            showAdminStatus(`Failed to load ${platform} data: ${error.message}`, true);
             // --- ADDED: Clear count on error too ---
             if (countElement) countElement.textContent = '(Error)';
        }
    }
    
    // Handle adding a new shoutout
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
       const accountData = {
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
           await updateMetadataTimestamp(platform); // Use corrected path via getMetadataRef
           showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout added.`, false);
           formElement.reset();
           if (typeof loadShoutoutsAdmin === 'function') loadShoutoutsAdmin(platform);
       } catch (error) {
           console.error(`Error adding ${platform} shoutout:`, error);
           showAdminStatus(`Error adding ${platform} shoutout: ${error.message}`, true);
       }
    }

    // Handle updating an existing shoutout (from edit modal)
    async function handleUpdateShoutout(event) {
        event.preventDefault();
        if (!editForm) return;
        const docId = editForm.getAttribute('data-doc-id');
        const platform = editForm.getAttribute('data-platform');
        if (!docId || !platform) {
            showAdminStatus("Error: Missing document ID or platform for update.", true);
            return;
        }
        const username = editUsernameInput?.value.trim();
        const nickname = editNicknameInput?.value.trim();
        const orderStr = editOrderInput?.value.trim();
        const order = parseInt(orderStr);
        if (!username || !nickname || !orderStr || isNaN(order) || order < 0) {
             showAdminStatus(`Update Error: Please provide Username, Nickname, and a valid non-negative Order number.`, true);
             return;
        }
        const updatedData = {
            username: username, nickname: nickname, order: order,
            isVerified: editIsVerifiedInput?.checked || false,
            bio: editBioInput?.value.trim() || null,
            profilePic: editProfilePicInput?.value.trim() || null,
            // Note: createdAt is not updated here, which is usually correct.
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
            await updateMetadataTimestamp(platform); // Use corrected path via getMetadataRef
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

    // Handle deleting a shoutout
    async function handleDeleteShoutout(docId, platform, listItemElement) {
        if (!confirm(`Are you sure you want to delete this ${platform} shoutout?`)) return;
        try {
            await deleteDoc(doc(db, 'shoutouts', docId)); // Use imported 'db'
            await updateMetadataTimestamp(platform); // Use corrected path via getMetadataRef
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
