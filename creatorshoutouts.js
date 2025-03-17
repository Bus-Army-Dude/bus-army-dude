const instagramShoutouts = {
    accounts: [
        { username: 'mrbeast', isVerified: true, followers: '66.6M', nickname: 'MrBeast', bio: 'My New Show Beast Games is out now on Prime Video!', profilePic: 'instagram_photos/mrbeast.jpg' },
        { username: 'applesauceandadhd', isVerified: true, followers: '823K', nickname: 'Jessica', bio: 'TeamJessSecrest@Gersh.com', profilePic: 'instagram_photos/applesauceandadhd.jpeg' },
        { username: 'emtbadge502', isVerified: true, followers: '529K', nickname: 'Anthony Christian', bio: 'P.O. Box 775, Belleville, NJ 07109, EMT - 911/ EMD - CPR Instructor - Content Creator, Work Hard. Be Kind Always.', profilePic: 'instagram_photos/emtbadge502.jpg' },
        { username: 'mrfattcheeto', isVerified: true, followers: '327K', nickname: 'Trent Parker', bio: "I'm like some HVAC Genius", profilePic: 'instagram_photos/mrfatcheeto.jpeg' },
        { username: 'trafficlightdoctor', isVerified: true, followers: '318K', nickname: 'TrafficLightDoctor', bio: 'Follow My YouTube And TikTok!!', profilePic: 'instagram_photos/trafficlightdoctor.jpeg' },
        { username: 'lisa.remillard', isVerified: true, followers: '122K', nickname: 'Lisa Remillard', bio: 'Public figure 📹 🎙Journalist, ▶️ Subcribe to my YouTube channel (@LisaRemillardOfficial)', profilePic: 'instagram_photos/lisaremillard.jpg' },
        { username: 'heyrachelhughes', isVerified: false, followers: '103K', nickname: 'Rachel Hughes', bio: 'PPersonal blog, YouTube + TikTok: Rachel_Hughes, ALL INQUIRIES: houseofhughes@thestation.io, 20% off Bucked Up: RACHELHUGHES', profilePic: 'instagram_photos/heyrachelhughes.jpg' },
        { username: 'meetmeinthemediacenter', isVerified: true, followers: '51.8K', nickname: 'Jen Miller', bio: '✌🏻❤️&Toasty📚 680K on TikTok ✨Book Return Game 🫶🏻Middle School Librarian', profilePic: 'instagram_photos/meetmeinthemediacenter.jpeg' },
        { username: 'kaylee_mertens_', isVerified: false, followers: '3,176', nickname: 'Kaylee Mertens', bio: 'Tik Tok: Kaylee_Mertens_', profilePic: 'instagram_photos/kayleemertens.jpeg' },
        { username: 'riverkritzar', isVerified: false, followers: '97', nickname: 'River Jordan Kritzar', bio: "Hello, my name is River, I am 20. I am autistic. I love technology.", profilePic: 'instagram_photos/riverkritzar.jpg' },
        { username: 'rose_the_fox24', isVerified: false, followers: '80', nickname: 'Rose Haydu', bio: 'I’m 19, Drp/rp open, I’m taken by the love of my life @_jano_142_ 💜3/1/24💜', profilePic: 'instagram_photos/rosethefox24.jpg' },
        { username: '_jano_142_', isVerified: false, followers: '51', nickname: 'Nathan Haydu', bio: 'Cars are love, cars are life. Taken by @rose_the_fox24 ❤️(3/1/24)❤️#bncr33gtr:Best Skyline/🔰Dream car🚗#c7zr1:Last TRUE Vette/🇺🇸Dream car🏎', profilePic: 'instagram_photos/jano142.jpg' },
        { username: 'busarmydude', isVerified: false, followers: '21', nickname: 'Bus Army Dude', bio: 'Hello, my name is River, I am 20. I am autistic. I love technology.', profilePic: 'instagram_photos/busarmydude.jpg' },
        { username: 'miss_foxy_ghost_wife', isVerified: false, followers: '5', nickname: 'Foxy Riley', bio: 'hey yo im Miss Foxy! i turn 20 in about two months im very friendly i dint bite hard~ dont be shy come say Hey to your friendly neighborhood Fox 😘', profilePic: 'instagram_photos/missfoxyghostwife.jpg' },
        // Add more Instagram creators as needed
    ],
    lastUpdatedTime: '2025-03-16T12:54:02', // Manually set the last updated date and time
    init() {
        this.createShoutoutCards();
        this.setLastUpdatedTime();
    },
    createShoutoutCards() {
        const container = document.querySelector('.instagram-creator-grid');
        if (!container) return;

        container.innerHTML = '';
        this.accounts.forEach(account => {
            const card = document.createElement('div');
            card.className = 'instagram-creator-card';
            card.innerHTML = `
                <img src="${account.profilePic}" alt="${account.nickname}" class="instagram-creator-pic" onerror="this.src='images/default-profile.jpg'">
                <div class="instagram-creator-info">
                    <div class="instagram-creator-header">
                        <h3>${account.nickname} ${account.isVerified ? '<img src="instagramcheck.png" alt="Verified" class="instagram-verified-badge">' : ''}</h3>
                    </div>
                    <p class="instagram-creator-username">${account.username}</p>
                    <p class="instagram-creator-bio">${account.bio || ''}</p>
                    <p class="instagram-follower-count">${account.followers} Followers</p>
                    <a href="https://instagram.com/${account.username}" target="_blank" class="instagram-visit-profile">
                        Visit Profile
                    </a>
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
    }
};

// Initialize the Instagram shoutouts
instagramShoutouts.init();

const youtubeShoutouts = {
    accounts: [
        {
            username: 'MrBeast',
            isVerified: true,
            subscribers: '374M',
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
            subscribers: '1.72M',
            nickname: 'zollotech',
            bio: "The Top and most reliable iOS Update information on YouTube also covering the latest tech reviews, news and how to's on phones, gadgets, hardware, software and more ... Have a product you would like me to review, message me or contact me at business@zollotech.com",
            profilePic: 'youtube_photoes/channels4_profile.jpg',
            coverPhoto: 'youtube_photoes/channels4_banner (1).jpg', // Add cover photo
        },
        {
            username: 'CaptainSteeeve',
            isVerified: true,
            subscribers: '371K',
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
            profilePic: 'youtube_photoes/IMG_2648.jpg',
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
            subscribers: '110K',
            nickname: 'Mr Fat Cheeto',
            bio: 'I’m like a HVAC Genius. Come join me on my crazy HVAC Comedy adventures ',
            profilePic: 'youtube_photoes/mrfatcheeto.jpg',
            coverPhoto: 'youtube_photoes/channels12_banner.jpg', // Add cover photo
        },
        {
            username: 'Badge502',
            isVerified: false,
            subscribers: '63K',
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
    lastUpdatedTime: '2025-03-16T12:55:46', // Manually set the last updated date and time
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
