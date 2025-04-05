// Scamurai Popup Script

// DOM elements
const enabledToggle = document.getElementById('enabled-toggle');
const notificationsToggle = document.getElementById('notifications-toggle');
const autoScanToggle = document.getElementById('auto-scan-toggle');
const statusMessage = document.getElementById('status-message');
const scanNowButton = document.getElementById('scan-now-button');
const scamsDetectedElement = document.getElementById('scams-detected');
const highRiskCountElement = document.getElementById('high-risk-count');
const mediumRiskCountElement = document.getElementById('medium-risk-count');
const lowRiskCountElement = document.getElementById('low-risk-count');

// Load settings when popup opens
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadStatistics();
});

// Load settings from storage
function loadSettings() {
    chrome.storage.sync.get({
        // Default values
        enabledSites: ['gmail', 'whatsapp'],
        notificationsEnabled: true,
        autoScanEnabled: false
    }, (settings) => {
        // Update toggle states
        enabledToggle.checked = settings.enabledSites.length > 0;
        notificationsToggle.checked = settings.notificationsEnabled;
        autoScanToggle.checked = settings.autoScanEnabled;

        // Update status message
        updateStatusMessage(enabledToggle.checked);
    });
}

// Load statistics from storage
function loadStatistics() {
    chrome.storage.local.get(['scamHistory'], (result) => {
        const history = result.scamHistory || [];

        // Count total scams detected
        scamsDetectedElement.textContent = history.length;

        // Count by risk level
        let highRiskCount = 0;
        let mediumRiskCount = 0;
        let lowRiskCount = 0;

        history.forEach(item => {
            if (item.threatLevel > 6) {
                highRiskCount++;
            } else if (item.threatLevel > 3) {
                mediumRiskCount++;
            } else {
                lowRiskCount++;
            }
        });

        highRiskCountElement.textContent = highRiskCount;
        mediumRiskCountElement.textContent = mediumRiskCount;
        lowRiskCountElement.textContent = lowRiskCount;
    });
}

// Update the status message based on enabled state
function updateStatusMessage(isEnabled) {
    if (isEnabled) {
        statusMessage.textContent = 'Scamurai is active and ready to protect you.';
        statusMessage.className = 'status enabled';
    } else {
        statusMessage.textContent = 'Scamurai is currently disabled.';
        statusMessage.className = 'status disabled';
    }
}

// Save settings to storage
function saveSettings() {
    const enabledSites = enabledToggle.checked ? ['gmail', 'whatsapp'] : [];

    chrome.storage.sync.set({
        enabledSites: enabledSites,
        notificationsEnabled: notificationsToggle.checked,
        autoScanEnabled: autoScanToggle.checked
    }, () => {
        console.log('Scamurai: Settings saved');

        // Update status message
        updateStatusMessage(enabledToggle.checked);
    });
}

// Event listeners for toggle switches
enabledToggle.addEventListener('change', saveSettings);
notificationsToggle.addEventListener('change', saveSettings);
autoScanToggle.addEventListener('change', saveSettings);

// Event listener for Scan Now button
scanNowButton.addEventListener('click', async () => {
    // Get the active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];

    if (!activeTab) {
        console.error('Scamurai: No active tab found');
        return;
    }

    // Check if the current site is supported
    const url = activeTab.url;
    const isSupported = url.includes('mail.google.com') || url.includes('web.whatsapp.com');

    if (!isSupported) {
        // Show an alert or update the status message
        statusMessage.textContent = 'This website is not supported by Scamurai.';
        statusMessage.className = 'status disabled';
        return;
    }

    // Send message to content script to trigger a scan
    chrome.tabs.sendMessage(activeTab.id, { action: 'checkCurrentPage' }, (response) => {
        if (chrome.runtime.lastError) {
            console.error('Scamurai: Error sending message to content script', chrome.runtime.lastError);

            // The content script might not be loaded, so close the popup
            window.close();
        } else {
            console.log('Scamurai: Scan initiated', response);

            // Close the popup
            window.close();
        }
    });
});