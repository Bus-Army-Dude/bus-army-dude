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

// --- Firestore Collection References ---
const componentsCollectionRef = collection(db, "status_components");
const incidentsCollectionRef = collection(db, "status_incidents");

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
        return date.toLocaleString(navigator.language || 'en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
        });
    } catch (error) { console.error("Error formatting timestamp:", error); return 'Invalid Date'; }
}

/**
 * Converts a status string (e.g., "Operational") into a CSS class name.
 * @param {string} status - The status string.
 * @returns {string} CSS class name (e.g., "status-operational").
 */
function getStatusClass(status) {
    if (!status) return 'status-unknown';
    return `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
}

// --- Data Loading and Rendering Functions ---

/** Fetches components and updates the list and overall banner */
async function loadComponents() {
    if (!componentsListContainer || !overallStatusBanner) return;
    componentsListContainer.innerHTML = '<p>Loading component statuses...</p>';
    overallStatusBanner.innerHTML = '<p>Loading overall system status...</p>';
    overallStatusBanner.className = 'overall-status-banner'; // Reset class

    try {
        const q = query(componentsCollectionRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        let componentHtml = ''; const componentsData = [];

        if (querySnapshot.empty) {
            componentsListContainer.innerHTML = '<p>No components configured.</p>';
            updateOverallStatusBanner([]); return;
        }

        querySnapshot.forEach((doc) => {
            const component = doc.data(); const status = component.currentStatus || "Unknown";
            const statusClass = getStatusClass(status); componentsData.push(component);
            componentHtml += `
                <div class="component-item" data-id="${doc.id}">
                    <div>
                        <span class="component-name">${component.name || 'Unnamed'}</span>
                        ${component.description ? `<p class="component-description">${component.description}</p>` : ''}
                    </div>
                    <span class="component-status ${statusClass}">${status}</span>
                </div>`;
        });
        componentsListContainer.innerHTML = componentHtml;
        updateOverallStatusBanner(componentsData);
    } catch (error) {
        console.error("Error loading components:", error);
        componentsListContainer.innerHTML = '<p class="error">Could not load component statuses.</p>';
        overallStatusBanner.innerHTML = '<p class="error">Could not determine overall status.</p>';
        overallStatusBanner.className = 'overall-status-banner has-issues';
    }
}

/** Updates the overall status banner */
function updateOverallStatusBanner(componentsData) {
     if (!overallStatusBanner) return; let overallStatus = "all-operational"; let overallMessage = "All Systems Operational";
     let majorOutage = false; let partialIssue = false;
     if (componentsData.length === 0) { overallStatus = "unknown"; overallMessage = "System status unavailable."; }
     else {
         for (const component of componentsData) {
             const status = component.currentStatus || "Unknown";
             if (status === "Major Outage") { majorOutage = true; break; }
             else if (status === "Partial Outage" || status === "Degraded Performance") { partialIssue = true; }
             else if (status !== "Operational") { partialIssue = true; }
         }
         if (majorOutage) { overallStatus = "major-issues"; overallMessage = "Major System Outage"; }
         else if (partialIssue) { overallStatus = "has-issues"; overallMessage = "Some Systems Experiencing Issues"; }
     }
     overallStatusBanner.innerHTML = `<p>${overallMessage}</p>`; overallStatusBanner.className = `overall-status-banner ${overallStatus}`;
}

/** Fetches and renders active/past incidents */
async function loadIncidents() {
    if (!activeIncidentsListContainer || !pastIncidentsListContainer) return;
    activeIncidentsListContainer.innerHTML = '<p>Loading active incidents...</p>';
    pastIncidentsListContainer.innerHTML = '<p>Loading past incidents...</p>';

    try {
        const q = query(incidentsCollectionRef, orderBy("createdAt", "desc"), limit(20));
        const querySnapshot = await getDocs(q);
        let activeIncidentsHtml = ''; let pastIncidentsHtml = ''; let activeCount = 0; let pastCount = 0;

        querySnapshot.forEach((doc) => {
            const incident = doc.data(); const status = incident.status || "Unknown";
            const statusClass = getStatusClass(status); const isResolved = status === "Resolved";
            let updatesHtml = '<div class="incident-updates">';
            if (incident.updates && Array.isArray(incident.updates) && incident.updates.length > 0) {
                const sortedUpdates = [...incident.updates].sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
                sortedUpdates.forEach(update => { updatesHtml += `<div class="incident-update"><p>${update.message || ''}</p><time>${formatTimestamp(update.timestamp)} - <strong>${update.status || ''}</strong></time></div>`; });
            } else { updatesHtml += '<div class="incident-update"><p>No updates yet.</p></div>'; }
            updatesHtml += '</div>';
            const affectedText = incident.affectedComponents && incident.affectedComponents.length > 0 ? `<p>Affected: ${incident.affectedComponents.join(', ')}</p>` : '';
            const footerText = `<p>Opened: ${formatTimestamp(incident.createdAt)} ${isResolved ? `| Resolved: ${formatTimestamp(incident.resolvedAt)}` : ''}</p>`;

            const incidentHtml = `
                <article class="incident-item" data-id="${doc.id}">
                    <header class="incident-header">
                        <h3 class="incident-title">${incident.title || 'Untitled Incident'}</h3>
                        <span class="incident-status ${statusClass}">${status}</span>
                    </header>
                    ${updatesHtml}
                     <footer class="incident-footer">${affectedText}${footerText}</footer>
                </article>`;
            if (isResolved) { pastIncidentsHtml += incidentHtml; pastCount++; }
            else { activeIncidentsHtml += incidentHtml; activeCount++; }
        });

        activeIncidentsListContainer.innerHTML = activeCount === 0 ? '<p>No active incidents reported.</p>' : activeIncidentsHtml;
        pastIncidentsListContainer.innerHTML = pastCount === 0 ? '<p>No recent past incidents.</p>' : pastIncidentsHtml;

    } catch (error) {
        console.error("Error loading incidents:", error);
        activeIncidentsListContainer.innerHTML = '<p class="error">Could not load active incidents.</p>';
        pastIncidentsListContainer.innerHTML = '<p class="error">Could not load past incidents.</p>';
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    if (db) { // Check if Firebase initialized
        console.log("Firebase ready. Loading status page data...");
        loadComponents();
        loadIncidents();
    } else {
        console.error("Firestore database (db) is not available.");
        if(overallStatusBanner) overallStatusBanner.innerHTML = '<p class="error">Error: Cannot connect to status service.</p>';
        if(componentsListContainer) componentsListContainer.innerHTML = '<p class="error">Status components unavailable.</p>';
        // ... add errors for incident lists too ...
    }
});
