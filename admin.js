// Global Constants
const NEURAL_CONFIG = {
    CURRENT_TIME: '2025-03-26 16:29:13',
    CURRENT_USER: 'BusArmyDude',
    VERSION: '1.14.0',
    BUILD: '2025.3.26',
    TIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    TIME_ZONE: 'UTC',
    
    updateTime(newTime) {
        this.CURRENT_TIME = newTime;
        this.updateTimeDisplays();
        this.saveConfig();
    },
    
    updateUser(newUser) {
        this.CURRENT_USER = newUser;
        this.updateUserDisplays();
        this.saveConfig();
    },
    
    updateTimeDisplays() {
        document.querySelectorAll('.neural-time').forEach(display => {
            display.textContent = this.CURRENT_TIME;
        });
    },
    
    updateUserDisplays() {
        document.querySelectorAll('.neural-user').forEach(display => {
            display.textContent = this.CURRENT_USER;
        });
        const avatar = document.querySelector('.profile-hologram');
        if (avatar) {
            avatar.alt = this.CURRENT_USER;
        }
    },
    
    saveConfig() {
        localStorage.setItem('neural_config', JSON.stringify({
            time: this.CURRENT_TIME,
            user: this.CURRENT_USER
        }));
    },
    
    loadConfig() {
        const saved = localStorage.getItem('neural_config');
        if (saved) {
            const config = JSON.parse(saved);
            this.CURRENT_TIME = config.time;
            this.CURRENT_USER = config.user;
        }
    },
    
    formatDate(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        const pad = (num) => String(num).padStart(2, '0');
        const year = date.getUTCFullYear();
        const month = pad(date.getUTCMonth() + 1);
        const day = pad(date.getUTCDate());
        const hours = pad(date.getUTCHours());
        const minutes = pad(date.getUTCMinutes());
        const seconds = pad(date.getUTCSeconds());
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
};

// Time Management Functions
function initializeTimeManagement() {
    NEURAL_CONFIG.loadConfig();
    NEURAL_CONFIG.updateTimeDisplays();
    NEURAL_CONFIG.updateUserDisplays();
    
    if (DEBUG_MODE.enabled) {
        addTimeControls();
    }
}

function addTimeControls() {
    const debugPanel = document.getElementById('debug-panel');
    if (!debugPanel) return;
    
    const timeControls = document.createElement('div');
    timeControls.className = 'debug-time-controls';
    timeControls.innerHTML = `
        <div class="time-control">
            <label>System Time (UTC):</label>
            <input type="datetime-local" 
                   value="${NEURAL_CONFIG.CURRENT_TIME.replace(' ', 'T')}"
                   step="1"
                   onchange="updateSystemTime(this.value)">
        </div>
        <div class="user-control">
            <label>Current User:</label>
            <input type="text" 
                   value="${NEURAL_CONFIG.CURRENT_USER}"
                   onchange="updateSystemUser(this.value)">
        </div>
    `;
    
    debugPanel.insertBefore(timeControls, debugPanel.querySelector('.debug-log'));
}

function updateSystemTime(newTime) {
    if (newTime.includes('T')) {
        newTime = newTime.replace('T', ' ');
    }
    NEURAL_CONFIG.updateTime(newTime);
    showNeuralToast('System time updated', 'info');
}

function updateSystemUser(newUser) {
    NEURAL_CONFIG.updateUser(newUser);
    showNeuralToast('System user updated', 'info');
}

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
        lastUpdate: '2025-03-26 16:30:28'
    }
};

// DOM Elements and Global Variables
let loginSection;
let adminPanel;
let loginForm;
let lastLoginTime = localStorage.getItem('lastLogin') || '2025-03-26 16:30:28';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing admin portal for:', NEURAL_CONFIG.CURRENT_USER);
    
    loginSection = document.getElementById('login-section');
    adminPanel = document.getElementById('admin-panel');
    loginForm = document.getElementById('login-form');
    
    setupEventListeners();
    initializeData();
    checkLoginStatus();
    updateTimeDisplays();
    initializeNeuralLogin();
    initializeTimeManagement();
});

function initializeNeuralLogin() {
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.neural-button');
    const timeDisplay = document.querySelector('.neural-time');

    if (timeDisplay) {
        timeDisplay.textContent = NEURAL_CONFIG.CURRENT_TIME;
    }

    if (passwordInput) {
        passwordInput.removeAttribute('readonly');
        passwordInput.value = '';
        passwordInput.focus();
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = passwordInput.value.trim();
            passwordInput.disabled = true;
            loginButton.disabled = true;
            
            loginButton.innerHTML = `
                <span class="button-text">
                    <i class="fas fa-spinner fa-spin"></i> 
                    Establishing Neural Link...
                </span>
                <div class="button-glow"></div>
            `;

            initiateNeuralSequence(password);
        });
    }
}

function initiateNeuralSequence(password) {
    const sequences = [
        { message: 'Initializing neural interface...', delay: 800 },
        { message: 'Establishing quantum connection...', delay: 600 },
        { message: 'Verifying neural patterns...', delay: 700 },
        { message: 'Synchronizing bio-signatures...', delay: 500 }
    ];

    let currentStep = 0;
    let toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const showSequenceStep = () => {
        if (currentStep < sequences.length) {
            showNeuralToast(sequences[currentStep].message, 'info');
            currentStep++;
            setTimeout(showSequenceStep, sequences[currentStep - 1].delay);
        } else {
            if (password === 'admin123') {
                handleSuccessfulLogin();
            } else {
                handleFailedLogin();
            }
        }
    };

    showSequenceStep();
}

// Admin Panel Functions
function setupEventListeners() {
    document.querySelectorAll('.nav-menu li').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            navigateToSection(section);
            
            if (window.innerWidth <= 768) {
                toggleSidebar();
            }
        });
    });

    // Core button event listeners
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    document.getElementById('menuToggle')?.addEventListener('click', toggleSidebar);
    document.getElementById('theme-select')?.addEventListener('change', handleThemeChange);
    document.getElementById('status-select')?.addEventListener('change', handleStatusChange);
    document.getElementById('maintenance-toggle')?.addEventListener('change', handleMaintenanceToggle);

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

function showNeuralToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `neural-toast ${type}`;
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${getToastIcon(type)}"></i>
        </div>
        <div class="toast-content">
            <p>${message}</p>
        </div>
        <div class="toast-progress"></div>
    `;

    const container = document.getElementById('toast-container') || 
                     (() => {
                         const cont = document.createElement('div');
                         cont.id = 'toast-container';
                         document.body.appendChild(cont);
                         return cont;
                     })();

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
        const progress = toast.querySelector('.toast-progress');
        progress.style.transition = `width ${duration}ms linear`;
        requestAnimationFrame(() => {
            progress.style.width = '0%';
        });
    });

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function getToastIcon(type) {
    return {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    }[type] || 'info-circle';
}

function handleSuccessfulLogin() {
    localStorage.setItem('neural_auth', JSON.stringify({
        timestamp: NEURAL_CONFIG.CURRENT_TIME,
        user: NEURAL_CONFIG.CURRENT_USER
    }));

    showNeuralToast('Neural link established successfully', 'success');

    setTimeout(() => {
        loginSection.style.opacity = '0';
        setTimeout(() => {
            loginSection.style.display = 'none';
            adminPanel.classList.add('active');
            initializeAdminPanel();
        }, 500);
    }, 1000);
}

function handleFailedLogin() {
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.neural-button');

    loginButton.innerHTML = `
        <span class="button-text">Initialize Connection</span>
        <div class="button-glow"></div>
    `;
    
    loginButton.disabled = false;
    passwordInput.disabled = false;
    passwordInput.value = '';
    passwordInput.focus();

    showNeuralToast('Neural authentication failed: Invalid access key', 'error');

    const loginContainer = document.querySelector('.login-container');
    loginContainer.classList.add('shake');
    setTimeout(() => loginContainer.classList.remove('shake'), 650);
}

function navigateToSection(section) {
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    
    const selectedSection = document.getElementById(`${section}-section`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        selectedSection.classList.add('fade-in');
    }
    
    document.querySelectorAll('.nav-menu li').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === section) {
            item.classList.add('active');
        }
    });
    
    loadSectionData(section);
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
        case 'tech':
            renderTechInfo(data.techInfo);
            break;
        case 'hours':
            renderBusinessHours(data.businessHours);
            break;
        case 'settings':
            renderSettings(data.settings);
            break;
    }
}

function updateDashboardStats(data) {
    const stats = {
        lastLogin: lastLoginTime,
        activeLinks: data.socialLinks.length,
        systemStatus: data.settings.maintenanceMode ? 'Maintenance' : 'Operational',
        lastUpdate: data.settings.lastUpdate
    };

    Object.entries(stats).forEach(([key, value]) => {
        const element = document.getElementById(`${key}-stat`);
        if (element) {
            element.textContent = value;
            element.classList.add('pulse');
            setTimeout(() => element.classList.remove('pulse'), 1000);
        }
    });

    updateNeuralMetrics();
}

// Neural Effects and Animations
function initializeNeuralEffects() {
    createParticleEffect();
    initializeHologramEffects();
    startPulseEffects();
}

function createParticleEffect() {
    const container = document.querySelector('.neural-particles');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'neural-particle';
        particle.style.setProperty('--delay', `${Math.random() * 5}s`);
        particle.style.setProperty('--size', `${Math.random() * 3 + 1}px`);
        container.appendChild(particle);
    }
}

function initializeHologramEffects() {
    const holoElements = document.querySelectorAll('.hologram-effect');
    holoElements.forEach(element => {
        if (!element.querySelector('.holo-scanline')) {
            element.innerHTML += '<div class="holo-scanline"></div>';
            element.innerHTML += '<div class="holo-glow"></div>';
        }
    });
}

function startPulseEffects() {
    setInterval(() => {
        document.querySelectorAll('.neural-pulse').forEach(element => {
            element.classList.add('pulse');
            setTimeout(() => element.classList.remove('pulse'), 1000);
        });
    }, 3000);
}

// Real-time Updates
function initializeRealTimeUpdates() {
    setInterval(updateSystemTime, 1000);
    setInterval(updateNeuralMetrics, 5000);
    setInterval(checkSystemStatus, 10000);
}

function updateSystemTime() {
    const timeDisplays = document.querySelectorAll('.neural-time');
    timeDisplays.forEach(display => {
        display.textContent = NEURAL_CONFIG.CURRENT_TIME;
    });
}

function updateNeuralMetrics() {
    document.querySelectorAll('.neural-metric').forEach(metric => {
        const value = Math.floor(Math.random() * 100);
        metric.style.setProperty('--value', `${value}%`);
        
        const valueDisplay = metric.querySelector('.metric-value');
        if (valueDisplay) {
            valueDisplay.textContent = `${value}%`;
        }
    });
}

function checkSystemStatus() {
    const data = getAdminData();
    const statusIndicator = document.querySelector('.status-indicator');
    
    if (statusIndicator) {
        statusIndicator.className = `status-indicator ${data.settings.profileStatus}`;
    }
}

// Error Handling and System Recovery
class NeuralSystemError extends Error {
    constructor(message, code, context) {
        super(message);
        this.name = 'NeuralSystemError';
        this.code = code;
        this.context = context;
        this.timestamp = NEURAL_CONFIG.CURRENT_TIME;
    }
}

function handleSystemError(error, context = 'system') {
    console.error(`Neural System Error (${context}):`, error);

    const errorMessages = {
        auth: 'Neural authentication failure detected',
        sync: 'Neural synchronization disrupted',
        data: 'Neural data corruption detected',
        connection: 'Neural link disrupted',
        system: 'Neural system malfunction detected'
    };

    showNeuralToast(errorMessages[context] || error.message, 'error');

    if (['data', 'sync'].includes(context)) {
        attemptSystemRecovery(context);
    }

    if (['auth', 'connection'].includes(context)) {
        setTimeout(handleLogout, 2000);
    }
}

async function attemptSystemRecovery(context) {
    showNeuralToast('Initiating neural system recovery...', 'warning');

    try {
        const currentData = getAdminData();
        localStorage.setItem('neural_backup', JSON.stringify(currentData));
        await resetSystemState();
        await restoreVerifiedData();
        showNeuralToast('Neural system recovery complete', 'success');
    } catch (error) {
        console.error('Recovery failed:', error);
        showNeuralToast('Neural system recovery failed', 'error');
        handleLogout();
    }
}

// Final System Initialization
class NeuralSystem {
    constructor() {
        this.initialized = false;
        this.startTime = NEURAL_CONFIG.CURRENT_TIME;
        this.user = NEURAL_CONFIG.CURRENT_USER;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            await this.initializeCore();
            await this.initializeModules();
            this.startSystemMonitoring();
            this.initialized = true;
            
            console.log(`Neural System initialized for ${this.user}`);
            showNeuralToast('Neural system initialization complete', 'success');
        } catch (error) {
            handleSystemError(error, 'initialization');
        }
    }

    async initializeCore() {
        document.body.classList.add(getAdminData().settings.theme);
        initializeNeuralEffects();
        setupEventListeners();
    }

    async initializeModules() {
        await Promise.all([
            this.initializeAuth(),
            this.initializeData(),
            this.initializeUI()
        ]);
    }

    startSystemMonitoring() {
        initializeRealTimeUpdates();
        setInterval(() => this.checkSystemHealth(), 30000);
    }

    checkSystemHealth() {
        const healthMetrics = {
            memory: performance.memory?.usedJSHeapSize,
            timestamp: NEURAL_CONFIG.CURRENT_TIME,
            uptime: (Date.now() - new Date(this.startTime).getTime()) / 1000
        };

        if (DEBUG_MODE.enabled) {
            console.log('System Health:', healthMetrics);
        }
    }
}

// Initialize the Neural System
const neuralSystem = new NeuralSystem();

document.addEventListener('DOMContentLoaded', () => {
    neuralSystem.initialize().catch(error => {
        handleSystemError(error, 'startup');
    });
});

// Export configurations for module support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NeuralSystem,
        NEURAL_CONFIG,
        DEBUG_MODE
    };
}
