// Constants and Configuration
const ADMIN_USERNAME = 'BusArmyDude';
const ADMIN_PASSWORD = 'admin123';
const CURRENT_TIME = '2025-03-26 13:59:13';

// Initial Data Structure - Combining your existing data
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
    creatorShoutouts: {
        tiktok: tiktokShoutouts.accounts,
        instagram: instagramShoutouts.accounts,
        youtube: youtubeShoutouts.accounts
    },
    businessHours: businessHoursEST,
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
    lastUpdate: CURRENT_TIME
};

// Initialize data if not exists
if (!localStorage.getItem('adminData')) {
    localStorage.setItem('adminData', JSON.stringify(defaultData));
}

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const loginForm = document.getElementById('login-form');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const lastUpdateTime = document.getElementById('last-update-time');

    // Set current time
    if (lastUpdateTime) {
        lastUpdateTime.textContent = CURRENT_TIME;
    }

    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // Mobile menu toggle
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }

    // Navigation
    document.querySelectorAll('.nav-menu li').forEach(item => {
        item.addEventListener('click', () => {
            navigateToSection(item.dataset.section);
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Initialize data
    checkLoginStatus();
});

// Authentication Functions
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('lastLogin', CURRENT_TIME);
        showAdminPanel();
        loadContent();
        showToast('Login successful!', 'success');
    } else {
        showToast('Invalid credentials', 'error');
    }
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    hideAdminPanel();
    showToast('Logged out successfully', 'success');
}

// UI Functions
function showAdminPanel() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'grid';
    loadAllSections();
}

function hideAdminPanel() {
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
}

function navigateToSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    
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

// Data Loading Functions
function loadAllSections() {
    const data = JSON.parse(localStorage.getItem('adminData'));
    loadSocialLinks(data.socialLinks);
    loadCreatorShoutouts(data.creatorShoutouts);
    loadTechInfo(data.techInfo);
    loadBusinessHours(data.businessHours);
    updateDashboardStats(data);
}

function loadSectionData(section) {
    const data = JSON.parse(localStorage.getItem('adminData'));
    
    switch(section) {
        case 'dashboard':
            updateDashboardStats(data);
            break;
        case 'social':
            loadSocialLinks(data.socialLinks);
            break;
        case 'shoutouts':
            loadCreatorShoutouts(data.creatorShoutouts);
            break;
        case 'tech':
            loadTechInfo(data.techInfo);
            break;
        case 'hours':
            loadBusinessHours(data.businessHours);
            break;
    }
}

// Section-specific loading functions
function loadSocialLinks(links) {
    const container = document.getElementById('social-links-container');
    if (!container) return;

    container.innerHTML = links.map((link, index) => `
        <div class="social-link-item">
            <i class="${link.icon}"></i>
            <input type="text" value="${link.url}" data-index="${index}">
            <button class="btn-icon" onclick="updateSocialLink(${index})">
                <i class="fas fa-save"></i>
            </button>
            <button class="btn-icon" onclick="deleteSocialLink(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function loadCreatorShoutouts(shoutouts) {
    const container = document.getElementById('shoutouts-container');
    if (!container) return;

    // Get active platform
    const activePlatform = document.querySelector('.platform-tab.active')?.dataset.platform || 'tiktok';
    const platformShoutouts = shoutouts[activePlatform] || [];

    container.innerHTML = platformShoutouts.map((creator, index) => `
        <div class="creator-card">
            <img src="${creator.profilePic}" alt="${creator.username}" class="creator-pic">
            <div class="creator-info">
                <h3>${creator.nickname} ${creator.isVerified ? '<i class="fas fa-check-circle"></i>' : ''}</h3>
                <p>@${creator.username}</p>
                <p>${creator.followers} followers</p>
                <textarea class="creator-bio">${creator.bio}</textarea>
                <button class="save-btn" onclick="updateCreator(${index}, '${activePlatform}')">
                    Save Changes
                </button>
            </div>
        </div>
    `).join('');
}

function loadTechInfo(techInfo) {
    const container = document.querySelector('.tech-grid');
    if (!container) return;

    container.innerHTML = Object.entries(techInfo).map(([device, info]) => `
        <div class="tech-card">
            <h3>${info.model}</h3>
            ${Object.entries(info).map(([key, value]) => `
                <div class="tech-detail">
                    <strong>${key}:</strong> ${value}
                </div>
            `).join('')}
            <button class="save-btn" onclick="updateTechInfo('${device}')">
                Save Changes
            </button>
        </div>
    `).join('');
}

function loadBusinessHours(hours) {
    const container = document.getElementById('hours-container');
    if (!container) return;

    container.innerHTML = Object.entries(hours).map(([day, time]) => `
        <div class="hours-row">
            <strong>${day}:</strong>
            <input type="time" value="${time.open}" data-day="${day}" data-type="open">
            <input type="time" value="${time.close}" data-day="${day}" data-type="close">
            <label>
                <input type="checkbox" ${time.closed ? 'checked' : ''} 
                       onchange="toggleDayClosed('${day}')"> Closed
            </label>
        </div>
    `).join('');
}

// Utility Functions
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function updateDashboardStats(data) {
    document.getElementById('social-count').textContent = data.socialLinks.length;
    document.getElementById('shoutouts-count').textContent = 
        Object.values(data.creatorShoutouts).flat().length;
}

// Initialize the admin portal
checkLoginStatus();
