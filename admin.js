// admin.js

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCIZ0fri5V1E2si1xXpBPQQJqj1F_KuuG0", // Use your actual API key
    authDomain: "busarmydudewebsite.firebaseapp.com",
    projectId: "busarmydudewebsite",
    storageBucket: "busarmydudewebsite.firebasestorage.app", // Ensure this matches your project
    messagingSenderId: "42980404680",
    appId: "1:42980404680:web:f4f1e54789902a4295e4fd",
    measurementId: "G-DQPH8YL789" // Optional
};

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
// Uncomment if you need Analytics:
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";

let db, auth;

try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    // Uncomment if you need Analytics:
    // const analytics = getAnalytics(app);
    console.log("Firebase initialized successfully by admin.js.");

} catch (error) {
    console.error("CRITICAL FIREBASE INITIALIZATION ERROR:", error);
    alert("FATAL ERROR: Cannot connect to Firebase. Admin Portal functionality disabled.\n\n" + error.message);
    // Attempt to display error message even if DOMContentLoaded hasn't fired yet
    const loginSectionElement = document.getElementById('login-section');
    if (loginSectionElement) loginSectionElement.innerHTML = '<h2 style="color: red;">Firebase Initialization Failed. Cannot load Admin Portal. Check Console.</h2>';
    throw error; // Stop script execution
}

document.addEventListener('DOMContentLoaded', () => {
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
    const editBioInput = document.getElementById('edit-bio');
    const editProfilePicInput = document.getElementById('edit-profilePic');
    const editFollowersInput = document.getElementById('edit-followers');
    const editSubscribersInput = document.getElementById('edit-subscribers');
    const editCoverPhotoInput = document.getElementById('edit-coverPhoto');
    const editPlatformSpecificDiv = document.getElementById('edit-platform-specific');

    // *** START: Add Region Management DOM References ***
    const regionListContainer = document.getElementById('region-list-container');
    const saveRegionButton = document.getElementById('save-region-changes');
    const regionStatus = document.getElementById('region-status');
    // *** END: Add Region Management DOM References ***

    // --- Helper Functions ---
    function showAdminStatus(message, isError = false) {
        if (!adminStatusElement) {
            console.warn("Admin status element not found");
            return;
        }
        adminStatusElement.textContent = message;
        adminStatusElement.className = `status-message ${isError ? 'error' : 'success'}`;
        // Automatically clear non-error messages after 5 seconds
        if (!isError) {
             setTimeout(() => {
                if (adminStatusElement && adminStatusElement.textContent === message) { // Check if message is still the same
                     adminStatusElement.textContent = '';
                     adminStatusElement.className = 'status-message';
                }
             }, 5000);
        }
    }
     // Helper specifically for region status messages
     function showRegionStatus(message, isError = false) {
        if (!regionStatus) {
             console.warn("Region status element not found");
             return;
         }
         regionStatus.textContent = message;
         regionStatus.className = `status-message ${isError ? 'error' : 'success'}`;
         // Automatically clear non-error messages after 5 seconds
         if (!isError) {
             setTimeout(() => {
                 if (regionStatus && regionStatus.textContent === message) { // Check if message is still the same
                     regionStatus.textContent = '';
                     regionStatus.className = 'status-message';
                 }
             }, 5000);
         }
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
        const docRef = doc(db, 'shoutouts', docId);
        getDoc(docRef).then(docSnap => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (editUsernameInput) editUsernameInput.value = data.username || '';
                if (editNicknameInput) editNicknameInput.value = data.nickname || '';
                if (editOrderInput) editOrderInput.value = data.order ?? ''; // Use ?? for 0
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

    // Close modal if cancel button exists and is clicked
    if (cancelEditButton) {
        cancelEditButton.addEventListener('click', closeEditModal);
    }
    // Close modal if user clicks outside the modal content
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

    // --- Authentication Logic ---
    onAuthStateChanged(auth, user => {
        if (user) {
            // User is signed in
            if (loginSection) loginSection.style.display = 'none';
            if (adminContent) adminContent.style.display = 'block';
            if (logoutButton) logoutButton.style.display = 'inline-block';
            if (adminGreeting) adminGreeting.textContent = `Logged in as: ${user.email}`;
            if (authStatus) {
                authStatus.textContent = '';
                authStatus.className = 'status-message';
            }
            if (adminStatusElement) {
                adminStatusElement.textContent = '';
                adminStatusElement.className = 'status-message';
            }

            // --- Load ALL Admin Data on Login ---
            if (shoutoutsTiktokListAdmin) loadShoutoutsAdmin('tiktok');
            if (shoutoutsInstagramListAdmin) loadShoutoutsAdmin('instagram');
            if (shoutoutsYoutubeListAdmin) loadShoutoutsAdmin('youtube');

            // *** Load Region Data ***
            loadAndDisplayRegions(); // Call the function to load regions

        } else {
            // User is signed out
            if (loginSection) loginSection.style.display = 'block';
            if (adminContent) adminContent.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'none';
            if (adminGreeting) adminGreeting.textContent = '';
            closeEditModal(); // Ensure edit modal is closed on logout

            // *** Clear dynamic content on logout ***
            if (shoutoutsTiktokListAdmin) shoutoutsTiktokListAdmin.innerHTML = '';
            if (shoutoutsInstagramListAdmin) shoutoutsInstagramListAdmin.innerHTML = '';
            if (shoutoutsYoutubeListAdmin) shoutoutsYoutubeListAdmin.innerHTML = '';
            if (regionListContainer) regionListContainer.innerHTML = ''; // Clear region list
            if (regionStatus) regionStatus.textContent = ''; // Clear region status
            if (adminStatusElement) adminStatusElement.textContent = ''; // Clear general admin status
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
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log("Login successful for:", userCredential.user.email);
                    if (authStatus) {
                        authStatus.textContent = '';
                        authStatus.className = 'status-message';
                    }
                })
                .catch((error) => {
                    console.error("Login failed:", error.code, error.message);
                    let errorMessage = 'Invalid email or password.';
                    if (error.code === 'auth/invalid-email') { errorMessage = 'Invalid email format.'; }
                    else if (error.code === 'auth/user-disabled') { errorMessage = 'This user account has been disabled.'; }
                    else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') { errorMessage = 'Invalid email or password.'; }
                    else if (error.code === 'auth/too-many-requests') { errorMessage = 'Too many login attempts. Please try again later.'; }
                    else { errorMessage = `An unexpected error occurred (${error.code}).`; }
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
            signOut(auth).then(() => {
                console.log("User signed out successfully.");
            }).catch((error) => {
                console.error("Logout failed:", error);
                showAdminStatus(`Logout Failed: ${error.message}`, true);
            });
        });
    }

    // --- Shoutouts Load/Add/Delete/Update --- (Keep your existing functions)
    function getMetadataRef() { return doc(db, 'siteConfig', 'shoutoutsMetadata'); }
    async function updateMetadataTimestamp(platform) { /* ... Keep existing ... */ }
    async function loadShoutoutsAdmin(platform) { /* ... Keep existing ... */ }
    async function handleAddShoutout(platform, formElement) { /* ... Keep existing ... */ }
    async function handleUpdateShoutout(event) { /* ... Keep existing ... */ }
    async function handleDeleteShoutout(docId, platform, listItemElement) { /* ... Keep existing ... */ }

    // *** START: Region Availability Management Functions ***
    async function loadAndDisplayRegions() {
        // Use the specific region status element
        const statusDiv = regionStatus; // Reference added at the top
        const container = regionListContainer; // Reference added at the top
        const saveButton = saveRegionButton; // Reference added at the top

        if (!container || !statusDiv || !saveButton) {
            console.error("Region management UI elements not found. Cannot load regions.");
            showAdminStatus("UI Error: Region management section not found.", true); // Show error in main status
            return;
        }

        container.innerHTML = '<p>Loading regions...</p>';
        statusDiv.textContent = ''; // Clear previous status
        saveButton.disabled = true;

        try {
            const docRef = doc(db, "settings", "regionAvailability");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const regions = docSnap.data();
                container.innerHTML = ''; // Clear loading message
                const sortedCodes = Object.keys(regions).sort();

                sortedCodes.forEach(code => {
                    const isAvailable = regions[code];
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'region-item';

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `region-${code}`;
                    checkbox.checked = isAvailable;
                    checkbox.dataset.countryCode = code;

                    const label = document.createElement('label');
                    label.htmlFor = `region-${code}`;
                    label.textContent = code;

                    itemDiv.appendChild(checkbox);
                    itemDiv.appendChild(label);
                    container.appendChild(itemDiv);
                });
                saveButton.disabled = false; // Enable save button
            } else {
                container.innerHTML = '<p>Region configuration not found in database.</p>';
                showRegionStatus('Error: Region configuration document missing.', true);
                console.error("Region availability document ('settings/regionAvailability') not found!");
            }
        } catch (error) {
            container.innerHTML = '<p>Error loading region settings.</p>';
            showRegionStatus(`Error loading regions: ${error.message}`, true);
            console.error('Error fetching region availability:', error);
        }
    }

    async function saveRegionChanges() {
        const statusDiv = regionStatus; // Use specific status div
        const container = regionListContainer; // Use specific container
        const saveButton = saveRegionButton; // Use specific button

        if (!container || !statusDiv || !saveButton) {
            console.error("Region management UI elements not found. Cannot save regions.");
            showAdminStatus("UI Error: Region management section not found.", true); // Show error in main status
            return;
        }

        saveButton.disabled = true;
        showRegionStatus('Saving region settings...'); // Use specific status function

        const updatedAvailability = {};
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');

        if (checkboxes.length === 0) {
            showRegionStatus("No regions found to save.", true);
            saveButton.disabled = false;
            return;
        }

        checkboxes.forEach(checkbox => {
            const countryCode = checkbox.dataset.countryCode;
            if (countryCode) {
                updatedAvailability[countryCode] = checkbox.checked;
            } else {
                 console.warn("Checkbox found without country code:", checkbox);
             }
        });

        try {
            const docRef = doc(db, "settings", "regionAvailability");
            await setDoc(docRef, updatedAvailability); // Overwrite document with new map
            showRegionStatus('Region availability updated successfully!'); // Use specific status function
            console.log('Region availability updated in Firestore.');
        } catch (error) {
            showRegionStatus(`Error saving region settings: ${error.message}`, true); // Use specific status function
            console.error('Error updating region availability:', error);
        } finally {
            saveButton.disabled = false;
        }
    }
    // *** END: Region Availability Management Functions ***


    // --- Attach Event Listeners ---

    // Shoutout Add Forms
    if (addShoutoutTiktokForm) addShoutoutTiktokForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('tiktok', addShoutoutTiktokForm); });
    if (addShoutoutInstagramForm) addShoutoutInstagramForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('instagram', addShoutoutInstagramForm); });
    if (addShoutoutYoutubeForm) addShoutoutYoutubeForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('youtube', addShoutoutYoutubeForm); });

    // Shoutout Edit Form
    if (editForm) {
        editForm.addEventListener('submit', handleUpdateShoutout);
    }

    // *** Add Event Listener for Save Region Button ***
    if (saveRegionButton) {
        saveRegionButton.addEventListener('click', saveRegionChanges);
         console.log("Event listener attached to save-region-changes button.");
    } else {
        console.warn("Save region changes button not found. Listener not attached.");
    }

}); // End DOMContentLoaded
