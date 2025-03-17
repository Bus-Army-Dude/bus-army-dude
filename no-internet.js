// Function to update datetime in UTC format
function updateDateTime() {
    const now = new Date();
    const utcString = now.toISOString().replace('T', ' ').slice(0, 19);
    document.getElementById('current-datetime').textContent = utcString;
}

// Function to retry connection
function retryConnection() {
    window.location.reload();
}

// Listen for online status
window.addEventListener('online', function() {
    window.location.reload();
});

// Prevent default offline page
window.addEventListener('offline', function(e) {
    e.preventDefault();
});

// Update status message based on connection
function updateConnectionStatus() {
    const statusMessage = document.querySelector('.status-message');
    const connectionStatus = document.querySelector('.connection-status');
    const statusIndicator = document.querySelector('.status-indicator');
    
    if (navigator.onLine) {
        statusMessage.textContent = 'Reconnecting to BusArmyDude\'s website...';
        connectionStatus.innerHTML = `
            <span class="status-indicator" style="background: #44ff44;"></span>
            Reconnecting...
        `;
    } else {
        statusMessage.textContent = 'Unable to connect to BusArmyDude\'s website';
        connectionStatus.innerHTML = `
            <span class="status-indicator" style="background: #ff4444;"></span>
            Currently Offline
        `;
    }
}

// Initialize status on page load
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime(); // Initial datetime update
    updateConnectionStatus(); // Initial status update
    
    // Update datetime every second
    setInterval(updateDateTime, 1000);
    
    // Update connection status every 5 seconds
    setInterval(updateConnectionStatus, 5000);
});

// Update status when connection changes
window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);
