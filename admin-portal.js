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

if (saveProfileButton) {
    saveProfileButton.addEventListener('click', function() {
        // Save Profile Picture (as a data URL in Local Storage)
        if (profileImageUpload.files && profileImageUpload.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                localStorage.setItem('profilePicture', e.target.result);
                alert('Profile information updated!'); // Provide a simple confirmation
            }
            reader.readAsDataURL(profileImageUpload.files[0]);
        } else {
            // If no new image, we can also save a placeholder or handle as needed
            // For now, we'll just save the existing URL if there is one
            const currentPicSrc = document.getElementById('currentProfilePic')?.src;
            if (currentPicSrc) {
                localStorage.setItem('profilePicture', currentPicSrc);
            }
            alert('Profile information updated!'); // Still show confirmation
        }

        // Save Username to Local Storage
        localStorage.setItem('username', usernameInput.value);

        // Save Bio to Local Storage
        localStorage.setItem('bio', bioTextarea.value);
    });
}

// Load saved data when admin.html loads
document.addEventListener('DOMContentLoaded', function() {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        usernameInput.value = savedUsername;
    }

    const savedBio = localStorage.getItem('bio');
    if (savedBio) {
        bioTextarea.value = savedBio;
    }

    // We can't directly load the image to the file input for security reasons.
    // The user will need to re-select the image if they want to change it again.
    // However, we could potentially display the currently stored image URL somewhere in the form.
});
