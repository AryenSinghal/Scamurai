// Scamurai Content Script
// This script injects a floating action button and handles the scam detection functionality

// Configuration
const CONFIG = {
    backendUrl: 'http://localhost:5001/api/scan', // Replace with your actual backend URL
    buttonText: 'Scamurai',
    buttonPosition: 'top-right', // Options: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
};

// Main initialization function
function initScamurai() {
    console.log('Scamurai: Initializing...');

    // Create and inject the floating action button
    injectFloatingButton();

    // Add event listener for messages from the background script
    chrome.runtime.onMessage.addListener(handleMessages);

    console.log('Scamurai: Initialized successfully');
}

// Create and inject the floating action button
function injectFloatingButton() {
    // Create the button element
    const button = document.createElement('button');
    button.id = 'scamurai-fab';
    button.innerText = CONFIG.buttonText;
    button.classList.add('scamurai-fab', CONFIG.buttonPosition);

    // Add click event listener
    button.addEventListener('click', handleButtonClick);

    // Append to the document body
    document.body.appendChild(button);
}

// Handle the button click event
async function handleButtonClick() {
    console.log('Scamurai: Button clicked');

    // Show a loading indicator
    showLoadingIndicator();
    console.log('Scamurai: Loading indicator shown');

    try {
        // Capture the current content (either via screenshot or text extraction)
        const contentData = await captureContent();
        console.log('Scamurai: Content captured', contentData);

        // Send the data to the backend for analysis
        const analysisResult = await sendToBackend(contentData);

        // Display the results in an overlay
        showResultsOverlay(analysisResult);
    } catch (error) {
        console.error('Scamurai: Error processing content', error);
        showError('An error occurred while checking for scams. Please try again.');
    }
}

// Show a loading indicator while processing
function showLoadingIndicator() {
    // Create and inject a loading overlay if it doesn't exist
    let loadingOverlay = document.getElementById('scamurai-loading');

    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'scamurai-loading';
        loadingOverlay.classList.add('scamurai-overlay', 'loading');
        loadingOverlay.innerHTML = `
        <div class="scamurai-overlay-content">
          <div class="scamurai-spinner"></div>
          <p>Analyzing content for potential scams...</p>
        </div>
      `;
        document.body.appendChild(loadingOverlay);
    }

    loadingOverlay.style.display = 'flex';
}

// Hide the loading indicator
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('scamurai-loading');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// Capture content from the current page
async function captureContent() {
    // Determine which capture method to use
    // For this example, we'll just extract text from the visible page

    // Get the visible text content
    const textContent = document.body.innerText;

    // For email-specific sites like Gmail, we can be more targeted
    if (window.location.href.includes('mail.google.com')) {
        // Try to find the currently open email
        const emailContainer = document.querySelector('[role="main"]');
        return emailContainer ? emailContainer.innerText : textContent;
    }

    // For WhatsApp Web, focus on the conversation
    if (window.location.href.includes('web.whatsapp.com')) {
        const chatContent = document.querySelector('#main');
        return chatContent ? chatContent.innerText : textContent;
    }

    // Return the captured text content
    return textContent;
}

// Send the captured content to the backend for analysis
async function sendToBackend(content) {
    try {
        const response = await fetch(CONFIG.backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                url: window.location.href
            }),
        });

        if (!response.ok) {
            throw new Error('Backend returned an error: ' + response.status);
        }

        return await response.json();
    } catch (error) {
        console.error('Scamurai: Error communicating with backend', error);
        throw error;
    }
}

// Display the analysis results in an overlay
function showResultsOverlay(results) {
    // Hide the loading indicator first
    hideLoadingIndicator();

    // Create an overlay element if it doesn't exist
    let resultsOverlay = document.getElementById('scamurai-results');

    if (!resultsOverlay) {
        resultsOverlay = document.createElement('div');
        resultsOverlay.id = 'scamurai-results';
        resultsOverlay.classList.add('scamurai-overlay', 'results');
        document.body.appendChild(resultsOverlay);
    }

    // Format the threat level as a user-friendly indicator
    const threatLevelClass = getThreatLevelClass(results.threatLevel);
    const threatLevelText = getThreatLevelText(results.threatLevel);

    // Populate the overlay with results
    resultsOverlay.innerHTML = `
      <div class="scamurai-overlay-content">
        <div class="scamurai-header">
          <h2>Scamurai Analysis Results</h2>
          <button id="scamurai-close-btn">&times;</button>
        </div>
        <div class="scamurai-results-content">
          <div class="scamurai-threat-indicator ${threatLevelClass}">
            <span class="scamurai-threat-level">${threatLevelText}</span>
            <span class="scamurai-threat-score">${results.threatLevel}/10</span>
          </div>
          <div class="scamurai-explanation">
            <h3>Analysis:</h3>
            <p>${results.explanation}</p>
          </div>
          <div class="scamurai-tips">
            <h3>Safety Tips:</h3>
            <ul>
              ${results.tips ? results.tips.map(tip => `<li>${tip}</li>`).join('') : '<li>Be cautious with requests for personal information.</li><li>Don\'t click on suspicious links.</li>'}
            </ul>
          </div>
        </div>
      </div>
    `;

    // Show the overlay
    resultsOverlay.style.display = 'flex';

    // Add event listener to the close button
    document.getElementById('scamurai-close-btn').addEventListener('click', () => {
        resultsOverlay.style.display = 'none';
    });
}

// Helper function to get a CSS class based on the threat level
function getThreatLevelClass(level) {
    if (level <= 3) return 'low-threat';
    if (level <= 6) return 'medium-threat';
    return 'high-threat';
}

// Helper function to get a text description based on the threat level
function getThreatLevelText(level) {
    if (level <= 3) return 'Low Risk';
    if (level <= 6) return 'Medium Risk';
    return 'High Risk';
}

// Show an error message in an overlay
function showError(message) {
    // Hide the loading indicator first
    hideLoadingIndicator();

    // Create an overlay for the error message
    let errorOverlay = document.getElementById('scamurai-error');

    if (!errorOverlay) {
        errorOverlay = document.createElement('div');
        errorOverlay.id = 'scamurai-error';
        errorOverlay.classList.add('scamurai-overlay', 'error');
        document.body.appendChild(errorOverlay);
    }

    // Populate the error overlay
    errorOverlay.innerHTML = `
      <div class="scamurai-overlay-content">
        <div class="scamurai-header">
          <h2>Scamurai Error</h2>
          <button id="scamurai-error-close-btn">&times;</button>
        </div>
        <div class="scamurai-error-content">
          <p>${message}</p>
        </div>
      </div>
    `;

    // Show the overlay
    errorOverlay.style.display = 'flex';

    // Add event listener to the close button
    document.getElementById('scamurai-error-close-btn').addEventListener('click', () => {
        errorOverlay.style.display = 'none';
    });
}

// Handle messages from the background script
function handleMessages(message, sender, sendResponse) {
    console.log('Scamurai: Received message', message);

    if (message.action === 'checkCurrentPage') {
        handleButtonClick();
        sendResponse({ status: 'checking' });
    }

    return true; // Keep the message channel open for asynchronous responses
}

// Initialize when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScamurai);
} else {
    initScamurai();
}