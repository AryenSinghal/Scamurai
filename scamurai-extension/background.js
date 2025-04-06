// Scamurai Background Script
// This script handles extension-level events and communication

// Initialize when the extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Scamurai: Extension installed/updated', details);

    // Set default settings if this is a fresh install
    if (details.reason === 'install') {
        chrome.storage.sync.set({
            enabledSites: ['gmail', 'whatsapp'],
            notificationsEnabled: true,
            autoScanEnabled: false,
            backendUrl: 'http://localhost:5001/api/scan', // Replace with your actual backend URL
            animationEnabled: true // Enable animations by default
        }, () => {
            console.log('Scamurai: Default settings initialized');
        });
    }
});

// Listen for clicks on the extension icon in the toolbar
chrome.action.onClicked.addListener((tab) => {
    // Only process supported sites
    if (isSupportedSite(tab.url)) {
        // Get animation setting
        chrome.storage.sync.get(['animationEnabled'], (result) => {
            const animationEnabled = result.animationEnabled !== false; // Default to true
            
            // First, try to animate the samurai if animations are enabled
            if (animationEnabled) {
                chrome.tabs.sendMessage(tab.id, { action: 'animateSamurai' }, (response) => {
                    // After animation (or if it fails), send the scan message
                    setTimeout(() => {
                        triggerScan(tab);
                    }, 500);
                });
            } else {
                // If animations are disabled, just scan
                triggerScan(tab);
            }
        });
    } else {
        // For unsupported sites, show a notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'Scamurai',
            message: 'This website is not supported by Scamurai. Please visit Gmail or WhatsApp Web to use the scam detection features.'
        });
    }
});

// Trigger a scan on the page
function triggerScan(tab) {
    // Send a message to the content script to check the current page
    chrome.tabs.sendMessage(tab.id, { action: 'checkCurrentPage' }, (response) => {
        if (chrome.runtime.lastError) {
            console.error('Scamurai: Error sending message to content script', chrome.runtime.lastError);

            // If there was an error, the content script might not be loaded, so inject it
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['samurai-animation.js', 'content-script.js']
            }).then(() => {
                // Try sending the message again after a short delay
                setTimeout(() => {
                    chrome.tabs.sendMessage(tab.id, { action: 'checkCurrentPage' });
                }, 500);
            }).catch(err => {
                console.error('Scamurai: Failed to inject content script', err);
            });
        }
    });
}

// Check if a URL is for a supported site
function isSupportedSite(url) {
    if (!url) return false;

    return url.includes('mail.google.com') || url.includes('web.whatsapp.com');
}

// Handle messages from content scripts or the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Scamurai: Background received message', message);

    if (message.action === 'getSettings') {
        // Retrieve and return the current settings
        chrome.storage.sync.get([
            'enabledSites',
            'notificationsEnabled',
            'autoScanEnabled',
            'backendUrl',
            'animationEnabled'
        ], (settings) => {
            sendResponse(settings);
        });
        return true; // Keep the message channel open for asynchronous response
    }

    if (message.action === 'updateSettings') {
        // Update settings
        chrome.storage.sync.set(message.settings, () => {
            sendResponse({ status: 'success' });
        });
        return true; // Keep the message channel open for asynchronous response
    }

    if (message.action === 'recordScamDetection') {
        // Record a scam detection for statistics
        chrome.storage.local.get(['scamHistory'], (result) => {
            const history = result.scamHistory || [];
            history.push({
                date: new Date().toISOString(),
                url: message.url,
                threatLevel: message.threatLevel
            });

            // Keep only the last 100 entries
            if (history.length > 100) {
                history.shift();
            }

            chrome.storage.local.set({ scamHistory: history }, () => {
                sendResponse({ status: 'recorded' });
            });
        });
        return true; // Keep the message channel open for asynchronous response
    }

    if (message.action === 'animateOnAllTabs') {
        // Animate the samurai icon on all open tabs with the content script
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                if (isSupportedSite(tab.url)) {
                    chrome.tabs.sendMessage(tab.id, { action: 'animateSamurai' });
                }
            });
            sendResponse({ status: 'animating' });
        });
        return true; // Keep the message channel open for asynchronous response
    }
});