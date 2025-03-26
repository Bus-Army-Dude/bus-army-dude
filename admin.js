// Neural Interface Configuration
const NEURAL_CONFIG = {
    VERSION: '1.14.0',
    BUILD: '2025.3.17',
    SYSTEM_TIME: '2025-03-26 15:58:28',
    CURRENT_USER: 'BusArmyDude',
    DEBUG_MODE: false
};

// Neural Data Structure
class NeuralDataStore {
    constructor() {
        this.socialLinks = {
            tiktok: { 
                url: 'https://www.tiktok.com/@officalbusarmydude', 
                icon: 'fab fa-tiktok', 
                label: 'TikTok',
                active: true 
            },
            youtube: { 
                url: 'https://www.youtube.com/@BusArmyDude', 
                icon: 'fab fa-youtube', 
                label: 'YouTube',
                active: true 
            },
            snapchat: { 
                url: 'https://www.snapchat.com/add/calebkritzar', 
                icon: 'fab fa-snapchat-ghost', 
                label: 'Snapchat',
                active: true 
            },
            twitter: { 
                url: 'https://x.com/KritzarRiver', 
                icon: 'fab fa-twitter', 
                label: 'X/Twitter',
                active: true 
            },
            twitch: { 
                url: 'https://m.twitch.tv/BusArmyDude', 
                icon: 'fab fa-twitch', 
                label: 'Twitch',
                active: true 
            },
            facebook: { 
                url: 'https://www.facebook.com/profile.php?id=61569972389004', 
                icon: 'fab fa-facebook', 
                label: 'Facebook',
                active: true 
            },
            steam: { 
                url: 'https://steamcommunity.com/profiles/76561199283946668', 
                icon: 'fab fa-steam', 
                label: 'Steam',
                active: true 
            },
            discord: { 
                url: 'https://discord.gg/NjMtuZYc52', 
                icon: 'fab fa-discord', 
                label: 'Discord',
                active: true 
            },
            instagram: { 
                url: 'https://www.instagram.com/busarmydude/', 
                icon: 'fab fa-instagram', 
                label: 'Instagram',
                active: true 
            },
            youtubeMusic: { 
                url: 'https://music.youtube.com/@BusArmyDude', 
                icon: 'fab fa-youtube-square', 
                label: 'YouTube Music',
                active: true 
            }
        };

        this.techSpecs = {
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
        };

        this.schedule = {
            monday: { open: '09:00', close: '17:00', closed: false },
            tuesday: { open: '09:00', close: '17:00', closed: false },
            wednesday: { open: '09:00', close: '17:00', closed: false },
            thursday: { open: '09:00', close: '17:00', closed: false },
            friday: { open: '09:00', close: '17:00', closed: false },
            saturday: { open: '10:00', close: '15:00', closed: false },
            sunday: { open: '00:00', close: '00:00', closed: true }
        };

        this.settings = {
            theme: 'dark',
            status: 'online',
            maintenance: false,
            lastUpdate: NEURAL_CONFIG.SYSTEM_TIME
        };
    }

    // Data management methods
    async initialize() {
        try {
            const stored = localStorage.getItem('neural_data');
            if (stored) {
                const data = JSON.parse(stored);
                this.socialLinks = { ...this.socialLinks, ...data.socialLinks };
                this.techSpecs = { ...this.techSpecs, ...data.techSpecs };
                this.schedule = { ...this.schedule, ...data.schedule };
                this.settings = { ...this.settings, ...data.settings };
            }
            return true;
        } catch (error) {
            console.error('Neural data initialization failed:', error);
            return false;
        }
    }

    async save() {
        try {
            const data = {
                socialLinks: this.socialLinks,
                techSpecs: this.techSpecs,
                schedule: this.schedule,
                settings: {
                    ...this.settings,
                    lastUpdate: NEURAL_CONFIG.SYSTEM_TIME
                }
            };
            localStorage.setItem('neural_data', JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Neural data save failed:', error);
            return false;
        }
    }
}

// Neural Interface Controller
class NeuralInterface {
    constructor() {
        this.data = new NeuralDataStore();
        this.initialized = false;
    }

// Neural Interface Controller (continued)
    async initialize() {
        if (this.initialized) return;
        
        await this.data.initialize();
        this.initializeElements();
        this.setupEventListeners();
        this.initializeNeuralEffects();
        this.startSystemClock();
        
        this.initialized = true;
        console.log(`Neural Interface initialized for ${NEURAL_CONFIG.CURRENT_USER}`);
    }

    initializeElements() {
        // Core interface elements
        this.elements = {
            loginSection: document.getElementById('login-section'),
            adminPanel: document.getElementById('admin-panel'),
            loginForm: document.getElementById('login-form'),
            sidebar: document.querySelector('.sidebar'),
            menuToggle: document.getElementById('menuToggle'),
            navItems: document.querySelectorAll('.nav-menu li'),
            sections: document.querySelectorAll('.content-section'),
            toastContainer: document.getElementById('toast-container'),
            neuralParticles: document.querySelector('.neural-particles'),
            statusIndicator: document.querySelector('.status-indicator'),
            timeDisplays: document.querySelectorAll('.neural-time')
        };

        // Section-specific elements
        this.sectionElements = {
            social: {
                container: document.getElementById('social-links-container'),
                addButton: document.querySelector('[data-section="social"] .add-btn')
            },
            tech: {
                container: document.getElementById('tech-section'),
                specCards: document.querySelectorAll('.tech-card')
            },
            shoutouts: {
                container: document.getElementById('shoutouts-container'),
                platformTabs: document.querySelector('.platform-tabs')
            },
            hours: {
                container: document.getElementById('hours-container'),
                scheduleForm: document.getElementById('schedule-form')
            },
            settings: {
                themeSelect: document.getElementById('theme-select'),
                statusSelect: document.getElementById('status-select'),
                maintenanceToggle: document.getElementById('maintenance-toggle')
            }
        };
    }

    setupEventListeners() {
        // Authentication events
        this.elements.loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('logout-btn')?.addEventListener('click', () => {
            this.handleLogout();
        });

        // Navigation events
        this.elements.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Mobile menu toggle
        this.elements.menuToggle?.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Settings events
        this.sectionElements.settings.themeSelect?.addEventListener('change', (e) => {
            this.handleThemeChange(e.target.value);
        });

        this.sectionElements.settings.statusSelect?.addEventListener('change', (e) => {
            this.handleStatusChange(e.target.value);
        });

        this.sectionElements.settings.maintenanceToggle?.addEventListener('change', (e) => {
            this.handleMaintenanceToggle(e.target.checked);
        });

        // Section-specific events
        this.setupSocialEvents();
        this.setupTechEvents();
        this.setupShoutoutEvents();
        this.setupScheduleEvents();

        // Global click handler for closing mobile sidebar
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !e.target.closest('.sidebar') && 
                !e.target.closest('.neural-menu-toggle')) {
                this.elements.sidebar?.classList.remove('active');
            }
        });
    }

    setupSocialEvents() {
        this.sectionElements.social.addButton?.addEventListener('click', () => {
            this.showSocialLinkModal();
        });

        // Platform card handlers
        Object.keys(this.data.socialLinks).forEach(platform => {
            const card = document.querySelector(`[data-platform="${platform}"]`);
            card?.addEventListener('click', () => {
                this.editSocialLink(platform);
            });
        });
    }

    setupTechEvents() {
        this.sectionElements.tech.specCards.forEach(card => {
            card.addEventListener('click', () => {
                const device = card.getAttribute('data-device');
                this.showTechSpecs(device);
            });
        });
    }

    setupShoutoutEvents() {
        // Platform tab switching
        const tabs = this.sectionElements.shoutouts.platformTabs?.querySelectorAll('.platform-tab');
        tabs?.forEach(tab => {
            tab.addEventListener('click', () => {
                const platform = tab.getAttribute('data-platform');
                this.switchPlatform(platform);
            });
        });
    }

    setupScheduleEvents() {
        this.sectionElements.hours.scheduleForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSchedule();
        });
    }

    // Navigation and Section Management
    navigateToSection(section) {
        // Update active states
        this.elements.navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-section') === section);
        });

        // Show selected section
        this.elements.sections.forEach(s => {
            s.style.display = s.id === `${section}-section` ? 'block' : 'none';
        });

        // Load section data
        this.loadSectionData(section);

        // Handle mobile navigation
        if (window.innerWidth <= 768) {
            this.toggleSidebar();
        }
    }

    loadSectionData(section) {
        switch(section) {
            case 'dashboard':
                this.updateDashboardStats();
                break;
            case 'social':
                this.renderSocialLinks();
                break;
            case 'tech':
                this.renderTechSpecs();
                break;
            case 'shoutouts':
                this.loadCreatorShoutouts();
                break;
            case 'hours':
                this.renderSchedule();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }
    }

 // Authentication and Security
    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Show neural connection animation
        this.showNeuralConnecting();

        try {
            // Simulated neural authentication check
            if (username === NEURAL_CONFIG.CURRENT_USER && password === 'admin123') {
                await this.simulateNeuralSync();
                localStorage.setItem('neural_auth', JSON.stringify({
                    timestamp: '2025-03-26 16:01:49',
                    user: NEURAL_CONFIG.CURRENT_USER,
                    session: this.generateSessionId()
                }));
                
                this.showAdminPanel();
                this.showToast('Neural link established', 'success');
                this.initializeRealTimeUpdates();
            } else {
                throw new Error('Neural authentication failed');
            }
        } catch (error) {
            this.showToast('Neural link failed: Invalid credentials', 'error');
            console.error('Authentication error:', error);
        }
    }

    async handleLogout() {
        try {
            this.showToast('Terminating neural connection...', 'info');
            await this.simulateNeuralDisconnect();
            
            localStorage.removeItem('neural_auth');
            this.hideAdminPanel();
            this.showToast('Neural link terminated successfully', 'success');
        } catch (error) {
            this.showToast('Error terminating neural link', 'error');
            console.error('Logout error:', error);
        }
    }

    // UI Management
    showAdminPanel() {
        this.elements.loginSection.style.display = 'none';
        this.elements.adminPanel.style.display = 'grid';
        this.navigateToSection('dashboard');
        this.startNeuralEffects();
    }

    hideAdminPanel() {
        this.elements.loginSection.style.display = 'flex';
        this.elements.adminPanel.style.display = 'none';
        this.stopNeuralEffects();
    }

    toggleSidebar() {
        this.elements.sidebar?.classList.toggle('active');
    }

    // Neural Effects
    initializeNeuralEffects() {
        this.initializeParticles();
        this.initializeHologramEffects();
        this.initializePulseEffects();
    }

    initializeParticles() {
        if (!this.elements.neuralParticles) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'neural-particle';
            particle.style.setProperty('--delay', `${Math.random() * 5}s`);
            particle.style.setProperty('--size', `${Math.random() * 3 + 1}px`);
            this.elements.neuralParticles.appendChild(particle);
        }
    }

    initializeHologramEffects() {
        const holoElements = document.querySelectorAll('.hologram-effect');
        holoElements.forEach(element => {
            element.innerHTML += '<div class="holo-scanline"></div>';
            element.innerHTML += '<div class="holo-glow"></div>';
        });
    }

    // Real-time Updates
    startSystemClock() {
        setInterval(() => {
            const now = new Date();
            const timeString = now.toISOString().replace('T', ' ').split('.')[0];
            this.elements.timeDisplays.forEach(display => {
                display.textContent = timeString;
            });
        }, 1000);
    }

    // Section Renderers
    renderSocialLinks() {
        const container = this.sectionElements.social.container;
        if (!container) return;

        container.innerHTML = Object.entries(this.data.socialLinks)
            .map(([platform, data]) => `
                <div class="neural-card social-card" data-platform="${platform}">
                    <div class="card-icon">
                        <i class="${data.icon}"></i>
                    </div>
                    <div class="card-content">
                        <h3>${data.label}</h3>
                        <p class="username">@${this.extractUsername(data.url)}</p>
                    </div>
                    <div class="card-actions">
                        <button class="neural-btn" onclick="window.open('${data.url}', '_blank')">
                            <i class="fas fa-external-link-alt"></i>
                        </button>
                        <button class="neural-btn edit" onclick="neuralInterface.editSocialLink('${platform}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            `).join('');
    }

    renderTechSpecs() {
        const container = this.sectionElements.tech.container;
        if (!container) return;

        const techGrid = document.createElement('div');
        techGrid.className = 'tech-grid';

        Object.entries(this.data.techSpecs).forEach(([device, specs]) => {
            const card = this.createTechCard(device, specs);
            techGrid.appendChild(card);
        });

        container.querySelector('.tech-grid')?.replaceWith(techGrid);
    }

    createTechCard(device, specs) {
        const card = document.createElement('div');
        card.className = 'neural-card tech-card';
        card.setAttribute('data-device', device);

        card.innerHTML = `
            <div class="tech-icon">
                <i class="fas fa-${this.getTechIcon(device)}"></i>
            </div>
            <div class="tech-info">
                <h3>${specs.model}</h3>
                <div class="tech-specs">
                    <span><i class="fas fa-microchip"></i> ${specs.storage}</span>
                    ${specs.batteryCapacity ? `<span><i class="fas fa-battery-full"></i> ${specs.batteryCapacity}</span>` : ''}
                    <span><i class="fas fa-clock"></i> ${specs.purchaseDate}</span>
                </div>
                <div class="tech-status">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${specs.batteryHealth || 100}%"></div>
                    </div>
                    <span>${specs.batteryHealth ? `${specs.batteryHealth}% Health` : 'System Optimal'}</span>
                </div>
            </div>
        `;

        return card;
    }

    // Schedule Management
    renderSchedule() {
        const container = this.sectionElements.hours.container;
        if (!container) return;

        container.innerHTML = `
            <div class="schedule-grid">
                ${Object.entries(this.data.schedule).map(([day, hours]) => `
                    <div class="schedule-card neural-card ${hours.closed ? 'closed' : ''}">
                        <div class="day-header">
                            <h3>${this.capitalizeFirst(day)}</h3>
                            <label class="neural-switch">
                                <input type="checkbox" 
                                    ${!hours.closed ? 'checked' : ''} 
                                    onchange="neuralInterface.toggleDay('${day}')">
                                <span class="switch-slider"></span>
                            </label>
                        </div>
                        <div class="hours-container">
                            <div class="time-input">
                                <label>Open</label>
                                <input type="time" 
                                    value="${hours.open}" 
                                    onchange="neuralInterface.updateHours('${day}', 'open', this.value)"
                                    ${hours.closed ? 'disabled' : ''}>
                            </div>
                            <div class="time-input">
                                <label>Close</label>
                                <input type="time" 
                                    value="${hours.close}" 
                                    onchange="neuralInterface.updateHours('${day}', 'close', this.value)"
                                    ${hours.closed ? 'disabled' : ''}>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="schedule-actions">
                <button class="neural-button" onclick="neuralInterface.saveSchedule()">
                    <i class="fas fa-save"></i> Update Schedule
                </button>
            </div>
        `;
    }

    toggleDay(day) {
        this.data.schedule[day].closed = !this.data.schedule[day].closed;
        this.renderSchedule();
        this.showToast(`${this.capitalizeFirst(day)} ${this.data.schedule[day].closed ? 'closed' : 'opened'}`, 'info');
    }

    updateHours(day, type, value) {
        this.data.schedule[day][type] = value;
    }

    async saveSchedule() {
        try {
            await this.data.save();
            this.showToast('Schedule updated successfully', 'success');
        } catch (error) {
            this.showToast('Failed to update schedule', 'error');
            console.error('Schedule update error:', error);
        }
    }

    // Creator Shoutouts System
    loadCreatorShoutouts() {
        const container = this.sectionElements.shoutouts.container;
        if (!container) return;

        // First, render platform tabs
        this.renderPlatformTabs();
        
        // Then load default platform (TikTok)
        this.switchPlatform('tiktok');
    }

    renderPlatformTabs() {
        const tabsContainer = this.sectionElements.shoutouts.platformTabs;
        if (!tabsContainer) return;

        tabsContainer.innerHTML = Object.entries(this.data.socialLinks)
            .map(([platform, data]) => `
                <div class="platform-tab ${platform === 'tiktok' ? 'active' : ''}" 
                    data-platform="${platform}">
                    <i class="${data.icon}"></i>
                    <span>${data.label}</span>
                </div>
            `).join('');
    }

    switchPlatform(platform) {
        // Update active tab
        document.querySelectorAll('.platform-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.platform === platform);
        });

        // Load platform-specific creators
        this.loadPlatformCreators(platform);
    }

    loadPlatformCreators(platform) {
        const container = this.sectionElements.shoutouts.container;
        if (!container) return;

        // Clear current content with neural effect
        container.style.opacity = '0';
        setTimeout(() => {
            container.innerHTML = `
                <div class="creators-grid">
                    <div class="neural-card add-creator">
                        <div class="add-icon">
                            <i class="fas fa-plus"></i>
                        </div>
                        <h3>Add Creator</h3>
                    </div>
                </div>
            `;
            container.style.opacity = '1';
        }, 300);
    }

    // Toast Notification System
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `neural-toast ${type}`;
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
            </div>
            <div class="toast-content">
                <p>${message}</p>
            </div>
            <div class="toast-progress"></div>
        `;

        this.elements.toastContainer.appendChild(toast);

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

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Neural Animation Effects
    startNeuralEffects() {
        this.pulseEffect = setInterval(() => {
            document.querySelectorAll('.neural-pulse').forEach(element => {
                element.classList.add('pulse');
                setTimeout(() => element.classList.remove('pulse'), 1000);
            });
        }, 2000);

        this.scanlineEffect = setInterval(() => {
            document.querySelectorAll('.hologram-effect').forEach(element => {
                element.classList.add('scan');
                setTimeout(() => element.classList.remove('scan'), 1500);
            });
        }, 3000);
    }

    stopNeuralEffects() {
        clearInterval(this.pulseEffect);
        clearInterval(this.scanlineEffect);
    }

    // Utility Methods
    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    extractUsername(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.pathname.split('/').filter(Boolean).pop();
        } catch {
            return url;
        }
    }

    generateSessionId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    getTechIcon(device) {
        const icons = {
            iphone: 'mobile-alt',
            watch: 'clock',
            mac: 'laptop'
        };
        return icons[device] || 'microchip';
    }

// Real-time Updates System
    initializeRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
            this.updateSystemTime();
            this.checkSystemStatus();
            this.updateNeuralMetrics();
        }, 1000);
    }

    updateSystemTime() {
        const now = new Date();
        const timeString = now.toISOString().replace('T', ' ').split('.')[0];
        this.elements.timeDisplays.forEach(display => {
            display.textContent = timeString;
        });
    }

    checkSystemStatus() {
        const status = this.data.settings.status;
        this.elements.statusIndicator?.classList.forEach(className => {
            if (['online', 'away', 'busy', 'offline'].includes(className)) {
                this.elements.statusIndicator.classList.remove(className);
            }
        });
        this.elements.statusIndicator?.classList.add(status);
    }

    updateNeuralMetrics() {
        // Update random metrics for visual effect
        document.querySelectorAll('.neural-metric').forEach(metric => {
            const value = Math.floor(Math.random() * 100);
            metric.style.setProperty('--value', `${value}%`);
        });
    }

    // Neural Sync Simulation
    async simulateNeuralSync() {
        return new Promise((resolve) => {
            const steps = [
                'Initializing neural interface...',
                'Establishing quantum connection...',
                'Synchronizing neural patterns...',
                'Validating bio-signatures...',
                'Neural link established.'
            ];

            let currentStep = 0;
            const interval = setInterval(() => {
                if (currentStep < steps.length) {
                    this.showToast(steps[currentStep], 'info', 1000);
                    currentStep++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, 800);
        });
    }

    async simulateNeuralDisconnect() {
        return new Promise((resolve) => {
            const steps = [
                'Initiating neural disconnect...',
                'Saving quantum state...',
                'Clearing neural cache...',
                'Terminating connection...'
            ];

            let currentStep = 0;
            const interval = setInterval(() => {
                if (currentStep < steps.length) {
                    this.showToast(steps[currentStep], 'info', 1000);
                    currentStep++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, 600);
        });
    }

    // Error Handling and Recovery
    handleError(error, context) {
        console.error(`Neural Interface Error (${context}):`, error);

        const errorMessages = {
            auth: 'Neural authentication failure',
            sync: 'Neural synchronization error',
            data: 'Data corruption detected',
            connection: 'Neural link disrupted'
        };

        this.showToast(errorMessages[context] || 'System error detected', 'error');

        if (context === 'auth' || context === 'connection') {
            setTimeout(() => this.handleLogout(), 2000);
        }
    }

    async recoverFromError() {
        try {
            await this.data.initialize();
            this.showToast('Neural system recovered', 'success');
            return true;
        } catch (error) {
            this.handleError(error, 'recovery');
            return false;
        }
    }

    // Debug Mode Functions
    toggleDebugMode() {
        NEURAL_CONFIG.DEBUG_MODE = !NEURAL_CONFIG.DEBUG_MODE;
        document.body.classList.toggle('debug-mode', NEURAL_CONFIG.DEBUG_MODE);
        
        if (NEURAL_CONFIG.DEBUG_MODE) {
            this.initializeDebugTools();
        } else {
            this.removeDebugTools();
        }
    }

    initializeDebugTools() {
        const debugPanel = document.createElement('div');
        debugPanel.className = 'debug-panel neural-card';
        debugPanel.innerHTML = `
            <h3>Neural Debug Console</h3>
            <div class="debug-metrics">
                <p>Session ID: ${this.generateSessionId()}</p>
                <p>Last Sync: ${new Date().toISOString()}</p>
                <p>Memory Usage: ${this.getMemoryUsage()}</p>
            </div>
            <div class="debug-actions">
                <button onclick="neuralInterface.forceSyncData()">Force Sync</button>
                <button onclick="neuralInterface.clearNeuralCache()">Clear Cache</button>
            </div>
        `;
        document.body.appendChild(debugPanel);
    }

    removeDebugTools() {
        document.querySelector('.debug-panel')?.remove();
    }

    getMemoryUsage() {
        return `${(performance.memory?.usedJSHeapSize / 1048576).toFixed(2)} MB`;
    }
}

// Initialize the Neural Interface
const neuralInterface = new NeuralInterface();

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await neuralInterface.initialize();
        console.log(`Neural Interface v${NEURAL_CONFIG.VERSION} initialized for ${NEURAL_CONFIG.CURRENT_USER}`);
    } catch (error) {
        console.error('Neural Interface initialization failed:', error);
    }
});

// Handle service worker for PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/neural-sw.js').then(registration => {
            console.log('Neural ServiceWorker registered:', registration);
        }).catch(error => {
            console.error('Neural ServiceWorker registration failed:', error);
        });
    });
}

// Export for module support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NeuralInterface, NEURAL_CONFIG };
}
