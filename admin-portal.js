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

// DOM elements
const tabs = document.querySelectorAll(".admin-nav li a");
const contentSections = document.querySelectorAll(".admin-tab-content");

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
}

// Set default tab on page load
window.onload = setDefaultTab;

// --------------------------------------------------------------------------
// Profile Section Editing Functionality (for admin.html)
// --------------------------------------------------------------------------

const profileImageUploadAdmin = document.getElementById('profileImageUpload');
const usernameInputAdmin = document.getElementById('usernameInput');
const bioTextareaAdmin = document.getElementById('bioTextarea');
const saveProfileButton = document.querySelector('.save-profile-button');

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
            loadPresidentData(); // Load president data
        })
        .catch((error) => {
            console.error("Error getting document:", error);
        });
});

// --------------------------------------------------------------------------
// Manage Social Links Functionality (for admin.html)
// --------------------------------------------------------------------------

const currentSocialLinksUl = document.getElementById('current-social-links');
const platformInput = document.getElementById('platform');
const urlInput = document.getElementById('url');
const addLinkButton = document.querySelector('#add-social-link-form button[type="button"]');
let editingIndex = -1; // To keep track of the index being edited

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
    })
    .catch((error) => {
        console.error("Error updating social links in Firebase: ", error);
        alert('Error saving social links.');
    });
}

function loadSocialLinksAdmin() {
    const currentSocialLinksUl = document.getElementById('current-social-links');
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
                console.log("addSocialLink: Calling saveSocialLinksToFirebase with:", socialLinks); // ADD THIS LINE
                saveSocialLinksToFirebase(socialLinks); // Save updated links to Firebase
                platformInput.value = ''; // Clear the input fields
                urlInput.value = '';
                loadSocialLinksAdmin(); // Reload the displayed list from Firebase
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
                    console.log("startEditSocialLink: Editing index:", editingIndex); // ADD THIS LINE
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
                    console.log("removeSocialLink: Calling saveSocialLinksToFirebase with:", socialLinks); // ADD THIS LINE
                    socialLinks.splice(index, 1); // Remove the link at the given index
                    saveSocialLinksToFirebase(socialLinks); // Save the updated array to Firebase
                    loadSocialLinksAdmin(); // Reload the displayed list from Firebase
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded on index.html is running on mobile');

    db.collection('users').doc('main-user').get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const indexProfilePic = document.getElementById('indexProfilePic');
                const indexUsername = document.getElementById('indexUsername');
                const indexBioLine1 = document.getElementById('indexBioLine1');
                const indexBioLine2 = document.getElementById('indexBioLine2');

                if (indexProfilePic && data.profilePictureUrl) {
                    indexProfilePic.src = data.profilePictureUrl;
                }
                if (indexUsername) {
                    indexUsername.textContent = data.username || '';
                }
                if (data.bio) {
                    const bioLines = data.bio.split('\n');
                    if (indexBioLine1) {
                        indexBioLine1.textContent = bioLines[0] || '';
                    }
                    if (indexBioLine2) {
                        indexBioLine2.textContent = bioLines[1] || '';
                    }
                }
                loadSocialLinksIndex(); // Load social links for index.html
            } else {
                console.log("No profile document found in Firebase for index.html");
            }
        })
        .catch((error) => {
            console.error("Error getting profile data for index.html:", error);
        });
});

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
// Current President Section Editing Functionality (for admin.html)
// --------------------------------------------------------------------------

const presidentNameInput = document.getElementById('presidentName');
const presidentBirthDateInput = document.getElementById('presidentBirthDate');
const presidentHeightInput = document.getElementById('presidentHeight');
const presidentPartyInput = document.getElementById('presidentParty');
const presidentTermStartInput = document.getElementById('presidentTermStart');
const presidentTermEndInput = document.getElementById('presidentTermEnd');
const vicePresidentNameInput = document.getElementById('vicePresidentName');
const presidentPhotoUpload = document.getElementById('presidentPhoto');
const currentPresidentPhotoDisplay = document.getElementById('currentPresidentPhoto');
const savePresidentButton = document.querySelector('.save-president-button');

const presidentDisplayName = document.getElementById('presidentDisplayName');
const presidentDisplayBirthDate = document.getElementById('presidentDisplayBirthDate');
const presidentDisplayHeight = document.getElementById('presidentDisplayHeight');
const presidentDisplayParty = document.getElementById('presidentDisplayParty');
const presidentDisplayTerm = document.getElementById('presidentDisplayTerm');
const vicePresidentDisplayName = document.getElementById('vicePresidentDisplayName');
const presidentDisplayPhoto = document.getElementById('presidentDisplayPhoto');

if (savePresidentButton) {
    savePresidentButton.addEventListener('click', function() {
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
                savePresidentData(name, birthDate, height, party, termStart, termEnd, vicePresident, photoUrl);
            };
            reader.readAsDataURL(presidentPhotoUpload.files[0]);
        } else {
            savePresidentData(name, birthDate, height, party, termStart, termEnd, vicePresident, photoUrl);
        }
    });
}

function savePresidentData(name, birthDate, height, party, termStart, termEnd, vicePresident, photoUrl) {
    db.collection('president').doc('current').update({
        name: name,
        birthDate: birthDate,
        height: height,
        party: party,
        termStart: termStart,
        termEnd: termEnd,
        vicePresident: vicePresident,
        photoUrl: photoUrl
    })
    .then(() => {
        alert('President information updated!');
        loadPresidentData(); // Reload the data to update the display
    })
    .catch((error) => {
        console.error("Error updating president data: ", error);
        alert('Error updating president information.');
    });
}

function loadPresidentData() {
    db.collection('president').doc('current').get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                presidentNameInput.value = data.name || '';
                presidentBirthDateInput.value = data.birthDate || '';
                presidentHeightInput.value = data.height || '';
                presidentPartyInput.value = data.party || '';
                presidentTermStartInput.value = data.termStart || '';
                presidentTermEndInput.value = data.termEnd || '';
                vicePresidentNameInput.value = data.vicePresident || '';
                const photoUrl = data.photoUrl || '';
                currentPresidentPhotoDisplay.src = photoUrl;
                presidentDisplayPhoto.src = photoUrl;
                presidentDisplayName.textContent = data.name || 'President Name';
                presidentDisplayBirthDate.textContent = data.birthDate || 'Birth Date';
                presidentDisplayHeight.textContent = data.height || 'Height';
                presidentDisplayParty.textContent = data.party || 'Party';
                presidentDisplayTerm.textContent = `${data.termStart || 'Start Date'} - ${data.termEnd || 'End Date'}`;
                vicePresidentDisplayName.textContent = data.vicePresident || 'Vice President Name';
            } else {
                console.log("No president data found.");
                // Optionally set default values or display a message
            }
        })
        .catch((error) => {
            console.error("Error loading president data: ", error);
        });
}
