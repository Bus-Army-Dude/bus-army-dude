// Global Constants
const CONFIG = {
    CURRENT_TIME: '2025-03-26 15:17:31',
    CURRENT_USER: 'BusArmyDude',
    VERSION: '1.14.0',
    BUILD: '2025.3.17'
};

// Default Data Structure
const defaultData = {
    socialLinks: [
        { platform: 'tiktok', url: 'https://www.tiktok.com/@officalbusarmydude', icon: 'fab fa-tiktok', label: 'TikTok' },
        { platform: 'youtube', url: 'https://www.youtube.com/@BusArmyDude', icon: 'fab fa-youtube', label: 'YouTube' },
        { platform: 'snapchat', url: 'https://www.snapchat.com/add/calebkritzar', icon: 'fab fa-snapchat-ghost', label: 'Snapchat' },
        { platform: 'twitter', url: 'https://x.com/KritzarRiver', icon: 'fab fa-twitter', label: 'X/Twitter' },
        { platform: 'twitch', url: 'https://m.twitch.tv/BusArmyDude', icon: 'fab fa-twitch', label: 'Twitch' },
        { platform: 'facebook', url: 'https://www.facebook.com/profile.php?id=61569972389004', icon: 'fab fa-facebook', label: 'Facebook' },
        { platform: 'steam', url: 'https://steamcommunity.com/profiles/76561199283946668', icon: 'fab fa-steam', label: 'Steam' },
        { platform: 'discord', url: 'https://discord.gg/NjMtuZYc52', icon: 'fab fa-discord', label: 'Discord' },
        { platform: 'instagram', url: 'https://www.instagram.com/busarmydude/', icon: 'fab fa-instagram', label: 'Instagram' },
        { platform: 'youtube-music', url: 'https://music.youtube.com/@BusArmyDude', icon: 'fab fa-youtube-square', label: 'YouTube Music' }
    ],
    techInfo: {
        iphone: {
            model: 'iPhone 16 Pro',
            material: 'Titanium',
            storage: '128GB',
            batteryCapacity: '3,582mAh',
            color: 'Natural Titanium',
            price: '$1,067.49',
            releaseDate: 'September 20, 2024',
            purchaseDate: 'November 08, 2024',
            osVersion: 'iOS 18.4 (22E5232a)',
            batteryHealth: '99',
            chargeCycles: '208'
        },
        watch: {
            model: 'Apple Watch Ultra 2',
            material: 'Titanium',
            storage: '64GB',
            batteryCapacity: '564mAh',
            color: 'Natural Titanium',
            price: '$853.98',
            releaseDate: 'September 22, 2023',
            purchaseDate: 'May 17, 2024',
            osVersion: 'WatchOS 11.4 (22T5244a)',
            batteryHealth: '97'
        },
        mac: {
            model: '2023 Mac Mini M2',
            material: 'Aluminum',
            storage: '256GB SSD',
            color: 'Grey',
            price: '$742.29',
            releaseDate: 'January 17, 2023',
            purchaseDate: 'May 16, 2024',
            osVersion: 'macOS Sequoia 15.4 Beta (24E5238a)'
        }
    },
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
        theme: 'dark',
        profileStatus: 'online',
        maintenanceMode: false,
        lastUpdate: CONFIG.CURRENT_TIME
    }
};

// DOM Elements and Global Variables
let loginSection;
let adminPanel;
let loginForm;
let lastLoginTime = localStorage.getItem('lastLogin') || CONFIG.CURRENT_TIME;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing admin portal for:', CONFIG.CURRENT_USER);
    
    // Get DOM elements
    loginSection = document.getElementById('login-section');
    adminPanel = document.getElementById('admin-panel');
    loginForm = document.getElementById('login-form');
    
    // Setup Event Listeners
    setupEventListeners();
    
    // Initialize data
    initializeData();
    
    // Check login status
    checkLoginStatus();

    // Update time displays
    updateTimeDisplays();
});

function setupEventListeners() {
    // Login form
    loginForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    // Navigation menu items
    document.querySelectorAll('.nav-menu li').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            navigateToSection(section);
            
            // Update mobile menu
            if (window.innerWidth <= 768) {
                toggleSidebar();
            }
        });
    });

    // Button event listeners
    setupButtonListeners();

    // Platform tabs in Shoutouts section
    document.querySelectorAll('.platform-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const platform = tab.getAttribute('data-platform');
            switchPlatform(platform);
        });
    });
}

function setupButtonListeners() {
    // Core buttons
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    document.getElementById('menuToggle')?.addEventListener('click', toggleSidebar);
    document.getElementById('theme-select')?.addEventListener('change', handleThemeChange);
    document.getElementById('status-select')?.addEventListener('change', handleStatusChange);
    document.getElementById('maintenance-toggle')?.addEventListener('change', handleMaintenanceToggle);

    // Section-specific buttons
    setupSectionButtons();
}

function setupSectionButtons() {
    // Add buttons
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.content-section').id.replace('-section', '');
            handleAdd(section);
        });
    });

    // Save buttons
    document.querySelectorAll('.save-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.content-section').id.replace('-section', '');
            handleSave(section);
        });
    });
}

// Authentication Functions
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === CONFIG.CURRENT_USER && password === 'admin123') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('lastLogin', CONFIG.CURRENT_TIME);
        showAdminPanel();
        showToast('Welcome back, ' + CONFIG.CURRENT_USER + '!', 'success');
        loadDashboardData();
    } else {
        showToast('Invalid credentials', 'error');
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        hideAdminPanel();
        showToast('Logged out successfully', 'success');
    }
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

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar?.classList.toggle('active');
}

// Navigation Functions
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
        if (item.getAttribute('data-section') === section) {
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

function getAdminData() {
    return JSON.parse(localStorage.getItem('adminData')) || defaultData;
}

function saveAdminData(data) {
    data.settings.lastUpdate = CONFIG.CURRENT_TIME;
    localStorage.setItem('adminData', JSON.stringify(data));
    updateTimeDisplays();
    showToast('Changes saved successfully', 'success');
}

function updateTimeDisplays() {
    document.getElementById('last-login-time').textContent = lastLoginTime;
    document.getElementById('last-update-time').textContent = CONFIG.CURRENT_TIME;
}

// Section Loading Functions
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
            loadCreatorShoutouts();
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

// Creator Shoutouts Management
function loadCreatorShoutouts() {
    const defaultPlatform = 'tiktok';
    document.querySelector(`[data-platform="${defaultPlatform}"]`)?.click();
}

function switchPlatform(platform) {
    document.querySelectorAll('.platform-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.platform === platform) {
            tab.classList.add('active');
        }
    });

    // Load creators from the appropriate shoutouts object
    const creators = window[`${platform}Shoutouts`].accounts;
    renderCreators(platform, creators);
}

function renderCreators(platform, creators) {
    const container = document.getElementById('shoutouts-container');
    if (!container) return;

    container.innerHTML = creators.map(creator => `
        <div class="creator-card">
            <img src="${creator.profilePic}" alt="${creator.username}" class="creator-pic">
            <div class="creator-info">
                <div class="creator-header">
                    <h3>${creator.nickname} ${creator.isVerified ? '<img src="check.png" alt="Verified" class="verified-badge">' : ''}</h3>
                </div>
                <p class="creator-username">@${creator.username}</p>
                <p class="creator-bio">${creator.bio || ''}</p>
                <p class="follower-count">${creator.followers} Followers</p>
                <div class="creator-actions">
                    <button class="btn btn-primary" onclick="editCreator('${platform}', '${creator.username}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteCreator('${platform}', '${creator.username}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Settings Handlers
function handleThemeChange(e) {
    const theme = e.target.value;
    document.body.setAttribute('data-theme', theme);
    const data = getAdminData();
    data.settings.theme = theme;
    saveAdminData(data);
}

function handleStatusChange(e) {
    const status = e.target.value;
    const data = getAdminData();
    data.settings.profileStatus = status;
    saveAdminData(data);
}

function handleMaintenanceToggle(e) {
    const enabled = e.target.checked;
    const data = getAdminData();
    data.settings.maintenanceMode = enabled;
    saveAdminData(data);
    showToast(`Maintenance mode ${enabled ? 'enabled' : 'disabled'}`, 'info');
}

// Initialize application
checkLoginStatus();
