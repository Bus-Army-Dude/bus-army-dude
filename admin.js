// admin.js (Includes Inactivity Logout + Timer Display, Corrected Paths, Counts, Next Button Logic, Direct Links, and Import Fix)

// *** Import Firebase services from your corrected init file ***
import { db, auth } from './firebase-init.js'; // Ensure path is correct

// Import Firebase functions
// CORRECTED Import statement includes 'where'
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc, serverTimestamp, getDoc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => { //
    // First, check if db and auth were successfully imported/initialized
    if (!db || !auth) { //
         console.error("Firestore (db) or Auth not initialized correctly. Check firebase-init.js and imports."); //
         alert("FATAL ERROR: Firebase services failed to load. Admin panel disabled."); //
         return; // Stop executing if Firebase isn't ready
    }
    console.log("Admin DOM Loaded. Setting up UI and CRUD functions."); //

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
    const addShoutoutTiktokForm = document.getElementById('add-shoutout-tiktok-form'); //
    const shoutoutsTiktokListAdmin = document.getElementById('shoutouts-tiktok-list-admin'); //
    const addShoutoutInstagramForm = document.getElementById('add-shoutout-instagram-form'); //
    const shoutoutsInstagramListAdmin = document.getElementById('shoutouts-instagram-list-admin'); //
    const addShoutoutYoutubeForm = document.getElementById('add-shoutout-youtube-form'); //
    const shoutoutsYoutubeListAdmin = document.getElementById('shoutouts-youtube-list-admin'); //
    const editModal = document.getElementById('edit-shoutout-modal'); //
    const editForm = document.getElementById('edit-shoutout-form'); //
    const cancelEditButton = document.getElementById('cancel-edit-button'); //
    const editUsernameInput = document.getElementById('edit-username'); //
    const editNicknameInput = document.getElementById('edit-nickname'); //
    const editOrderInput = document.getElementById('edit-order'); //
    const editIsVerifiedInput = document.getElementById('edit-isVerified'); //
    const editBioInput = document.getElementById('edit-bio'); //
    const editProfilePicInput = document.getElementById('edit-profilePic'); //
    const editFollowersInput = document.getElementById('edit-followers'); //
    const editSubscribersInput = document.getElementById('edit-subscribers'); //
    const editCoverPhotoInput = document.getElementById('edit-coverPhoto'); //
    const editPlatformSpecificDiv = document.getElementById('edit-platform-specific'); //
    const profileForm = document.getElementById('profile-form'); //
    const profileUsernameInput = document.getElementById('profile-username'); //
    const profilePicUrlInput = document.getElementById('profile-pic-url'); //
    const profileBioInput = document.getElementById('profile-bio'); //
    const profileStatusInput = document.getElementById('profile-status'); //
    const profileStatusMessage = document.getElementById('profile-status-message'); //
    const adminPfpPreview = document.getElementById('admin-pfp-preview'); //
    const timerDisplayElement = document.getElementById('inactivity-timer-display'); //
    const nextButton = document.getElementById('next-button'); //
    const emailGroup = document.getElementById('email-group'); //
    const passwordGroup = document.getElementById('password-group'); //
    const loginButton = document.getElementById('login-button'); //

    // Firestore Reference for Profile
    const profileDocRef = doc(db, "site_config", "mainProfile"); //

    // --- Inactivity Logout Variables ---
    let inactivityTimer; //
    let expirationTime; //
    let displayIntervalId; //
    const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll']; //

    // --- Helper Functions ---
    function showAdminStatus(message, isError = false) { //
        if (!adminStatusElement) { console.warn("Admin status element not found"); return; } //
        adminStatusElement.textContent = message; //
        adminStatusElement.className = `status-message ${isError ? 'error' : 'success'}`; //
        setTimeout(() => { if (adminStatusElement) { adminStatusElement.textContent = ''; adminStatusElement.className = 'status-message'; } }, 5000); //
    }

    function showProfileStatus(message, isError = false) { //
        if (!profileStatusMessage) { console.warn("Profile status element not found"); showAdminStatus(message, isError); return; } //
        profileStatusMessage.textContent = message; //
        profileStatusMessage.className = `status-message ${isError ? 'error' : 'success'}`; //
        setTimeout(() => { if (profileStatusMessage) { profileStatusMessage.textContent = ''; profileStatusMessage.className = 'status-message'; } }, 5000); //
    }

    // --- Edit Modal Logic ---
    function openEditModal(docId, platform) { //
        if (!editModal || !editForm) { console.error("Edit modal/form not found."); showAdminStatus("UI Error: Cannot open edit form.", true); return; } //
        editForm.setAttribute('data-doc-id', docId); //
        editForm.setAttribute('data-platform', platform); //
        const docRef = doc(db, 'shoutouts', docId); //
        getDoc(docRef).then(docSnap => { //
            if (docSnap.exists()) { //
                const data = docSnap.data(); //
                if (editUsernameInput) editUsernameInput.value = data.username || ''; //
                if (editNicknameInput) editNicknameInput.value = data.nickname || ''; //
                if (editOrderInput) editOrderInput.value = data.order ?? ''; //
                if (editIsVerifiedInput) editIsVerifiedInput.checked = data.isVerified || false; //
                if (editBioInput) editBioInput.value = data.bio || ''; //
                if (editProfilePicInput) editProfilePicInput.value = data.profilePic || ''; //

                const followersDiv = editPlatformSpecificDiv?.querySelector('.edit-followers-group'); //
                const subscribersDiv = editPlatformSpecificDiv?.querySelector('.edit-subscribers-group'); //
                const coverPhotoDiv = editPlatformSpecificDiv?.querySelector('.edit-coverphoto-group'); //
                if (followersDiv) followersDiv.style.display = 'none'; //
                if (subscribersDiv) subscribersDiv.style.display = 'none'; //
                if (coverPhotoDiv) coverPhotoDiv.style.display = 'none'; //

                if (platform === 'youtube') { //
                    if (editSubscribersInput) editSubscribersInput.value = data.subscribers || 'N/A'; //
                    if (editCoverPhotoInput) editCoverPhotoInput.value = data.coverPhoto || ''; //
                    if (subscribersDiv) subscribersDiv.style.display = 'block'; //
                    if (coverPhotoDiv) coverPhotoDiv.style.display = 'block'; //
                } else { //
                    if (editFollowersInput) editFollowersInput.value = data.followers || 'N/A'; //
                    if (followersDiv) followersDiv.style.display = 'block'; //
                }
                editModal.style.display = 'block'; //
            } else { showAdminStatus("Error: Could not load data for editing.", true); } //
        }).catch(error => { showAdminStatus(`Error loading data: ${error.message}`, true); }); //
    }

    function closeEditModal() { //
        if (editModal) editModal.style.display = 'none'; //
        if (editForm) editForm.reset(); //
        editForm?.removeAttribute('data-doc-id'); //
        editForm?.removeAttribute('data-platform'); //
    }

    if (cancelEditButton) cancelEditButton.addEventListener('click', closeEditModal); //
    window.addEventListener('click', (event) => { if (event.target === editModal) closeEditModal(); }); //

    // --- MODIFIED: renderAdminListItem Function ---
    function renderAdminListItem(container, docId, platform, username, nickname, order, deleteHandler, editHandler) { //
        if (!container) { console.warn("List container not found"); return; } //

        const itemDiv = document.createElement('div'); //
        itemDiv.className = 'list-item-admin'; //
        itemDiv.setAttribute('data-id', docId); //

        // Construct direct link URL based on platform
        let directLinkUrl = '#'; // Default placeholder
        let safeUsername = username || ''; // Ensure username is not null/undefined
        if (platform === 'tiktok' && safeUsername) { //
            directLinkUrl = `https://tiktok.com/@${encodeURIComponent(safeUsername)}`; //
        } else if (platform === 'instagram' && safeUsername) { //
            directLinkUrl = `https://instagram.com/${encodeURIComponent(safeUsername)}`; //
        } else if (platform === 'youtube' && safeUsername) { //
            // YouTube uses handles, ensure username includes '@' if needed or adjust logic
            directLinkUrl = `https://youtube.com/$${encodeURIComponent(safeUsername)}`; //
        }

        // Build inner HTML with the direct link
        itemDiv.innerHTML = `
            <div class="item-content">
                 <div class="item-details"> {/* Wrapper for text */}
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

        const editButton = itemDiv.querySelector('.edit-button'); //
        if (editButton) editButton.addEventListener('click', () => editHandler(docId, platform)); //

        const deleteButton = itemDiv.querySelector('.delete-button'); //
        if (deleteButton) deleteButton.addEventListener('click', () => deleteHandler(docId, platform, itemDiv)); //

        container.appendChild(itemDiv); //
    }
    // --- END MODIFIED: renderAdminListItem Function ---

    // --- Function to Load Profile Data ---
    async function loadProfileData() { //
        if (!auth || !auth.currentUser) { console.warn("Auth not ready/user not logged in"); return; } //
        if (!profileForm) { console.log("Profile form not found"); return; } //
        console.log("Attempting to load profile data..."); //
        try {
            const docSnap = await getDoc(profileDocRef); //
            if (docSnap.exists()) { //
                const data = docSnap.data(); //
                console.log("Loaded profile data:", data); //
                if(profileUsernameInput) profileUsernameInput.value = data.username || ''; //
                if(profilePicUrlInput) profilePicUrlInput.value = data.profilePicUrl || ''; //
                if(profileBioInput) profileBioInput.value = data.bio || ''; //
                if(profileStatusInput) profileStatusInput.value = data.status || 'offline'; //
                if (adminPfpPreview && data.profilePicUrl) { adminPfpPreview.src = data.profilePicUrl; adminPfpPreview.style.display = 'inline-block'; } //
                else if (adminPfpPreview) { adminPfpPreview.style.display = 'none'; } //
            } else { console.log("Profile document does not exist yet."); } //
        } catch (error) { console.error("Error loading profile data:", error); showProfileStatus("Error loading profile data.", true); } //
    }

    // --- Function to Save Profile Data ---
    async function saveProfileData(event) { //
        event.preventDefault(); //
        if (!auth || !auth.currentUser) { showProfileStatus("Error: Not logged in.", true); return; } //
        if (!profileForm) return; //
        const newData = { //
            username: profileUsernameInput?.value.trim() || "", //
            profilePicUrl: profilePicUrlInput?.value.trim() || "", //
            bio: profileBioInput?.value.trim() || "", //
            status: profileStatusInput?.value || "offline", //
            lastUpdated: serverTimestamp() //
        };
        showProfileStatus("Saving profile..."); //
        try {
            await setDoc(profileDocRef, newData, { merge: true }); //
            console.log("Profile data saved."); showProfileStatus("Profile updated successfully!", false); //
        } catch (error) { console.error("Error saving profile data:", error); showProfileStatus(`Error saving profile: ${error.message}`, true); } //
    }

    // --- Inactivity Logout & Timer Display Functions ---
    function updateTimerDisplay() { //
        if (!timerDisplayElement) return; //
        const now = Date.now(); //
        const remainingMs = expirationTime - now; //
        if (remainingMs <= 0) { //
            timerDisplayElement.textContent = "00:00"; //
            clearInterval(displayIntervalId); //
        } else {
            const remainingSeconds = Math.round(remainingMs / 1000); //
            const minutes = Math.floor(remainingSeconds / 60); //
            const seconds = remainingSeconds % 60; //
            timerDisplayElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; //
        }
    }

    function logoutDueToInactivity() { //
        console.log("Logging out due to inactivity."); //
        clearTimeout(inactivityTimer); //
        clearInterval(displayIntervalId); //
        if (timerDisplayElement) timerDisplayElement.textContent = ''; //
        removeActivityListeners(); //
        signOut(auth).catch((error) => { console.error("Error during inactivity logout:", error); }); //
    }

    function resetInactivityTimer() { //
        clearTimeout(inactivityTimer); //
        clearInterval(displayIntervalId); //
        expirationTime = Date.now() + INACTIVITY_TIMEOUT_MS; //
        inactivityTimer = setTimeout(logoutDueToInactivity, INACTIVITY_TIMEOUT_MS); //
        if (timerDisplayElement) { //
             updateTimerDisplay(); //
             displayIntervalId = setInterval(updateTimerDisplay, 1000); //
        }
    }

    function addActivityListeners() { //
        console.log("Adding activity listeners."); //
        activityEvents.forEach(eventName => { document.addEventListener(eventName, resetInactivityTimer, true); }); //
    }

    function removeActivityListeners() { //
        console.log("Removing activity listeners."); //
        clearTimeout(inactivityTimer); //
        clearInterval(displayIntervalId); //
        if (timerDisplayElement) timerDisplayElement.textContent = ''; //
        activityEvents.forEach(eventName => { document.removeEventListener(eventName, resetInactivityTimer, true); }); //
    }

    // --- 'Next' Button Logic ---
    if (nextButton && emailInput && authStatus && emailGroup && passwordGroup && loginButton) { //
        nextButton.addEventListener('click', () => { //
            const userEmail = emailInput.value.trim(); //
            if (userEmail) { //
                authStatus.textContent = `Welcome back, ${userEmail}`; //
                authStatus.className = 'status-message'; //
                authStatus.style.display = 'block'; //
                emailGroup.style.display = 'none'; //
                nextButton.style.display = 'none'; //
                passwordGroup.style.display = 'block'; //
                loginButton.style.display = 'inline-block'; // Or 'block'
                if(passwordInput) { passwordInput.focus(); } //
            } else {
                authStatus.textContent = 'Please enter your email address.'; //
                authStatus.className = 'status-message error'; //
                authStatus.style.display = 'block'; //
            }
        });
    } else {
         console.warn("Could not find all necessary elements for the 'Next' button functionality."); //
    }

    // --- Authentication Logic ---
    onAuthStateChanged(auth, user => { //
        if (user) { //
            // User is signed in
            if (loginSection) loginSection.style.display = 'none'; //
            if (adminContent) adminContent.style.display = 'block'; //
            if (logoutButton) logoutButton.style.display = 'inline-block'; //
            if (adminGreeting) adminGreeting.textContent = `Logged in as: ${user.email}`; //
            if (authStatus) { authStatus.textContent = ''; authStatus.className = 'status-message'; authStatus.style.display = 'none'; } //
            if (adminStatusElement) { adminStatusElement.textContent = ''; adminStatusElement.className = 'status-message'; } //

            loadProfileData(); //
            if (typeof loadShoutoutsAdmin === 'function') { //
                 if (shoutoutsTiktokListAdmin) loadShoutoutsAdmin('tiktok'); //
                 if (shoutoutsInstagramListAdmin) loadShoutoutsAdmin('instagram'); //
                 if (shoutoutsYoutubeListAdmin) loadShoutoutsAdmin('youtube'); //
            } else { console.error("loadShoutoutsAdmin function is not defined!"); } //

            resetInactivityTimer(); //
            addActivityListeners(); //

        } else {
            // User is signed out
            if (loginSection) loginSection.style.display = 'block'; //
            if (adminContent) adminContent.style.display = 'none'; //
            if (logoutButton) logoutButton.style.display = 'none'; //
            if (adminGreeting) adminGreeting.textContent = ''; //
            if (typeof closeEditModal === 'function') closeEditModal(); //

            // Reset the login form state
            if (emailGroup) emailGroup.style.display = 'block'; //
            if (passwordGroup) passwordGroup.style.display = 'none'; //
            if (nextButton) nextButton.style.display = 'inline-block'; // Or 'block'
            if (loginButton) loginButton.style.display = 'none'; //
            if (authStatus) { authStatus.textContent = ''; authStatus.style.display = 'none'; } // Hide status message
            if (loginForm) loginForm.reset(); // Clear email/password inputs

            removeActivityListeners(); //
        }
    });

    // Login Form Submission
    if (loginForm) { //
        loginForm.addEventListener('submit', (e) => { //
            e.preventDefault(); //
            const email = emailInput.value; //
            const password = passwordInput.value; //
            if (!email || !password) { //
                 if (passwordGroup && passwordGroup.style.display !== 'none' && !password) { //
                     if (authStatus) { authStatus.textContent = 'Please enter your password.'; authStatus.className = 'status-message error'; authStatus.style.display = 'block';} //
                 } else if (!email) { //
                     if (authStatus) { authStatus.textContent = 'Please enter your email.'; authStatus.className = 'status-message error'; authStatus.style.display = 'block';} //
                 }
                 return; //
            }
            if (authStatus) { authStatus.textContent = 'Logging in...'; authStatus.className = 'status-message'; authStatus.style.display = 'block'; } //
            signInWithEmailAndPassword(auth, email, password) //
                .then((userCredential) => { console.log("Login successful"); /* State handled by onAuthStateChanged */ }) //
                .catch((error) => { //
                    console.error("Login failed:", error.code, error.message); //
                    let errorMessage = 'Invalid email or password.'; //
                    if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email format.'; //
                    else if (error.code === 'auth/user-disabled') errorMessage = 'Account disabled.'; //
                    else if (error.code === 'auth/invalid-credential') errorMessage = 'Invalid email or password.'; //
                    else if (error.code === 'auth/too-many-requests') errorMessage = 'Too many attempts. Try again later.'; //
                    else errorMessage = `Error (${error.code}).`; //
                    if (authStatus) { authStatus.textContent = `Login Failed: ${errorMessage}`; authStatus.className = 'status-message error'; authStatus.style.display = 'block'; } //
                });
        });
    }

    // Logout Button
    if (logoutButton) { //
        logoutButton.addEventListener('click', () => { //
            removeActivityListeners(); //
            signOut(auth).then(() => { console.log("User signed out."); }) //
                         .catch((error) => { console.error("Logout failed:", error); showAdminStatus(`Logout Failed: ${error.message}`, true); }); //
        });
    }

    // --- Shoutouts Load/Add/Delete/Update ---

    function getMetadataRef() { //
        // Ensure 'siteConfig' is the correct path in Firestore
        return doc(db, 'siteConfig', 'shoutoutsMetadata'); //
    }

    async function updateMetadataTimestamp(platform) { //
         const metaRef = getMetadataRef(); //
         try {
             await setDoc(metaRef, { [`lastUpdatedTime_${platform}`]: serverTimestamp() }, { merge: true }); //
             console.log(`Metadata timestamp updated for ${platform}.`); //
         } catch (error) { console.error(`Error updating timestamp for ${platform}:`, error); showAdminStatus(`Warning: Could not update timestamp for ${platform}.`, true); } //
    }

    // --- MODIFIED: loadShoutoutsAdmin Function ---
    async function loadShoutoutsAdmin(platform) { //
        const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`); //
        const countElement = document.getElementById(`${platform}-count`); //
        if (!listContainer) return; //
        if (countElement) countElement.textContent = ''; //
        listContainer.innerHTML = `<p>Loading ${platform} shoutouts...</p>`; //

        try {
            // Query shoutouts, filter by platform, order by 'order' field
            const shoutoutsCol = collection(db, 'shoutouts'); //
            // This query now requires the composite index created in Firebase console
             const shoutoutQuery = query(shoutoutsCol, where("platform", "==", platform), orderBy("order", "asc")); //

            const querySnapshot = await getDocs(shoutoutQuery); //
            listContainer.innerHTML = ''; // Clear loading message
            let count = 0; //

            querySnapshot.forEach(docSnapshot => { //
                const account = docSnapshot.data(); //
                count++; //
                const nickname = account.nickname || 'N/A'; //
                const username = account.username || 'N/A'; // Make sure username is retrieved
                const order = account.order ?? 'N/A'; //

                // Call renderAdminListItem with individual data fields
                if (typeof renderAdminListItem === 'function') { //
                    renderAdminListItem( //
                        listContainer, //
                        docSnapshot.id, //
                        platform, //
                        username, // Pass username
                        nickname, // Pass nickname
                        order,    // Pass order
                        handleDeleteShoutout, //
                        openEditModal //
                    );
                }
            });

            if (countElement) { countElement.textContent = `(${count})`; } //
            if (count === 0) { listContainer.innerHTML = `<p>No ${platform} shoutouts found.</p>`; } //
        } catch (error) {
            console.error(`Error loading ${platform} shoutouts:`, error); //
            // Check for index error message specifically
            if (error.code === 'failed-precondition') { //
                 listContainer.innerHTML = `<p class="error">Error: Missing Firestore index for this query. Check the developer console (F12) for a link to create it.</p>`; //
            } else {
                 listContainer.innerHTML = `<p class="error">Error loading ${platform} shoutouts.</p>`; //
            }
            showAdminStatus(`Failed to load ${platform} data: ${error.message}`, true); //
            if (countElement) countElement.textContent = '(Error)'; //
        }
    }
    // --- END MODIFIED: loadShoutoutsAdmin Function ---


    async function handleAddShoutout(platform, formElement) { //
        if (!formElement) return; //
        const username = formElement.querySelector(`#${platform}-username`)?.value.trim(); //
        const nickname = formElement.querySelector(`#${platform}-nickname`)?.value.trim(); //
        const orderStr = formElement.querySelector(`#${platform}-order`)?.value.trim(); //
        const order = parseInt(orderStr); //
        if (!username || !nickname || !orderStr || isNaN(order) || order < 0) { showAdminStatus(`Invalid input for ${platform}. Check fields.`, true); return; } //
        const accountData = { //
            platform: platform, username: username, nickname: nickname, order: order, //
            isVerified: formElement.querySelector(`#${platform}-isVerified`)?.checked || false, //
            bio: formElement.querySelector(`#${platform}-bio`)?.value.trim() || null, //
            profilePic: formElement.querySelector(`#${platform}-profilePic`)?.value.trim() || null, //
            createdAt: serverTimestamp() //
        };
        if (platform === 'youtube') { //
            accountData.subscribers = formElement.querySelector(`#${platform}-subscribers`)?.value.trim() || 'N/A'; //
            accountData.coverPhoto = formElement.querySelector(`#${platform}-coverPhoto`)?.value.trim() || null; //
        } else {
            accountData.followers = formElement.querySelector(`#${platform}-followers`)?.value.trim() || 'N/A'; //
        }
        try {
            const docRef = await addDoc(collection(db, 'shoutouts'), accountData); //
            console.log("Shoutout added:", docRef.id); //
            await updateMetadataTimestamp(platform); //
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout added.`, false); //
            formElement.reset(); //
            if (typeof loadShoutoutsAdmin === 'function') loadShoutoutsAdmin(platform); //
        } catch (error) { console.error(`Error adding ${platform} shoutout:`, error); showAdminStatus(`Error adding ${platform} shoutout: ${error.message}`, true); } //
    }

    async function handleUpdateShoutout(event) { //
        event.preventDefault(); //
        if (!editForm) return; //
        const docId = editForm.getAttribute('data-doc-id'); //
        const platform = editForm.getAttribute('data-platform'); //
        if (!docId || !platform) { showAdminStatus("Error: Missing doc ID/platform for update.", true); return; } //
        const username = editUsernameInput?.value.trim(); //
        const nickname = editNicknameInput?.value.trim(); //
        const orderStr = editOrderInput?.value.trim(); //
        const order = parseInt(orderStr); //
        if (!username || !nickname || !orderStr || isNaN(order) || order < 0) { showAdminStatus(`Update Error: Invalid input. Check fields.`, true); return; } //
        const updatedData = { //
            username: username, nickname: nickname, order: order, //
            isVerified: editIsVerifiedInput?.checked || false, //
            bio: editBioInput?.value.trim() || null, //
            profilePic: editProfilePicInput?.value.trim() || null, //
        };
        if (platform === 'youtube') { //
            updatedData.subscribers = editSubscribersInput?.value.trim() || 'N/A'; //
            updatedData.coverPhoto = editCoverPhotoInput?.value.trim() || null; //
        } else {
            updatedData.followers = editFollowersInput?.value.trim() || 'N/A'; //
        }
        try {
            const docRef = doc(db, 'shoutouts', docId); //
            await updateDoc(docRef, updatedData); //
            await updateMetadataTimestamp(platform); //
            showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout updated.`, false); //
            if (typeof closeEditModal === 'function') closeEditModal(); //
            if (typeof loadShoutoutsAdmin === 'function') loadShoutoutsAdmin(platform); //
        } catch (error) { console.error(`Error updating ${platform} shoutout (ID: ${docId}):`, error); showAdminStatus(`Error updating ${platform} shoutout: ${error.message}`, true); } //
    }

    async function handleDeleteShoutout(docId, platform, listItemElement) { //
        if (!confirm(`Are you sure you want to delete this ${platform} shoutout?`)) return; //
        try {
            await deleteDoc(doc(db, 'shoutouts', docId)); //
            await updateMetadataTimestamp(platform); //
            showAdminStatus(`${platform} shoutout deleted.`, false); //
            if (listItemElement) { //
                 listItemElement.remove(); // Remove immediately from UI
                 // Reload is needed to update count accurately
                 if (typeof loadShoutoutsAdmin === 'function') loadShoutoutsAdmin(platform); //
            } else if (typeof loadShoutoutsAdmin === 'function') { //
                 // Fallback reload if element wasn't passed
                 loadShoutoutsAdmin(platform); //
            }
        } catch (error) { console.error(`Error deleting ${platform} shoutout (ID: ${docId}):`, error); showAdminStatus(`Error deleting ${platform} shoutout: ${error.message}`, true); } //
    }

    // --- Attach Event Listeners for Forms ---
    if (addShoutoutTiktokForm) addShoutoutTiktokForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('tiktok', addShoutoutTiktokForm); }); //
    if (addShoutoutInstagramForm) addShoutoutInstagramForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('instagram', addShoutoutInstagramForm); }); //
    if (addShoutoutYoutubeForm) addShoutoutYoutubeForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('youtube', addShoutoutYoutubeForm); }); //
    if (profileForm) profileForm.addEventListener('submit', saveProfileData); //
    if (editForm) editForm.addEventListener('submit', handleUpdateShoutout); //

}); // End DOMContentLoaded
