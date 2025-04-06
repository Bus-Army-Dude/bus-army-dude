// admin-portal.js

// Global JSON data storage
let portalData = {};

// GitHub JSON URL (replace with your actual URL)
const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/admin-data.json';

// DOM Elements
const tabs = document.querySelectorAll(".admin-tabs button");
const contentSections = document.querySelectorAll(".admin-content > div");
const loadingMessage = document.getElementById("loading-message");
const errorMessage = document.getElementById("error-message");

// Load JSON from GitHub
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

// Tab switching
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

// Render section content from JSON
function renderAllSections() {
  renderSection("profile-section", portalData.profile);
  renderSection("links-section", portalData.links);
  renderSection("shoutouts-section", portalData.shoutouts);
  renderSection("blog-section", portalData.blog);
  renderSection("merch-section", portalData.merch);
  renderSection("settings-section", portalData.settings);
  renderSection("legal-section", portalData.legal);
}

function renderSection(sectionId, sectionData) {
  const section = document.getElementById(sectionId);
  if (!section || !sectionData) return;
  section.innerHTML = `<pre>${JSON.stringify(sectionData, null, 2)}</pre>`;
}

// Start loading the portal
fetchPortalData();
