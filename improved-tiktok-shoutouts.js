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
  lastUpdatedTime: '2025-03-17 15:28:36',
  cacheDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds

  get regionAvailability() {
    return regionConfiguration.regions;
  },

  async getUserRegion() {
    const cachedRegion = this.getCachedRegion();
    if (cachedRegion) return cachedRegion;

    try {
      // Method 1: Navigator Language
      let region = navigator.language.split('-')[1] || navigator.language;

      // Method 2: Intl.DateTimeFormat
      if (!region) {
        region = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[1];
      }

      // Method 3: Timezone fallback
      if (!region) {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        region = this.getRegionFromTimezone(timezone);
      }

      region = region?.toUpperCase() || 'US';
      this.cacheRegion(region);
      return region;
    } catch (error) {
      console.warn('Error detecting region:', error);
      return 'US';
    }
  },

  getCachedRegion() {
    const cachedRegion = localStorage.getItem('userRegion');
    const cachedTime = localStorage.getItem('userRegionTime');
    const currentTime = Date.now();

    if (cachedRegion && cachedTime && (currentTime - Number(cachedTime) < this.cacheDuration)) {
      return cachedRegion;
    }
    return null;
  },

  cacheRegion(region) {
    localStorage.setItem('userRegion', region);
    localStorage.setItem('userRegionTime', Date.now().toString());
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
      if (timezone.startsWith(prefix)) {
        return region;
      }
    }
    return 'US';
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
          <a href="https://tiktok.com/@${account.username}" target="_blank" class="visit-profile">Visit Profile</a>
        </div>
      `;
      container.appendChild(card);
    });
  },

  setLastUpdatedTime() {
    const lastUpdatedElement = document.getElementById('tiktok-last-updated-timestamp');
    if (!lastUpdatedElement) return;

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const lastUpdatedDate = new Date(this.lastUpdatedTime).toLocaleString('en-US', {
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
    lastUpdatedElement.textContent = `Last Updated: ${lastUpdatedDate}`;
  },

  showUnavailableMessage(region) {
    const messageContainer = document.querySelector('.unavailable-message');
    if (!messageContainer) return;
    
    messageContainer.innerHTML = `
      <div class="unavailable-message-title">System Message</div>
      <p>Sorry, this section isn't available in ${region}. Sorry for the inconvenience we have caused.</p>
    `;
    messageContainer.style.display = 'block';
  },

  init() {
    this.getUserRegion().then(userRegion => {
      if (this.regionAvailability[userRegion]) {
        this.createShoutoutCards();
        this.setLastUpdatedTime();
      } else {
        this.showUnavailableMessage(userRegion);
      }
    }).catch(error => {
      console.error('Error fetching user region:', error);
    });
  }
};

// Initialize TikTok shoutouts
document.addEventListener('DOMContentLoaded', () => {
  tiktokShoutouts.init();
});
