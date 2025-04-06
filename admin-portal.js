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

// Initialize Firebase (Compatibility syntax)
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// const analytics = getAnalytics(app); // Remove this line for now
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
    db.collection('users').doc('main-user').set({
        username: username,
        bio: bio,
        profilePictureUrl: profilePictureUrl
    })
    .then(() => {
        alert('Profile information updated!');
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
        alert('Error updating profile information.');
    });
}

// Load saved data when admin.html loads (Profile Section)
document.addEventListener('DOMContentLoaded', function() {
    const savedUsername = localStorage.getItem('username'); // We will update this to Firebase
    if (savedUsername && usernameInputAdmin) {
        usernameInputAdmin.value = savedUsername;
    }

    const savedBio = localStorage.getItem('bio'); // We will update this to Firebase
    if (savedBio && bioTextareaAdmin) {
        bioTextareaAdmin.value = savedBio;
    }

    loadSocialLinksAdmin(); // Load social links when admin page loads
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

function loadSocialLinksAdmin() {
    const currentSocialLinksUl = document.getElementById('current-social-links');
    if (currentSocialLinksUl) { // ADDED THIS CHECK
        currentSocialLinksUl.innerHTML = ''; // Clear the current list
        const storedLinks = localStorage.getItem('socialLinks'); // We will update this to Firebase
        if (storedLinks) {
            const socialLinks = JSON.parse(storedLinks);
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
            // Load initial links from your index.html structure
            const initialLinks = [
                { platform: 'TikTok', url: 'https://www.tiktok.com/@bus.army.dude' },
                { platform: 'Snapchat', url: 'https://www.snapchat.com/add/calebkritzar' },
                { platform: 'X (Twitter)', url: 'https://x.com/KritzarRiver' },
                { platform: 'Threads', url: 'https://www.threads.net/@busarmydude' },
                { platform: 'Twitch', url: 'https://m.twitch.tv/BusArmyDude' },
                { platform: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61569972389004' },
                { platform: 'Steam', url: 'https://steamcommunity.com/profiles/76561199283946668' },
                { platform: 'Discord', url: 'https://discord.gg/NjMtuZYc52' },
                { platform: 'Instagram', url: 'https://www.instagram.com/busarmydude/' },
                { platform: 'Amazon Music', url: 'https://music.amazon.com/profiles/@riverkritzar40820895?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_itT4WHDz0nPzPfGGi9YYP0iqI' }
            ];
            localStorage.setItem('socialLinks', JSON.stringify(initialLinks));
            loadSocialLinksAdmin(); // Reload to display them
        }
        editingIndex = -1; // Reset editing index after loading
        addLinkButton.textContent = 'Add Link'; // Reset button text
    }
}

function addSocialLink() {
    const platform = platformInput.value.trim();
    const url = urlInput.value.trim();

    if (platform && url) {
        const newLink = { platform: platform, url: url };
        const storedLinks = localStorage.getItem('socialLinks'); // We will update this to Firebase
        let socialLinks = storedLinks ? JSON.parse(storedLinks) : [];

        if (editingIndex > -1) {
            // Save the edit
            socialLinks[editingIndex] = newLink;
            editingIndex = -1; // Reset editing index
            addLinkButton.textContent = 'Add Link';
        } else {
            // Add a new link
            socialLinks.push(newLink);
        }

        localStorage.setItem('socialLinks', JSON.stringify(socialLinks)); // We will update this to Firebase
        platformInput.value = ''; // Clear the input fields
        urlInput.value = '';
        loadSocialLinksAdmin(); // Reload the displayed list
    } else {
        alert('Please enter both the platform and the URL.');
    }
}

function startEditSocialLink(index) {
    const storedLinks = localStorage.getItem('socialLinks'); // We will update this to Firebase
    if (storedLinks) {
        const socialLinks = JSON.parse(storedLinks);
        const linkToEdit = socialLinks[index];
        platformInput.value = linkToEdit.platform;
        urlInput.value = linkToEdit.url;
        editingIndex = index;
        addLinkButton.textContent = 'Save Edit';
    }
}

function removeSocialLink(index) {
    const storedLinks = localStorage.getItem('socialLinks'); // We will update this to Firebase
    if (storedLinks) {
        let socialLinks = JSON.parse(storedLinks);
        socialLinks.splice(index, 1); // Remove the link at the given index
        localStorage.setItem('socialLinks', JSON.stringify(socialLinks)); // We will update this to Firebase
        loadSocialLinksAdmin(); // Reload the displayed list
    }
}

// --------------------------------------------------------------------------
// Load Profile Data and Social Links for index.html
// --------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded on index.html is running on mobile'); // ADDED

    // Load Profile Picture for index.html
    const storedProfilePicture = localStorage.getItem('profilePicture'); // We will update this to Firebase
    const indexProfilePic = document.getElementById('indexProfilePic');
    if (storedProfilePicture && indexProfilePic) {
        indexProfilePic.src = storedProfilePicture;
    }

    // Load Username for index.html
    const storedUsername = localStorage.getItem('username'); // We will update this to Firebase
    const indexUsername = document.getElementById('indexUsername'); // Corrected selector to use ID
    console.log('Stored Username:', storedUsername); // ADDED
    console.log('Username Element:', indexUsername); // ADDED
    if (storedUsername && indexUsername) {
        indexUsername.textContent = storedUsername;
    }

    // Load Bio for index.html
    const storedBio = localStorage.getItem('bio'); // We will update this to Firebase
    const indexBioLine1 = document.getElementById('indexBioLine1'); // Corrected selector to use ID
    const indexBioLine2 = document.getElementById('indexBioLine2'); // Corrected selector to use ID
    console.log('Stored Bio:', storedBio); // ADDED
    console.log('Bio Element Line 1:', indexBioLine1); // ADDED
    console.log('Bio Element Line 2:', indexBioLine2); // ADDED
    if (storedBio) {
        const bioLines = storedBio.split('\n');
        if (indexBioLine1) {
            indexBioLine1.textContent = bioLines[0] || '';
        }
        if (indexBioLine2) {
            indexBioLine2.textContent = bioLines[1] || '';
        }
    }

    const storedSocialLinks = localStorage.getItem('socialLinks'); // We will update this to Firebase
    console.log('Stored Social Links:', storedSocialLinks); // ADDED

    loadSocialLinksIndex(); // Load social links for index.html
});

function loadSocialLinksIndex() {
    const socialLinksContainer = document.querySelector('.social-links-container'); // Corrected selector (class is correct)
    if (!socialLinksContainer) return; // Exit if the container doesn't exist

    socialLinksContainer.innerHTML = ''; // Clear existing links

    const storedLinks = localStorage.getItem('socialLinks'); // We will update this to Firebase
    if (storedLinks) {
        const socialLinks = JSON.parse(storedLinks);
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
    }
}
