// admin-portal.js

// Paste your Firebase configuration here
const firebaseConfig = {
    apiKey: "AIzaSyA9s6Sx82K6XlYpp_OKqrS-weMpoKP7uco",
    authDomain: "bus-army-dude-s-admin-portal.firebaseapp.com",
    projectId: "bus-army-dude-s-admin-portal",
    storageBucket: "bus-army-dude-s-admin-portal.firebasestorage.app",
    messagingSenderId: "974325477528",
    appId: "1:974325477528:web:b143e75657384a82f5e0ed",
    measurementId: "G-FVWWFFBCP2"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// If you plan to use Firebase Storage
// const storage = firebase.storage();

// DOM elements (for admin.html)
const tabs = document.querySelectorAll(".admin-nav li a");
const contentSections = document.querySelectorAll(".admin-tab-content");
const profileImageUploadAdmin = document.getElementById('profileImageUpload');
const usernameInputAdmin = document.getElementById('usernameInput');
const bioTextareaAdmin = document.getElementById('bioTextarea');
const saveProfileButton = document.querySelector('.save-profile-button');
const currentSocialLinksUl = document.getElementById('current-social-links');
const platformInput = document.getElementById('platform');
const urlInput = document.getElementById('url');
const addLinkButton = document.querySelector('#add-social-link-form button[type="button"]');
const presidentInfoDisplay = document.getElementById('presidentInfoDisplay');
const presidentEditForm = document.getElementById('presidentEditForm');
const editPresidentButton = document.getElementById('editPresidentButton');
const presidentNameInput = document.getElementById('presidentName');
const presidentBirthDateInput = document.getElementById('presidentBirthDate');
const presidentHeightInput = document.getElementById('presidentHeight');
const presidentPartyInput = document.getElementById('presidentParty');
const presidentTermStartInput = document.getElementById('presidentTermStart');
const presidentTermEndInput = document.getElementById('presidentTermEnd');
const vicePresidentNameInput = document.getElementById('vicePresidentName');
const presidentPhotoUpload = document.getElementById('presidentPhoto');
const currentPresidentPhotoDisplay = document.getElementById('currentPresidentPhoto');
const presidentDisplayNameAdmin = document.getElementById('presidentDisplayName');
const presidentDisplayBirthDateAdmin = document.getElementById('presidentDisplayBirthDate');
const presidentDisplayHeightAdmin = document.getElementById('presidentDisplayHeight');
const presidentDisplayPartyAdmin = document.getElementById('presidentDisplayParty');
const presidentDisplayTermAdmin = document.getElementById('presidentDisplayTerm');
const vicePresidentDisplayNameAdmin = document.getElementById('vicePresidentDisplayName');
const presidentDisplayPhotoAdmin = document.getElementById('presidentDisplayPhoto');
const cancelPresidentButton = document.querySelector('.cancel-president-button');

// DOM elements (for index.html)
const indexPresidentPhoto = document.querySelector('#current-president .president-photo');
const indexPresidentName = document.querySelector('#current-president .president-name');
const indexPresidentBirthDate = document.querySelector('#current-president .president-details p:nth-child(2)');
const indexPresidentHeight = document.querySelector('#current-president .president-details p:nth-child(3)');
const indexPresidentParty = document.querySelector('#current-president .president-details p:nth-child(4)');
const indexPresidentTerm = document.querySelector('#current-president .president-details p:nth-child(5)');
const indexVicePresidentName = document.querySelector('#current-president .president-details p:nth-child(6)');
const indexProfilePic = document.getElementById('indexProfilePic');
const indexUsername = document.getElementById('indexUsername');
const indexBioLine1 = document.getElementById('indexBioLine1');
const indexBioLine2 = document.getElementById('indexBioLine2');

// Modal elements for shoutouts (Add)
const shoutoutModal = document.getElementById('shoutout-modal');
const modalTitle = document.getElementById('modal-title');
const shoutoutForm = document.getElementById('shoutout-form');
const shoutoutPlatformInput = document.getElementById('shoutout-platform');
const followersSubscribersGroup = document.getElementById('followers-subscribers-group');
const coverPhotoGroup = document.getElementById('coverPhoto-group');
const tiktokShoutoutsList = document.getElementById('tiktok-shoutouts-list');
const instagramShoutoutsList = document.getElementById('instagram-shoutouts-list');
const youtubeShoutoutsList = document.getElementById('youtube-shoutouts-list');
const tiktokLastUpdatedTimestamp = document.getElementById('tiktok-last-updated-timestamp');
const instagramLastUpdatedTimestamp = document.getElementById('lastUpdatedInstagram');
const youtubeLastUpdatedTimestamp = document.getElementById('lastUpdatedYouTube');

// Modal elements for shoutouts (Edit)
const editShoutoutModal = document.getElementById('edit-shoutout-modal');
const editModalTitle = document.getElementById('edit-modal-title');
const editShoutoutForm = document.getElementById('edit-shoutout-form');
const editShoutoutIndexInput = document.getElementById('edit-shoutout-index');
const editShoutoutPlatformInput = document.getElementById('edit-shoutout-platform');
const editUsernameInput = document.getElementById('edit-username');
const editNicknameInput = document.getElementById('edit-nickname');
const editBioTextarea = document.getElementById('edit-bio');
const editProfilePicInput = document.getElementById('edit-profilePic');
const editFollowersSubscribersGroup = document.getElementById('edit-followers-subscribers-group');
const editFollowersInput = document.getElementById('edit-followers');
const editCoverPhotoGroup = document.getElementById('edit-coverPhoto-group');
const editCoverPhotoInput = document.getElementById('edit-coverPhoto');
const editIsVerifiedCheckbox = document.getElementById('edit-isVerified');

// Default: Hide all content sections except Home
function setDefaultTab() {
    contentSections.forEach((section) => {
        section.style.display = "none";
    });
    document.getElementById('home').style.display = "block";  // Show home tab by default
}

// Switch between tabs
function switchTab(tabId) {
    contentSections.forEach((section) => {
        section.style.display = "none";  // Hide all sections
    });
    document.getElementById(tabId).style.display = "block";  // Show the selected section
    if (tabId === 'shoutouts') {
        loadShoutoutsAdminPanel();
    }
}

// Set default tab on page load
window.onload = setDefaultTab;

// --------------------------------------------------------------------------
// Profile Section Editing Functionality (for admin.html)
// --------------------------------------------------------------------------

if (saveProfileButton) {
    saveProfileButton.addEventListener('click', function() {
        const username = usernameInputAdmin.value;
        const bio = bioTextareaAdmin.value;
        let profilePictureUrl = null;

        // Handle Profile Picture (saving data URL to Firestore for now)
        if (profileImageUploadAdmin.files && profileImageUploadAdmin.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePictureUrl = e.target.result;
                saveProfileData(username, bio, profilePictureUrl);
            };
            reader.readAsDataURL(profileImageUploadAdmin.files[0]);
        } else {
            const currentPicSrc = document.getElementById('currentProfilePic')?.src;
            profilePictureUrl = currentPicSrc || null;
            saveProfileData(username, bio, profilePictureUrl);
        }
    });
}

function saveProfileData(username, bio, profilePictureUrl) {
    db.collection('users').doc('main-user').update({
        username: username,
        bio: bio,
        profilePictureUrl: profilePictureUrl
    })
    .then(() => {
        alert('Profile information updated!');
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
        alert('Error updating profile information.');
    });
}

// Load saved data when admin.html loads (Profile Section)
document.addEventListener('DOMContentLoaded', function() {
    db.collection('users').doc('main-user').get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (usernameInputAdmin) {
                    usernameInputAdmin.value = data.username || '';
                }
                if (bioTextareaAdmin) {
                    bioTextareaAdmin.value = data.bio || '';
                }
                const profilePicSrc = data.profilePictureUrl || '';
                const currentProfilePic = document.getElementById('currentProfilePic');
                if (currentProfilePic) {
                    currentProfilePic.src = profilePicSrc;
                }
            } else {
                console.log("No such document!");
            }
            loadSocialLinksAdmin(); // Load social links for the management section
            loadSocialLinksAdminPreview(); // Load social links for the preview section
            loadPresidentData(); // Load president data for admin page
            loadShoutoutsAdminPanel(); // Load shoutouts for admin panel on load if shoutouts is default
        })
        .catch((error) => {
            console.error("Error getting document:", error);
        });

    // Load president data for index.html
    loadPresidentDataIndex();
    loadSocialLinksIndex();
});

// --------------------------------------------------------------------------
// Manage Social Links Functionality (for admin.html)
// --------------------------------------------------------------------------

function getSocialIconClass(platform) {
    platform = platform.toLowerCase();
    if (platform.includes('tiktok')) return 'fab fa-tiktok';
    if (platform.includes('snapchat')) return 'fab fa-snapchat-ghost';
    if (platform.includes('twitter') || platform.includes('x')) return 'fab fa-x-twitter';
    if (platform.includes('threads')) return 'fab fa-threads';
    if (platform.includes('twitch')) return 'fab fa-twitch';
    if (platform.includes('facebook')) return 'fab fa-facebook';
    if (platform.includes('steam')) return 'fab fa-steam';
    if (platform.includes('discord')) return 'fab fa-discord';
    if (platform.includes('instagram')) return 'fab fa-instagram';
    if (platform.includes('amazon')) return 'fa-brands fa-amazon';
    // Add more platforms and icons as needed
    return 'fa fa-link'; // Default link icon
}

function saveSocialLinksToFirebase(socialLinks) {
    db.collection('users').doc('main-user').update({
        socialLinks: socialLinks
    })
    .then(() => {
        console.log("Social links updated in Firebase!");
        loadSocialLinksAdmin(); // Reload the displayed list from Firebase after saving
        loadSocialLinksIndex(); // Reload social links on index page
    })
    .catch((error) => {
        console.error("Error updating social links in Firebase: ", error);
        alert('Error saving social links.');
    });
}

function loadSocialLinksAdmin() {
    if (currentSocialLinksUl) {
        currentSocialLinksUl.innerHTML = ''; // Clear the current list

        db.collection('users').doc('main-user').get()
            .then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    const socialLinks = data.socialLinks || []; // Get social links from Firebase

                    socialLinks.forEach((link, index) => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            <i class="${getSocialIconClass(link.platform)}"></i>
                            <span>${link.platform}:</span>
                            <a href="${link.url}" target="_blank">${link.url}</a>
                            <button onclick="startEditSocialLink(${index})">Edit</button>
                            <button onclick="removeSocialLink(${index})">Remove</button>
                        `;
                        currentSocialLinksUl.appendChild(listItem);
                    });
                } else {
                    console.log("No user document found, or no social links.");
                    // Optionally handle the case where the document doesn't exist
                }
                editingIndex = -1; // Reset editing index after loading
                addLinkButton.textContent = 'Add Link'; // Reset button text
            })
            .catch((error) => {
                console.error("Error loading social links from Firebase: ", error);
            });
    }
}

let editingIndex = -1; // To keep track of the index being edited (moved here for scope)

function addSocialLink() {
    const platform = platformInput.value.trim();
    const url = urlInput.value.trim();

    if (platform && url) {
        const newLink = { platform: platform, url: url };

        db.collection('users').doc('main-user').get()
            .then((doc) => {
                const data = doc.data();
                let socialLinks = data.socialLinks || [];

                if (editingIndex > -1) {
                    // Save the edit
                    socialLinks[editingIndex] = newLink;
                    editingIndex = -1; // Reset editing index
                    addLinkButton.textContent = 'Add Link';
                } else {
                    // Add a new link
                    socialLinks.push(newLink);
                }
                saveSocialLinksToFirebase(socialLinks); // Save updated links to Firebase and trigger reload
                platformInput.value = ''; // Clear the input fields
                urlInput.value = '';
            })
            .catch((error) => {
                console.error("Error getting user document for adding social link: ", error);
            });
    } else {
        alert('Please enter both the platform and the URL.');
    }
}

function startEditSocialLink(index) {
    db.collection('users').doc('main-user').get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const socialLinks = data.socialLinks || [];
                if (socialLinks[index]) {
                    const linkToEdit = socialLinks[index];
                    platformInput.value = linkToEdit.platform;
                    urlInput.value = linkToEdit.url;
                    editingIndex = index;
                    addLinkButton.textContent = 'Save Edit';
                } else {
                    console.log("Social link not found at index:", index);
                }
            } else {
                console.log("No user document found.");
            }
        })
        .catch((error) => {
            console.error("Error getting user document for editing social link: ", error);
        });
}

function removeSocialLink(index) {
    db.collection('users').doc('main-user').get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                let socialLinks = data.socialLinks || [];
                if (index >= 0 && index < socialLinks.length) {
                    socialLinks.splice(index, 1); // Remove the link at the given index
                    saveSocialLinksToFirebase(socialLinks); // Save the updated array to Firebase and trigger reload
                } else {
                    console.log("Invalid index for removing social link:", index);
                }
            } else {
                console.log("No user document found.");
            }
        })
        .catch((error) => {
            console.error("Error getting user document for removing social link: ", error);
        });
}

// --------------------------------------------------------------------------
// Load Profile Data and Social Links for index.html
// --------------------------------------------------------------------------

function loadSocialLinksIndex() {
    const socialLinksContainer = document.querySelector('.social-links-container'); // Corrected selector (class is correct)
    if (!socialLinksContainer) return; // Exit if the container doesn't exist

    socialLinksContainer.innerHTML = ''; // Clear existing links

    db.collection('users').doc('main-user').get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const socialLinks = data.socialLinks || []; // Get social links from Firebase

                socialLinks.forEach(link => {
                    const linkElement = document.createElement('a');
                    linkElement.href = link.url;
                    linkElement.classList.add('social-button');

                    const iconElement = document.createElement('i');
                    iconElement.className = `${getSocialIconClass(link.platform)} social-icon`;

                    const spanElement = document.createElement('span');
                    spanElement.textContent = link.platform.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); // Format platform name

                    linkElement.appendChild(iconElement);
                    linkElement.appendChild(spanElement);
                    socialLinksContainer.appendChild(linkElement);
                });
            } else {
                console.log("No user document found, or no social links for index.html.");
            }
        })
        .catch((error) => {
            console.error("Error loading social links from Firebase for index.html: ", error);
        });
}

// --------------------------------------------------------------------------
// Load Social Links for Admin Preview
// --------------------------------------------------------------------------

function loadSocialLinksAdminPreview() {
    const socialLinksContainer = document.getElementById('current-social-links-display');
    if (!socialLinksContainer) return;

    socialLinksContainer.innerHTML = ''; // Clear existing links

    db.collection('users').doc('main-user').get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const socialLinks = data.socialLinks || [];

                socialLinks.forEach(link => {
                    const linkElement = document.createElement('a');
                    linkElement.href = link.url;
                    linkElement.classList.add('social-button');

                    const iconElement = document.createElement('i');
                    iconElement.className = `${getSocialIconClass(link.platform)} social-icon`;

                    const spanElement = document.createElement('span');
                    spanElement.textContent = link.platform.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); // Format platform name

                    linkElement.appendChild(iconElement);
                    linkElement.appendChild(spanElement);
                    socialLinksContainer.appendChild(linkElement);
                });
            } else {
                console.log("No user document found, or no social links for admin preview.");
            }
        })
        .catch((error) => {
            console.error("Error loading social links from Firebase for admin preview: ", error);
        });
}

// --------------------------------------------------------------------------
// Current President Section Editing Functionality (for admin.html) - UPDATED to store in users/main-user
// --------------------------------------------------------------------------

function initializePresidentSection() {
    if (presidentInfoDisplay) presidentInfoDisplay.style.display = 'block';
    if (presidentEditForm) presidentEditForm.style.display = 'none';
    loadPresidentData();
}

if (editPresidentButton) {
    editPresidentButton.addEventListener('click', function() {
        if (presidentInfoDisplay) presidentInfoDisplay.style.display = 'none';
        if (presidentEditForm) presidentEditForm.style.display = 'block';
    });
}

if (cancelPresidentButton) {
    cancelPresidentButton.addEventListener('click', function() {
        if (presidentInfoDisplay) presidentInfoDisplay.style.display = 'block';
        if (presidentEditForm) presidentEditForm.style.display = 'none';
    });
}

function savePresidentData() {
    const name = presidentNameInput.value;
    const birthDate = presidentBirthDateInput.value;
    const height = presidentHeightInput.value;
    const party = presidentPartyInput.value;
    const termStart = presidentTermStartInput.value;
    const termEnd = presidentTermEndInput.value;
    const vicePresident = vicePresidentNameInput.value;
    let photoUrl = currentPresidentPhotoDisplay.src !== window.location.href ? currentPresidentPhotoDisplay.src : null; // Check if a new image was loaded

    if (presidentPhotoUpload.files && presidentPhotoUpload.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photoUrl = e.target.result;
            savePresidentDataToFirebase(name, birthDate, height, party, termStart, termEnd, vicePresident, photoUrl);
        };
        reader.readAsDataURL(presidentPhotoUpload.files[0]);
    } else {
        savePresidentDataToFirebase(name, birthDate, height, party, termStart, termEnd, vicePresident, photoUrl);
    }
}

function savePresidentDataToFirebase(name, birthDate, height, party, termStart, termEnd, vicePresident, photoUrl) {
    db.collection('users').doc('main-user').update({ // Update the main-user document
        currentPresident: { // Add a new field called currentPresident
            name: name,
            birthDate: birthDate,
            height: height,
            party: party,
            termStart: termStart,
            termEnd: termEnd,
            vicePresident: vicePresident,
            photoUrl: photoUrl
        }
    })
    .then(() => {
        alert('President information updated!');
        loadPresidentData(); // Reload the data to update the display on admin page
        loadPresidentDataIndex(); // Reload the data for index page
    })
    .catch((error) => {
        console.error("Error updating president data: ", error);
        alert('Error updating president information.');
    });
}

function loadPresidentData() {
    // Set initial state on load
    if (presidentInfoDisplay) presidentInfoDisplay.style.display = 'block';
    if (presidentEditForm) presidentEditForm.style.display = 'none';

    db.collection('users').doc('main-user').get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const presidentData = data.currentPresident || {}; // Get president data from the field

                if (presidentNameInput) presidentNameInput.value = presidentData.name || '';
                if (presidentBirthDateInput) presidentBirthDateInput.value = presidentData.birthDate || '';
                if (presidentHeightInput) presidentHeightInput.value = presidentData.height || '';
                if (presidentPartyInput) presidentPartyInput.value = presidentData.party || '';
                if (presidentTermStartInput) presidentTermStartInput.value = presidentData.termStart || '';
                if (presidentTermEndInput) presidentTermEndInput.value = presidentData.termEnd || '';
                if (vicePresidentNameInput) vicePresidentNameInput.value = presidentData.vicePresident || '';
                const photoUrl = presidentData.photoUrl || 'donaldtrump.jpg'; // Default image if no URL
                if (currentPresidentPhotoDisplay) currentPresidentPhotoDisplay.src = photoUrl;
                if (presidentDisplayPhotoAdmin) presidentDisplayPhotoAdmin.src = photoUrl;
                if (presidentDisplayNameAdmin) presidentDisplayNameAdmin.textContent = presidentData.name || 'President Name';
                if (presidentDisplayBirthDateAdmin) presidentDisplayBirthDateAdmin.textContent = presidentData.birthDate || 'Birth Date';
                if (presidentDisplayHeightAdmin) presidentDisplayHeightAdmin.textContent = presidentData.height || 'Height';
                if (presidentDisplayPartyAdmin) presidentDisplayPartyAdmin.textContent = presidentData.party || 'Party';
                if (presidentDisplayTermAdmin) presidentDisplayTermAdmin.textContent = `${presidentData.termStart || 'Start Date'} - ${presidentData.termEnd || 'End Date'}`;
                if (vicePresidentDisplayNameAdmin) vicePresidentDisplayNameAdmin.textContent = presidentData.vicePresident || 'Vice President Name';

                if (presidentInfoDisplay) presidentInfoDisplay.style.display = 'block';
                if (presidentEditForm) presidentEditForm.style.display = 'none';
            } else {
                console.log("No user document found.");
                if (presidentInfoDisplay) presidentInfoDisplay.style.display = 'none';
                if (presidentEditForm) presidentEditForm.style.display = 'none'; // Keep it hidden if no data
                // Optionally set default values in the form if you want it to be immediately editable
            }
        })
        .catch((error) => {
            console.error("Error loading president data: ", error);
            alert('Error loading president information.'); // Alert for load errors too
            if (presidentInfoDisplay) presidentInfoDisplay.style.display = 'none';
            if (presidentEditForm) presidentEditForm.style.display = 'none'; // Ensure hidden on error
        });
}

function loadPresidentDataIndex() {
    db.collection('users').doc('main-user').get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const presidentData = data.currentPresident || {}; // Get president data from the field
                const photoUrl = presidentData.photoUrl || 'donaldtrump.jpg'; // Default image if no URL

                if (indexPresidentPhoto) indexPresidentPhoto.src = photoUrl;
                if (indexPresidentName) indexPresidentName.textContent = presidentData.name || 'President Name';
                if (indexPresidentBirthDate) indexPresidentBirthDate.innerHTML = `<strong>Born:</strong> ${presidentData.birthDate || 'June 14, 1946'}`;
                if (indexPresidentHeight) indexPresidentHeight.innerHTML = `<strong>Height:</strong> ${presidentData.height || "6'3\" (190.5 cm)"}`;
                if (indexPresidentParty) indexPresidentParty.innerHTML = `<strong>Party:</strong> ${presidentData.party || 'Republican Party'}`;
                if (indexPresidentTerm) indexPresidentTerm.innerHTML = `<strong>Presidential Term:</strong> ${presidentData.termStart || '1/20/25 at 12:00 PM'} - ${presidentData.termEnd || '1/20/29 at 12:00 PM'}`;
                if (indexVicePresidentName) indexVicePresidentName.innerHTML = `<strong>Vice President:</strong> ${presidentData.vicePresident || 'James David Vance'}`;
            } else {
                console.log("No user document found, or no president data for index page.");
                // If no data, the index.html will show the hardcoded values
            }
        })
        .catch((error) => {
            console.error("Error loading president data for index page: ", error);
        });
}

// --------------------------------------------------------------------------
// Shoutout Section Functionality (for admin.html)
// --------------------------------------------------------------------------

function openAddShoutoutModal(platform) {
    shoutoutPlatformInput.value = platform;
    modalTitle.textContent = `Add New ${platform.charAt(0).toUpperCase() + platform.slice(1)} Shoutout`;

    // Adjust modal fields based on the platform
    if (platform === 'youtube') {
        document.querySelector('#followers-subscribers-group label').textContent = 'Subscribers:';
        coverPhotoGroup.style.display = 'block';
    } else {
        document.querySelector('#followers-subscribers-group label').textContent = 'Followers:';
        coverPhotoGroup.style.display = 'none';
    }

    shoutoutForm.reset(); // Clear any previous form data
    shoutoutModal.style.display = 'block';
}

function closeAddShoutoutModal() {
    shoutoutModal.style.display = 'none';
}

function saveShoutout() {
    const platform = shoutoutPlatformInput.value;
    const username = document.getElementById('username').value;
    const nickname = document.getElementById('nickname').value;
    const bio = document.getElementById('bio').value;
    const profilePic = document.getElementById('profilePic').value;
    const followers = document.getElementById('followers').value;
    const isVerified = document.getElementById('isVerified').checked;
    const coverPhoto = document.getElementById('coverPhoto').value;

    const shoutoutData = {
        platform: platform,
        username: username,
        nickname: nickname,
        bio: bio,
        profilePic: profilePic,
        [platform === 'youtube' ? 'subscribers' : 'followers']: parseInt(followers),
        isVerified: isVerified,
        coverPhoto: coverPhoto
    };

    db.collection('users').doc('main-user').update({
        shoutouts: firebase.firestore.FieldValue.arrayUnion(shoutoutData)
    })
    .then(() => {
        console.log("Shoutout data added to users/main-user");
        alert(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout added successfully!`);
        closeAddShoutoutModal();
        loadShoutoutsAdminPanel(); // Reload the shoutouts in the admin panel
    })
    .catch((error) => {
        console.error("Error adding shoutout data to users/main-user: ", error);
        alert(`Error adding ${platform} shoutout.`);
    });
}

function loadShoutoutsAdminPanel() {
    db.collection('users').doc('main-user').get()
        .then((doc) => {
            if (doc.exists && doc.data().shoutouts) {
                const shoutouts = doc.data().shoutouts;

                // Filter shoutouts by platform
                const tiktokShoutouts = shoutouts.filter(shoutout => shoutout.platform === 'tiktok');
                const instagramShoutouts = shoutouts.filter(shoutout => shoutout.platform === 'instagram');
                const youtubeShoutouts = shoutouts.filter(shoutout => shoutout.platform === 'youtube');

                // Display shoutouts in the admin panel
                displayShoutoutsAdmin(tiktokShoutouts, 'tiktok', tiktokShoutoutsList, tiktokLastUpdatedTimestamp);
                displayShoutoutsAdmin(instagramShoutouts, 'instagram', instagramShoutoutsList, instagramLastUpdatedTimestamp);
                displayShoutoutsAdmin(youtubeShoutouts, 'youtube', youtubeShoutoutsList, youtubeLastUpdatedTimestamp);
            } else {
                console.log("No shoutout data found.");
                tiktokShoutoutsList.innerHTML = '<p>No TikTok creators available yet.</p>';
                instagramShoutoutsList.innerHTML = '<p>No Instagram creators available yet.</p>';
                youtubeShoutoutsList.innerHTML = '<p>No YouTube creators available yet.</p>';
                updateLastUpdatedTimestamp(tiktokLastUpdatedTimestamp);
                updateLastUpdatedTimestamp(instagramLastUpdatedTimestamp);
                updateLastUpdatedTimestamp(youtubeLastUpdatedTimestamp);
            }
        })
        .catch((error) => {
            console.error("Error loading shoutout data for admin panel: ", error);
            tiktokShoutoutsList.innerHTML = '<p>Error loading TikTok shoutouts.</p>';
            instagramShoutoutsList.innerHTML = '<p>Error loading Instagram shoutouts.</p>';
            youtubeShoutoutsList.innerHTML = '<p>Error loading YouTube shoutouts.</p>';
            updateLastUpdatedTimestamp(tiktokLastUpdatedTimestamp);
            updateLastUpdatedTimestamp(instagramLastUpdatedTimestamp);
            updateLastUpdatedTimestamp(youtubeLastUpdatedTimestamp);
        });
}

function displayShoutoutsAdmin(shoutouts, platform, container, timestampElement) {
    container.innerHTML = ''; // Clear the current list
    if (shoutouts && shoutouts.length > 0) {
        shoutouts.forEach((shoutout, index) => {
            const creatorCard = document.createElement('div');
            creatorCard.classList.add('creator-card');
            creatorCard.innerHTML = `
                <img src="${shoutout.profilePic}" alt="${shoutout.nickname || shoutout.username}" class="profile-pic">
                <h3>${shoutout.nickname || shoutout.username} ${shoutout.isVerified ? '<i class="fas fa-check-circle verified"></i>' : ''}</h3>
                <p class="username">@${shoutout.username}</p>
                <p class="bio">${shoutout.bio || ''}</p>
                <p>${platform === 'youtube' ? 'Subscribers' : 'Followers'}: ${shoutout[platform === 'youtube' ? 'subscribers' : 'followers'] || 'N/A'}</p>
                ${platform === 'youtube' && shoutout.coverPhoto ? `<img src="${shoutout.coverPhoto}" alt="Cover Photo" class="cover-photo">` : ''}
                <div class="admin-controls">
                    <button onclick="populateEditShoutoutModal('${platform}', ${index})">Edit</button>
                    <button onclick="deleteShoutout('${platform}', ${index})">Delete</button>
                </div>
            `;
            container.appendChild(creatorCard);
        });
    } else {
        container.innerHTML = `<p>No ${platform.charAt(0).toUpperCase() + platform.slice(1)} creators added yet.</p>`;
    }
    updateLastUpdatedTimestamp(timestampElement);
}

function updateLastUpdatedTimestamp(element) {
    if (element) {
        const now = new Date();
        element.textContent = `Last updated: ${now.toLocaleString()}`;
    }
}

function openEditShoutoutModal() {
    editShoutoutModal.style.display = 'block';
}

function closeEditShoutoutModal() {
    editShoutoutModal.style.display = 'none';
}

function populateEditShoutoutModal(platform, index) {
    db.collection('users').doc('main-user').get()
        .then((doc) => {
            if (doc.exists && doc.data().shoutouts) {
                const shoutouts = doc.data().shoutouts;
                const shoutoutToEdit = shoutouts.find(shoutout => shoutout.platform === platform && shoutouts.indexOf(shoutout) === index); // Basic find, might need more robust ID

                if (shoutoutToEdit) {
                    editShoutoutIndexInput.value = index;
                    editShoutoutPlatformInput.value = platform;
                    editModalTitle.textContent = `Edit ${platform.charAt(0).toUpperCase() + platform.slice(1)} Shoutout`;
                    editUsernameInput.value = shoutoutToEdit.username || '';
                    editNicknameInput.value = shoutoutToEdit.nickname || '';
                    editBioTextarea.value = shoutoutToEdit.bio || '';
                    editProfilePicInput.value = shoutoutToEdit.profilePic || '';
                    editFollowersInput.value = shoutoutToEdit[platform === 'youtube' ? 'subscribers' : 'followers'] || '';
                    editIsVerifiedCheckbox.checked = shoutoutToEdit.isVerified || false;
                    if (platform === 'youtube') {
                        editFollowersSubscribersGroup.querySelector('label').textContent = 'Subscribers:';
                        editCoverPhotoGroup.style.display = 'block';
                        editCoverPhotoInput.value = shoutoutToEdit.coverPhoto || '';
                    } else {
                        editFollowersSubscribersGroup.querySelector('label').textContent = 'Followers:';
                        editCoverPhotoGroup.style.display = 'none';
                        editCoverPhotoInput.value = ''; // Clear if not YouTube
                    }
                    openEditShoutoutModal();
                } else {
                    console.log("Shoutout not found for editing.");
                }
            }
        })
        .catch((error) => {
            console.error("Error loading shoutout data for editing: ", error);
        });
}

function saveEditedShoutout() {
    const index = parseInt(editShoutoutIndexInput.value);
    const platform = editShoutoutPlatformInput.value;
    const username = editUsernameInput.value;
    const nickname = editNicknameInput.value;
    const bio = editBioTextarea.value;
    const profilePic = editProfilePicInput.value;
    const followers = parseInt(editFollowersInput.value);
    const isVerified = editIsVerifiedCheckbox.checked;
    const coverPhoto = editCoverPhotoInput.value;

    db.collection('users').doc('main-user').get()
        .then((doc) => {
            if (doc.exists && doc.data().shoutouts) {
                const shoutouts = [...doc.data().shoutouts]; // Create a copy to modify

                const updatedShoutout = {
                    platform: platform,
                    username: username,
                    nickname: nickname,
                    bio: bio,
                    profilePic: profilePic,
                    [platform === 'youtube' ? 'subscribers' : 'followers']: followers,
                    isVerified: isVerified,
                    coverPhoto: coverPhoto
                };

                // Replace the item at the specified index
                shoutouts[index] = updatedShoutout;

                db.collection('users').doc('main-user').update({
                    shoutouts: shoutouts
                })
                .then(() => {
                    console.log(`${platform} shoutout at index ${index} updated.`);
                    alert(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout updated successfully!`);
                    closeEditShoutoutModal();
                    loadShoutoutsAdminPanel(); // Reload the shoutouts
                })
                .catch((error) => {
                    console.error("Error updating shoutout: ", error);
                    alert(`Error updating ${platform} shoutout.`);
                });
            }
        });
}

function deleteShoutout(platform, index) {
    if (confirm(`Are you sure you want to delete the ${platform} shoutout at index: ${index}?`)) {
        db.collection('users').doc('main-user').get()
            .then((doc) => {
                if (doc.exists && doc.data().shoutouts) {
                    const shoutouts = [...doc.data().shoutouts];
                    shoutouts.splice(index, 1); // Remove the item at the specified index

                    db.collection('users').doc('main-user').update({
                        shoutouts: shoutouts
                    })
                    .then(() => {
                        console.log(`${platform} shoutout at index ${index} deleted.`);
                        alert(`${platform.charAt(0).toUpperCase() + platform.slice(1)} shoutout deleted.`);
                        loadShoutoutsAdminPanel();
                    })
                    .catch((error) => {
                        console.error("Error deleting shoutout: ", error);
                        alert(`Error deleting ${platform} shoutout.`);
                    });
                }
            });
    }
}

// Call initializePresidentSection when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Existing DOMContentLoaded logic for other sections
    db.collection('users').doc('main-user').get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (usernameInputAdmin) {
                    usernameInputAdmin.value = data.username || '';
                }
                if (bioTextareaAdmin) {
                    bioTextareaAdmin.value = data.bio || '';
                }
                const profilePicSrc = data.profilePictureUrl || '';
                const currentProfilePic = document.getElementById('currentProfilePic');
                if (currentProfilePic) {
                    currentProfilePic.src = profilePicSrc;
                }
            } else {
                console.log("No such document!");
            }
            loadSocialLinksAdmin();
            loadSocialLinksAdminPreview();
            initializePresidentSection(); // Initialize the president section for admin page
            loadShoutoutsAdminPanel(); // Load shoutouts for admin panel on load if shoutouts is default
        })
        .catch((error) => {
            console.error("Error getting document:", error);
        });

    // Load president data and social links for index page
    loadPresidentDataIndex();
    loadSocialLinksIndex();
});
