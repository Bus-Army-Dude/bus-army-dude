// events.js
class EventManager {
    constructor() {
        // Debug logging
        console.log('EventManager initializing...');
        
        // Get the container
        this.eventsContainer = document.getElementById('eventsContainer');
        
        // Define your events (dates in UTC)
        this.events = [
            {
                title: 'Twitch Stream',
                date: new Date('2025-01-30T15:00:00Z'), // UTC time
                location: 'Twitch',
                duration: '2 hours',
                link: 'https://twitch.tv/busarmydude',
                description: 'Join us for a live streaming event!'
            },
            {
                title: 'Game Night',
                date: new Date('2025-02-01T19:00:00Z'), // UTC time
                location: 'Twitch',
                duration: '3 hours',
                link: 'https://twitch.tv/busarmydude',
                description: 'Weekly gaming session with viewers'
            }
        ];

        // Initialize if container exists
        if (this.eventsContainer) {
            this.init();
        } else {
            console.error('Events container not found!');
        }
    }

    init() {
        this.renderEvents();
        // Update countdown every minute
        setInterval(() => this.renderEvents(), 60000);
    }

    formatDateTime(date) {
        return new Intl.DateTimeFormat(navigator.language, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        }).format(date);
    }

    getTimeUntil(date) {
        const now = new Date();
        const diff = date - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        let parts = [];
        if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
        if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
        if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);

        return parts.join(', ') || 'Starting soon';
    }

    renderEvents() {
        const now = new Date();
        // Filter and sort upcoming events
        const futureEvents = this.events
            .filter(event => event.date > now)
            .sort((a, b) => a.date - b.date);

        if (futureEvents.length === 0) {
            this.eventsContainer.innerHTML = `
                <div class="event-card">
                    <p class="no-events">No upcoming events scheduled.</p>
                </div>`;
            return;
        }

        this.eventsContainer.innerHTML = futureEvents.map(event => `
            <div class="event-card">
                <h3 class="event-title">${event.title}</h3>
                <div class="event-info">
                    <div class="event-row">
                        <span>📅 ${this.formatDateTime(event.date)}</span>
                    </div>
                    <div class="event-row">
                        <span>⏳ Starts in: ${this.getTimeUntil(event.date)}</span>
                    </div>
                    <div class="event-row">
                        <span>📍 ${event.location}</span>
                    </div>
                    <div class="event-row">
                        <span>⏱️ ${event.duration}</span>
                    </div>
                    ${event.description ? `
                        <div class="event-row">
                            <span>📝 ${event.description}</span>
                        </div>
                    ` : ''}
                </div>
                ${event.link ? `
                    <a href="${event.link}" target="_blank" class="event-link">Join Event</a>
                ` : ''}
            </div>
        `).join('');
    }
}

// Initialize the EventManager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating EventManager...');
    new EventManager();
});
