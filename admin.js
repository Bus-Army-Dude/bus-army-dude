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

  // Shoutout Forms & Lists (assuming IDs match your HTML)
  const addShoutoutTiktokForm = document.getElementById('add-shoutout-tiktok-form');
  const shoutoutsTiktokListAdmin = document.getElementById('shoutouts-tiktok-list-admin');
  const addShoutoutInstagramForm = document.getElementById('add-shoutout-instagram-form');
  const shoutoutsInstagramListAdmin = document.getElementById('shoutouts-instagram-list-admin');
  const addShoutoutYoutubeForm = document.getElementById('add-shoutout-youtube-form');
  const shoutoutsYoutubeListAdmin = document.getElementById('shoutouts-youtube-list-admin');

  // Edit Modal Elements (You'll need to add this structure to your admin.html)
  const editModal = document.getElementById('edit-shoutout-modal');
  const editForm = document.getElementById('edit-shoutout-form');
  const cancelEditButton = document.getElementById('cancel-edit-button');
  // Add input field IDs within your edit modal's form in admin.html
  const editUsernameInput = document.getElementById('edit-username');
  const editNicknameInput = document.getElementById('edit-nickname');
  const editOrderInput = document.getElementById('edit-order');
  const editIsVerifiedInput = document.getElementById('edit-isVerified');
  const editBioInput = document.getElementById('edit-bio');
  const editProfilePicInput = document.getElementById('edit-profilePic');
  const editFollowersInput = document.getElementById('edit-followers'); // For TikTok/Instagram
  const editSubscribersInput = document.getElementById('edit-subscribers'); // For YouTube
  const editCoverPhotoInput = document.getElementById('edit-coverPhoto'); // For YouTube
  const editPlatformSpecificDiv = document.getElementById('edit-platform-specific'); // Container for platform fields

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

  // --- Edit Modal Logic ---
  function openEditModal(docId, platform) {
      if (!editModal || !editForm) {
          console.error("Edit modal or form not found in the DOM.");
          showAdminStatus("UI Error: Cannot open edit form.", true);
          return;
      }

      // Store ID and platform for submission
      editForm.setAttribute('data-doc-id', docId);
      editForm.setAttribute('data-platform', platform);

      // Fetch the specific document data
      const docRef = doc(db, 'shoutouts', docId);
      getDoc(docRef).then(docSnap => {
          if (docSnap.exists()) {
              const data = docSnap.data();

              // Populate common fields
              if (editUsernameInput) editUsernameInput.value = data.username || '';
              if (editNicknameInput) editNicknameInput.value = data.nickname || '';
              if (editOrderInput) editOrderInput.value = data.order || '';
              if (editIsVerifiedInput) editIsVerifiedInput.checked = data.isVerified || false;
              if (editBioInput) editBioInput.value = data.bio || '';
              if (editProfilePicInput) editProfilePicInput.value = data.profilePic || '';

              // Show/hide platform-specific fields and populate them
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

              editModal.style.display = 'block'; // Show the modal
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
      if (editForm) editForm.reset(); // Clear the form
      editForm?.removeAttribute('data-doc-id');
      editForm?.removeAttribute('data-platform');
  }

  // Close modal if cancel button exists and is clicked
  if (cancelEditButton) {
      cancelEditButton.addEventListener('click', closeEditModal);
  }
  // Close modal if user clicks outside the modal content (optional)
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

    // Attach Edit Handler
    const editButton = itemDiv.querySelector('.edit-button');
    if (editButton) {
      editButton.addEventListener('click', () => editHandler(docId, platform)); // Pass platform here
    } else {
      console.warn("Could not find edit button in rendered list item for ID:", docId);
    }

    // Attach Delete Handler
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

      // --- Load Shoutout Data ---
      if (shoutoutsTiktokListAdmin) loadShoutoutsAdmin('tiktok');
      if (shoutoutsInstagramListAdmin) loadShoutoutsAdmin('instagram');
      if (shoutoutsYoutubeListAdmin) loadShoutoutsAdmin('youtube');

    } else {
      // User is signed out
      if (loginSection) loginSection.style.display = 'block';
      if (adminContent) adminContent.style.display = 'none';
      if (logoutButton) logoutButton.style.display = 'none';
      if (adminGreeting) adminGreeting.textContent = '';
      closeEditModal(); // Ensure edit modal is closed on logout
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
            // Signed in
            console.log("Login successful for:", userCredential.user.email);
            // onAuthStateChanged handles UI updates
            if (authStatus) { // Clear status on success
                authStatus.textContent = '';
                authStatus.className = 'status-message';
            }
        })
        .catch((error) => {
          console.error("Login failed:", error.code, error.message);
          let errorMessage = 'Invalid email or password.'; // Default
          // More specific Firebase Auth error codes: https://firebase.google.com/docs/auth/admin/errors
          if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email format.';
          } else if (error.code === 'auth/user-disabled') {
            errorMessage = 'This user account has been disabled.';
          } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errorMessage = 'Invalid email or password.';
          } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many login attempts. Please try again later.';
          } else {
            errorMessage = `An unexpected error occurred (${error.code}).`; // Include code for debugging
          }

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
        // onAuthStateChanged handles UI updates
      }).catch((error) => {
        console.error("Logout failed:", error);
        showAdminStatus(`Logout Failed: ${error.message}`, true);
      });
    });
  }

  // --- Shoutouts Load/Add/Delete/Update ---

  // Helper to get metadata ref
  function getMetadataRef() {
      return doc(db, 'siteConfig', 'shoutoutsMetadata');
  }

  // Helper to update metadata timestamp
  async function updateMetadataTimestamp(platform) {
      const metaRef = getMetadataRef();
      try {
          await setDoc(metaRef, {
              [`lastUpdatedTime_${platform}`]: serverTimestamp()
          }, { merge: true });
          console.log(`Metadata timestamp updated for ${platform}.`);
      } catch (error) {
          console.error(`Error updating metadata timestamp for ${platform}:`, error);
          // Optionally show an error, but it's less critical than the main operation
          showAdminStatus(`Warning: Could not update timestamp for ${platform}.`, true);
      }
  }

  async function loadShoutoutsAdmin(platform) {
    const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`);
    if (!listContainer) {
      console.warn(`List container for ${platform} not found.`);
      return;
    }
    listContainer.innerHTML = `<p>Loading ${platform} shoutouts...</p>`; // Loading indicator
    try {
      const querySnapshot = await getDocs(collection(db, 'shoutouts'));
      listContainer.innerHTML = ''; // Clear previous content/loading message
      let hasResults = false;

      querySnapshot.forEach(docSnapshot => { // Use a different name to avoid conflict with 'doc' function
        const account = docSnapshot.data();
        if (account.platform === platform) {
          hasResults = true;
          // Use optional chaining and nullish coalescing for safer access
          const nickname = account.nickname || 'No Nickname';
          const username = account.username || 'No Username';
          const order = account.order ?? 'N/A'; // Use ?? for potentially zero/false values
          const content = `<strong>${nickname}</strong> (@${username}) - Order: ${order}`;
          // Pass platform to renderAdminListItem so it can be passed to the edit handler
          renderAdminListItem(
              listContainer,
              docSnapshot.id,
              platform, // Pass platform
              content,
              handleDeleteShoutout, // Pass reference to delete handler
              openEditModal         // Pass reference to edit handler
          );
        }
      });

      if (!hasResults) {
        listContainer.innerHTML = `<p>No ${platform} shoutouts found. Use the form above to add one.</p>`;
      }

    } catch (error) {
      console.error(`Error loading ${platform} shoutouts:`, error);
      listContainer.innerHTML = `<p class="error">Error loading ${platform} shoutouts. Check console for details.</p>`;
      showAdminStatus(`Failed to load ${platform} data: ${error.message}`, true);
    }
  }

  // --- Add Shoutout ---
  async function handleAddShoutout(platform, formElement) {
    if (!formElement) return;

    const username = formElement.querySelector(`#${platform}-username`)?.value.trim();
    const nickname = formElement.querySelector(`#${platform}-nickname`)?.value.trim();
    const orderStr = formElement.querySelector(`#${platform}-order`)?.value.trim();
    const order = parseInt(orderStr);

    if (!username || !nickname || !orderStr || isNaN(order) || order < 0) { // Allow order 0
      showAdminStatus(`Please provide Username, Nickname, and a valid non-negative Order number for ${platform}.`, true);
      return;
    }

    // Construct base data object
    const accountData = {
      platform: platform,
      username: username,
      nickname: nickname,
      order: order,
      isVerified: formElement.querySelector(`#${platform}-isVerified`)?.checked || false,
      bio: formElement.querySelector(`#${platform}-bio`)?.value.trim() || null, // Use null for potentially empty fields
      profilePic: formElement.querySelector(`#${platform}-profilePic`)?.value.trim() || null,
      createdAt: serverTimestamp() // Add a creation timestamp
    };

    // Add platform-specific fields
    if (platform === 'youtube') {
        accountData.subscribers = formElement.querySelector(`#${platform}-subscribers`)?.value.trim() || 'N/A';
        accountData.coverPhoto = formElement.querySelector(`#${platform}-coverPhoto`)?.value.trim() || null;
    } else { // TikTok or Instagram
        accountData.followers = formElement.querySelector(`#${platform}-followers`)?.value.trim() || 'N/A';
    }

    try {
      const docRef = await addDoc(collection(db, 'shoutouts'), accountData);
      console.log("Document written with ID: ", docRef.id);
      await updateMetadataTimestamp(platform); // Update timestamp
      showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout added successfully.`);
      formElement.reset(); // Clear the form
      loadShoutoutsAdmin(platform); // Refresh the list
    } catch (error) {
      console.error(`Error adding ${platform} shoutout:`, error);
      showAdminStatus(`Error adding ${platform} shoutout: ${error.message}`, true);
    }
  }

  // --- Update Shoutout (Handles Edit Form Submission) ---
  async function handleUpdateShoutout(event) {
      event.preventDefault(); // Prevent default form submission
      if (!editForm) return;

      const docId = editForm.getAttribute('data-doc-id');
      const platform = editForm.getAttribute('data-platform');

      if (!docId || !platform) {
          showAdminStatus("Error: Missing document ID or platform for update.", true);
          return;
      }

      // Validate required fields (similar to add)
      const username = editUsernameInput?.value.trim();
      const nickname = editNicknameInput?.value.trim();
      const orderStr = editOrderInput?.value.trim();
      const order = parseInt(orderStr);

      if (!username || !nickname || !orderStr || isNaN(order) || order < 0) {
          showAdminStatus(`Update Error: Please provide Username, Nickname, and a valid non-negative Order number.`, true);
          return;
      }

      // Construct update data object
      const updatedData = {
          username: username,
          nickname: nickname,
          order: order,
          isVerified: editIsVerifiedInput?.checked || false,
          bio: editBioInput?.value.trim() || null,
          profilePic: editProfilePicInput?.value.trim() || null,
          // Don't update platform or createdAt
      };

      // Add platform-specific fields
      if (platform === 'youtube') {
          updatedData.subscribers = editSubscribersInput?.value.trim() || 'N/A';
          updatedData.coverPhoto = editCoverPhotoInput?.value.trim() || null;
      } else { // TikTok or Instagram
          updatedData.followers = editFollowersInput?.value.trim() || 'N/A';
      }

      try {
          const docRef = doc(db, 'shoutouts', docId);
          await updateDoc(docRef, updatedData);
          await updateMetadataTimestamp(platform); // Update timestamp
          showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout updated successfully.`);
          closeEditModal(); // Close the modal on success
          loadShoutoutsAdmin(platform); // Refresh the list
      } catch (error) {
          console.error(`Error updating ${platform} shoutout (ID: ${docId}):`, error);
          showAdminStatus(`Error updating ${platform} shoutout: ${error.message}`, true);
      }
  }

  // Attach listener to the edit form
  if (editForm) {
      editForm.addEventListener('submit', handleUpdateShoutout);
  }


  // --- Delete Shoutout ---
  async function handleDeleteShoutout(docId, platform, listItemElement) {
    // Use template literal for clarity
    if (!confirm(`Are you sure you want to delete this ${platform} shoutout? This action cannot be undone.`)) {
        return; // User cancelled
    }

    try {
      await deleteDoc(doc(db, 'shoutouts', docId));
      await updateMetadataTimestamp(platform); // Update timestamp
      showAdminStatus(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout deleted successfully.`);
      if (listItemElement) {
          listItemElement.remove(); // Remove item from the list immediately
      } else {
          // If element wasn't passed, just reload the list
          loadShoutoutsAdmin(platform);
      }
      // Check if the list is now empty after deletion
      const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`);
      if (listContainer && !listContainer.hasChildNodes()) {
          listContainer.innerHTML = `<p>No ${platform} shoutouts found. Use the form above to add one.</p>`;
      }
    } catch (error) {
      console.error(`Error deleting ${platform} shoutout (ID: ${docId}):`, error);
      showAdminStatus(`Error deleting ${platform} shoutout: ${error.message}`, true);
    }
  }

  // --- Attach Event Listeners for Add Forms ---
  if (addShoutoutTiktokForm) addShoutoutTiktokForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleAddShoutout('tiktok', addShoutoutTiktokForm);
  });
  if (addShoutoutInstagramForm) addShoutoutInstagramForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleAddShoutout('instagram', addShoutoutInstagramForm);
  });
  if (addShoutoutYoutubeForm) addShoutoutYoutubeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleAddShoutout('youtube', addShoutoutYoutubeForm);
  });

}); // End DOMContentLoaded
