// DOM Elements
let loginSection;
let adminPanel;
let loginForm;
let lastLoginTime = localStorage.getItem('lastLogin') || CONFIG.CURRENT_TIME;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    loginSection = document.getElementById('login-section');
    adminPanel = document.getElementById('admin-panel');
    loginForm = document.getElementById('login-form');
    
    // Add event listeners
    loginForm.addEventListener('submit', handleLogin);
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    document.getElementById('menuToggle')?.addEventListener('click', toggleSidebar);
    document.getElementById('theme-select')?.addEventListener('change', handleThemeChange);
    document.getElementById('status-select')?.addEventListener('change', handleStatusChange);
    document.getElementById('maintenance-toggle')?.addEventListener('change', handleMaintenanceToggle);
    
    // Setup navigation
    setupNavigation();
    
    // Initialize data
    initializeData();
    
    // Check login status
    checkLoginStatus();

    // Update time displays
    updateTimeDisplays();
});

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === CONFIG.ADMIN_USERNAME && password === CONFIG.ADMIN_PASSWORD) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('lastLogin', CONFIG.CURRENT_TIME);
        showAdminPanel();
        showToast('Login successful!', 'success');
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

function updateTimeDisplays() {
    document.getElementById('last-login-time').textContent = lastLoginTime;
    document.getElementById('last-update-time').textContent = CONFIG.CURRENT_TIME;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const container = document.getElementById('toast-container');
    container.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
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

function getAdminData() {
    return JSON.parse(localStorage.getItem('adminData'));
}

function saveAdminData(data) {
    data.settings.lastUpdate = CONFIG.CURRENT_TIME;
    localStorage.setItem('adminData', JSON.stringify(data));
    showToast('Changes saved successfully', 'success');
    updateTimeDisplays();
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

// Render Functions
function updateDashboardStats(data) {
    document.getElementById('social-count').textContent = data.socialLinks.length;
    document.getElementById('shoutouts-count').textContent = 
        Object.values(data.shoutouts).flat().length;
    document.getElementById('events-count').textContent = data.events.length;
    document.getElementById('faq-count').textContent = data.faq.length;
}

// Social Links Functions
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
    if (confirm('Are you sure you want to delete this social link?')) {
        const data = getAdminData();
        data.socialLinks.splice(index, 1);
        saveAdminData(data);
        loadSectionData('social');
    }
}

// Settings Functions
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
