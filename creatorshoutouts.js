// TikTok Shoutouts
const tiktokShoutouts = {
    accounts: [
        { username: 'mrbeast', isVerified: true, followers: '115.1M', nickname: 'MrBeast', bio: 'New CEO of Tiktok?', profilePic: 'images/mrbeast.jpeg' },
        { username: 'teamtrump', isVerified: true, followers: '9M', nickname: 'Team Trump', bio: 'The official TikTok page for the Trump Campaign', profilePic: 'images/teamtrump.jpeg' },
        { username: 'carterpcs', isVerified: true, followers: '5.7M', nickname: 'Carterpcs', bio: 'Making Tech Less Of A Snoozefest, LA', profilePic: 'images/carterpcs.jpeg' },
        { username: 'applesauceandadhd', isVerified: true, followers: '4.1M', nickname: 'Jess|Aggressive Tutorials', bio: 'Surviving Not Thriving, TeamJessSecrest@Gersh.com', profilePic: 'images/applesauceandadhd.jpeg' },
        { username: 'tatechtips', isVerified: true, followers: '3.3M', nickname: 'TA TECH TIPS', bio: '🔥 Tech Tips from Nick B 🔥, Enquiries: 📧 hello@TheGoldStudios.com', profilePic: 'images/tatechtips.jpeg' },
        { username: 'imparkerburton', isVerified: false, followers: '3M', nickname: 'Parker Burton', bio: 'That Android Guy, Business: parker@imparkerburton.com', profilePic: 'images/imparkerburton.jpeg' },
        { username: 'kennedylawfirm', isVerified: false, followers: '1.9M', nickname: 'Lawyer Kevin Kennedy', bio: "The Kennedy Law Firm, PLLC, Clarksville, TN, Kev's got you covered™️", profilePic: 'images/kennedylawfirm.jpeg' },
        { username: 'badge502', isVerified: false, followers: '828.2K', nickname: 'Badge502', bio: 'NREMT - 911/EMD PO Box 775 Belleville, NJ 07109 *I DONT HAVE A BACKUP ACCOUNT*', profilePic: 'images/badge502.jpeg' },
        { username: 'mrfatcheeto', isVerified: false, followers: '746.3K', nickname: 'Mr Fat Cheeto', bio: 'OH YEAH!', profilePic: 'images/mrfatcheeto.jpeg' },
        { username: 'meetmeinthemediacenter', isVerified: true, followers: '705.7K', nickname: 'Meet Me In The Media Center', bio: '✌🏻❤️&ToastyBooks, 📚Middle School Librarian, 💌 meetmeinthemediacenter@gmail.com', profilePic: 'images/meetmeinthemediacenter.jpeg' },
        { username: 'kaylee_mertens_', isVerified: false, followers: '675.1K', nickname: 'Kaylee Mertens|Dancing Baby', bio: 'Just a mom who loves her baby boy 💙,📍Wisconsin, KayleeMertens.collabs@gmail.com', profilePic: 'images/kayleemertens.jpeg' },
        { username: 'trafficlightdoctor', isVerified: false, followers: '386K', nickname: '🚦 Traffic Light Doctor 🚦', bio: '🚦Traffic Signal Tech🚦 Traffic Lights, Family, Food, and Comedy!, Mississippi', profilePic: 'images/trafficlightdoctor.jpeg' },
        { username: 'aggressiveafterdark', isVerified: false, followers: '362.7K', nickname: 'ApplesauceandADHD_AfterDark', bio: "Shhhhhhh. It's a secret@Jess|Aggressive Tutorials Official Back-Up", profilePic: 'images/aggressiveafterdark.jpeg' },
        { username: 'rachel_hughes', isVerified: false, followers: '322.2K', nickname: 'Rachel Hughes', bio: 'houseofhughes@thestation.io, Cerebral Palsy Mama, 20% OFF BUCKED UP: RACHELHUGHES', profilePic: 'images/rachel_hughes.jpeg' },        
        { username: 'captainsteeeve', isVerified: false, followers: '321.8K', nickname: 'CaptainSteeve', bio: "See all my links!  I'm Captain Steeeve Fly Safe!, linktr.ee/Captainsteeeve", profilePic: 'images/IMG_2371.jpeg' },
        { username: 'badge5022', isVerified: false, followers: '23.7K', nickname: 'Badge502', bio: 'Backup Account', profilePic: 'images/badge5022.jpeg' },
        { username: 'raisingramsey2023', isVerified: false, followers: '1,198', nickname: 'RaisingRamsey2023', bio: 'The Adventures of Raising Ramsey. Come along as we watch Ramsey Play and Learn', profilePic: 'images/raisingramsey2023.jpeg' },
        { username: 'jerridc4', isVerified: false, followers: '481', nickname: 'Jerrid Cook', bio: '@raisingramsey2023, @benz.the beard', profilePic: 'images/jerridc4.jpeg' },
        { username: 'jerridonthelot', isVerified: false, followers: '275', nickname: 'Jerrid on the Lot', bio: 'Your friendly neighborhood Car Salesman and Boy Dad', profilePic: 'images/jerridonthelot.jpeg' },
        { username: 'officalbusarmydude', isVerified: false, followers: '52', nickname: 'Bus Army Dude', bio: 'https://bus-army-dude.github.io/bus-army-dude/index.html', profilePic: 'images/busarmydude.jpg' },
        // Add more shoutouts here...
     ],
  lastUpdatedTime: '2025-03-13T09:21:57', // Manually set the last updated date and time
  regionAvailability: {
    AD: true, AE: true, AF: false, AG: true, AI: true, AL: true, AM: true, AO: true, AQ: true, AR: true, AS: true, AT: true, AU: true, AW: true, AX: true, AZ: true, 
    BA: true, BB: true, BD: true, BE: true, BF: true, BG: true, BH: true, BI: true, BJ: true, BL: true, BM: true, BN: true, BO: true, BQ: true, BR: true, BS: true, BT: true, BV: true, BW: true, BY: true, BZ: true, 
    CA: true, CC: true, CD: true, CF: true, CG: true, CH: true, CI: true, CK: true, CL: true, CM: true, CN: true, CO: true, CR: true, CU: true, CV: true, CW: true, CX: true, CY: true, CZ: true, 
    DE: true, DJ: true, DK: true, DM: true, DO: true, DZ: true, 
    EC: true, EE: true, EG: true, EH: true, ER: true, ES: true, ET: true, 
    FI: true, FJ: true, FK: true, FM: true, FO: true, FR: true, 
    GA: true, GB: true, GD: true, GE: true, GF: true, GG: true, GH: true, GI: true, GL: true, GM: true, GN: true, GP: true, GQ: true, GR: true, GT: true, GU: true, GW: true, GY: true, 
    HK: true, HM: true, HN: true, HR: true, HT: true, HU: true, 
    ID: true, IE: true, IL: true, IM: true, IN: false, IO: true, IQ: true, IR: false, IS: true, IT: true, 
    JE: true, JM: true, JO: true, JP: true, 
    KE: true, KG: false, KH: true, KI: true, KM: true, KN: true, KP: false, KR: true, KW: true, KY: true, KZ: true, 
    LA: true, LB: true, LC: true, LI: true, LK: true, LR: true, LS: true, LT: true, LU: true, LV: true, LY: true, 
    MA: true, MC: true, MD: true, ME: true, MF: true, MG: true, MH: true, MK: true, ML: true, MM: true, MN: true, MO: true, MP: true, MQ: true, MR: true, MS: true, MT: true, MU: true, MV: true, MW: true, MX: true, MY: true, MZ: true, 
    NA: true, NC: true, NE: true, NF: true, NG: true, NI: true, NL: true, NO: true, NP: false, NR: true, NU: true, NZ: true, 
    OM: true, 
    PA: true, PE: true, PF: true, PG: true, PH: true, PK: true, PL: true, PM: true, PN: true, PR: true, PT: true, PW: true, PY: true, 
    QA: true, 
    RE: true, RO: true, RS: true, RU: true, RW: true, 
    SA: true, SB: true, SC: true, SD: true, SE: true, SG: true, SH: true, SI: true, SJ: true, SK: true, SL: true, SM: true, SN: true, SO: false, SR: true, SS: true, ST: true, SV: true, SX: true, SY: true, SZ: true, 
    TC: true, TD: true, TF: true, TG: true, TH: true, TJ: true, TK: true, TL: true, TM: false, TN: true, TO: true, TR: true, TT: true, TV: true, TW: true, TZ: true, 
    UA: true, UG: true, UM: true, US: true, UY: true, UZ: false, 
    VA: true, VC: true, VE: true, VG: true, VI: true, VN: true, VU: true, 
    WF: true, WS: true, 
    YE: true, YT: true, 
    ZA: true, ZM: true, ZW: true
  },
  apiKey: '2378DCCDF7E3D95F025FE117FADA4B73', // Replace with your ipgeolocation.io API key
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
          <a href="https://tiktok.com/@${account.username}" target="_blank" class="visit-profile"> Visit Profile </a>
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
  async getUserRegion() {
  const cachedRegion = localStorage.getItem('userRegion');
  const cachedTime = localStorage.getItem('userRegionTime');
  const currentTime = Date.now();

  if (cachedRegion && cachedTime && (currentTime - cachedTime < this.cacheDuration)) {
    return cachedRegion;
  }

  try {
    const response = await fetch(`https://api.ip2location.io/?key=${this.apiKey}&format=json`);
    const data = await response.json();
    const region = data.country_code; // ip2location.io uses 'country_code' for the country code
    localStorage.setItem('userRegion', region);
    localStorage.setItem('userRegionTime', currentTime);
    return region;
  } catch (error) {
    console.error('Error fetching geolocation data:', error);
    return 'US'; // Default to 'US' if there's an error
  }
},
  showUnavailableMessage(region) {
    const messageContainer = document.querySelector('.unavailable-message');
    if (!messageContainer) return;
    messageContainer.innerHTML = `
      <div class="unavailable-message-title">System Message</div>
      <p>Sorry, this section isn't available in ${region}. Sorry for the inconvenience we have caused.</p>
    `;
    messageContainer.style.display = 'block';
  }
};

// Initialize the TikTok shoutouts
tiktokShoutouts.init();

const instagramShoutouts = {
  accounts: [
    { username: 'mrbeast', isVerified: true, followers: '66.6M', nickname: 'MrBeast', bio: 'My New Show Beast Games is out now on Prime Video!', profilePic: 'instagram_photos/mrbeast.jpg' },
    { username: 'applesauceandadhd', isVerified: true, followers: '821K', nickname: 'Jessica', bio: 'TeamJessSecrest@Gersh.com', profilePic: 'instagram_photos/applesauceandadhd.jpeg' },
    { username: 'emtbadge502', isVerified: true, followers: '527K', nickname: 'Anthony Christian', bio: 'P.O. Box 775, Belleville, NJ 07109, EMT - 911/ EMD - CPR Instructor - Content Creator, Work Hard. Be Kind Always.', profilePic: 'instagram_photos/emtbadge502.jpg' },
    { username: 'mrfattcheeto', isVerified: true, followers: '325K', nickname: 'Trent Parker', bio: "I'm like some HVAC Genius", profilePic: 'instagram_photos/mrfatcheeto.jpeg' },
    { username: 'trafficlightdoctor', isVerified: true, followers: '318K', nickname: 'TrafficLightDoctor', bio: 'Follow My YouTube And TikTok!!', profilePic: 'instagram_photos/trafficlightdoctor.jpeg' },
    { username: 'lisa.remillard', isVerified: true, followers: '120K', nickname: 'Lisa Remillard', bio: 'Public figure 📹 🎙Journalist, ▶️ Subcribe to my YouTube channel (@LisaRemillardOfficial)', profilePic: 'instagram_photos/lisaremillard.jpg' },
    { username: 'heyrachelhughes', isVerified: false, followers: '103K', nickname: 'Rachel Hughes', bio: 'Personal blog, YouTube + TikTok: Rachel_Hughes, ALL INQUIRIES: houseofhughes@thestation.io, 20% off Bucked Up: RACHELHUGHES', profilePic: 'instagram_photos/heyrachelhughes.jpg' },
    { username: 'meetmeinthemediacenter', isVerified: true, followers: '51.7K', nickname: 'Jen Miller', bio: '✌🏻❤️&Toasty📚 680K on TikTok ✨Book Return Game 🫶🏻Middle School Librarian', profilePic: 'instagram_photos/meetmeinthemediacenter.jpeg' },
    { username: 'kaylee_mertens_', isVerified: false, followers: '3,170', nickname: 'Kaylee Mertens', bio: 'Tik Tok: Kaylee_Mertens_', profilePic: 'instagram_photos/kayleemertens.jpeg' },
    { username: 'riverkritzar', isVerified: false, followers: '93', nickname: 'River Jordan Kritzar', bio: "Hello, my name is River, I am 20. I am autistic. I love technology.", profilePic: 'instagram_photos/riverkritzar.jpg' },
    { username: 'rose_the_fox24', isVerified: false, followers: '80', nickname: 'Rose Haydu', bio: 'I’m 19, Drp/rp open, I’m taken by the love of my life @_jano_142_ 💜3/1/24💜', profilePic: 'instagram_photos/rosethefox24.jpg' },
    { username: '_jano_142_', isVerified: false, followers: '50', nickname: 'Nathan Haydu', bio: 'Cars are love, cars are life. Taken by @rose_the_fox24 ❤️(3/1/24)❤️#bncr33gtr:Best Skyline/🔰Dream car🚗#c7zr1:Last TRUE Vette/🇺🇸Dream car🏎', profilePic: 'instagram_photos/jano142.jpg' },
    { username: 'busarmydude', isVerified: false, followers: '21', nickname: 'Bus Army Dude', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology.', profilePic: 'instagram_photos/busarmydude.jpg' },
    { username: 'miss_foxy_ghost_wife', isVerified: false, followers: '5', nickname: 'Foxy', bio: 'hey yo im Miss Foxy! i turn 20 in about two months im very friendly i dint bite hard~ dont be shy come say Hey to your friendly neighborhood Fox 😘', profilePic: 'instagram_photos/missfoxyghostwife.jpg' },
    // Add more Instagram creators as needed
  ],
  regionAvailability: {
    AD: true, AE: true, AF: false, AG: true, AI: true, AL: true, AM: true, AO: true, AQ: true, AR: true, AS: true, AT: true, AU: true, AW: true, AX: true, AZ: true, 
    BA: true, BB: true, BD: true, BE: true, BF: true, BG: true, BH: true, BI: true, BJ: true, BL: true, BM: true, BN: true, BO: true, BQ: true, BR: true, BS: true, BT: true, BV: true, BW: true, BY: true, BZ: true, 
    CA: true, CC: true, CD: true, CF: true, CG: true, CH: true, CI: true, CK: true, CL: true, CM: true, CN: true, CO: true, CR: true, CU: true, CV: true, CW: true, CX: true, CY: true, CZ: true, 
    DE: true, DJ: true, DK: true, DM: true, DO: true, DZ: true, 
    EC: true, EE: true, EG: true, EH: true, ER: true, ES: true, ET: true, 
    FI: true, FJ: true, FK: true, FM: true, FO: true, FR: true, 
    GA: true, GB: true, GD: true, GE: true, GF: true, GG: true, GH: true, GI: true, GL: true, GM: true, GN: true, GP: true, GQ: true, GR: true, GT: true, GU: true, GW: true, GY: true, 
    HK: true, HM: true, HN: true, HR: true, HT: true, HU: true, 
    ID: true, IE: true, IL: true, IM: true, IN: false, IO: true, IQ: true, IR: false, IS: true, IT: true, 
    JE: true, JM: true, JO: true, JP: true, 
    KE: true, KG: false, KH: true, KI: true, KM: true, KN: true, KP: false, KR: true, KW: true, KY: true, KZ: true, 
    LA: true, LB: true, LC: true, LI: true, LK: true, LR: true, LS: true, LT: true, LU: true, LV: true, LY: true, 
    MA: true, MC: true, MD: true, ME: true, MF: true, MG: true, MH: true, MK: true, ML: true, MM: true, MN: true, MO: true, MP: true, MQ: true, MR: true, MS: true, MT: true, MU: true, MV: true, MW: true, MX: true, MY: true, MZ: true, 
    NA: true, NC: true, NE: true, NF: true, NG: true, NI: true, NL: true, NO: true, NP: false, NR: true, NU: true, NZ: true, 
    OM: true, 
    PA: true, PE: true, PF: true, PG: true, PH: true, PK: true, PL: true, PM: true, PN: true, PR: true, PT: true, PW: true, PY: true, 
    QA: true, 
    RE: true, RO: true, RS: true, RU: true, RW: true, 
    SA: true, SB: true, SC: true, SD: true, SE: true, SG: true, SH: true, SI: true, SJ: true, SK: true, SL: true, SM: true, SN: true, SO: false, SR: true, SS: true, ST: true, SV: true, SX: true, SY: true, SZ: true, 
    TC: true, TD: true, TF: true, TG: true, TH: true, TJ: true, TK: true, TL: true, TM: false, TN: true, TO: true, TR: true, TT: true, TV: true, TW: true, TZ: true, 
    UA: true, UG: true, UM: true, US: true, UY: true, UZ: false, 
    VA: true, VC: true, VE: true, VG: true, VI: true, VN: true, VU: true, 
    WF: true, WS: true, 
    YE: true, YT: true, 
    ZA: true, ZM: true, ZW: true
  },
  apiKey: '2378DCCDF7E3D95F025FE117FADA4B73', // Replace with your ipgeolocation.io API key
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
  },
  createShoutoutCards() {
    const container = document.querySelector('.instagram-creator-grid');
    if (!container) return;
    container.innerHTML = '';
    this.accounts.forEach(account => {
      const card = document.createElement('div');
      card.className = 'instagram-creator-card';
      card.innerHTML = `
        <img src="${account.profilePic}" alt="@${account.username}" class="instagram-creator-pic" onerror="this.src='images/default-profile.jpg'">
        <div class="instagram-creator-info">
          <div class="instagram-creator-header">
            <h3>${account.nickname} ${account.isVerified ? '<img src="instagramcheck.png" alt="Verified" class="instagram-verified-badge">' : ''}</h3>
          </div>
          <p class="instagram-creator-username">@${account.username}</p>
          <p class="instagram-creator-bio">${account.bio || ''}</p>
          <p class="instagram-follower-count">${account.followers} Followers</p>
          <a href="https://instagram.com/${account.username}" target="_blank" class="instagram-visit-profile"> Visit Profile </a>
        </div>
      `;
      container.appendChild(card);
    });
  },
  setLastUpdatedTime() {
    const lastUpdatedElement = document.getElementById('instagram-last-updated-timestamp');
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
  async getUserRegion() {
    const cachedRegion = localStorage.getItem('userRegion');
    const cachedTime = localStorage.getItem('userRegionTime');
    const currentTime = Date.now();

    if (cachedRegion && cachedTime && (currentTime - cachedTime < this.cacheDuration)) {
      return cachedRegion;
    }

    try {
      const response = await fetch(`https://api.ip2location.io/?key=${this.apiKey}&format=json`);
      const data = await response.json();
      const region = data.country_code; // ip2location.io uses 'country_code' for the country code
      localStorage.setItem('userRegion', region);
      localStorage.setItem('userRegionTime', currentTime);
      return region;
    } catch (error) {
      console.error('Error fetching geolocation data:', error);
      return 'US'; // Default to 'US' if there's an error
    }
  },
  showUnavailableMessage(region) {
    const messageContainer = document.querySelector('.unavailable-message');
    if (!messageContainer) return;
    messageContainer.innerHTML = `
      <div class="unavailable-message-title">System Message</div>
      <p>Sorry, this section isn't available in ${region}. Sorry for the inconvenience we have caused.</p>
    `;
    messageContainer.style.display = 'block';
  }
};

// Initialize the Instagram shoutouts
instagramShoutouts.init();

const youtubeShoutouts = {
    accounts: [
        {
            username: 'MrBeast',
            isVerified: true,
            subscribers: '373M',
            nickname: 'MrBeast',
            bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames SUBSCRIBE FOR A COOKIE!',
            profilePic: 'youtube_photoes/mrbeast.jpg',
            coverPhoto: 'youtube_photoes/channels3_banner.jpg', // Add cover photo
        },
        {
            username: 'MrBeast2',
            isVerified: true,
            subscribers: '49.5M',
            nickname: 'MrBeast 2',
            bio: 'my second channel for other videos and shorts :) subscribe ',
            profilePic: 'youtube_photoes/mrbeast2.jpg',
            coverPhoto: 'youtube_photoes/channels4_banner.jpg', // Add cover photo
        },
        {
            username: 'MrBeastGaming',
            isVerified: true,
            subscribers: '46.8M',
            nickname: 'MrBeast Gaming',
            bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames MrBeast Gaming - SUBSCRIBE OR ELSE',
            profilePic: 'youtube_photoes/mrbeastgaming.jpg',
            coverPhoto: 'youtube_photoes/channels5_banner.jpg', // Add cover photo
        },
        {
            username: 'BeastReacts',
            isVerified: true,
            subscribers: '35.5M',
            nickname: 'Beast Reacts',
            bio: 'SUBSCRIBE FOR A COOKIE',
            profilePic: 'youtube_photoes/beastreacts.jpg',
            coverPhoto: 'youtube_photoes/channels6_banner.jpg', // Add cover photo
        },
        {
            username: 'BeastPhilanthropy',
            isVerified: true,
            subscribers: '27.5M',
            nickname: 'Beast Philanthropy',
            bio: '100% of the profits from my ad revenue, merch sales, and sponsorships will go towards making the world a better place!',
            profilePic: 'youtube_photoes/beastphilanthropy.jpg',
            coverPhoto: 'youtube_photoes/channels8_banner.jpg', // Add cover photo
        },
        {
            username: 'zollotech',
            isVerified: true,
            subscribers: '1.71M',
            nickname: 'zollotech',
            bio: "The Top and most reliable iOS Update information on YouTube also covering the latest tech reviews, news and how to's on phones, gadgets, hardware, software and more ... Have a product you would like me to review, message me or contact me at business@zollotech.com",
            profilePic: 'youtube_photoes/channels4_profile.jpg',
            coverPhoto: 'youtube_photoes/channels4_banner (1).jpg', // Add cover photo
        },
        {
            username: 'CaptainSteeeve',
            isVerified: true,
            subscribers: '369K',
            nickname: 'Captain Steeeve',
            bio: 'No bio yet',
            profilePic: 'youtube_photoes/IMG_2371.jpeg',
            coverPhoto: 'youtube_photoes/channels9_banner.jpg', // Add cover photo
        },
        {
            username: 'HeyRachelHughes',
            isVerified: false,
            subscribers: '232K',
            nickname: 'Rachel Hughes',
            bio: 'My name is Rachel Hughes :) I am a 30 year old, mom of two, living in Utah! I love sharing my experiences and life regarding mental health, leaving religion, overcoming an eating disorder, having a disabled child, fitness, beauty and more! Thank you so much for being here. xo',
            profilePic: 'youtube_photoes/IMG_2648.jpeg',
            coverPhoto: 'youtube_photoes/channels10_banner.jpg', // Add cover photo
        },
        {
            username: 'Trafficlightdoctor',
            isVerified: false,
            subscribers: '155K',
            nickname: 'Traffic Light Doctor',
            bio: 'TrafficlightDoctor Live! explores traffic signals and road safety, while TrafficlightDoctor Live Gaming offers an immersive gaming experience.',
            profilePic: 'youtube_photoes/trafficlightdoctor.jpeg',
            coverPhoto: 'youtube_photoes/channels11_banner.jpg', // Add cover photo
        },
        {
            username: 'mrfatcheeto',
            isVerified: false,
            subscribers: '109K',
            nickname: 'Mr Fat Cheeto',
            bio: 'I’m like a HVAC Genius. Come join me on my crazy HVAC Comedy adventures ',
            profilePic: 'youtube_photoes/mrfatcheeto.jpg',
            coverPhoto: 'youtube_photoes/channels12_banner.jpg', // Add cover photo
        },
        {
            username: 'Badge502',
            isVerified: false,
            subscribers: '62.8K',
            nickname: 'Badge502',
            bio: 'Your local EMT!',
            profilePic: 'youtube_photoes/badge502.jpg',
            coverPhoto: 'youtube_photoes/channels13_banner.jpg', // Add cover photo
        },
        {
            username: 'BusArmyDude',
            isVerified: false,
            subscribers: '2',
            nickname: 'Bus Army Dude',
            bio: "Welcome to Bus Army Dude, a tech channel offering reviews, tutorials, and insights. The channel explores various tech topics, emphasizing accessibility and user-friendly content.",
            profilePic: 'youtube_photoes/busarmydude.jpg',
            coverPhoto: 'youtube_photoes/channels7_banner.jpg', // Add cover photo
        },
        // Add more YouTube creators as needed
    ],
    lastUpdatedTime: '2025-03-13T09:25:50', // Manually set the last updated date and time
    init() {
        this.createShoutoutCards();
        this.setLastUpdatedTime();
    },
    createShoutoutCards() {
        const container = document.querySelector('.youtube-creator-grid');
        if (!container) return;

        container.innerHTML = '';
        this.accounts.forEach(account => {
            const card = document.createElement('div');
            card.className = 'youtube-creator-card';
            card.innerHTML = `
                <img src="${account.coverPhoto}" alt="${account.nickname} Cover Photo" class="youtube-cover-photo" onerror="this.style.display='none'">
                <img src="${account.profilePic}" alt="@${account.username}" class="youtube-creator-pic" onerror="this.src='images/default-profile.jpg'">
                <div class="youtube-creator-info">
                    <div class="youtube-creator-header">
                        <h3>${account.nickname} ${account.isVerified ? '<img src="youtubecheck.png" alt="Verified" class="youtube-verified-badge">' : ''}</h3>
                    </div>
                    <div class="username-container">
                        <p class="youtube-creator-username">${account.username}</p>
                    </div>
                    <p class="youtube-creator-bio">${account.bio || ''}</p>
                    <p class="youtube-subscriber-count">${account.subscribers} Subscribers</p>
                    <a href="https://youtube.com/@${account.username}" target="_blank" class="youtube-visit-profile">
                        Visit Channel
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    },
    setLastUpdatedTime() {
        const lastUpdatedElement = document.getElementById('lastUpdatedYouTube');
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
    }
};

youtubeShoutouts.init();
