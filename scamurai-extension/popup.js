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
const closeButton = document.querySelector('.close-btn');
const bubbleArrow = document.querySelector('.bubble-arrow');

// Load settings when popup opens
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadStatistics();

    // Add event listener for messages from content script
    window.addEventListener('message', handleContentScriptMessages);

    // Add event listener for the close button
    if (closeButton) {
        closeButton.addEventListener('click', closePopup);
    }
});

// Handle messages from content script
function handleContentScriptMessages(event) {
    // Only accept messages from the same origin
    if (event.origin !== window.origin) return;

    const message = event.data;

    if (message && message.action === 'setArrowPosition') {
        // Position the speech bubble arrow
        setArrowPosition(message.position);
    }
}

// Set the position of the speech bubble arrow
function setArrowPosition(position) {
    if (!bubbleArrow) return;

    // Default styling
    bubbleArrow.style.width = '0';
    bubbleArrow.style.height = '0';
    bubbleArrow.style.position = 'absolute';

    // Apply position-specific styling
    switch (position) {
        case 'left':
            bubbleArrow.style.left = '-10px';
            bubbleArrow.style.top = '30px';
            bubbleArrow.style.borderTop = '10px solid transparent';
            bubbleArrow.style.borderBottom = '10px solid transparent';
            bubbleArrow.style.borderRight = '10px solid white';
            break;

        case 'right':
            bubbleArrow.style.right = '-10px';
            bubbleArrow.style.top = '30px';
            bubbleArrow.style.borderTop = '10px solid transparent';
            bubbleArrow.style.borderBottom = '10px solid transparent';
            bubbleArrow.style.borderLeft = '10px solid white';
            break;

        case 'top':
            bubbleArrow.style.left = '150px';
            bubbleArrow.style.top = '-10px';
            bubbleArrow.style.borderLeft = '10px solid transparent';
            bubbleArrow.style.borderRight = '10px solid transparent';
            bubbleArrow.style.borderBottom = '10px solid white';
            break;

        case 'bottom':
            bubbleArrow.style.left = '150px';
            bubbleArrow.style.bottom = '-10px';
            bubbleArrow.style.borderLeft = '10px solid transparent';
            bubbleArrow.style.borderRight = '10px solid transparent';
            bubbleArrow.style.borderTop = '10px solid white';
            break;
    }
}

// Close the popup
function closePopup() {
    // Send a message to the parent window (content script)
    window.parent.postMessage({ action: 'closePopup' }, '*');
}

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
scanNowButton.addEventListener('click', () => {
    // Send message to parent window (content script) to scan
    window.parent.postMessage({ action: 'scanPage' }, '*');
});