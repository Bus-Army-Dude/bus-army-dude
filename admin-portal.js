// Global JSON data storage
let portalData = {};

// GitHub JSON URL (replace with your actual URL)
const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/BusArmyDude/bus-army-dude/main/admin-data.json';
const CLIENT_ID = 'Iv23liJ1Id81cwQNO3sX'; // Replace with your actual GitHub client ID
const REDIRECT_URI = 'https://bus-army-dude.github.io/callback'; // Replace with your actual callback URL
const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user`;

// DOM Elements
const tabs = document.querySelectorAll(".admin-tabs button");
const contentSections = document.querySelectorAll(".admin-content > div");
const loadingMessage = document.getElementById("loading-message");
const errorMessage = document.getElementById("error-message");
const profileSection = document.getElementById("profile-section");
const loginButton = document.getElementById("login-btn");
const logoutButton = document.getElementById("logout-btn");
const profileImage = document.getElementById("profile-img");
const usernameDisplay = document.getElementById("username");

// GitHub Authentication Handling
async function checkLoginStatus() {
  try {
    const response = await fetch('/check-login-status');
    const data = await response.json();
    
    if (data.loggedIn) {
      displayUserProfile(data.profile);
    } else {
      showLoginButton();
    }
  } catch (err) {
    console.error('Error checking login status', err);
    showLoginButton();
  }
}

// Display the user profile on login
function displayUserProfile(profile) {
  profileImage.src = profile.profileImage;
  usernameDisplay.textContent = profile.username;
  loginButton.style.display = 'none';
  logoutButton.style.display = 'block';
}

// Show the login button
function showLoginButton() {
  loginButton.style.display = 'block';
  logoutButton.style.display = 'none';
}

// Redirect to GitHub OAuth for login
function loginWithGitHub() {
  window.location.href = GITHUB_OAUTH_URL;
}

// Logout
async function logout() {
  try {
    await fetch('/logout', { method: 'POST' });
    showLoginButton();
  } catch (err) {
    console.error('Error logging out', err);
  }
}

// Handle the OAuth callback
async function handleGitHubCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    try {
      const response = await fetch('/github/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      if (data.accessToken) {
        fetchUserProfile(data.accessToken);
      } else {
        alert('Error: Unable to log in.');
      }
    } catch (err) {
      console.error('Error in callback', err);
      alert('An error occurred during login.');
    }
  }
}

// Fetch user profile from GitHub using the access token
async function fetchUserProfile(accessToken) {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const userData = await response.json();
    
    // Save user profile to session (or secure cookie)
    await fetch('/save-user-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: userData.login,
        profileImage: userData.avatar_url
      })
    });
    
    // Redirect to admin page after login
    window.location.href = '/admin';
  } catch (err) {
    console.error('Error fetching user profile', err);
    alert('Failed to fetch user profile.');
  }
}

// Fetch data from GitHub JSON
async function fetchPortalData() {
  try {
    const response = await fetch(GITHUB_JSON_URL);
    if (!response.ok) throw new Error("Failed to load data from GitHub");
    portalData = await response.json();
    loadingMessage.style.display = "none";
    renderAllSections();
  } catch (err) {
    loadingMessage.style.display = "none";
    errorMessage.style.display = "block";
    errorMessage.textContent = err.message;
  }
}

// Tab switching functionality
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const target = tab.getAttribute("data-tab");
    contentSections.forEach((section) => {
      section.classList.toggle("active", section.id === target);
    });
  });
});

// Render content from the JSON data
function renderAllSections() {
  renderSection("profile-section", portalData.profile);
  renderSection("links-section", portalData.links);
  renderSection("shoutouts-section", portalData.shoutouts);
  renderSection("blog-section", portalData.blog);
  renderSection("merch-section", portalData.merch);
  renderSection("settings-section", portalData.settings);
  renderSection("legal-section", portalData.legal);
}

// Render individual sections
function renderSection(sectionId, sectionData) {
  const section = document.getElementById(sectionId);
  if (!section || !sectionData) return;
  section.innerHTML = `<pre>${JSON.stringify(sectionData, null, 2)}</pre>`;
}

// Start the process by fetching data
fetchPortalData();

// Event listeners
loginButton.addEventListener('click', loginWithGitHub);
logoutButton.addEventListener('click', logout);

// Check login status on page load
document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
  if (window.location.pathname === '/callback') {
    handleGitHubCallback();
  }
});
