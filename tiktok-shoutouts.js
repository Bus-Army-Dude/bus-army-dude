// Last Updated: March 17, 2025 4:22:10 PM

const tiktokShoutouts = {
  accounts: [
    { username: 'mrbeast', isVerified: true, followers: '115.1M', nickname: 'MrBeast', bio: 'New CEO of Tiktok?', profilePic: 'images/mrbeast.jpeg' },
    { username: 'teamtrump', isVerified: true, followers: '9M', nickname: 'Team Trump', bio: 'The official TikTok page for the Trump Campaign', profilePic: 'images/teamtrump.jpeg' },
    { username: 'carterpcs', isVerified: true, followers: '5.7M', nickname: 'Carterpcs', bio: 'Making Tech Less Of A Snoozefest, LA', profilePic: 'images/carterpcs.jpeg' },
    { username: 'applesauceandadhd', isVerified: true, followers: '4.2M', nickname: 'Jess|Aggressive Tutorials', bio: 'Surviving Not Thriving, TeamJessSecrest@Gersh.com', profilePic: 'images/applesauceandadhd.jpeg' },
    { username: 'tatechtips', isVerified: true, followers: '3.3M', nickname: 'TA TECH TIPS', bio: '🔥 Tech Tips from Nick B 🔥, Enquiries: 📧 hello@TheGoldStudios.com', profilePic: 'images/tatechtips.jpeg' },
    { username: 'imparkerburton', isVerified: false, followers: '3M', nickname: 'Parker Burton', bio: 'That Android Guy, Business: parker@imparkerburton.com', profilePic: 'images/imparkerburton.jpeg' },
    { username: 'kennedylawfirm', isVerified: false, followers: '1.9M', nickname: 'Lawyer Kevin Kennedy', bio: "The Kennedy Law Firm, PLLC, Clarksville, TN, Kev's got you covered™️", profilePic: 'images/kennedylawfirm.jpeg' },
    { username: 'badge502', isVerified: false, followers: '829K', nickname: 'Badge502', bio: 'NREMT - 911/EMD PO Box 775 Belleville, NJ 07109 *I DONT HAVE A BACKUP ACCOUNT*', profilePic: 'images/badge502.jpeg' },
    { username: 'mrfatcheeto', isVerified: false, followers: '758.6K', nickname: 'Mr Fat Cheeto', bio: 'OH YEAH!', profilePic: 'images/mrfatcheeto.jpeg' },
    { username: 'meetmeinthemediacenter', isVerified: true, followers: '705.9K', nickname: 'Meet Me In The Media Center', bio: '✌🏻❤️&ToastyBooks, 📚Middle School Librarian, 💌 meetmeinthemediacenter@gmail.com', profilePic: 'images/meetmeinthemediacenter.jpeg' },
    { username: 'kaylee_mertens_', isVerified: false, followers: '677K', nickname: 'Kaylee Mertens|Dancing Baby', bio: 'Just a mom who loves her baby boy 💙,📍Wisconsin, KayleeMertens.collabs@gmail.com', profilePic: 'images/kayleemertens.jpeg' },
    { username: 'trafficlightdoctor', isVerified: false, followers: '386K', nickname: '🚦 Traffic Light Doctor 🚦', bio: '🚦Traffic Signal Tech🚦 Traffic Lights, Family, Food, and Comedy!, Mississippi', profilePic: 'images/trafficlightdoctor.jpeg' },
    { username: 'aggressiveafterdark', isVerified: false, followers: '362.9K', nickname: 'ApplesauceandADHD_AfterDark', bio: "Shhhhhhh. It's a secret@Jess|Aggressive Tutorials Official Back-Up", profilePic: 'images/aggressiveafterdark.jpeg' },
    { username: 'captainsteeeve', isVerified: false, followers: '325.1K', nickname: 'CaptainSteeve', bio: "See all my links!  I'm Captain Steeeve Fly Safe!, linktr.ee/Captainsteeeve", profilePic: 'images/IMG_2371.jpeg' },
    { username: 'rachel_hughes', isVerified: false, followers: '323.8K', nickname: 'Rachel Hughes', bio: 'houseofhughes@thestation.io, Cerebral Palsy Mama, 20% OFF BUCKED UP: RACHELHUGHES', profilePic: 'images/rachel_hughes.jpeg' },
    { username: 'badge5022', isVerified: false, followers: '23.8K', nickname: 'Badge502', bio: 'Backup Account', profilePic: 'images/badge5022.jpeg' },
    { username: 'raisingramsey2023', isVerified: false, followers: '1,197', nickname: 'RaisingRamsey2023', bio: 'The Adventures of Raising Ramsey. Come along as we watch Ramsey Play and Learn', profilePic: 'images/raisingramsey2023.jpeg' },
    { username: 'jerridc4', isVerified: false, followers: '481', nickname: 'Jerrid Cook', bio: '@raisingramsey2023, @benz.the beard', profilePic: 'images/jerridc4.jpeg' },
    { username: 'jerridonthelot', isVerified: false, followers: '287', nickname: 'Jerrid on the Lot', bio: 'Your friendly neighborhood Car Salesman and Boy Dad', profilePic: 'images/jerridonthelot.jpeg' },
    { username: 'officalbusarmydude', isVerified: false, followers: '52', nickname: 'Bus Army Dude', bio: 'https://bus-army-dude.github.io/bus-army-dude/index.html', profilePic: 'images/busarmydude.jpg' }
  ],
  lastUpdatedTime: 'March 17, 2025 4:22:10 PM',

  async init() {
    try {
      // First ensure region configuration is loaded
      if (typeof regionConfiguration === 'undefined') {
        console.error('Region configuration not loaded');
        return;
      }

      // Get user's region
      const userRegion = await this.getUserRegion();
      console.log('Detected Region:', userRegion);

      // Update timestamp first
      this.setLastUpdatedTime();

      // Get necessary DOM elements
      const gridContainer = document.querySelector('.creator-grid');
      const messageContainer = document.querySelector('.unavailable-message');

      if (!gridContainer || !messageContainer) {
        console.error('Required DOM elements not found');
        return;
      }

      // Check region availability
      const isRegionAvailable = regionConfiguration.regions[userRegion];
      console.log('Region Available:', isRegionAvailable);

      // Update debug panel
      this.updateDebugPanel(userRegion, isRegionAvailable);

      if (isRegionAvailable) {
        // Show content for available region
        gridContainer.style.display = 'grid';
        messageContainer.style.display = 'none';
        this.createShoutoutCards();
      } else {
        // Show unavailable message for restricted region
        gridContainer.style.display = 'none';
        this.showUnavailableMessage(userRegion);
      }
    } catch (error) {
      console.error('Error in TikTok shoutouts initialization:', error);
      this.showUnavailableMessage('Unknown');
    }
  },

  async getUserRegion() {
    try {
      // Try to get cached region first
      const cachedRegion = this.getCachedRegion();
      if (cachedRegion) return cachedRegion;

      // Method 1: Navigator Language
      let region = navigator.language?.split('-')[1]?.toUpperCase();

      // Method 2: Intl API
      if (!region && 'Intl' in window) {
        try {
          region = new Intl.DateTimeFormat().resolvedOptions().locale.split('-')[1]?.toUpperCase();
        } catch (e) {
          console.warn('Intl API detection failed:', e);
        }
      }

      // Method 3: Timezone-based detection
      if (!region) {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        region = this.getRegionFromTimezone(timezone);
      }

      // Fallback to US if no region detected
      region = region || 'US';

      // Cache the detected region
      this.cacheRegion(region);
      return region;
    } catch (error) {
      console.error('Error detecting region:', error);
      return 'US';
    }
  },

  getRegionFromTimezone(timezone) {
    const timezoneMap = {
      'America/': 'US',
      'Europe/': 'GB',
      'Asia/': 'JP',
      'Australia/': 'AU',
      'Pacific/': 'NZ',
      'Africa/': 'ZA',
      'Indian/': 'IN',
      'Atlantic/': 'GB'
    };

    for (const [prefix, region] of Object.entries(timezoneMap)) {
      if (timezone.startsWith(prefix)) return region;
    }
    return 'US';
  },

  getCachedRegion() {
    try {
      const cachedRegion = localStorage.getItem('userRegion');
      const cachedTime = localStorage.getItem('userRegionTime');
      
      if (cachedRegion && cachedTime) {
        const cacheAge = Date.now() - Number(cachedTime);
        if (cacheAge < 24 * 60 * 60 * 1000) { // 24 hours
          return cachedRegion;
        }
      }
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
    }
    return null;
  },

  cacheRegion(region) {
    try {
      localStorage.setItem('userRegion', region);
      localStorage.setItem('userRegionTime', Date.now().toString());
    } catch (error) {
      console.warn('Error saving to localStorage:', error);
    }
  },

  createShoutoutCards() {
    const container = document.querySelector('.creator-grid');
    if (!container) return;

    container.innerHTML = '';
    this.accounts.forEach(account => {
      const card = document.createElement('div');
      card.className = 'creator-card';
      card.innerHTML = `
        <img src="${account.profilePic}" alt="@${account.username}" class="creator-pic" onerror="this.src='images/default-profile.jpg'">
        <div class="creator-info">
          <div class="creator-header">
            <h3>${account.nickname} ${account.isVerified ? '<img src="check.png" alt="Verified" class="verified-badge">' : ''}</h3>
          </div>
          <p class="creator-username">@${account.username}</p>
          <p class="creator-bio">${account.bio || ''}</p>
          <p class="follower-count">${account.followers} Followers</p>
          <a href="https://tiktok.com/@${account.username}" target="_blank" rel="noopener noreferrer" class="visit-profile">Visit Profile</a>
        </div>
      `;
      container.appendChild(card);
    });
  },

  setLastUpdatedTime() {
    const lastUpdatedElement = document.getElementById('tiktok-last-updated-timestamp');
    if (!lastUpdatedElement) return;

    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const lastUpdatedDate = new Date(this.lastUpdatedTime);
      
      const formattedDate = lastUpdatedDate.toLocaleString('en-US', {
        timeZone: userTimeZone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      });

      lastUpdatedElement.textContent = `Last Updated: ${formattedDate}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      lastUpdatedElement.textContent = `Last Updated: ${this.lastUpdatedTime}`;
    }
  },

  showUnavailableMessage(region) {
    const messageContainer = document.querySelector('.unavailable-message');
    if (!messageContainer) return;

    messageContainer.innerHTML = `
      <div class="unavailable-message-title">Content Not Available</div>
      <p>This content is not available in your region (${region}). 
      We apologize for any inconvenience.</p>
    `;
    messageContainer.style.display = 'block';
  },

  updateDebugPanel(region, isAvailable) {
    const debugPanel = document.getElementById('region-debug');
    if (!debugPanel) return;

    // Update region
    const regionSpan = document.getElementById('current-region');
    if (regionSpan) {
        regionSpan.textContent = region || 'Unknown';
    }

    // Update status with appropriate class for color
    const statusSpan = document.getElementById('region-status');
    if (statusSpan) {
        statusSpan.textContent = isAvailable ? 'Available' : 'Restricted';
        statusSpan.className = isAvailable ? 'available' : 'unavailable';
    }

    // Update debug time in 12-hour format
    const timeSpan = document.getElementById('debug-time');
    if (timeSpan) {
        const now = new Date();
        const formattedTime = now.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
        timeSpan.textContent = formattedTime;
    }

    // Show the debug panel
    debugPanel.style.display = 'block';
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure region-config.js is loaded
  setTimeout(() => tiktokShoutouts.init(), 100);
});
