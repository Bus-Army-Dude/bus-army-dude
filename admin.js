// Global Constants
const NEURAL_CONFIG = {
    CURRENT_TIME: '2025-03-26 16:10:24',
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
        lastUpdate: NEURAL_CONFIG.CURRENT_TIME
    }
};

// DOM Elements and Global Variables
let loginSection;
let adminPanel;
let loginForm;
let lastLoginTime = localStorage.getItem('lastLogin') || NEURAL_CONFIG.CURRENT_TIME;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing admin portal for:', NEURAL_CONFIG.CURRENT_USER);
    
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

    // Initialize Neural Login System
    initializeNeuralLogin();
});

function initializeNeuralLogin() {
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.neural-button');
    const timeDisplay = document.querySelector('.neural-time');

    // Update system time
    if (timeDisplay) {
        timeDisplay.textContent = NEURAL_CONFIG.CURRENT_TIME;
    }

    // Enable password input and focus
    if (passwordInput) {
        passwordInput.removeAttribute('readonly');
        passwordInput.value = 'admin123';
        passwordInput.focus();
    }

    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get password value
            const password = passwordInput.value.trim();
            
            // Disable form during authentication
            passwordInput.disabled = true;
            loginButton.disabled = true;
            
            // Update button state
            loginButton.innerHTML = `
                <span class="button-text">
                    <i class="fas fa-spinner fa-spin"></i> 
                    Establishing Neural Link...
                </span>
                <div class="button-glow"></div>
            `;

            // Simulate neural connection sequence
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

    // Create toast container if it doesn't exist
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
            // Authentication check
            if (password === 'admin123') {
                handleSuccessfulLogin();
            } else {
                handleFailedLogin();
            }
        }
    };

    showSequenceStep();
}

function setupEventListeners() {
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

    // Core button event listeners
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

    const container = document.getElementById('toast-container');
    container.appendChild(toast);

    // Add appear animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Start progress bar
    const progress = toast.querySelector('.toast-progress');
    progress.style.transition = `width ${duration}ms linear`;
    requestAnimationFrame(() => {
        progress.style.width = '0%';
    });

    // Remove toast after duration
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function handleSuccessfulLogin() {
    // Save login state
    localStorage.setItem('neural_auth', JSON.stringify({
        timestamp: NEURAL_CONFIG.CURRENT_TIME,
        user: NEURAL_CONFIG.CURRENT_USER
    }));

    // Show success message
    showNeuralToast('Neural link established successfully', 'success');

    // Redirect to admin panel
    setTimeout(() => {
        const loginSection = document.getElementById('login-section');
        if (loginSection) {
            loginSection.style.opacity = '0';
            setTimeout(() => {
                loginSection.style.display = 'none';
                window.location.reload(); // Reload to initialize admin panel
            }, 500);
        }
    }, 1000);
}

function handleFailedLogin() {
    // Reset form
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.neural-button');

    if (loginButton) {
        loginButton.innerHTML = `
            <span class="button-text">Initialize Connection</span>
            <div class="button-glow"></div>
        `;
        loginButton.disabled = false;
    }

    if (passwordInput) {
        passwordInput.disabled = false;
        passwordInput.value = '';
        passwordInput.focus();
    }

    // Show error message
    showNeuralToast('Neural authentication failed: Invalid access key', 'error');
}

// Section Navigation and Data Management
function navigateToSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    
    // Show selected section
    const selectedSection = document.getElementById(`${section}-section`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        selectedSection.classList.add('fade-in');
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
        activeLinks: Object.keys(data.socialLinks).length,
        systemStatus: data.settings.maintenanceMode ? 'Maintenance' : 'Operational',
        lastUpdate: data.settings.lastUpdate
    };

    // Update stats display
    Object.entries(stats).forEach(([key, value]) => {
        const element = document.getElementById(`${key}-stat`);
        if (element) {
            element.textContent = value;
            element.classList.add('pulse');
            setTimeout(() => element.classList.remove('pulse'), 1000);
        }
    });

    // Update neural metrics
    updateNeuralMetrics();
}

function renderSocialLinks(links) {
    const container = document.getElementById('social-links-container');
    if (!container) return;

    container.innerHTML = links.map(link => `
        <div class="neural-card social-card" data-platform="${link.platform}">
            <div class="card-icon">
                <i class="${link.icon}"></i>
            </div>
            <div class="card-content">
                <h3>${link.label}</h3>
                <p class="username">@${extractUsername(link.url)}</p>
            </div>
            <div class="card-actions">
                <button class="neural-btn" onclick="window.open('${link.url}', '_blank')">
                    <i class="fas fa-external-link-alt"></i>
                </button>
                <button class="neural-btn edit" onclick="editSocialLink('${link.platform}')">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
            <div class="neural-glow"></div>
        </div>
    `).join('');
}

function renderTechInfo(techInfo) {
    const container = document.getElementById('tech-section');
    if (!container) return;

    const techGrid = document.createElement('div');
    techGrid.className = 'tech-grid';

    Object.entries(techInfo).forEach(([device, specs]) => {
        const card = createTechCard(device, specs);
        techGrid.appendChild(card);
    });

    const existingGrid = container.querySelector('.tech-grid');
    if (existingGrid) {
        existingGrid.replaceWith(techGrid);
    } else {
        container.appendChild(techGrid);
    }
}

function createTechCard(device, specs) {
    const card = document.createElement('div');
    card.className = 'neural-card tech-card';
    card.setAttribute('data-device', device);

    card.innerHTML = `
        <div class="tech-header">
            <div class="tech-icon">
                <i class="fas fa-${getTechIcon(device)}"></i>
            </div>
            <h3>${specs.model}</h3>
        </div>
        <div class="tech-specs">
            <div class="spec-item">
                <i class="fas fa-microchip"></i>
                <span>${specs.storage}</span>
            </div>
            ${specs.batteryCapacity ? `
            <div class="spec-item">
                <i class="fas fa-battery-full"></i>
                <span>${specs.batteryCapacity}</span>
            </div>
            ` : ''}
            <div class="spec-item">
                <i class="fas fa-clock"></i>
                <span>${specs.purchaseDate}</span>
            </div>
        </div>
        <div class="tech-status">
            <div class="status-label">System Health</div>
            <div class="progress-bar">
                <div class="progress" style="width: ${specs.batteryHealth || 100}%"></div>
            </div>
            <div class="status-value">${specs.batteryHealth ? `${specs.batteryHealth}%` : 'Optimal'}</div>
        </div>
        <div class="tech-footer">
            <span class="os-version">${specs.osVersion}</span>
            <button class="neural-btn" onclick="showTechDetails('${device}')">
                <i class="fas fa-info-circle"></i>
            </button>
        </div>
        <div class="neural-glow"></div>
    `;

    return card;
}

function renderBusinessHours(hours) {
    const container = document.getElementById('hours-container');
    if (!container) return;

    container.innerHTML = `
        <div class="schedule-grid">
            ${Object.entries(hours).map(([day, schedule]) => `
                <div class="schedule-card neural-card ${schedule.closed ? 'closed' : ''}">
                    <div class="day-header">
                        <h3>${capitalizeFirst(day)}</h3>
                        <label class="neural-switch">
                            <input type="checkbox" 
                                ${!schedule.closed ? 'checked' : ''} 
                                onchange="toggleDay('${day}')">
                            <span class="switch-slider"></span>
                        </label>
                    </div>
                    <div class="hours-container">
                        <div class="time-input">
                            <label>Open</label>
                            <input type="time" 
                                value="${schedule.open}" 
                                onchange="updateHours('${day}', 'open', this.value)"
                                ${schedule.closed ? 'disabled' : ''}>
                        </div>
                        <div class="time-input">
                            <label>Close</label>
                            <input type="time" 
                                value="${schedule.close}" 
                                onchange="updateHours('${day}', 'close', this.value)"
                                ${schedule.closed ? 'disabled' : ''}>
                        </div>
                    </div>
                    <div class="neural-glow"></div>
                </div>
            `).join('')}
        </div>
    `;
}

// Settings Management and Neural Effects
function renderSettings(settings) {
    // Update theme selector
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = settings.theme;
    }

    // Update status selector
    const statusSelect = document.getElementById('status-select');
    if (statusSelect) {
        statusSelect.value = settings.profileStatus;
    }

    // Update maintenance toggle
    const maintenanceToggle = document.getElementById('maintenance-toggle');
    if (maintenanceToggle) {
        maintenanceToggle.checked = settings.maintenanceMode;
    }

    // Update last sync time
    const lastSyncDisplay = document.getElementById('last-sync');
    if (lastSyncDisplay) {
        lastSyncDisplay.textContent = NEURAL_CONFIG.CURRENT_TIME;
    }
}

function handleThemeChange(theme) {
    document.body.className = theme;
    const data = getAdminData();
    data.settings.theme = theme;
    saveAdminData(data);
    showNeuralToast('Neural interface theme updated', 'success');
}

function handleStatusChange(status) {
    const statusIndicator = document.querySelector('.status-indicator');
    if (statusIndicator) {
        statusIndicator.className = 'status-indicator ' + status;
    }
    
    const data = getAdminData();
    data.settings.profileStatus = status;
    saveAdminData(data);
    showNeuralToast(`Status updated to: ${status}`, 'info');
}

function handleMaintenanceToggle(enabled) {
    const data = getAdminData();
    data.settings.maintenanceMode = enabled;
    saveAdminData(data);
    showNeuralToast(`Maintenance mode ${enabled ? 'enabled' : 'disabled'}`, 'warning');
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
    // Update system time
    setInterval(updateSystemTime, 1000);
    
    // Update neural metrics
    setInterval(updateNeuralMetrics, 5000);
    
    // Check system status
    setInterval(checkSystemStatus, 10000);
}

function updateSystemTime() {
    const timeDisplays = document.querySelectorAll('.neural-time');
    const now = new Date();
    const timeString = now.toISOString().replace('T', ' ').split('.')[0];
    
    timeDisplays.forEach(display => {
        display.textContent = timeString;
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

// Utility Functions
function getAdminData() {
    try {
        const stored = localStorage.getItem('admin_data');
        return stored ? JSON.parse(stored) : defaultData;
    } catch (error) {
        console.error('Error loading admin data:', error);
        return defaultData;
    }
}

function saveAdminData(data) {
    try {
        data.settings.lastUpdate = NEURAL_CONFIG.CURRENT_TIME;
        localStorage.setItem('admin_data', JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving admin data:', error);
        return false;
    }
}

function extractUsername(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.pathname.split('/').filter(Boolean).pop();
    } catch {
        return url;
    }
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getTechIcon(device) {
    const icons = {
        iphone: 'mobile-alt',
        watch: 'clock',
        mac: 'laptop'
    };
    return icons[device] || 'microchip';
}

// Error Handling and System Recovery
class NeuralSystemError extends Error {
    constructor(message, code, context) {
        super(message);
        this.name = 'NeuralSystemError';
        this.code = code;
        this.context = context;
        this.timestamp = '2025-03-26 16:15:06';
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

    // Attempt recovery for specific error types
    if (['data', 'sync'].includes(context)) {
        attemptSystemRecovery(context);
    }

    // Force logout on critical errors
    if (['auth', 'connection'].includes(context)) {
        setTimeout(handleLogout, 2000);
    }
}

async function attemptSystemRecovery(context) {
    showNeuralToast('Initiating neural system recovery...', 'warning');

    try {
        // Backup current state
        const currentData = getAdminData();
        localStorage.setItem('neural_backup', JSON.stringify(currentData));

        // Reset to default state
        await resetSystemState();

        // Restore verified data
        await restoreVerifiedData();

        showNeuralToast('Neural system recovery complete', 'success');
    } catch (error) {
        console.error('Recovery failed:', error);
        showNeuralToast('Neural system recovery failed', 'error');
        handleLogout();
    }
}

async function resetSystemState() {
    return new Promise(resolve => {
        setTimeout(() => {
            localStorage.setItem('admin_data', JSON.stringify(defaultData));
            resolve();
        }, 1000);
    });
}

async function restoreVerifiedData() {
    return new Promise(resolve => {
        setTimeout(() => {
            const backup = localStorage.getItem('neural_backup');
            if (backup) {
                try {
                    const data = JSON.parse(backup);
                    // Verify and restore only valid data
                    const verified = verifyDataIntegrity(data);
                    if (verified) {
                        localStorage.setItem('admin_data', JSON.stringify(data));
                    }
                } catch (e) {
                    console.error('Data restoration failed:', e);
                }
            }
            resolve();
        }, 1000);
    });
}

function verifyDataIntegrity(data) {
    // Check required data structure
    const requiredKeys = ['socialLinks', 'techInfo', 'businessHours', 'settings'];
    return requiredKeys.every(key => key in data);
}

// Debug Mode
const DEBUG_MODE = {
    enabled: false,
    lastLog: '2025-03-26 16:15:06',
    metrics: new Map()
};

function toggleDebugMode() {
    DEBUG_MODE.enabled = !DEBUG_MODE.enabled;
    document.body.classList.toggle('debug-mode', DEBUG_MODE.enabled);

    if (DEBUG_MODE.enabled) {
        initializeDebugTools();
    } else {
        removeDebugTools();
    }

    showNeuralToast(`Debug mode ${DEBUG_MODE.enabled ? 'enabled' : 'disabled'}`, 'info');
}

function initializeDebugTools() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.className = 'neural-card debug-panel';
    
    debugPanel.innerHTML = `
        <h3>Neural Debug Console</h3>
        <div class="debug-metrics">
            <p>User: ${NEURAL_CONFIG.CURRENT_USER}</p>
            <p>Version: ${NEURAL_CONFIG.VERSION}</p>
            <p>Build: ${NEURAL_CONFIG.BUILD}</p>
            <p>Session Start: ${DEBUG_MODE.lastLog}</p>
        </div>
        <div class="debug-actions">
            <button onclick="forceSyncData()">Force Sync</button>
            <button onclick="clearNeuralCache()">Clear Cache</button>
            <button onclick="simulateError()">Simulate Error</button>
        </div>
        <div class="debug-log"></div>
    `;
    
    document.body.appendChild(debugPanel);
    startDebugMetrics();
}

function removeDebugTools() {
    document.getElementById('debug-panel')?.remove();
    stopDebugMetrics();
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/neural-sw.js')
            .then(registration => {
                console.log('Neural ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.error('Neural ServiceWorker registration failed:', error);
            });
    });
}

// Final System Initialization
class NeuralSystem {
    constructor() {
        this.initialized = false;
        this.startTime = '2025-03-26 16:15:06';
        this.user = 'BusArmyDude';
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
        // Initialize core components
        document.body.classList.add(getAdminData().settings.theme);
        initializeNeuralEffects();
        setupEventListeners();
    }

    async initializeModules() {
        // Initialize all modules
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
            timestamp: this.startTime,
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
