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
// Profile Section Editing Functionality
// --------------------------------------------------------------------------

const profileImageUpload = document.getElementById('profileImageUpload');
const usernameInput = document.getElementById('usernameInput');
const bioTextarea = document.getElementById('bioTextarea');
const saveProfileButton = document.querySelector('.save-profile-button');

const currentProfilePic = document.getElementById('currentProfilePic');
const currentUsername = document.getElementById('currentUsername');
const currentBio = document.getElementById('currentBio');
const currentBioExtra = document.getElementById('currentBioExtra');

if (saveProfileButton) {
    saveProfileButton.addEventListener('click', function() {
        // Update Profile Picture (if a new file is selected)
        if (profileImageUpload.files && profileImageUpload.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentProfilePic.src = e.target.result;
            }
            reader.readAsDataURL(profileImageUpload.files[0]);
        }

        // Update Username
        currentUsername.textContent = usernameInput.value;

        // Update Bio
        const bioLines = bioTextarea.value.split('\n');
        if (bioLines.length > 0) {
            currentBio.textContent = bioLines[0];
        }
        if (bioLines.length > 1) {
            currentBioExtra.textContent = bioLines[1];
        } else {
            currentBioExtra.textContent = ''; // Clear if only one line
        }

        alert('Profile information updated!'); // Provide a simple confirmation
    });
}
