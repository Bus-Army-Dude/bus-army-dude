// admin-portal.js

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
        // Save Profile Picture (as a data URL in Local Storage)
        if (profileImageUploadAdmin.files && profileImageUploadAdmin.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                localStorage.setItem('profilePicture', e.target.result);
                alert('Profile information updated!'); // Provide a simple confirmation
            }
            reader.readAsDataURL(profileImageUploadAdmin.files[0]);
        } else {
            const currentPicSrc = document.getElementById('currentProfilePic')?.src;
            if (currentPicSrc) {
                localStorage.setItem('profilePicture', currentPicSrc);
            }
            alert('Profile information updated!'); // Still show confirmation
        }

        // Save Username to Local Storage
        localStorage.setItem('username', usernameInputAdmin.value);

        // Save Bio to Local Storage
        localStorage.setItem('bio', bioTextareaAdmin.value);
    });
}

// Load saved data when admin.html loads
document.addEventListener('DOMContentLoaded', function() {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername && usernameInputAdmin) {
        usernameInputAdmin.value = savedUsername;
    }

    const savedBio = localStorage.getItem('bio');
    if (savedBio && bioTextareaAdmin) {
        bioTextareaAdmin.value = savedBio;
    }
});

// --------------------------------------------------------------------------
// Load Profile Data for index.html
// --------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    // Load Profile Picture for index.html
    const storedProfilePicture = localStorage.getItem('profilePicture');
    const indexProfilePic = document.getElementById('indexProfilePic');
    if (storedProfilePicture && indexProfilePic) {
        indexProfilePic.src = storedProfilePicture;
    }

    // Load Username for index.html
    const storedUsername = localStorage.getItem('username');
    const indexUsername = document.getElementById('indexUsername');
    if (storedUsername && indexUsername) {
        indexUsername.textContent = storedUsername;
    }

    // Load Bio for index.html
    const storedBio = localStorage.getItem('bio');
    const indexBioLine1 = document.getElementById('indexBioLine1');
    const indexBioLine2 = document.getElementById('indexBioLine2');
    if (storedBio) {
        const bioLines = storedBio.split('\n');
        if (indexBioLine1) {
            indexBioLine1.textContent = bioLines[0] || '';
        }
        if (indexBioLine2) {
            indexBioLine2.textContent = bioLines[1] || '';
        }
    }
});
