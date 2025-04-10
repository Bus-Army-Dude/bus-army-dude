// admin.js

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIZ0fri5V1E2si1xXpBPQQJqj1F_KuuG0",
  authDomain: "busarmydudewebsite.firebaseapp.com",
  projectId: "busarmydudewebsite",
  storageBucket: "busarmydudewebsite.firebasestorage.app",
  messagingSenderId: "42980404680",
  appId: "1:42980404680:web:f4f1e54789902a4295e4fd",
  measurementId: "G-DQPH8YL789"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

let app, db, auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log("Firebase initialized successfully.");
} catch (error) {
  console.error("Firebase initialization failed:", error);
  alert("FATAL ERROR: Cannot connect to Firebase. Admin Portal functionality disabled.");
  document.getElementById('admin-content').style.display = 'none';
  document.getElementById('login-section').innerHTML = '<h2 style="color: red;">Firebase Initialization Failed. Cannot load Admin Portal.</h2>';
  throw error; // Stop further execution
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

  // --- Helper Functions ---
  function showAdminStatus(message, isError = false) {
    if (!adminStatusElement) {
      console.warn("Admin status element not found");
      return;
    }
    adminStatusElement.textContent = message;
    adminStatusElement.className = `status-message ${isError ? 'error' : 'success'}`;
    setTimeout(() => {
      if (adminStatusElement) adminStatusElement.textContent = '';
      if (adminStatusElement) adminStatusElement.className = 'status-message';
    }, 5000);
  }

  function renderAdminListItem(container, docId, contentHtml, deleteHandler) {
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
                <button type="button" class="delete-button small-button">Delete</button>
                </div>
        `;
    const deleteButton = itemDiv.querySelector('.delete-button');
    if (deleteButton) {
      deleteButton.addEventListener('click', () => deleteHandler(docId, itemDiv));
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
      if (shoutoutsTiktokListAdmin && addShoutoutTiktokForm) loadShoutoutsAdmin('tiktok');
      if (shoutoutsInstagramListAdmin && addShoutoutInstagramForm) loadShoutoutsAdmin('instagram');
      if (shoutoutsYoutubeListAdmin && addShoutoutYoutubeForm) loadShoutoutsAdmin('youtube');

    } else {
      // User is signed out
      if (loginSection) loginSection.style.display = 'block';
      if (adminContent) adminContent.style.display = 'none';
      if (logoutButton) logoutButton.style.display = 'none';
      if (adminGreeting) adminGreeting.textContent = '';
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
        .then(() => { /* onAuthStateChanged handles UI */ })
        .catch((error) => {
          console.error("Login failed:", error);
          let errorMessage = 'Invalid email or password.';
          if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email format.';
          } else if (error.code === 'auth/user-disabled') {
            errorMessage = 'This user account has been disabled.';
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
      signOut(auth).catch((error) => {
        console.error("Logout failed:", error);
        showAdminStatus(`Logout Failed: ${error.message}`, true);
      });
    });
  }

  // --- Shoutouts Load/Add/Delete ---
  async function loadShoutoutsAdmin(platform) {
    const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`);
    if (!listContainer) {
      console.warn(`List container for ${platform} not found.`);
      return;
    }
    listContainer.innerHTML = `<p>Loading ${platform} shoutouts...</p>`;
    try {
      const querySnapshot = await getDocs(collection(db, 'shoutouts'));
      listContainer.innerHTML = '';
      if (querySnapshot.empty) {
        listContainer.innerHTML = `<p>No ${platform} shoutouts found.</p>`;
        return;
      }

      let hasResults = false; // Flag to check if any results were found for this platform

      querySnapshot.forEach(doc => {
        const account = doc.data();
        if (account.platform === platform) {
          hasResults = true;
          const content = `<strong>${account.nickname || 'No Nickname'}</strong> (@${account.username}) - Order: ${account.order}`;
          renderAdminListItem(listContainer, doc.id, content, (docId, itemEl) => handleDeleteShoutout(docId, platform, itemEl));
        }
      });

      if (!hasResults) {
        listContainer.innerHTML = `<p>No ${platform} shoutouts found.</p>`;
      }

    } catch (error) {
      console.error(`Error loading ${platform} shoutouts:`, error);
      listContainer.innerHTML = `<p class="error">Error loading ${platform} shoutouts.</p>`;
    }
  }

  async function handleAddShoutout(platform, formElement) {
    if (!formElement) return;

    const username = formElement.querySelector(`#${platform}-username`)?.value.trim();
    const nickname = formElement.querySelector(`#${platform}-nickname`)?.value.trim();
    const orderStr = formElement.querySelector(`#${platform}-order`)?.value.trim();
    const order = parseInt(orderStr);

    if (!username || !nickname || !orderStr || isNaN(order) || order < 1) {
      showAdminStatus(`Please provide Username, Nickname, and a valid positive Order number for ${platform}.`, true);
      return;
    }

    const accountData = {
      platform: platform,
      username: username,
      nickname: nickname,
      order: order,
      isVerified: formElement.querySelector(`#${platform}-isVerified`)?.checked || false,
      bio: formElement.querySelector(`#${platform}-bio`)?.value.trim() || null,
      profilePic: formElement.querySelector(`#${platform}-profilePic`)?.value.trim() || null,
      ...(platform === 'youtube' && {
        subscribers: formElement.querySelector(`#${platform}-subscribers`)?.value.trim() || 'N/A'
      }),
      ...(platform !== 'youtube' && {
        followers: formElement.querySelector(`#${platform}-followers`)?.value.trim() || 'N/A'
      }),
      ...(platform === 'youtube' && {
        coverPhoto: formElement.querySelector(`#${platform}-coverPhoto`)?.value.trim() || null
      }),
    };

    try {
      await addDoc(collection(db, 'shoutouts'), accountData);
      const metaRef = doc(db, 'siteConfig', 'shoutoutsMetadata');
      await setDoc(metaRef, {
        [`lastUpdatedTime_${platform}`]: serverTimestamp()
      }, { merge: true });
      showAdminStatus(`${platform} shoutout added.`);
      formElement.reset();
      loadShoutoutsAdmin(platform);
    } catch (error) {
      console.error(`Error adding ${platform} shoutout:`, error);
      showAdminStatus(`Error adding ${platform} shoutout: ${error.message}`, true);
    }
  }

  async function handleDeleteShoutout(docId, platform, listItemElement) {
    if (!confirm(`Are you sure you want to delete this ${platform} shoutout?`)) return;

    try {
      await deleteDoc(doc(db, 'shoutouts', docId));
      const metaRef = doc(db, 'siteConfig', 'shoutoutsMetadata');
      await setDoc(metaRef, {
        [`lastUpdatedTime_${platform}`]: serverTimestamp()
      }, {
        merge: true
      });
      showAdminStatus(`${platform} shoutout deleted.`);
      if (listItemElement) listItemElement.remove();
    } catch (error) {
      console.error(`Error deleting ${platform} shoutout:`, error);
      showAdminStatus(`Error deleting ${platform} shoutout: ${error.message}`, true);
    }
  }

  // Add listeners safely
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
});
