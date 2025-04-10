// admin.js

// !!! YOUR FIREBASE CONFIGURATION !!!
const firebaseConfig = {
    apiKey: "AIzaSyCrQNseQTsWjQhsQBGm8nk9Y_mysuaTsrc", // This key is likely intended to be public
    authDomain: "bus-army-dude-website.firebaseapp.com",
    projectId: "bus-army-dude-website",
    storageBucket: "bus-army-dude-website.appspot.com", // Ensure this matches your console
    messagingSenderId: "464457126263",
    appId: "1:464457126263:web:7e8d63b9bb59a360b39172"
};

// Initialize Firebase immediately when admin.js loads
let db, auth, Timestamp; // Declare variables in script scope

try {
    // Check if Firebase SDK is loaded
    if (typeof firebase === 'undefined') {
        throw new Error("Firebase SDK not loaded before admin.js. Check script order in admin.html.");
    }

    // Initialize ONLY if it hasn't been initialized yet
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized by admin.js.");
    } else {
        firebase.app(); // Get default app if already initialized
        console.log("Firebase already initialized.");
    }

    // Get Firestore and Auth instances after initialization
    db = firebase.firestore();
    auth = firebase.auth();
    Timestamp = firebase.firestore.Timestamp; // Useful alias

    if (!db || !auth) { // Check if instances were obtained
        throw new Error("Failed to get Firestore or Auth instance after initialization.");
    }

} catch (error) {
     console.error("CRITICAL FIREBASE INITIALIZATION ERROR:", error);
     alert("FATAL ERROR: Cannot connect to Firebase. Admin Portal functionality disabled.\n\n" + error.message);
     // Optional: Hide admin UI elements if init fails
     const adminContentElement = document.getElementById('admin-content');
     const loginSectionElement = document.getElementById('login-section');
     if(adminContentElement) adminContentElement.style.display = 'none';
     if(loginSectionElement) loginSectionElement.innerHTML = '<h2 style="color: red;">Firebase Initialization Failed. Cannot load Admin Portal.</h2>';
     // Stop further script execution by throwing the error again
     throw error;
}


// --- Wait for the DOM to be fully loaded for UI interactions ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin DOM Loaded. Setting up UI and CRUD functions.");

    // --- DOM Element References ---
    // Login/Auth
    const loginSection = document.getElementById('login-section');
    const adminContent = document.getElementById('admin-content');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const authStatus = document.getElementById('auth-status');
    const adminGreeting = document.getElementById('admin-greeting');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const adminStatus = document.getElementById('admin-status'); // For general save messages

    // Forms & Sections (Ensure these IDs match your admin.html)
    const globalSettingsForm = document.getElementById('global-settings-form');
    const profileInfoForm = document.getElementById('profile-info-form');
    const businessHoursForm = document.getElementById('business-hours-form');
    const addHolidayForm = document.getElementById('add-holiday-form');
    const deleteHolidayButton = document.getElementById('delete-holiday-button');
    const holidaysListAdmin = document.getElementById('holidays-list-admin');
    const addTempUnavailabilityForm = document.getElementById('add-temp-unavailability-form');
    const tempUnavailabilityListAdmin = document.getElementById('temp-unavailability-list-admin');
    const addEventForm = document.getElementById('add-event-form');
    const eventsListAdmin = document.getElementById('events-list-admin');
    // Shoutout Forms & Lists
    const addShoutoutTiktokForm = document.getElementById('add-shoutout-tiktok-form');
    const shoutoutsTiktokListAdmin = document.getElementById('shoutouts-tiktok-list-admin');
    const addShoutoutInstagramForm = document.getElementById('add-shoutout-instagram-form');
    const shoutoutsInstagramListAdmin = document.getElementById('shoutouts-instagram-list-admin');
    const addShoutoutYoutubeForm = document.getElementById('add-shoutout-youtube-form');
    const shoutoutsYoutubeListAdmin = document.getElementById('shoutouts-youtube-list-admin');
    // FAQ
    const addFaqForm = document.getElementById('add-faq-form');
    const faqListAdmin = document.getElementById('faq-list-admin');
    // Tech Specs
    const techSpecsForm = document.getElementById('tech-specs-form');

    // --- Helper Functions ---
    function showAdminStatus(message, isError = false) {
        if (!adminStatus) { console.warn("Admin status element not found"); return; }
        adminStatus.textContent = message;
        adminStatus.className = `status-message ${isError ? 'error' : 'success'}`;
        setTimeout(() => {
            if (adminStatus) adminStatus.textContent = '';
            if (adminStatus) adminStatus.className = 'status-message';
        }, 5000);
    }

    function renderAdminListItem(container, docId, contentHtml, deleteHandler) {
        if (!container) { console.warn("List container not found for rendering item"); return; }
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
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            if(loginSection) loginSection.style.display = 'none';
            if(adminContent) adminContent.style.display = 'block';
            if(logoutButton) logoutButton.style.display = 'inline-block';
            if(adminGreeting) adminGreeting.textContent = `Logged in as: ${user.email}`;
            if(authStatus) {
                authStatus.textContent = '';
                authStatus.className = 'status-message';
            }
            if(adminStatus) {
                 adminStatus.textContent = '';
                 adminStatus.className = 'status-message';
            }

            // --- Load Data into Forms ---
            // Check if forms/containers exist before trying to load data
            if (globalSettingsForm) loadGlobalSettingsAdmin();
            if (profileInfoForm) loadProfileInfoAdmin();
            if (businessHoursForm) loadBusinessHoursAdmin();
            if (holidaysListAdmin && addHolidayForm) loadHolidaysAdmin();
            if (tempUnavailabilityListAdmin && addTempUnavailabilityForm) loadTempUnavailabilityAdmin();
            if (eventsListAdmin && addEventForm) loadEventsAdmin();
            if (shoutoutsTiktokListAdmin && addShoutoutTiktokForm) loadShoutoutsAdmin('tiktok');
            if (shoutoutsInstagramListAdmin && addShoutoutInstagramForm) loadShoutoutsAdmin('instagram');
            if (shoutoutsYoutubeListAdmin && addShoutoutYoutubeForm) loadShoutoutsAdmin('youtube');
            if (faqListAdmin && addFaqForm) loadFaqsAdmin();
            if (techSpecsForm) loadTechSpecsAdmin();

        } else {
            // User is signed out
            if(loginSection) loginSection.style.display = 'block';
            if(adminContent) adminContent.style.display = 'none';
            if(logoutButton) logoutButton.style.display = 'none';
            if(adminGreeting) adminGreeting.textContent = '';
        }
    });

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;
            if (!email || !password) {
                if(authStatus) { authStatus.textContent = 'Please enter email and password.'; authStatus.className = 'status-message error'; }
                return;
            }
            if(authStatus) { authStatus.textContent = 'Logging in...'; authStatus.className = 'status-message'; }

            auth.signInWithEmailAndPassword(email, password)
                .then(() => { /* onAuthStateChanged handles UI */ })
                .catch((error) => {
                    console.error("Login failed:", error);
                    let errorMessage = 'Invalid email or password.'; // Default user-friendly message
                    if (error.code === 'auth/invalid-email') { errorMessage = 'Invalid email format.'; }
                    else if (error.code === 'auth/user-disabled') { errorMessage = 'This user account has been disabled.'; }
                    // Add more specific error codes if needed
                     if(authStatus) { authStatus.textContent = `Login Failed: ${errorMessage}`; authStatus.className = 'status-message error'; }
                });
        });
    }

    // Logout Button
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            auth.signOut().catch((error) => {
                console.error("Logout failed:", error);
                showAdminStatus(`Logout Failed: ${error.message}`, true);
            });
        });
    }

    // --- CRUD Functions Implementation ---

    // --- Global Settings ---
    // Firestore: siteConfig/globalSettings -> { maintenanceMode: boolean, profileStatus: string }
    async function loadGlobalSettingsAdmin() {
        if (!globalSettingsForm) return;
        try {
            const docRef = db.collection('siteConfig').doc('globalSettings');
            const docSnap = await docRef.get();
            const maintenanceInput = globalSettingsForm.querySelector('#maintenance-mode');
            const statusSelect = globalSettingsForm.querySelector('#profile-status');

            if (docSnap.exists) {
                const data = docSnap.data();
                if (maintenanceInput) maintenanceInput.checked = data.maintenanceMode || false;
                if (statusSelect) statusSelect.value = data.profileStatus || 'offline';
            } else {
                console.warn("Global settings document not found. Using defaults.");
                if (maintenanceInput) maintenanceInput.checked = false;
                if (statusSelect) statusSelect.value = 'offline';
            }
        } catch (error) {
            console.error("Error loading global settings:", error);
            showAdminStatus("Error loading global settings.", true);
        }
    }
    if (globalSettingsForm) {
        globalSettingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const settingsData = {
                maintenanceMode: globalSettingsForm.querySelector('#maintenance-mode')?.checked || false,
                profileStatus: globalSettingsForm.querySelector('#profile-status')?.value || 'offline'
            };
            try {
                await db.collection('siteConfig').doc('globalSettings').set(settingsData, { merge: true });
                showAdminStatus("Global settings saved successfully.");
            } catch (error) {
                console.error("Error saving global settings:", error);
                showAdminStatus(`Error saving global settings: ${error.message}`, true);
            }
        });
    }

    // --- Profile Info ---
    // Firestore: profile/main -> { username: string, bio: string, profilePicUrl: string, isVerified: boolean }
    async function loadProfileInfoAdmin() {
       if (!profileInfoForm) return;
       console.log("Loading profile info for admin...");
       try {
           const docRef = db.collection('profile').doc('main');
           const docSnap = await docRef.get();

           const usernameInput = profileInfoForm.querySelector('#profile-username');
           const bioTextarea = profileInfoForm.querySelector('#profile-bio');
           const picUrlInput = profileInfoForm.querySelector('#profile-pic-url');
           const verifiedCheckbox = profileInfoForm.querySelector('#profile-is-verified');

           if (docSnap.exists) {
               const data = docSnap.data();
               console.log("Fetched profile data:", data);
               if (usernameInput) usernameInput.value = data.username || '';
               if (bioTextarea) bioTextarea.value = data.bio || '';
               if (picUrlInput) picUrlInput.value = data.profilePicUrl || '';
               if (verifiedCheckbox) verifiedCheckbox.checked = data.isVerified || false;
           } else {
               console.warn("Profile info document 'main' not found. Clearing form.");
               if(profileInfoForm) profileInfoForm.reset();
           }
       } catch (error) {
           console.error("Error loading profile info:", error);
           showAdminStatus("Error loading profile info.", true);
       }
   }
    if (profileInfoForm) {
       profileInfoForm.addEventListener('submit', async (e) => {
           e.preventDefault();
           console.log("Saving profile info...");

           const profileData = {
               username: profileInfoForm.querySelector('#profile-username')?.value.trim() || null,
               bio: profileInfoForm.querySelector('#profile-bio')?.value.trim() || null,
               profilePicUrl: profileInfoForm.querySelector('#profile-pic-url')?.value.trim() || null,
               isVerified: profileInfoForm.querySelector('#profile-is-verified')?.checked || false,
               lastUpdated: Timestamp.now()
           };

           if (!profileData.username) { showAdminStatus("Username cannot be empty.", true); return; }

           try {
               await db.collection('profile').doc('main').set(profileData, { merge: true });
               showAdminStatus("Profile info saved successfully.");
               console.log("Profile info saved:", profileData);
           } catch (error) {
               console.error("Error saving profile info:", error);
               showAdminStatus(`Error saving profile info: ${error.message}`, true);
           }
       });
   }

   // --- Business Hours (Regular) ---
   // Firestore: siteConfig/businessHours -> { regularHours: Map }
    async function loadBusinessHoursAdmin() {
        if (!businessHoursForm) return;
        try {
            const docRef = db.collection('siteConfig').doc('businessHours');
            const docSnap = await docRef.get();
            if (docSnap.exists && docSnap.data()?.regularHours) {
                const hours = docSnap.data().regularHours;
                for (const day of ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']) {
                    const openInput = businessHoursForm.querySelector(`#hours-${day}-open`);
                    const closeInput = businessHoursForm.querySelector(`#hours-${day}-close`);
                    if(openInput) openInput.value = hours[day]?.open || ''; // Use value from DB or empty string
                    if(closeInput) closeInput.value = hours[day]?.close || '';
                }
            } else {
                 console.warn("Business hours document or regularHours field not found.");
                 businessHoursForm.reset();
            }
        } catch (error) {
            console.error("Error loading regular hours:", error);
            showAdminStatus("Error loading regular hours.", true);
        }
    }
    if (businessHoursForm) {
        businessHoursForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const regularHoursData = {};
            let isValid = true;
            const timeRegex = /^(1[0-2]|0?[1-9]):[0-5][0-9]\s*(AM|PM)$/i; // Regex for HH:MM AM/PM

            for (const day of ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']) {
                 const openInput = businessHoursForm.querySelector(`#hours-${day}-open`);
                 const closeInput = businessHoursForm.querySelector(`#hours-${day}-close`);
                 const openVal = openInput ? openInput.value.trim() : '';
                 const closeVal = closeInput ? closeInput.value.trim() : '';

                 // Validate: Allow empty string (for null/closed) or valid time format
                 if ((openVal !== '' && !timeRegex.test(openVal)) || (closeVal !== '' && !timeRegex.test(closeVal))) {
                     showAdminStatus(`Invalid time format for ${day}. Use HH:MM AM/PM or leave blank for closed.`, true);
                     isValid = false;
                     break;
                 }
                 regularHoursData[day] = {
                     open: openVal === '' ? null : openVal,
                     close: closeVal === '' ? null : closeVal
                 };
            }

            if (!isValid) return;

            try {
                // Using set with merge: true will create the doc if it doesn't exist, or update the regularHours field if it does.
                await db.collection('siteConfig').doc('businessHours').set({ regularHours: regularHoursData }, { merge: true });
                showAdminStatus("Regular business hours saved.");
            } catch (error) {
                console.error("Error saving regular hours:", error);
                showAdminStatus(`Error saving regular hours: ${error.message}`, true);
            }
        });
    }

   // --- Holidays Load/Add/Delete ---
   // Firestore: siteConfig/holidays -> Map { "YYYY-MM-DD": { name: string, hours: string } }
    async function loadHolidaysAdmin() {
        if (!holidaysListAdmin) return;
        holidaysListAdmin.innerHTML = '<p>Loading holidays...</p>'; // Use <p> for consistency
        try {
            const docRef = db.collection('siteConfig').doc('holidays');
            const docSnap = await docRef.get();
            holidaysListAdmin.innerHTML = '';
            if (docSnap.exists) {
                const holidays = docSnap.data() || {};
                const sortedDates = Object.keys(holidays).sort();
                if (sortedDates.length === 0) { holidaysListAdmin.innerHTML = '<p>No holidays defined.</p>'; return; }
                sortedDates.forEach(dateKey => {
                    const holiday = holidays[dateKey];
                    if (holiday?.name && holiday.hours !== undefined) {
                         const content = `<strong>${dateKey}:</strong> ${holiday.name} - <i>${holiday.hours}</i>`;
                         renderAdminListItem(holidaysListAdmin, dateKey, content, handleDeleteHoliday);
                    }
                });
            } else {
                holidaysListAdmin.innerHTML = '<p>No holidays defined.</p>';
            }
        } catch (error) {
            console.error("Error loading holidays:", error);
            holidaysListAdmin.innerHTML = '<p class="error">Error loading holidays.</p>';
        }
    }
    async function handleDeleteHoliday(dateKey, listItemElement) {
        if (!confirm(`Are you sure you want to delete the holiday for ${dateKey}?`)) return;
        // Use dot notation for map field deletion
        const holidayToDelete = { [`${dateKey}`]: firebase.firestore.FieldValue.delete() };
        try {
             // Use update to remove the specific field (dateKey) from the document
            await db.collection('siteConfig').doc('holidays').update(holidayToDelete);
            showAdminStatus(`Holiday for ${dateKey} deleted.`);
            if (listItemElement) listItemElement.remove();
        } catch (error) {
            console.error("Error deleting holiday:", error);
            showAdminStatus(`Error deleting holiday: ${error.message}`, true);
        }
    }
    if (addHolidayForm) {
        addHolidayForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dateInput = addHolidayForm.querySelector('#holiday-date');
            const nameInput = addHolidayForm.querySelector('#holiday-name');
            const hoursInput = addHolidayForm.querySelector('#holiday-hours');
            const dateKey = dateInput.value;
            const name = nameInput.value.trim();
            const hours = hoursInput.value.trim();

            if (!dateKey.match(/^\d{4}-\d{2}-\d{2}$/)) { showAdminStatus("Invalid date format. Use YYYY-MM-DD.", true); return; }
            if (!name || !hours) { showAdminStatus("Holiday Name and Hours cannot be empty.", true); return; }

            // Use dot notation to set/update a specific field within the map
            const holidayData = { [`${dateKey}.name`]: name, [`${dateKey}.hours`]: hours };
            try {
                // Using update ensures the document exists, set with merge creates if needed. Let's use set/merge for simplicity.
                 await db.collection('siteConfig').doc('holidays').set({ [dateKey]: { name, hours } }, { merge: true });
                showAdminStatus(`Holiday for ${dateKey} added/updated.`);
                addHolidayForm.reset();
                loadHolidaysAdmin();
            } catch (error) {
                console.error("Error adding/updating holiday:", error);
                showAdminStatus(`Error saving holiday: ${error.message}`, true);
            }
        });
    }
    if (deleteHolidayButton) {
         deleteHolidayButton.addEventListener('click', async () => {
             const dateInput = addHolidayForm.querySelector('#holiday-date');
             const dateToDelete = dateInput ? dateInput.value : null;
             if (!dateToDelete || !dateToDelete.match(/^\d{4}-\d{2}-\d{2}$/)) {
                showAdminStatus("Enter a valid date (YYYY-MM-DD) in the form above to specify which holiday to delete.", true);
                return;
             }
             const listItemElement = holidaysListAdmin ? holidaysListAdmin.querySelector(`[data-id="${dateToDelete}"]`) : null;
             // Check if holiday actually exists before trying to delete
             const docRef = db.collection('siteConfig').doc('holidays');
             const docSnap = await docRef.get();
             if (!docSnap.exists() || !docSnap.data()?.[dateToDelete]) {
                  showAdminStatus(`Holiday for ${dateToDelete} not found. Cannot delete.`, true);
                  return;
             }
             await handleDeleteHoliday(dateToDelete, listItemElement);
         });
    }

   // --- Temporary Unavailability Load/Add/Delete ---
   // Firestore: siteConfig/temporaryUnavailability -> Map { "YYYY-MM-DD": Array[{from: string, to: string, reason: string}] }
    async function loadTempUnavailabilityAdmin() {
        if (!tempUnavailabilityListAdmin) return;
        tempUnavailabilityListAdmin.innerHTML = '<p>Loading temporary slots...</p>';
         try {
            const docRef = db.collection('siteConfig').doc('temporaryUnavailability');
            const docSnap = await docRef.get();
            tempUnavailabilityListAdmin.innerHTML = ''; // Clear
             if (docSnap.exists) {
                const tempMap = docSnap.data() || {};
                const sortedDates = Object.keys(tempMap).sort();
                 if (sortedDates.length === 0) { tempUnavailabilityListAdmin.innerHTML = '<p>No temporary slots.</p>'; return; }
                 let hasItems = false;
                 sortedDates.forEach(dateKey => {
                     const slots = tempMap[dateKey];
                     if (Array.isArray(slots)) {
                         slots.forEach((slot, index) => {
                            if (slot?.from && slot?.to && slot.reason !== undefined) { // Check reason exists
                                 hasItems = true;
                                 const slotId = `${dateKey}_${index}`;
                                 const content = `<strong>${dateKey}:</strong> ${slot.from} - ${slot.to} <i>(${slot.reason})</i>`;
                                 renderAdminListItem(tempUnavailabilityListAdmin, slotId, content, handleDeleteTempSlot);
                             }
                         });
                     }
                 });
                 if (!hasItems) tempUnavailabilityListAdmin.innerHTML = '<p>No temporary slots defined.</p>';
            } else {
                tempUnavailabilityListAdmin.innerHTML = '<p>No temporary slots defined.</p>';
            }
        } catch (error) {
            console.error("Error loading temporary unavailability:", error);
            tempUnavailabilityListAdmin.innerHTML = '<p class="error">Error loading temporary slots.</p>';
        }
    }
    async function handleDeleteTempSlot(slotId, listItemElement) {
        const [dateKey, indexStr] = slotId.split('_');
        const index = parseInt(indexStr, 10);
        if (!dateKey || isNaN(index)) { showAdminStatus("Invalid slot ID.", true); return; }
        if (!confirm(`Are you sure you want to delete slot ${index + 1} for ${dateKey}?`)) return;

        const docRef = db.collection('siteConfig').doc('temporaryUnavailability');
        try {
            await db.runTransaction(async (transaction) => {
                const docSnap = await transaction.get(docRef);
                let currentData = docSnap.data();
                if (currentData?.[dateKey]?.[index]) {
                    currentData[dateKey].splice(index, 1); // Remove item
                    if (currentData[dateKey].length === 0) {
                         transaction.update(docRef, { [dateKey]: firebase.firestore.FieldValue.delete() }); // Remove date key if array empty
                    } else {
                        transaction.update(docRef, { [dateKey]: currentData[dateKey] }); // Update array
                    }
                } else { throw new Error("Slot or date key not found."); }
            });
            showAdminStatus(`Temporary slot deleted.`);
            if (listItemElement) listItemElement.remove();
        } catch (error) {
            console.error("Error deleting temporary slot:", error);
            showAdminStatus(`Error deleting temporary slot: ${error.message}`, true);
        }
    }
    if (addTempUnavailabilityForm) {
        addTempUnavailabilityForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dateKey = addTempUnavailabilityForm.querySelector('#temp-date')?.value;
            const from = addTempUnavailabilityForm.querySelector('#temp-from')?.value.trim();
            const to = addTempUnavailabilityForm.querySelector('#temp-to')?.value.trim();
            const reason = addTempUnavailabilityForm.querySelector('#temp-reason')?.value.trim();
            const timeRegex = /^(1[0-2]|0?[1-9]):[0-5][0-9]\s*(AM|PM)$/i;

            if (!dateKey?.match(/^\d{4}-\d{2}-\d{2}$/)) { showAdminStatus("Invalid date format. Use YYYY-MM-DD.", true); return; }
            if (!from || !to || !reason) { showAdminStatus("Please fill in From, To, and Reason fields.", true); return; }
            if (!timeRegex.test(from) || !timeRegex.test(to)) { showAdminStatus("Invalid time format. Use HH:MM AM/PM.", true); return; }

            const newSlot = { from, to, reason };
            const docRef = db.collection('siteConfig').doc('temporaryUnavailability');
            try {
                // Use FieldValue.arrayUnion to add the new slot to the array for that date, creating if needed
                await docRef.set({ [dateKey]: firebase.firestore.FieldValue.arrayUnion(newSlot) }, { merge: true });
                showAdminStatus(`Temporary slot for ${dateKey} added.`);
                addTempUnavailabilityForm.reset();
                loadTempUnavailabilityAdmin(); // Refresh list
            } catch (error) {
                console.error("Error adding temporary slot:", error);
                showAdminStatus(`Error adding temporary slot: ${error.message}`, true);
            }
        });
    }

   // --- Events Load/Add/Delete ---
   // Firestore: events collection -> Docs { title, startDate(Timestamp), endDate(Timestamp), type, location, description, link }
    async function loadEventsAdmin() {
        if (!eventsListAdmin) return;
        eventsListAdmin.innerHTML = '<p>Loading events...</p>';
        try {
            const querySnapshot = await db.collection('events')
                                          .orderBy('startDate', 'desc') // Show newest first in admin
                                          .limit(50) // Limit results for performance
                                          .get();
            eventsListAdmin.innerHTML = '';
            if (querySnapshot.empty) { eventsListAdmin.innerHTML = '<p>No events found.</p>'; return; }
            querySnapshot.forEach(doc => {
                const event = doc.data();
                const startDateStr = event.startDate?.toDate ? event.startDate.toDate().toLocaleString() : 'Invalid Date';
                const endDateStr = event.endDate?.toDate ? event.endDate.toDate().toLocaleString() : 'Invalid Date';
                const content = `<strong>${event.title || 'No Title'}</strong><br>
                                 <small>Start: ${startDateStr}</small><br>
                                 <small>End: ${endDateStr}</small> |
                                 <small>Loc: ${event.location || 'N/A'}</small>`;
                renderAdminListItem(eventsListAdmin, doc.id, content, handleDeleteEvent);
            });
        } catch (error) {
            console.error("Error loading events:", error);
            eventsListAdmin.innerHTML = '<p class="error">Error loading events.</p>';
        }
    }
    async function handleDeleteEvent(docId, listItemElement) {
        if (!confirm(`Are you sure you want to delete this event?`)) return;
       try {
           await db.collection('events').doc(docId).delete();
           showAdminStatus("Event deleted.");
           if(listItemElement) listItemElement.remove();
       } catch (error) {
           console.error("Error deleting event:", error);
           showAdminStatus(`Error deleting event: ${error.message}`, true);
       }
   }
    if (addEventForm) {
        addEventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = addEventForm.querySelector('#event-title')?.value.trim();
            const startDateTimeStr = addEventForm.querySelector('#event-start-datetime')?.value;
            const endDateTimeStr = addEventForm.querySelector('#event-end-datetime')?.value;

            if (!title || !startDateTimeStr || !endDateTimeStr) { showAdminStatus("Title, Start, and End date/time are required.", true); return; }

            let startDateTs, endDateTs;
            try {
                 const startDate = new Date(startDateTimeStr);
                 const endDate = new Date(endDateTimeStr);
                 if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) throw new Error("Invalid date string");
                 startDateTs = Timestamp.fromDate(startDate);
                 endDateTs = Timestamp.fromDate(endDate);
                 if (endDateTs.toMillis() <= startDateTs.toMillis()) {
                     showAdminStatus("End date/time must be after start date/time.", true);
                     return;
                 }
            } catch (dateError) {
                 showAdminStatus("Invalid date/time format. Use your browser's picker.", true);
                 console.error("Date parsing error:", dateError);
                 return;
            }

            const eventData = {
                title: title,
                startDate: startDateTs,
                endDate: endDateTs,
                type: addEventForm.querySelector('#event-type')?.value.trim() || null,
                location: addEventForm.querySelector('#event-location')?.value.trim() || null,
                description: addEventForm.querySelector('#event-description')?.value.trim() || null,
                link: addEventForm.querySelector('#event-link')?.value.trim() || null,
                createdAt: Timestamp.now()
            };

            try {
                await db.collection('events').add(eventData);
                showAdminStatus("Event added successfully.");
                addEventForm.reset();
                loadEventsAdmin(); // Refresh list
            } catch (error) {
                console.error("Error adding event:", error);
                showAdminStatus(`Error adding event: ${error.message}`, true);
            }
        });
    }

   // --- Shoutouts Load/Add/Delete ---
   // Firestore: shoutouts_tiktok, shoutouts_instagram, shoutouts_youtube collections
   // Firestore: siteConfig/shoutoutsMetadata -> { lastUpdatedTime_tiktok(Timestamp), ... }
    async function loadShoutoutsAdmin(platform) {
        const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`);
        if (!listContainer) { console.warn(`List container for ${platform} not found.`); return; }
        listContainer.innerHTML = `<p>Loading ${platform} shoutouts...</p>`; // Use <p>
        try {
            const collectionName = `shoutouts_${platform}`;
            const querySnapshot = await db.collection(collectionName).orderBy('order', 'asc').get();
            listContainer.innerHTML = ''; // Clear
            if (querySnapshot.empty) { listContainer.innerHTML = `<p>No ${platform} shoutouts found.</p>`; return; }
            querySnapshot.forEach(doc => {
                const account = doc.data();
                const content = `<strong>${account.nickname || 'No Nickname'}</strong> (@${account.username}) - Order: ${account.order}`;
                renderAdminListItem(listContainer, doc.id, content, (docId, itemEl) => handleDeleteShoutout(platform, docId, itemEl));
            });
        } catch (error) {
            console.error(`Error loading ${platform} shoutouts:`, error);
            listContainer.innerHTML = `<p class="error">Error loading ${platform} shoutouts.</p>`;
        }
    }
    async function handleAddShoutout(platform, formElement) {
        if (!formElement) return;
        const collectionName = `shoutouts_${platform}`;
        const username = formElement.querySelector(`#${platform}-username`)?.value.trim();
        const nickname = formElement.querySelector(`#${platform}-nickname`)?.value.trim();
        const orderStr = formElement.querySelector(`#${platform}-order`)?.value.trim();
        const order = parseInt(orderStr);

        if (!username || !nickname || !orderStr || isNaN(order) || order < 1) {
            showAdminStatus(`Please provide Username, Nickname, and a valid positive Order number for ${platform}.`, true);
            return;
        }

        const accountData = {
            username: username, nickname: nickname, order: order,
            isVerified: formElement.querySelector(`#${platform}-isVerified`)?.checked || false,
            bio: formElement.querySelector(`#${platform}-bio`)?.value.trim() || null,
            profilePic: formElement.querySelector(`#${platform}-profilePic`)?.value.trim() || null,
            // Platform specific fields
            ...(platform === 'youtube' && { subscribers: formElement.querySelector(`#${platform}-subscribers`)?.value.trim() || 'N/A' }),
            ...(platform !== 'youtube' && { followers: formElement.querySelector(`#${platform}-followers`)?.value.trim() || 'N/A' }),
            ...(platform === 'youtube' && { coverPhoto: formElement.querySelector(`#${platform}-coverPhoto`)?.value.trim() || null }),
        };

        try {
            await db.collection(collectionName).add(accountData);
            const metaRef = db.collection('siteConfig').doc('shoutoutsMetadata');
            // Use server timestamp for reliability
            await metaRef.set({ [`lastUpdatedTime_${platform}`]: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
            showAdminStatus(`${platform} shoutout added.`);
            formElement.reset();
            loadShoutoutsAdmin(platform);
        } catch (error) {
            console.error(`Error adding ${platform} shoutout:`, error);
            showAdminStatus(`Error adding ${platform} shoutout: ${error.message}`, true);
        }
    }
    async function handleDeleteShoutout(platform, docId, listItemElement) {
       if (!confirm(`Are you sure you want to delete this ${platform} shoutout?`)) return;
       const collectionName = `shoutouts_${platform}`;
        try {
           await db.collection(collectionName).doc(docId).delete();
           const metaRef = db.collection('siteConfig').doc('shoutoutsMetadata');
           await metaRef.set({ [`lastUpdatedTime_${platform}`]: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
           showAdminStatus(`${platform} shoutout deleted.`);
           if(listItemElement) listItemElement.remove();
        } catch (error) {
           console.error(`Error deleting ${platform} shoutout:`, error);
           showAdminStatus(`Error deleting ${platform} shoutout: ${error.message}`, true);
       }
   }
    // Add listeners safely
    if(addShoutoutTiktokForm) addShoutoutTiktokForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('tiktok', addShoutoutTiktokForm); });
    if(addShoutoutInstagramForm) addShoutoutInstagramForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('instagram', addShoutoutInstagramForm); });
    if(addShoutoutYoutubeForm) addShoutoutYoutubeForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('youtube', addShoutoutYoutubeForm); });


   // --- FAQs Load/Add/Delete ---
   // Firestore: faqs collection -> Docs { question: string, answer: string (HTML allowed), order: number }
    async function loadFaqsAdmin() {
        if (!faqListAdmin) return;
        faqListAdmin.innerHTML = '<p>Loading FAQs...</p>'; // Use <p>
         try {
            const querySnapshot = await db.collection('faqs').orderBy('order', 'asc').get();
            faqListAdmin.innerHTML = '';
             if (querySnapshot.empty) { faqListAdmin.innerHTML = '<p>No FAQs found.</p>'; return; }
            querySnapshot.forEach(doc => {
                const faq = doc.data();
                const content = `<strong>Q: ${faq.question || 'No Question'}</strong> (Order: ${faq.order})`;
                renderAdminListItem(faqListAdmin, doc.id, content, handleDeleteFaq);
            });
        } catch (error) {
            console.error("Error loading FAQs:", error);
            faqListAdmin.innerHTML = '<p class="error">Error loading FAQs.</p>';
        }
    }
    async function handleDeleteFaq(docId, listItemElement) {
        if (!confirm(`Are you sure you want to delete this FAQ?`)) return;
        try {
           await db.collection('faqs').doc(docId).delete();
           showAdminStatus("FAQ deleted.");
           if(listItemElement) listItemElement.remove();
        } catch (error) {
           console.error("Error deleting FAQ:", error);
           showAdminStatus(`Error deleting FAQ: ${error.message}`, true);
       }
   }
    if (addFaqForm) {
        addFaqForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const question = addFaqForm.querySelector('#faq-question')?.value.trim();
            const answer = addFaqForm.querySelector('#faq-answer')?.value.trim();
            const orderStr = addFaqForm.querySelector('#faq-order')?.value.trim();
            const order = parseInt(orderStr);

            if (!question || !answer || !orderStr || isNaN(order) || order < 1) {
                 showAdminStatus("Please fill in Question, Answer, and a valid positive Order number.", true);
                 return;
             }
            const faqData = { question, answer, order };
             try {
                await db.collection('faqs').add(faqData);
                showAdminStatus("FAQ added successfully.");
                addFaqForm.reset();
                loadFaqsAdmin(); // Refresh list
            } catch (error) {
                console.error("Error adding FAQ:", error);
                showAdminStatus(`Error adding FAQ: ${error.message}`, true);
            }
        });
    }

   // --- Tech Specs Load/Save ---
   // Firestore: techSpecs collection -> Docs: 'iphone', 'watch', 'mac' -> Fields per device
    async function loadTechSpecsAdmin() {
        if (!techSpecsForm) return;
        try {
            const [iphoneSnap, watchSnap, macSnap] = await Promise.all([
                db.collection('techSpecs').doc('iphone').get(),
                db.collection('techSpecs').doc('watch').get(),
                db.collection('techSpecs').doc('mac').get()
            ]);
            // Use helper to populate based on prefix
            populateFormFields(techSpecsForm, iphoneSnap.data(), 'tech-iphone-');
            populateFormFields(techSpecsForm, watchSnap.data(), 'tech-watch-');
            populateFormFields(techSpecsForm, macSnap.data(), 'tech-mac-');

        } catch (error) {
            console.error("Error loading tech specs:", error);
            showAdminStatus("Error loading tech specs.", true);
        }
    }
    // Helper to populate form fields based on prefix and data object
    function populateFormFields(form, data, prefix) {
        if (!data) { // If doc didn't exist or had no data
             // Find all inputs with this prefix and clear them
             form.querySelectorAll(`[id^="${prefix}"]`).forEach(input => input.value = '');
             return;
         }
        for (const key in data) {
             const input = form.querySelector(`#${prefix}${key}`); // Case sensitive ID match
             if (input) {
                 input.value = data[key] !== null && data[key] !== undefined ? data[key] : ''; // Handle null/undefined from DB
             }
         }
    }
     // Helper to get form data based on prefix
     function getFormData(form, prefix) {
         const data = {};
         const inputs = form.querySelectorAll(`[id^="${prefix}"]`);
         inputs.forEach(input => {
             const key = input.id.substring(prefix.length);
             if (key) {
                // Basic type handling (can be expanded)
                if (input.type === 'number') {
                     data[key] = input.value === '' ? null : Number(input.value); // Store number or null
                 } else {
                     data[key] = input.value.trim() === '' ? null : input.value.trim(); // Store string or null
                 }
             }
         });
         return data;
     }

    if (techSpecsForm) {
        techSpecsForm.addEventListener('submit', async (e) => {
             e.preventDefault();
             const iphoneData = getFormData(techSpecsForm, 'tech-iphone-');
             const watchData = getFormData(techSpecsForm, 'tech-watch-');
             const macData = getFormData(techSpecsForm, 'tech-mac-');

             try {
                 await Promise.all([
                     db.collection('techSpecs').doc('iphone').set(iphoneData, { merge: true }),
                     db.collection('techSpecs').doc('watch').set(watchData, { merge: true }),
                     db.collection('techSpecs').doc('mac').set(macData, { merge: true })
                 ]);
                 showAdminStatus("Tech specs saved successfully.");
             } catch (error) {
                 console.error("Error saving tech specs:", error);
                 showAdminStatus(`Error saving tech specs: ${error.message}`, true);
             }
         });
    }

}); // End DOMContentLoaded
