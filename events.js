// events.js
class EventManager {
    constructor() {
        console.log('EventManager initializing...');
        
        this.eventsContainer = document.getElementById('eventsContainer');
        
        // Example events structure with more detailed information
        this.events = [
            {
                title: 'Minecraft Stream',
                startDate: new Date('2025-01-30T15:00:00Z'),
                endDate: new Date('2025-01-30T17:00:00Z'),
                description: 'Join us for some Minecraft building and adventures! We\'ll be working on new projects and having fun with the community.',
                location: 'Twitch',
                link: 'https://twitch.tv/busarmydude',
                type: 'stream' // Can be used for different event types styling
            },
            {
                title: 'Community Game Night',
                startDate: new Date('2025-02-01T19:00:00Z'),
                endDate: new Date('2025-02-01T22:00:00Z'),
                description: 'Weekly gaming session with viewers! Games will be chosen by the community.',
                location: 'Twitch',
                link: 'https://twitch.tv/busarmydude',
                type: 'community'
            }
        ];

        if (this.eventsContainer) {
            this.init();
        } else {
            console.error('Events container not found!');
        }
    }

    init() {
        this.renderEvents();
        setInterval(() => this.renderEvents(), 60000); // Update every minute
    }

    formatDateTime(date) {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return {
            date: new Intl.DateTimeFormat(navigator.language, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date),
            time: new Intl.DateTimeFormat(navigator.language, {
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            }).format(date),
            timezone: userTimeZone
        };
    }

    calculateDuration(startDate, endDate) {
        const diff = endDate - startDate;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
    }

    getTimeUntil(date) {
        const now = new Date();
        const diff = date - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (diff < 0) return 'Live Now!';

        let parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);

        return parts.join(' ') || 'Starting soon';
    }

    renderEvents() {
        const now = new Date();
        const futureEvents = this.events
            .filter(event => event.endDate > now)
            .sort((a, b) => a.startDate - b.startDate);

        if (futureEvents.length === 0) {
            this.eventsContainer.innerHTML = `
                <div class="event-card empty">
                    <p class="no-events">No upcoming events scheduled</p>
                </div>`;
            return;
        }

        this.eventsContainer.innerHTML = futureEvents.map(event => {
            const startDateTime = this.formatDateTime(event.startDate);
            const endDateTime = this.formatDateTime(event.endDate);
            const timeUntil = this.getTimeUntil(event.startDate);
            const duration = this.calculateDuration(event.startDate, event.endDate);

            return `
                <div class="event-card ${event.type}">
                    <div class="event-header">
                        <h3 class="event-title">${event.title}</h3>
                        <span class="event-badge">${timeUntil}</span>
                    </div>
                    
                    <div class="event-info">
                        <div class="event-datetime">
                            <div class="event-row">
                                <span class="icon">📅</span>
                                <span>${startDateTime.date}</span>
                            </div>
                            <div class="event-row">
                                <span class="icon">🕒</span>
                                <span>${startDateTime.time} - ${endDateTime.time}</span>
                            </div>
                            <div class="event-row">
                                <span class="icon">⌛</span>
                                <span>${duration}</span>
                            </div>
                        </div>
                        
                        <div class="event-details">
                            <div class="event-row">
                                <span class="icon">📍</span>
                                <span>${event.location}</span>
                            </div>
                            <div class="event-row description">
                                <span class="icon">📝</span>
                                <span>${event.description}</span>
                            </div>
                        </div>
                    </div>

                    <a href="${event.link}" target="_blank" class="event-link">
                        <span>Join Event</span>
                        <span class="icon">➜</span>
                    </a>
                    
                    <div class="timezone-info">
                        Times shown in your timezone (${startDateTime.timezone})
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new EventManager();
});
