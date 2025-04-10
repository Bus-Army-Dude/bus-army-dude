// admin.js

// !!! IMPORTANT: REPLACE WITH YOUR FIREBASE CONFIGURATION !!!
const firebaseConfig = {
    apiKey: "AIzaSyCrQNseQTsWjQhsQBGm8nk9Y_mysuaTsrc",
    authDomain: "bus-army-dude-website.firebaseapp.com",
    projectId: "bus-army-dude-website",
    storageBucket: "bus-army-dude-website.firebasestorage.app",
    messagingSenderId: "464457126263",
    appId: "1:464457126263:web:7e8d63b9bb59a360b39172"
};

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Initialize Firebase
    try {
        if (!firebase || !firebase.app) { // Basic check if SDK loaded
             firebase.initializeApp(firebaseConfig);
        }
    } catch (e) {
        console.error("Error initializing Firebase:", e);
        alert("Could not initialize Firebase. Admin portal will not work.");
        return; // Stop script execution
    }

    const auth = firebase.auth();
    const db = firebase.firestore();
    const Timestamp = firebase.firestore.Timestamp; // Alias for convenience

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

    // Forms & Sections
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

    // Helper function to display status messages
    function showAdminStatus(message, isError = false) {
        adminStatus.textContent = message;
        adminStatus.className = `status-message ${isError ? 'error' : 'success'}`;
        // Auto-clear message after a few seconds
        setTimeout(() => {
            adminStatus.textContent = '';
            adminStatus.className = 'status-message';
        }, 5000);
    }

    // Helper function to render list items with delete button
    function renderAdminListItem(container, docId, contentHtml, deleteHandler) {
         const itemDiv = document.createElement('div');
         itemDiv.className = 'list-item-admin';
         itemDiv.setAttribute('data-id', docId); // Store doc ID for deletion
         itemDiv.innerHTML = `
            <div class="item-content">${contentHtml}</div>
            <div class="item-actions">
                 <button type="button" class="delete-button small-button">Delete</button>
            </div>
        `;
        // Add event listener to the delete button WITHIN this item
        itemDiv.querySelector('.delete-button').addEventListener('click', () => deleteHandler(docId, itemDiv));
        container.appendChild(itemDiv);
    }


    // --- Authentication Logic ---
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            loginSection.style.display = 'none';
            adminContent.style.display = 'block';
            logoutButton.style.display = 'inline-block';
            adminGreeting.textContent = `Logged in as: ${user.email}`;
            authStatus.textContent = '';
            authStatus.className = 'status-message';
            adminStatus.textContent = ''; // Clear admin status on login
            adminStatus.className = 'status-message';

            // --- Load Data into Forms ---
            loadGlobalSettingsAdmin();
            loadProfileInfoAdmin();
            loadBusinessHoursAdmin();
            loadHolidaysAdmin();
            loadTempUnavailabilityAdmin();
            loadEventsAdmin();
            loadShoutoutsAdmin('tiktok');
            loadShoutoutsAdmin('instagram');
            loadShoutoutsAdmin('youtube');
            loadFaqsAdmin();
            loadTechSpecsAdmin();

        } else {
            // User is signed out
            loginSection.style.display = 'block';
            adminContent.style.display = 'none';
            logoutButton.style.display = 'none';
            adminGreeting.textContent = '';
        }
    });

    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        authStatus.textContent = 'Logging in...';
        authStatus.className = 'status-message';

        auth.signInWithEmailAndPassword(email, password)
            .then(() => { /* onAuthStateChanged handles UI */ })
            .catch((error) => {
                console.error("Login failed:", error);
                authStatus.textContent = `Login Failed: ${error.message}`;
                authStatus.className = 'status-message error';
            });
    });

    // Logout
    logoutButton.addEventListener('click', () => {
        auth.signOut().catch((error) => {
            console.error("Logout failed:", error);
            showAdminStatus(`Logout Failed: ${error.message}`, true);
        });
    });

    // --- CRUD Functions ---

    // --- Global Settings ---
    // Firestore: siteConfig/globalSettings -> { maintenanceMode: boolean, profileStatus: string }
    async function loadGlobalSettingsAdmin() {
        try {
            const docRef = db.collection('siteConfig').doc('globalSettings');
            const docSnap = await docRef.get();
            if (docSnap.exists) {
                const data = docSnap.data();
                globalSettingsForm.querySelector('#maintenance-mode').checked = data.maintenanceMode || false;
                globalSettingsForm.querySelector('#profile-status').value = data.profileStatus || 'offline';
            } else {
                console.warn("Global settings document not found. Using defaults.");
                // Set form to defaults if needed
                 globalSettingsForm.querySelector('#maintenance-mode').checked = false;
                 globalSettingsForm.querySelector('#profile-status').value = 'offline';
            }
        } catch (error) {
            console.error("Error loading global settings:", error);
            showAdminStatus("Error loading global settings.", true);
        }
    }
    globalSettingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const settingsData = {
            maintenanceMode: globalSettingsForm.querySelector('#maintenance-mode').checked,
            profileStatus: globalSettingsForm.querySelector('#profile-status').value
        };
        try {
            await db.collection('siteConfig').doc('globalSettings').set(settingsData, { merge: true });
            showAdminStatus("Global settings saved successfully.");
        } catch (error) {
            console.error("Error saving global settings:", error);
            showAdminStatus(`Error saving global settings: ${error.message}`, true);
        }
    });

     // --- Profile Info ---
     // Firestore: profile/main -> { username: string, currentPresidentText: string, politicalPartyText: string }
     async function loadProfileInfoAdmin() {
        try {
            const docRef = db.collection('profile').doc('main'); // Assuming one main profile document
            const docSnap = await docRef.get();
            if (docSnap.exists) {
                const data = docSnap.data();
                profileInfoForm.querySelector('#profile-username').value = data.username || '';
                profileInfoForm.querySelector('#profile-president').value = data.currentPresidentText || '';
                profileInfoForm.querySelector('#profile-party').value = data.politicalPartyText || '';
                 // Load other fields if you add them
            } else {
                console.warn("Profile info document not found.");
            }
        } catch (error) {
            console.error("Error loading profile info:", error);
            showAdminStatus("Error loading profile info.", true);
        }
    }
     profileInfoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const profileData = {
            username: profileInfoForm.querySelector('#profile-username').value,
            currentPresidentText: profileInfoForm.querySelector('#profile-president').value,
            politicalPartyText: profileInfoForm.querySelector('#profile-party').value,
            // Add other fields
        };
        try {
            await db.collection('profile').doc('main').set(profileData, { merge: true });
            showAdminStatus("Profile info saved successfully.");
        } catch (error) {
            console.error("Error saving profile info:", error);
            showAdminStatus(`Error saving profile info: ${error.message}`, true);
        }
    });


    // --- Business Hours ---
    // Firestore: siteConfig/businessHours -> { regularHours: Map }
    async function loadBusinessHoursAdmin() {
        try {
            const docRef = db.collection('siteConfig').doc('businessHours');
            const docSnap = await docRef.get();
            if (docSnap.exists && docSnap.data().regularHours) {
                const hours = docSnap.data().regularHours;
                for (const day of ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']) {
                    businessHoursForm.querySelector(`#hours-${day}-open`).value = hours[day]?.open || ''; // Use nullish coalescing
                    businessHoursForm.querySelector(`#hours-${day}-close`).value = hours[day]?.close || '';
                }
            } else {
                 console.warn("Business hours document or regularHours field not found.");
                 // Optionally clear the form or set defaults
                 businessHoursForm.reset();
            }
        } catch (error) {
            console.error("Error loading regular hours:", error);
            showAdminStatus("Error loading regular hours.", true);
        }
    }
    businessHoursForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const regularHoursData = {};
        for (const day of ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']) {
            // Store null if input is empty, otherwise store the string value
             const openVal = businessHoursForm.querySelector(`#hours-${day}-open`).value.trim();
             const closeVal = businessHoursForm.querySelector(`#hours-${day}-close`).value.trim();
             regularHoursData[day] = {
                 open: openVal === '' ? null : openVal,
                 close: closeVal === '' ? null : closeVal
             };
        }
        try {
            await db.collection('siteConfig').doc('businessHours').set({ regularHours: regularHoursData }, { merge: true });
            showAdminStatus("Regular business hours saved.");
        } catch (error) {
            console.error("Error saving regular hours:", error);
            showAdminStatus(`Error saving regular hours: ${error.message}`, true);
        }
    });

    // --- Holidays ---
    // Firestore: siteConfig/holidays -> Map { "YYYY-MM-DD": { name: string, hours: string } }
    async function loadHolidaysAdmin() {
        holidaysListAdmin.innerHTML = 'Loading holidays...';
        try {
            const docRef = db.collection('siteConfig').doc('holidays');
            const docSnap = await docRef.get();
            holidaysListAdmin.innerHTML = ''; // Clear loading/previous
            if (docSnap.exists) {
                const holidays = docSnap.data() || {};
                 // Sort dates for display
                const sortedDates = Object.keys(holidays).sort();
                if (sortedDates.length === 0) {
                    holidaysListAdmin.innerHTML = '<p>No holidays defined.</p>';
                }
                sortedDates.forEach(dateKey => {
                    const holiday = holidays[dateKey];
                    const content = `<strong>${dateKey}:</strong> ${holiday.name} - <i>${holiday.hours}</i>`;
                    // Use dateKey as the 'docId' for deletion purposes
                    renderAdminListItem(holidaysListAdmin, dateKey, content, handleDeleteHoliday);
                });
            } else {
                holidaysListAdmin.innerHTML = '<p>No holidays defined.</p>';
            }
        } catch (error) {
            console.error("Error loading holidays:", error);
            holidaysListAdmin.innerHTML = '<p class="error">Error loading holidays.</p>';
        }
    }
    addHolidayForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dateKey = addHolidayForm.querySelector('#holiday-date').value; // YYYY-MM-DD
        const name = addHolidayForm.querySelector('#holiday-name').value;
        const hours = addHolidayForm.querySelector('#holiday-hours').value;

        if (!dateKey.match(/^\d{4}-\d{2}-\d{2}$/)) {
            showAdminStatus("Invalid date format. Use YYYY-MM-DD.", true);
            return;
        }

        const holidayData = { [dateKey]: { name, hours } }; // Use Field Path notation for map key

        try {
            // Use update to merge into the existing map
            await db.collection('siteConfig').doc('holidays').set(holidayData, { merge: true });
            showAdminStatus(`Holiday for ${dateKey} added/updated.`);
            addHolidayForm.reset();
            loadHolidaysAdmin(); // Refresh list
        } catch (error) {
            console.error("Error adding/updating holiday:", error);
            showAdminStatus(`Error saving holiday: ${error.message}`, true);
        }
    });
    async function handleDeleteHoliday(dateKey, listItemElement) {
        if (!confirm(`Are you sure you want to delete the holiday for ${dateKey}?`)) return;

        const holidayToDelete = { [dateKey]: firebase.firestore.FieldValue.delete() };

        try {
            await db.collection('siteConfig').doc('holidays').update(holidayToDelete);
            showAdminStatus(`Holiday for ${dateKey} deleted.`);
             listItemElement.remove(); // Remove from UI
            // Optionally reload the list: loadHolidaysAdmin();
        } catch (error) {
            console.error("Error deleting holiday:", error);
            showAdminStatus(`Error deleting holiday: ${error.message}`, true);
        }
    }
     // Attach delete handler via event delegation if needed, but renderAdminListItem attaches directly

     // Handle clicking the separate delete button
     deleteHolidayButton.addEventListener('click', async () => {
         const dateToDelete = addHolidayForm.querySelector('#holiday-date').value;
         if (!dateToDelete.match(/^\d{4}-\d{2}-\d{2}$/)) {
            showAdminStatus("Enter a valid date (YYYY-MM-DD) in the 'Add/Update' form to delete.", true);
            return;
         }
         // Find the list item element to remove it visually if deletion is successful
         const listItemElement = holidaysListAdmin.querySelector(`[data-id="${dateToDelete}"]`);
         await handleDeleteHoliday(dateToDelete, listItemElement);
     });


    // --- Temporary Unavailability ---
    // Firestore: siteConfig/temporaryUnavailability -> Map { "YYYY-MM-DD": Array[{from: string, to: string, reason: string}] }
    async function loadTempUnavailabilityAdmin() {
        tempUnavailabilityListAdmin.innerHTML = 'Loading temporary slots...';
         try {
            const docRef = db.collection('siteConfig').doc('temporaryUnavailability');
            const docSnap = await docRef.get();
            tempUnavailabilityListAdmin.innerHTML = ''; // Clear
             if (docSnap.exists) {
                const tempMap = docSnap.data() || {};
                const sortedDates = Object.keys(tempMap).sort();
                 if (sortedDates.length === 0) {
                     tempUnavailabilityListAdmin.innerHTML = '<p>No temporary unavailable slots defined.</p>';
                 }

                 let hasItems = false;
                 sortedDates.forEach(dateKey => {
                     const slots = tempMap[dateKey];
                     if (Array.isArray(slots)) {
                         slots.forEach((slot, index) => {
                            hasItems = true;
                            // Create a unique ID for deletion combining date and index
                             const slotId = `${dateKey}_${index}`;
                             const content = `<strong>${dateKey}:</strong> ${slot.from} - ${slot.to} <i>(${slot.reason})</i>`;
                             renderAdminListItem(tempUnavailabilityListAdmin, slotId, content, handleDeleteTempSlot);
                         });
                     }
                 });
                 if (!hasItems) {
                      tempUnavailabilityListAdmin.innerHTML = '<p>No temporary unavailable slots defined.</p>';
                 }

            } else {
                tempUnavailabilityListAdmin.innerHTML = '<p>No temporary unavailable slots defined.</p>';
            }
        } catch (error) {
            console.error("Error loading temporary unavailability:", error);
            tempUnavailabilityListAdmin.innerHTML = '<p class="error">Error loading temporary slots.</p>';
        }
    }
     addTempUnavailabilityForm.addEventListener('submit', async (e) => {
         e.preventDefault();
         const dateKey = addTempUnavailabilityForm.querySelector('#temp-date').value;
         const from = addTempUnavailabilityForm.querySelector('#temp-from').value;
         const to = addTempUnavailabilityForm.querySelector('#temp-to').value;
         const reason = addTempUnavailabilityForm.querySelector('#temp-reason').value;

         if (!dateKey.match(/^\d{4}-\d{2}-\d{2}$/)) {
            showAdminStatus("Invalid date format. Use YYYY-MM-DD.", true);
            return;
        }
         if (!from || !to || !reason) {
              showAdminStatus("Please fill in all fields for the temporary slot.", true);
              return;
         }

         const newSlot = { from, to, reason };
         const docRef = db.collection('siteConfig').doc('temporaryUnavailability');

         try {
             // Use a transaction to safely update the array
             await db.runTransaction(async (transaction) => {
                 const docSnap = await transaction.get(docRef);
                 let currentData = docSnap.data() || {};
                 let slotsForDate = currentData[dateKey] || [];
                 if (!Array.isArray(slotsForDate)) slotsForDate = []; // Ensure it's an array
                 slotsForDate.push(newSlot);
                 transaction.set(docRef, { [dateKey]: slotsForDate }, { merge: true });
             });

             showAdminStatus(`Temporary slot for ${dateKey} added.`);
             addTempUnavailabilityForm.reset();
             loadTempUnavailabilityAdmin(); // Refresh list
         } catch (error) {
             console.error("Error adding temporary slot:", error);
             showAdminStatus(`Error adding temporary slot: ${error.message}`, true);
         }
     });
     async function handleDeleteTempSlot(slotId, listItemElement) {
        // slotId is "YYYY-MM-DD_index"
         const [dateKey, indexStr] = slotId.split('_');
         const index = parseInt(indexStr, 10);

         if (!dateKey || isNaN(index)) {
            showAdminStatus("Invalid slot ID for deletion.", true);
            return;
        }
         if (!confirm(`Are you sure you want to delete slot ${index + 1} for ${dateKey}?`)) return;

         const docRef = db.collection('siteConfig').doc('temporaryUnavailability');
         try {
            // Use a transaction to safely remove the item from the array
             await db.runTransaction(async (transaction) => {
                 const docSnap = await transaction.get(docRef);
                 let currentData = docSnap.data();
                 if (currentData && currentData[dateKey] && Array.isArray(currentData[dateKey]) && currentData[dateKey].length > index) {
                     currentData[dateKey].splice(index, 1); // Remove item at index
                     transaction.update(docRef, { [dateKey]: currentData[dateKey] });
                 } else {
                      throw new Error("Slot or date key not found for deletion.");
                 }
             });
             showAdminStatus(`Temporary slot for ${dateKey} deleted.`);
              listItemElement.remove(); // Remove from UI immediately
             // Optionally reload the whole list for safety: loadTempUnavailabilityAdmin();
         } catch (error) {
             console.error("Error deleting temporary slot:", error);
             showAdminStatus(`Error deleting temporary slot: ${error.message}`, true);
         }
     }


    // --- Events ---
    // Firestore: events collection -> Docs { title, startDate(Timestamp), endDate(Timestamp), type, location, description, link }
    async function loadEventsAdmin() {
        eventsListAdmin.innerHTML = 'Loading events...';
        try {
            const querySnapshot = await db.collection('events')
                                          .orderBy('startDate', 'asc') // Show oldest first in admin
                                          .get();
            eventsListAdmin.innerHTML = ''; // Clear loading/previous
            if (querySnapshot.empty) {
                eventsListAdmin.innerHTML = '<p>No events found.</p>';
            }
            querySnapshot.forEach(doc => {
                const event = doc.data();
                // Convert Timestamps back to JS Dates for display if needed, or format directly
                const startDateStr = event.startDate?.toDate ? event.startDate.toDate().toLocaleString() : 'N/A';
                 const endDateStr = event.endDate?.toDate ? event.endDate.toDate().toLocaleString() : 'N/A';
                const content = `<strong>${event.title || 'No Title'}</strong><br>
                                 <small>Start: ${startDateStr}</small><br>
                                 <small>End: ${endDateStr}</small><br>
                                 <small>Location: ${event.location || 'N/A'}</small>`;
                renderAdminListItem(eventsListAdmin, doc.id, content, handleDeleteEvent);
            });
        } catch (error) {
            console.error("Error loading events:", error);
            eventsListAdmin.innerHTML = '<p class="error">Error loading events.</p>';
        }
    }
    addEventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = addEventForm.querySelector('#event-title').value;
        const startDateTime = addEventForm.querySelector('#event-start-datetime').value;
        const endDateTime = addEventForm.querySelector('#event-end-datetime').value;

        if (!title || !startDateTime || !endDateTime) {
            showAdminStatus("Title, Start, and End date/time are required.", true);
            return;
        }

        const eventData = {
            title: title,
            startDate: Timestamp.fromDate(new Date(startDateTime)), // Convert local datetime string to Timestamp
            endDate: Timestamp.fromDate(new Date(endDateTime)),
            type: addEventForm.querySelector('#event-type').value || null,
            location: addEventForm.querySelector('#event-location').value || null,
            description: addEventForm.querySelector('#event-description').value || null,
            link: addEventForm.querySelector('#event-link').value || null,
            createdAt: Timestamp.now() // Optional: track when it was added
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
    async function handleDeleteEvent(docId, listItemElement) {
         if (!confirm(`Are you sure you want to delete this event?`)) return;
        try {
            await db.collection('events').doc(docId).delete();
            showAdminStatus("Event deleted.");
             listItemElement.remove();
        } catch (error) {
            console.error("Error deleting event:", error);
            showAdminStatus(`Error deleting event: ${error.message}`, true);
        }
    }

    // --- Shoutouts ---
    // Firestore: shoutouts_tiktok, shoutouts_instagram, shoutouts_youtube collections
    // Docs: { username, isVerified, followers/subscribers, nickname, bio, profilePic, coverPhoto(yt), order }
    // Firestore: siteConfig/shoutoutsMetadata -> { lastUpdatedTime_tiktok(Timestamp), ... }
    async function loadShoutoutsAdmin(platform) { // platform = 'tiktok', 'instagram', or 'youtube'
        const listContainer = document.getElementById(`shoutouts-${platform}-list-admin`);
        if (!listContainer) return;
        listContainer.innerHTML = `Loading ${platform} shoutouts...`;

        try {
            const collectionName = `shoutouts_${platform}`;
            const querySnapshot = await db.collection(collectionName).orderBy('order', 'asc').get();
            listContainer.innerHTML = ''; // Clear
            if (querySnapshot.empty) {
                listContainer.innerHTML = `<p>No ${platform} shoutouts found.</p>`;
            }
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
        const collectionName = `shoutouts_${platform}`;
        const accountData = {
            username: formElement.querySelector(`#${platform}-username`).value,
            nickname: formElement.querySelector(`#${platform}-nickname`).value,
            isVerified: formElement.querySelector(`#${platform}-isVerified`).checked,
            bio: formElement.querySelector(`#${platform}-bio`).value || null,
            profilePic: formElement.querySelector(`#${platform}-profilePic`).value || null,
            order: parseInt(formElement.querySelector(`#${platform}-order`).value) || 0,
            // Platform specific fields
            ...(platform === 'youtube' && { subscribers: formElement.querySelector(`#${platform}-subscribers`).value || 'N/A' }),
            ...(platform !== 'youtube' && { followers: formElement.querySelector(`#${platform}-followers`).value || 'N/A' }),
            ...(platform === 'youtube' && { coverPhoto: formElement.querySelector(`#${platform}-coverPhoto`).value || null }),
        };

        // Basic validation
        if (!accountData.username || !accountData.nickname || isNaN(accountData.order)) {
             showAdminStatus(`Please provide Username, Nickname, and a valid Order number for ${platform}.`, true);
             return;
        }

        try {
            await db.collection(collectionName).add(accountData);
            // Update the last updated time
            const metaRef = db.collection('siteConfig').doc('shoutoutsMetadata');
            await metaRef.set({ [`lastUpdatedTime_${platform}`]: Timestamp.now() }, { merge: true });

            showAdminStatus(`${platform} shoutout added.`);
            formElement.reset();
            loadShoutoutsAdmin(platform); // Refresh list
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
             // Update the last updated time
            const metaRef = db.collection('siteConfig').doc('shoutoutsMetadata');
            await metaRef.set({ [`lastUpdatedTime_${platform}`]: Timestamp.now() }, { merge: true });

            showAdminStatus(`${platform} shoutout deleted.`);
             listItemElement.remove();
         } catch (error) {
            console.error(`Error deleting ${platform} shoutout:`, error);
            showAdminStatus(`Error deleting ${platform} shoutout: ${error.message}`, true);
        }
    }
     // Add listeners for each platform's form
    addShoutoutTiktokForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('tiktok', addShoutoutTiktokForm); });
    addShoutoutInstagramForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('instagram', addShoutoutInstagramForm); });
    addShoutoutYoutubeForm.addEventListener('submit', (e) => { e.preventDefault(); handleAddShoutout('youtube', addShoutoutYoutubeForm); });


    // --- FAQs ---
    // Firestore: faqs collection -> Docs { question: string, answer: string (can be HTML), order: number }
    async function loadFaqsAdmin() {
        faqListAdmin.innerHTML = 'Loading FAQs...';
         try {
            const querySnapshot = await db.collection('faqs').orderBy('order', 'asc').get();
            faqListAdmin.innerHTML = ''; // Clear
             if (querySnapshot.empty) {
                faqListAdmin.innerHTML = '<p>No FAQs found.</p>';
            }
            querySnapshot.forEach(doc => {
                const faq = doc.data();
                 // Display only question in admin list for brevity
                const content = `<strong>Q: ${faq.question || 'No Question'}</strong> (Order: ${faq.order})`;
                renderAdminListItem(faqListAdmin, doc.id, content, handleDeleteFaq);
            });
        } catch (error) {
            console.error("Error loading FAQs:", error);
            faqListAdmin.innerHTML = '<p class="error">Error loading FAQs.</p>';
        }
    }
    addFaqForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const faqData = {
            question: addFaqForm.querySelector('#faq-question').value,
            answer: addFaqForm.querySelector('#faq-answer').value,
            order: parseInt(addFaqForm.querySelector('#faq-order').value) || 0
        };
         if (!faqData.question || !faqData.answer || isNaN(faqData.order)) {
             showAdminStatus("Please fill in Question, Answer, and a valid Order number.", true);
             return;
         }
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
     async function handleDeleteFaq(docId, listItemElement) {
         if (!confirm(`Are you sure you want to delete this FAQ?`)) return;
         try {
            await db.collection('faqs').doc(docId).delete();
            showAdminStatus("FAQ deleted.");
             listItemElement.remove();
         } catch (error) {
            console.error("Error deleting FAQ:", error);
            showAdminStatus(`Error deleting FAQ: ${error.message}`, true);
        }
    }

     // --- Tech Specs ---
     // Firestore: techSpecs collection -> Docs: 'iphone', 'watch', 'mac' -> Fields per device
     async function loadTechSpecsAdmin() {
        try {
            const [iphoneSnap, watchSnap, macSnap] = await Promise.all([
                db.collection('techSpecs').doc('iphone').get(),
                db.collection('techSpecs').doc('watch').get(),
                db.collection('techSpecs').doc('mac').get()
            ]);

             // Populate iPhone form
            if (iphoneSnap.exists) {
                const data = iphoneSnap.data();
                techSpecsForm.querySelector('#tech-iphone-model').value = data.model || '';
                techSpecsForm.querySelector('#tech-iphone-osVersion').value = data.osVersion || '';
                techSpecsForm.querySelector('#tech-iphone-batteryHealth').value = data.batteryHealth || '';
                // ... populate other iPhone fields ...
            }
              // Populate Watch form
            if (watchSnap.exists) {
                 const data = watchSnap.data();
                techSpecsForm.querySelector('#tech-watch-model').value = data.model || '';
                techSpecsForm.querySelector('#tech-watch-osVersion').value = data.osVersion || '';
                techSpecsForm.querySelector('#tech-watch-batteryHealth').value = data.batteryHealth || '';
                 // ... populate other watch fields ...
            }
             // Populate Mac form
            if (macSnap.exists) {
                 const data = macSnap.data();
                techSpecsForm.querySelector('#tech-mac-model').value = data.model || '';
                techSpecsForm.querySelector('#tech-mac-osVersion').value = data.osVersion || '';
                 // ... populate other mac fields ...
            }

        } catch (error) {
            console.error("Error loading tech specs:", error);
            showAdminStatus("Error loading tech specs.", true);
        }
    }
     techSpecsForm.addEventListener('submit', async (e) => {
         e.preventDefault();
         const iphoneData = {
             model: techSpecsForm.querySelector('#tech-iphone-model').value,
             osVersion: techSpecsForm.querySelector('#tech-iphone-osVersion').value,
             batteryHealth: techSpecsForm.querySelector('#tech-iphone-batteryHealth').value,
             // ... get other iphone fields ...
         };
         const watchData = {
              model: techSpecsForm.querySelector('#tech-watch-model').value,
              osVersion: techSpecsForm.querySelector('#tech-watch-osVersion').value,
              batteryHealth: techSpecsForm.querySelector('#tech-watch-batteryHealth').value,
              // ... get other watch fields ...
         };
         const macData = {
              model: techSpecsForm.querySelector('#tech-mac-model').value,
              osVersion: techSpecsForm.querySelector('#tech-mac-osVersion').value,
               // ... get other mac fields ...
         };

         try {
             // Save each device's data to its respective document
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


}); // End DOMContentLoaded
