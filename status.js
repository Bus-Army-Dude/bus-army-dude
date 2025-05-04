// status.js

// Import necessary Firestore functions and the db instance from firebase-init.js
import {
    getFirestore,
    collection,
    query,
    orderBy,
    limit,
    where,
    getDocs,
    Timestamp // Make sure Timestamp is imported if you use it directly
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { db } from './firebase-init.js'; // Assuming firebase-init.js exports db

// --- DOM Element References ---
const overallStatusBanner = document.getElementById('overall-status-banner');
const componentsListContainer = document.getElementById('components-list');
const activeIncidentsListContainer = document.getElementById('active-incidents-list');
const pastIncidentsListContainer = document.getElementById('past-incidents-list');
// Optional: Maintenance List Container
// const maintenanceListContainer = document.getElementById('maintenance-list');

// --- Firestore Collection References ---
const componentsCollectionRef = collection(db, "status_components");
const incidentsCollectionRef = collection(db, "status_incidents");
// Optional: Maintenance Collection Reference
// const maintenanceCollectionRef = collection(db, "status_maintenance");

// --- Helper Functions ---

/**
 * Formats a Firestore Timestamp into a readable string.
 * @param {Timestamp} firestoreTimestamp - The Firestore Timestamp object.
 * @returns {string} Formatted date/time string or 'N/A'.
 */
function formatTimestamp(firestoreTimestamp) {
    if (!firestoreTimestamp || typeof firestoreTimestamp.toDate !== 'function') {
        return 'N/A';
    }
    try {
        const date = firestoreTimestamp.toDate();
        // Example format: May 4, 2025, 10:30 AM UTC (adjust options as needed)
        return date.toLocaleString(navigator.language || 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short' // Or 'long' or specific timeZone
        });
    } catch (error) {
        console.error("Error formatting timestamp:", error);
        return 'Invalid Date';
    }
}

/**
 * Converts a status string (e.g., "Operational") into a CSS class name.
 * @param {string} status - The status string.
 * @returns {string} CSS class name (e.g., "status-operational").
 */
function getStatusClass(status) {
    if (!status) return 'status-unknown';
    // Convert to lowercase and replace spaces with hyphens
    return `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
}

// --- Data Loading and Rendering Functions ---

/**
 * Fetches component data from Firestore and renders it to the page.
 * Also updates the overall status banner based on component health.
 */
async function loadComponents() {
    if (!componentsListContainer || !overallStatusBanner) {
        console.error("Component list or overall status banner element not found.");
        return;
    }
    componentsListContainer.innerHTML = '<p>Loading component statuses...</p>';
    overallStatusBanner.innerHTML = '<p>Loading overall system status...</p>';
    overallStatusBanner.className = 'overall-status-banner'; // Reset class

    try {
        const q = query(componentsCollectionRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            componentsListContainer.innerHTML = '<p>No components configured.</p>';
             updateOverallStatusBanner([]); // Pass empty array if no components
            return;
        }

        let componentHtml = '';
        const componentsData = []; // Store data for overall status calculation

        querySnapshot.forEach((doc) => {
            const component = doc.data();
            const status = component.currentStatus || "Unknown";
            const statusClass = getStatusClass(status);

            componentsData.push(component); // Add data for overall status

            componentHtml += `
                <div class="component-item" data-id="${doc.id}">
                    <div>
                        <span class="component-name">${component.name || 'Unnamed Component'}</span>
                        ${component.description ? `<p class="component-description">${component.description}</p>` : ''}
                    </div>
                    <span class="component-status ${statusClass}">${status}</span>
                </div>
            `;
        });

        componentsListContainer.innerHTML = componentHtml;
        updateOverallStatusBanner(componentsData); // Update banner after processing all components

    } catch (error) {
        console.error("Error loading components:", error);
        componentsListContainer.innerHTML = '<p class="error">Could not load component statuses.</p>';
        overallStatusBanner.innerHTML = '<p class="error">Could not determine overall status.</p>';
        overallStatusBanner.className = 'overall-status-banner has-issues'; // Default to issue state on error
    }
}

/**
 * Updates the overall status banner based on component statuses.
 * @param {Array} componentsData - Array of component data objects.
 */
function updateOverallStatusBanner(componentsData) {
     if (!overallStatusBanner) return;

    let overallStatus = "all-operational"; // Assume operational initially
    let overallMessage = "All Systems Operational";
    let majorOutage = false;
    let partialIssue = false;

    if (componentsData.length === 0) {
        overallStatus = "unknown"; // Or maybe 'has-issues' if no components is an issue
        overallMessage = "System status cannot be determined (No components).";
    } else {
        for (const component of componentsData) {
            const status = component.currentStatus || "Unknown";
            if (status === "Major Outage") {
                majorOutage = true;
                break; // Highest severity, no need to check further
            } else if (status === "Partial Outage" || status === "Degraded Performance") {
                partialIssue = true;
            } else if (status !== "Operational") {
                partialIssue = true; // Treat any non-operational status as an issue
            }
        }

        if (majorOutage) {
            overallStatus = "major-issues";
            overallMessage = "Major System Outage";
        } else if (partialIssue) {
            overallStatus = "has-issues";
            overallMessage = "Some Systems Experiencing Issues";
        }
        // If neither majorOutage nor partialIssue is true, it remains 'all-operational'
    }

    overallStatusBanner.innerHTML = `<p>${overallMessage}</p>`;
    overallStatusBanner.className = `overall-status-banner ${overallStatus}`;
}


/**
 * Fetches incident data from Firestore and renders active/past incidents.
 */
async function loadIncidents() {
    if (!activeIncidentsListContainer || !pastIncidentsListContainer) {
        console.error("Incident list container(s) not found.");
        return;
    }
    activeIncidentsListContainer.innerHTML = '<p>Loading active incidents...</p>';
    pastIncidentsListContainer.innerHTML = '<p>Loading past incidents...</p>';

    try {
        // Query recent incidents, order by creation time descending
        const q = query(incidentsCollectionRef, orderBy("createdAt", "desc"), limit(20)); // Limit to recent 20
        const querySnapshot = await getDocs(q);

        let activeIncidentsHtml = '';
        let pastIncidentsHtml = '';
        let activeCount = 0;
        let pastCount = 0;

        querySnapshot.forEach((doc) => {
            const incident = doc.data();
            const status = incident.status || "Unknown";
            const statusClass = getStatusClass(status);
            const isResolved = status === "Resolved";

            // Build updates HTML (display newest update first in this example)
            let updatesHtml = '<div class="incident-updates">';
            if (incident.updates && Array.isArray(incident.updates)) {
                // Sort updates newest first for display
                const sortedUpdates = [...incident.updates].sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
                sortedUpdates.forEach(update => {
                    updatesHtml += `
                        <div class="incident-update">
                            <p>${update.message || 'No details provided.'}</p>
                            <time datetime="${update.timestamp?.toDate().toISOString()}">
                                ${formatTimestamp(update.timestamp)} - <strong>${update.status || ''}</strong>
                            </time>
                        </div>
                    `;
                });
            } else {
                 updatesHtml += '<div class="incident-update"><p>No updates posted yet.</p></div>';
            }
             updatesHtml += '</div>';


            const incidentHtml = `
                <article class="incident-item" data-id="${doc.id}">
                    <header class="incident-header">
                        <h3 class="incident-title">${incident.title || 'Untitled Incident'}</h3>
                        <span class="incident-status ${statusClass}">${status}</span>
                    </header>
                    ${updatesHtml}
                     <footer class="incident-footer">
                         ${incident.affectedComponents && incident.affectedComponents.length > 0 ? `<p>Affected: ${incident.affectedComponents.join(', ')}</p>` : ''}
                         <p>Opened: ${formatTimestamp(incident.createdAt)} ${isResolved ? `| Resolved: ${formatTimestamp(incident.resolvedAt)}` : ''}</p>
                    </footer>
                </article>
            `;

            if (isResolved) {
                pastIncidentsHtml += incidentHtml;
                pastCount++;
            } else {
                activeIncidentsHtml += incidentHtml;
                activeCount++;
            }
        });

        // Update Active Incidents List
        if (activeCount === 0) {
            activeIncidentsListContainer.innerHTML = '<p>No active incidents reported.</p>';
        } else {
            activeIncidentsListContainer.innerHTML = activeIncidentsHtml;
        }

        // Update Past Incidents List
        if (pastCount === 0) {
            pastIncidentsListContainer.innerHTML = '<p>No recent past incidents.</p>';
        } else {
            pastIncidentsListContainer.innerHTML = pastIncidentsHtml;
        }

    } catch (error) {
        console.error("Error loading incidents:", error);
        activeIncidentsListContainer.innerHTML = '<p class="error">Could not load active incidents.</p>';
        pastIncidentsListContainer.innerHTML = '<p class="error">Could not load past incidents.</p>';
    }
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // Check if db was initialized correctly in firebase-init.js
    if (db) {
        console.log("Firebase ready. Loading status page data...");
        loadComponents(); // Load components first to determine overall status
        loadIncidents();
        // Optional: Load Maintenance Info
        // loadMaintenance();
    } else {
        console.error("Firestore database (db) is not available. Cannot load status page data.");
        // Display a more prominent error on the page might be needed here
        if(overallStatusBanner) overallStatusBanner.innerHTML = '<p class="error">Error: Cannot connect to status service.</p>';
        if(componentsListContainer) componentsListContainer.innerHTML = '<p class="error">Status components unavailable.</p>';
        if(activeIncidentsListContainer) activeIncidentsListContainer.innerHTML = '<p class="error">Incident data unavailable.</p>';
        if(pastIncidentsListContainer) pastIncidentsListContainer.innerHTML = '';
    }
});
