// Initial Data Structure
const defaultData = {
    socialLinks: [
        { platform: 'tiktok', url: 'https://www.tiktok.com/@officalbusarmydude', icon: 'fab fa-tiktok' },
        { platform: 'youtube', url: 'https://www.youtube.com/@BusArmyDude', icon: 'fab fa-youtube' },
        { platform: 'snapchat', url: 'https://www.snapchat.com/add/calebkritzar', icon: 'fab fa-snapchat-ghost' },
        { platform: 'twitter', url: 'https://x.com/KritzarRiver', icon: 'fab fa-twitter' },
        { platform: 'twitch', url: 'https://m.twitch.tv/BusArmyDude', icon: 'fab fa-twitch' },
        { platform: 'facebook', url: 'https://www.facebook.com/profile.php?id=61569972389004', icon: 'fab fa-facebook' },
        { platform: 'steam', url: 'https://steamcommunity.com/profiles/76561199283946668', icon: 'fab fa-steam' },
        { platform: 'discord', url: 'https://discord.gg/NjMtuZYc52', icon: 'fab fa-discord' },
        { platform: 'instagram', url: 'https://www.instagram.com/busarmydude/', icon: 'fab fa-instagram' },
        { platform: 'youtube-music', url: 'https://music.youtube.com/@BusArmyDude', icon: 'fab fa-youtube-square' }
    ],
    shoutouts: {
        tiktok: [],
        youtube: [],
        instagram: []
    },
    events: [],
    techInfo: {
        iphone: {
            model: 'iPhone 16 Pro',
            storage: '128GB',
            material: 'Titanium',
            color: 'Natural Titanium',
            price: '1,067.49',
            releaseDate: '2024-09-20',
            purchaseDate: '2024-11-08',
            osVersion: 'iOS 18.4 (22E5232a)',
            batteryHealth: '99%',
            batteryCycles: '208'
        },
        watch: {
            model: 'Apple Watch Ultra 2',
            storage: '64GB',
            material: 'Titanium',
            color: 'Natural Titanium',
            price: '853.98',
            releaseDate: '2023-09-22',
            purchaseDate: '2024-05-17',
            osVersion: 'WatchOS 11.4 (22T5244a)',
            batteryHealth: '97%'
        },
        mac: {
            model: '2023 Mac Mini M2',
            storage: '256GB SSD',
            material: 'Aluminum',
            color: 'Grey',
            price: '742.29',
            releaseDate: '2023-01-17',
            purchaseDate: '2024-05-16',
            osVersion: 'macOS Sequoia 15.4 Beta (24E5238a)'
        }
    },
    faq: [
        {
            question: 'Who is Bus Army Dude?',
            answer: `Content Creator focusing on:
                    - Gaming (primarily simulation games)
                    - Tech reviews and updates
                    - Lifestyle content`
        },
        {
            question: 'What games do you play?',
            answer: `Currently Installed and Active:
                    - Farming Simulator 2025

                    Also Own (Currently Not Installed):
                    - American Truck Simulator
                    - Car Mechanic Simulator 2018
                    - Ark: Survival of the Fittest
                    - Cities: Skylines
                    - Planet Coaster
                    - X-Plane 11
                    - X-Plane 12`
        }
    ],
    businessHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '10:00', close: '15:00', closed: false },
        sunday: { open: '00:00', close: '00:00', closed: true }
    },
    settings: {
        theme: 'light',
        lastUpdate: '2025-03-26 14:13:00'
    }
};

// Authentication Configuration
const ADMIN_USERNAME = 'BusArmyDude';
const ADMIN_PASSWORD = 'admin123'; // Change this to your desired password
const CURRENT_TIME = '2025-03-26 14:13:00';

// DOM Elements
let loginSection;
let adminPanel;
let loginForm;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    loginSection = document.getElementById('login-section');
    adminPanel = document.getElementById('admin-panel');
    loginForm = document.getElementById('login-form');

    // Add event listeners
    loginForm.addEventListener('submit', handleLogin);
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    
    // Setup navigation
    setupNavigation();
    
    // Initialize data
    initializeData();
    
    // Check login status
    checkLoginStatus();
});

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('lastLogin', CURRENT_TIME);
        showAdminPanel();
        showToast('Login successful!', 'success');
        loadDashboardData();
    } else {
        showToast('Invalid credentials', 'error');
    }
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('lastLogin');
    hideAdminPanel();
    showToast('Logged out successfully', 'success');
}

function checkLoginStatus() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        showAdminPanel();
        loadDashboardData();
    } else {
        hideAdminPanel();
    }
}

// UI Functions
function showAdminPanel() {
    loginSection.style.display = 'none';
    adminPanel.style.display = 'grid';
    navigateToSection('dashboard');
    updateLastLoginTime();
}

function hideAdminPanel() {
    loginSection.style.display = 'flex';
    adminPanel.style.display = 'none';
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const container = document.getElementById('toast-container');
    container.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// Navigation Functions
function setupNavigation() {
    document.querySelectorAll('.nav-menu li').forEach(item => {
        item.addEventListener('click', () => {
            navigateToSection(item.dataset.section);
        });
    });
}

function navigateToSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(s => {
        s.style.display = 'none';
    });
    
    // Show selected section
    const selectedSection = document.getElementById(`${section}-section`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Update active nav item
    document.querySelectorAll('.nav-menu li').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === section) {
            item.classList.add('active');
        }
    });
    
    // Load section data
    loadSectionData(section);
}

// Data Management Functions
function initializeData() {
    if (!localStorage.getItem('adminData')) {
        localStorage.setItem('adminData', JSON.stringify(defaultData));
    }
}

function loadDashboardData() {
    const data = getAdminData();
    updateDashboardStats(data);
}

function loadSectionData(section) {
    const data = getAdminData();
    
    switch(section) {
        case 'dashboard':
            updateDashboardStats(data);
            break;
        case 'social':
            renderSocialLinks(data.socialLinks);
            break;
        case 'shoutouts':
            renderShoutouts(data.shoutouts);
            break;
        case 'events':
            renderEvents(data.events);
            break;
        case 'tech':
            renderTechInfo(data.techInfo);
            break;
        case 'faq':
            renderFAQ(data.faq);
            break;
        case 'hours':
            renderBusinessHours(data.businessHours);
            break;
        case 'settings':
            renderSettings(data.settings);
            break;
    }
}

// Render Functions
function updateDashboardStats(data) {
    document.getElementById('social-count').textContent = data.socialLinks.length;
    document.getElementById('shoutouts-count').textContent = 
        Object.values(data.shoutouts).flat().length;
    document.getElementById('events-count').textContent = data.events.length;
    document.getElementById('faq-count').textContent = data.faq.length;
}

function renderSocialLinks(links) {
    const container = document.getElementById('social-links-container');
    if (!container) return;
    
    container.innerHTML = links.map((link, index) => `
        <div class="social-link-item">
            <i class="${link.icon}"></i>
            <input type="text" value="${link.url}" data-index="${index}">
            <button onclick="updateSocialLink(${index})">
                <i class="fas fa-save"></i>
            </button>
            <button onclick="deleteSocialLink(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function renderShoutouts(shoutouts) {
    const container = document.getElementById('shoutouts-container');
    if (!container) return;

    // Create platform tabs
    container.innerHTML = `
        <div class="platform-tabs">
            <button class="platform-tab active" data-platform="tiktok">
                <i class="fab fa-tiktok"></i> TikTok
            </button>
            <button class="platform-tab" data-platform="youtube">
                <i class="fab fa-youtube"></i> YouTube
            </button>
            <button class="platform-tab" data-platform="instagram">
                <i class="fab fa-instagram"></i> Instagram
            </button>
        </div>
        <div class="shoutouts-list"></div>
        <button class="add-btn" onclick="addShoutout()">
            <i class="fas fa-plus"></i> Add Shoutout
        </button>
    `;

    // Add tab click listeners
    container.querySelectorAll('.platform-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            container.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderPlatformShoutouts(shoutouts[tab.dataset.platform], tab.dataset.platform);
        });
    });

    // Load initial platform
    renderPlatformShoutouts(shoutouts.tiktok, 'tiktok');
}

function renderPlatformShoutouts(creators, platform) {
    const container = document.querySelector('.shoutouts-list');
    if (!container) return;

    container.innerHTML = creators.map((creator, index) => `
        <div class="creator-card" data-index="${index}">
            <img src="${creator.profilePic}" alt="${creator.username}" class="creator-pic">
            <div class="creator-info">
                <input type="text" class="creator-nickname" value="${creator.nickname}" placeholder="Nickname">
                <input type="text" class="creator-username" value="${creator.username}" placeholder="Username">
                <input type="text" class="creator-followers" value="${creator.followers}" placeholder="Followers">
                <textarea class="creator-bio" placeholder="Bio">${creator.bio || ''}</textarea>
                <label class="verified-toggle">
                    <input type="checkbox" ${creator.isVerified ? 'checked' : ''}>
                    Verified
                </label>
                <div class="creator-actions">
                    <button onclick="updateCreator('${platform}', ${index})">
                        <i class="fas fa-save"></i> Save
                    </button>
                    <button onclick="deleteCreator('${platform}', ${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderTechInfo(techInfo) {
    const container = document.getElementById('tech-section');
    if (!container) return;

    container.innerHTML = Object.entries(techInfo).map(([device, info]) => `
        <div class="tech-card" data-device="${device}">
            <h3>${info.model}</h3>
            ${Object.entries(info).map(([key, value]) => `
                <div class="tech-detail">
                    <label>${key}:</label>
                    <input type="text" value="${value}" 
                           data-field="${key}"
                           onchange="updateTechField('${device}', '${key}', this.value)">
                </div>
            `).join('')}
            ${info.batteryHealth ? `
                <div class="battery-health">
                    <div class="battery-bar">
                        <div class="battery-level" style="width: ${parseInt(info.batteryHealth)}%"></div>
                    </div>
                    <span>Battery Health: ${info.batteryHealth}</span>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function renderBusinessHours(hours) {
    const container = document.getElementById('hours-container');
    if (!container) return;

    container.innerHTML = `
        <div class="hours-header">
            <h3>Business Hours (${Intl.DateTimeFormat().resolvedOptions().timeZone})</h3>
            <p>Current time: ${CURRENT_TIME}</p>
        </div>
        ${Object.entries(hours).map(([day, time]) => `
            <div class="hours-row" data-day="${day}">
                <div class="day-label">${day.charAt(0).toUpperCase() + day.slice(1)}</div>
                <div class="hours-inputs">
                    <input type="time" value="${time.open}" 
                           ${time.closed ? 'disabled' : ''}
                           onchange="updateBusinessHours('${day}', 'open', this.value)">
                    <span>to</span>
                    <input type="time" value="${time.close}"
                           ${time.closed ? 'disabled' : ''}
                           onchange="updateBusinessHours('${day}', 'close', this.value)">
                    <label class="closed-toggle">
                        <input type="checkbox" ${time.closed ? 'checked' : ''}
                               onchange="toggleDayClosed('${day}')">
                        Closed
                    </label>
                </div>
            </div>
        `).join('')}
        <button class="save-btn" onclick="saveBusinessHours()">
            <i class="fas fa-save"></i> Save Changes
        </button>
    `;
}

function renderFAQ(faq) {
    const container = document.getElementById('faq-container');
    if (!container) return;

    container.innerHTML = `
        ${faq.map((item, index) => `
            <div class="faq-item" data-index="${index}">
                <div class="faq-header">
                    <input type="text" class="faq-question" value="${item.question}"
                           placeholder="Question">
                    <button onclick="deleteFAQItem(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <textarea class="faq-answer" placeholder="Answer">${item.answer}</textarea>
                <button onclick="updateFAQItem(${index})">
                    <i class="fas fa-save"></i> Save
                </button>
            </div>
        `).join('')}
        <button class="add-btn" onclick="addFAQItem()">
            <i class="fas fa-plus"></i> Add FAQ Item
        </button>
    `;
}

// Utility Functions
function getCurrentDateTime() {
    return CURRENT_TIME;
}

function getAdminData() {
    return JSON.parse(localStorage.getItem('adminData'));
}

function saveAdminData(data) {
    data.settings.lastUpdate = getCurrentDateTime();
    localStorage.setItem('adminData', JSON.stringify(data));
    showToast('Changes saved successfully', 'success');
}

// CRUD Operations for Social Links
function addSocialLink() {
    const data = getAdminData();
    data.socialLinks.push({
        platform: '',
        url: '',
        icon: 'fab fa-link'
    });
    saveAdminData(data);
    loadSectionData('social');
}

function updateSocialLink(index) {
    const data = getAdminData();
    const input = document.querySelector(`[data-index="${index}"]`);
    if (input) {
        data.socialLinks[index].url = input.value;
        saveAdminData(data);
    }
}

function deleteSocialLink(index) {
    const data = getAdminData();
    data.socialLinks.splice(index, 1);
    saveAdminData(data);
    loadSectionData('social');
}

// Initialize application
checkLoginStatus();
