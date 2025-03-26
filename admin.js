// Initial Data Structure
const defaultData = {
    socialLinks: [
        { platform: 'tiktok', url: 'https://www.tiktok.com/@officalbusarmydude', icon: 'fab fa-tiktok' },
        { platform: 'youtube', url: 'https://www.youtube.com/@BusArmyDude', icon: 'fab fa-youtube' },
        { platform: 'snapchat', url: 'https://www.snapchat.com/add/calebkritzar', icon: 'fab fa-snapchat-ghost' }
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
            color: 'Natural Titanium',
            osVersion: 'iOS 18.4',
            batteryHealth: '99%',
            purchaseDate: '2024-11-08'
        },
        watch: {
            model: 'Apple Watch Ultra 2',
            storage: '64GB',
            color: 'Natural Titanium',
            osVersion: 'watchOS 11.4',
            batteryHealth: '97%',
            purchaseDate: '2024-05-17'
        },
        mac: {
            model: '2023 Mac Mini M2',
            storage: '256GB',
            color: 'Space Gray',
            osVersion: 'macOS Sequoia 15.4',
            purchaseDate: '2024-05-16'
        }
    },
    faq: [
        {
            question: 'Who is Bus Army Dude?',
            answer: 'Content Creator focusing on gaming (primarily simulation games), tech reviews, and lifestyle content.'
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
        lastUpdate: '2025-03-26 13:35:11'
    }
};

// Initialize data in localStorage if it doesn't exist
if (!localStorage.getItem('adminData')) {
    localStorage.setItem('adminData', JSON.stringify(defaultData));
}

// Authentication
const ADMIN_USERNAME = 'BusArmyDude';
const ADMIN_PASSWORD = 'Penta!933754'; // In production, use proper authentication

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Navigation
    document.querySelectorAll('.nav-menu li').forEach(item => {
        item.addEventListener('click', () => navigateToSection(item.dataset.section));
    });
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Check if already logged in
    checkLoginStatus();
    
    // Initialize theme
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    setTheme(adminData.settings.theme);
});

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('isLoggedIn', 'true');
        showAdminPanel();
        showToast('Login successful', 'success');
    } else {
        showToast('Invalid credentials', 'error');
    }
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    hideAdminPanel();
    showToast('Logged out successfully', 'success');
}

function checkLoginStatus() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        showAdminPanel();
    }
}

// Navigation Functions
function navigateToSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    
    // Show selected section
    document.getElementById(`${section}-section`).style.display = 'block';
    
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
function loadSectionData(section) {
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    
    switch(section) {
        case 'dashboard':
            updateDashboardStats();
            break;
        case 'social':
            loadSocialLinks();
            break;
        case 'shoutouts':
            loadShoutouts();
            break;
        case 'events':
            loadEvents();
            break;
        case 'tech':
            loadTechInfo();
            break;
        case 'faq':
            loadFAQ();
            break;
        case 'hours':
            loadBusinessHours();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// UI Helper Functions
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

function showModal(title, content, saveCallback) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal-save').onclick = saveCallback;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Theme Management
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    adminData.settings.theme = theme;
    localStorage.setItem('adminData', JSON.stringify(adminData));
}

// Data Management Functions
function saveData(key, value) {
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    adminData[key] = value;
    adminData.settings.lastUpdate = new Date().toISOString();
    localStorage.setItem('adminData', JSON.stringify(adminData));
    showToast('Changes saved successfully', 'success');
}

// Initialize the application
function init() {
    checkLoginStatus();
    if (localStorage.getItem('isLoggedIn') === 'true') {
        navigateToSection('dashboard');
    }
}

// Call init when the page loads
init();
