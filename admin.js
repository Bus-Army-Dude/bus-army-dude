// Constants and Configuration
const ADMIN_USERNAME = 'BusArmyDude';
const ADMIN_PASSWORD = 'admin123';
const CURRENT_TIME = '2025-03-26 14:03:39';

// Load your existing data structures
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
        tiktok: tiktokShoutouts.accounts,
        youtube: youtubeShoutouts.accounts,
        instagram: instagramShoutouts.accounts
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
    settings: {
        theme: 'dark',
        maintenanceMode: false,
        profileStatus: 'online',
        lastUpdate: CURRENT_TIME
    }
};

// Admin Portal Class
class AdminPortal {
    constructor() {
        this.initializeData();
        this.attachEventListeners();
        this.checkLoginStatus();
    }

    initializeData() {
        if (!localStorage.getItem('adminData')) {
            localStorage.setItem('adminData', JSON.stringify(defaultData));
        }
        this.data = JSON.parse(localStorage.getItem('adminData'));
    }

    attachEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Navigation
        document.querySelectorAll('.nav-menu li').forEach(item => {
            item.addEventListener('click', () => {
                this.navigateToSection(item.dataset.section);
            });
        });

        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.querySelector('.sidebar');
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('lastLogin', CURRENT_TIME);
            this.showAdminPanel();
            this.showToast('Login successful!', 'success');
        } else {
            this.showToast('Invalid credentials', 'error');
        }
    }

    handleLogout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('lastLogin');
        this.hideAdminPanel();
        this.showToast('Logged out successfully', 'success');
    }

    checkLoginStatus() {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            this.showAdminPanel();
        }
    }

    showAdminPanel() {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'grid';
        this.loadDashboard();
    }

    hideAdminPanel() {
        document.getElementById('login-section').style.display = 'flex';
        document.getElementById('admin-panel').style.display = 'none';
    }

    navigateToSection(section) {
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
        this.loadSectionData(section);
    }

    loadSectionData(section) {
        switch(section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'social':
                this.loadSocialLinks();
                break;
            case 'shoutouts':
                this.loadCreatorShoutouts();
                break;
            case 'tech':
                this.loadTechInfo();
                break;
            case 'hours':
                this.loadBusinessHours();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    loadDashboard() {
        this.updateStats();
        this.updateLastUpdateTime();
    }

    updateStats() {
        document.getElementById('social-count').textContent = this.data.socialLinks.length;
        document.getElementById('shoutouts-count').textContent = 
            Object.values(this.data.shoutouts).flat().length;
    }

    updateLastUpdateTime() {
        const element = document.getElementById('last-update-time');
        if (element) {
            element.textContent = CURRENT_TIME;
        }
    }

    loadSocialLinks() {
        const container = document.getElementById('social-links-container');
        if (!container) return;

        container.innerHTML = this.data.socialLinks.map((link, index) => `
            <div class="social-link-item">
                <i class="${link.icon}"></i>
                <input type="text" value="${link.url}" data-index="${index}">
                <button onclick="adminPortal.updateSocialLink(${index})">
                    <i class="fas fa-save"></i>
                </button>
                <button onclick="adminPortal.deleteSocialLink(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    updateSocialLink(index) {
        const input = document.querySelector(`[data-index="${index}"]`);
        if (input) {
            this.data.socialLinks[index].url = input.value;
            this.saveData();
            this.showToast('Social link updated', 'success');
        }
    }

    deleteSocialLink(index) {
        this.data.socialLinks.splice(index, 1);
        this.saveData();
        this.loadSocialLinks();
        this.showToast('Social link deleted', 'success');
    }

    addSocialLink() {
        this.data.socialLinks.push({
            platform: 'new',
            url: '',
            icon: 'fab fa-link'
        });
        this.saveData();
        this.loadSocialLinks();
    }

    saveData() {
        this.data.settings.lastUpdate = CURRENT_TIME;
        localStorage.setItem('adminData', JSON.stringify(this.data));
        this.updateLastUpdateTime();
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        const container = document.getElementById('toast-container');
        if (container) {
            container.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }
    }

    // Additional methods for other sections...
    loadCreatorShoutouts() {
        // Implementation for creator shoutouts
    }

    loadTechInfo() {
        // Implementation for tech info
    }

    loadBusinessHours() {
        // Implementation for business hours
    }

    loadSettings() {
        // Implementation for settings
    }
}

// Initialize the admin portal
const adminPortal = new AdminPortal();

// Make adminPortal available globally for button onclick handlers
window.adminPortal = adminPortal;

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    adminPortal.attachEventListeners();
});
