// Global Constants
const CURRENT_TIME = '2025-03-26 15:04:48';
const CURRENT_USER = 'BusArmyDude';

// DOM Elements and Global Variables
let loginSection;
let adminPanel;
let loginForm;
let lastLoginTime = localStorage.getItem('lastLogin') || CURRENT_TIME;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing admin portal for:', CURRENT_USER);
    
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
}

function setupButtonListeners() {
    // Logout button
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);

    // Mobile menu toggle
    document.getElementById('menuToggle')?.addEventListener('click', toggleSidebar);

    // Settings controls
    document.getElementById('theme-select')?.addEventListener('change', handleThemeChange);
    document.getElementById('status-select')?.addEventListener('change', handleStatusChange);
    document.getElementById('maintenance-toggle')?.addEventListener('change', handleMaintenanceToggle);

    // Add social link button
    document.querySelector('.add-social-btn')?.addEventListener('click', addSocialLink);
}

// Authentication Functions
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === CURRENT_USER && password === 'admin123') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('lastLogin', CURRENT_TIME);
        showAdminPanel();
        showToast('Welcome back, ' + CURRENT_USER + '!', 'success');
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
    data.settings.lastUpdate = CURRENT_TIME;
    localStorage.setItem('adminData', JSON.stringify(data));
    updateTimeDisplays();
    showToast('Changes saved successfully', 'success');
}

function updateTimeDisplays() {
    document.getElementById('last-login-time').textContent = lastLoginTime;
    document.getElementById('last-update-time').textContent = CURRENT_TIME;
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
            renderShoutouts(data.shoutouts);
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

// Section Render Functions
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
            <input type="text" value="${link.url}" class="form-control" data-index="${index}">
            <button class="btn btn-primary" onclick="updateSocialLink(${index})">
                <i class="fas fa-save"></i>
            </button>
            <button class="btn btn-danger" onclick="deleteSocialLink(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function renderShoutouts(shoutouts) {
    const container = document.getElementById('shoutouts-container');
    if (!container) return;

    container.innerHTML = Object.entries(shoutouts).map(([platform, items]) => `
        <div class="platform-section">
            <h3><i class="fab fa-${platform}"></i> ${platform.charAt(0).toUpperCase() + platform.slice(1)}</h3>
            <div class="shoutout-list">
                ${items.map((item, index) => `
                    <div class="shoutout-item">
                        <img src="${item.avatar}" alt="${item.username}">
                        <div class="shoutout-details">
                            <h4>${item.username}</h4>
                            <p>${item.message}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function renderTechInfo(techInfo) {
    const container = document.querySelector('.tech-grid');
    if (!container) return;

    container.innerHTML = Object.entries(techInfo).map(([device, info]) => `
        <div class="tech-card">
            <h3>${info.model}</h3>
            <div class="tech-details">
                ${Object.entries(info).map(([key, value]) => 
                    key !== 'model' ? `
                        <div class="tech-detail">
                            <span class="detail-label">${key}:</span>
                            <span class="detail-value">${value}</span>
                        </div>
                    ` : ''
                ).join('')}
            </div>
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
        <div class="hours-grid">
            ${Object.entries(hours).map(([day, time]) => `
                <div class="hours-row">
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
        </div>
    `;
}

function renderFAQ(faq) {
    const container = document.getElementById('faq-container');
    if (!container) return;

    container.innerHTML = `
        ${faq.map((item, index) => `
            <div class="faq-item">
                <input type="text" class="form-control" value="${item.question}" placeholder="Question">
                <textarea class="form-control" placeholder="Answer">${item.answer}</textarea>
                <div class="faq-actions">
                    <button class="btn btn-primary" onclick="updateFAQItem(${index})">
                        <i class="fas fa-save"></i> Save
                    </button>
                    <button class="btn btn-danger" onclick="deleteFAQItem(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('')}
        <button class="btn btn-primary add-faq-btn">
            <i class="fas fa-plus"></i> Add FAQ Item
        </button>
    `;
}

function renderSettings(settings) {
    const themeSelect = document.getElementById('theme-select');
    const statusSelect = document.getElementById('status-select');
    const maintenanceToggle = document.getElementById('maintenance-toggle');

    if (themeSelect) themeSelect.value = settings.theme;
    if (statusSelect) statusSelect.value = settings.profileStatus;
    if (maintenanceToggle) maintenanceToggle.checked = settings.maintenanceMode;
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
