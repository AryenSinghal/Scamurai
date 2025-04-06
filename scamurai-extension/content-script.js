// Scamurai Content Script
// This script injects a floating action button and handles the scam detection functionality

// Configuration
const CONFIG = {
    backendUrl: 'http://localhost:5001/api/scan', // Replace with your actual backend URL
    buttonText: 'Scamurai',
    buttonPosition: 'top-right', // Default position: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
};

// Variables to track drag state
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let buttonPosition = { x: 0, y: 0 };
let isProcessing = false; // Flag to prevent multiple clicks while processing
let hasMoved = false; // Track if movement has occurred during mousedown

// Main initialization function
function initScamurai() {
    console.log('Scamurai: Initializing...');

    // Create and inject the floating action button
    injectFloatingButton();

    // Add event listener for messages from the background script
    chrome.runtime.onMessage.addListener(handleMessages);

    // Load saved button position from storage
    loadButtonPosition();

    console.log('Scamurai: Initialized successfully');
}

// Load the saved button position
function loadButtonPosition() {
    chrome.storage.sync.get(['buttonPosition'], (result) => {
        if (result.buttonPosition) {
            buttonPosition = result.buttonPosition;
            const button = document.getElementById('scamurai-fab');
            if (button) {
                // Set the position from saved values
                button.style.top = buttonPosition.y + 'px';
                button.style.left = buttonPosition.x + 'px';

                // Clear default positioning classes
                button.className = 'scamurai-fab';
            }
        }
    });
}

// Save button position to storage
function saveButtonPosition() {
    chrome.storage.sync.set({ buttonPosition });
}

// Create and inject the floating action button
function injectFloatingButton() {
    // Create the button element
    const button = document.createElement('button');
    button.id = 'scamurai-fab';
    button.title = 'Scamurai'; // Add title for accessibility
    button.classList.add('scamurai-fab', CONFIG.buttonPosition);
    
    // No text content needed since we're using an image
    
    // Add click event listener
    button.addEventListener('mousedown', startDrag);
    button.addEventListener('click', handleClickIfNotDragging);
    
    // Append to the document body
    document.body.appendChild(button);
  }
    
// Function to handle the initial mousedown for dragging
function startDrag(e) {
    // Always reset hasMoved at the start of a potential drag operation
    hasMoved = false;

    // Prevent default to avoid text selection
    e.preventDefault();

    // Start dragging
    isDragging = true;

    // Calculate the offset from the pointer to the button's corner
    const buttonRect = e.target.getBoundingClientRect();
    dragOffsetX = e.clientX - buttonRect.left;
    dragOffsetY = e.clientY - buttonRect.top;

    // Clear the default positioning classes
    e.target.className = 'scamurai-fab';

    // Add document-level event listeners for dragging
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', endDrag);
}

// Handle drag move
function handleDragMove(e) {
    if (!isDragging) return;

    // Mark that movement has occurred
    hasMoved = true;

    const button = document.getElementById('scamurai-fab');
    if (!button) return;

    // Calculate new position
    const newX = e.clientX - dragOffsetX;
    const newY = e.clientY - dragOffsetY;

    // Keep button within viewport bounds
    const buttonWidth = button.offsetWidth;
    const buttonHeight = button.offsetHeight;

    // Apply bounds checking
    const maxX = window.innerWidth - buttonWidth;
    const maxY = window.innerHeight - buttonHeight;

    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));

    // Update button position
    button.style.left = boundedX + 'px';
    button.style.top = boundedY + 'px';

    // Update the position tracking
    buttonPosition = { x: boundedX, y: boundedY };
}

// End drag operation
function endDrag() {
    if (!isDragging) return;

    // End dragging
    isDragging = false;

    // Save the final position
    saveButtonPosition();

    // Remove document-level event listeners
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', endDrag);
}

// This handles the click event
function handleClickIfNotDragging(e) {
    // If we moved during this mouse interaction, cancel the click event
    if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    // Otherwise, handle the legitimate click
    handleButtonClick();
}

// Handle the button click event to directly scan
function handleButtonClick() {
    // If already processing, ignore the click
    if (isProcessing) return;

    isProcessing = true;

    console.log('Scamurai: Button clicked, starting scan');

    // Close any existing popups
    const existingResults = document.getElementById('scamurai-results');
    if (existingResults) {
        existingResults.remove();
    }

    const existingError = document.getElementById('scamurai-error');
    if (existingError) {
        existingError.remove();
    }

    // Get button position for the loading indicator
    const button = document.getElementById('scamurai-fab');

    // Show the loading indicator
    showLoadingIndicator(button);

    // Start the scan process
    setTimeout(async () => {
        try {
            // Capture the current content
            const contentData = await captureContent();
            console.log('Scamurai: Content captured', contentData);

            // Send the data to the backend for analysis
            const analysisResult = await sendToBackend(contentData);

            // Display the results in a speech bubble
            showResultsOverlay(analysisResult, button);
        } catch (error) {
            console.error('Scamurai: Error processing content', error);
            showError('An error occurred while checking for scams. Please try again.', button);
        } finally {
            isProcessing = false;
        }
    }, 1000);
}

// Show a loading indicator while processing
function showLoadingIndicator(button) {
    if (!button) return;

    // Remove any existing loading overlay
    const existingLoader = document.getElementById('scamurai-loading');
    if (existingLoader) {
        existingLoader.remove();
    }

    // Create a new loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'scamurai-loading';
    loadingOverlay.classList.add('scamurai-loading-bubble');

    // Get button position
    const buttonRect = button.getBoundingClientRect();

    // Set base styles
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.zIndex = '9998';

    // Create loading content
    loadingOverlay.innerHTML = `
        <div class="loading-bubble-content">
            <div class="bubble-arrow"></div>
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Scanning for scams...</p>
            </div>
        </div>
    `;

    // Append to the body
    document.body.appendChild(loadingOverlay);

    // Position the bubble
    positionBubble(loadingOverlay, button);
}

// Hide the loading indicator
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('scamurai-loading');
    if (loadingOverlay) {
        loadingOverlay.remove();
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

// Display the analysis results in a speech bubble
function showResultsOverlay(results, button) {
    // Hide the loading indicator first
    hideLoadingIndicator();

    if (!button) {
        button = document.getElementById('scamurai-fab');
    }

    if (!button) {
        console.error('Scamurai: Button not found for positioning results');
        return;
    }

    // Create results container
    const resultsOverlay = document.createElement('div');
    resultsOverlay.id = 'scamurai-results';
    resultsOverlay.classList.add('scamurai-speech-bubble');

    // Format the threat level as a user-friendly indicator
    const threatLevelClass = getThreatLevelClass(results.threatLevel);
    const threatLevelText = getThreatLevelText(results.threatLevel);

    // Populate the overlay with results
    resultsOverlay.innerHTML = `
    <div class="bubble-arrow"></div>
    <div class="results-content">
      <div class="result-header">
        <h2>Scan Results</h2>
        <button id="scamurai-close-btn">&times;</button>
      </div>
      <div class="result-body">
        <div class="threat-indicator ${threatLevelClass}">
          <span class="threat-level">${threatLevelText}</span>
          <span class="threat-score">${results.threatLevel}/10</span>
        </div>
        <div class="explanation">
          <h3>Analysis:</h3>
          <p>${results.explanation}</p>
        </div>
        ${results.reasons && results.threatLevel >= 5 ? `
          <div class="reasons">
            <h3>Reasons for Concern:</h3>
            <ul>
              ${results.reasons.map(reason => `<li>${reason}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${results.threatLevel >= 7 ? `
          <div class="high-alert">
            <p>If you were about to share personal information or send money, please stop and talk to a trusted friend or family member first.</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;

    // Add to the document
    document.body.appendChild(resultsOverlay);

    // Position the popup directly
    positionBubble(resultsOverlay, button);

    // Make the results visible
    resultsOverlay.style.display = 'block';

    // Add event listener to the close button
    document.getElementById('scamurai-close-btn').addEventListener('click', () => {
        resultsOverlay.remove();
    });

    // Add the result to scan history
    addToScanHistory(results);
}

// Position bubble next to button
function positionBubble(bubble, button) {
    if (!bubble || !button) return;

    // Get button position
    const buttonRect = button.getBoundingClientRect();

    // Determine available space in different directions
    const spaceRight = window.innerWidth - buttonRect.right;
    const spaceLeft = buttonRect.left;
    const spaceBottom = window.innerHeight - buttonRect.bottom;
    const spaceTop = buttonRect.top;

    // Set basic styles
    bubble.style.position = 'fixed';
    bubble.style.maxWidth = '480px';
    bubble.style.zIndex = '9998';

    // Get arrow element
    const arrow = bubble.querySelector('.bubble-arrow');
    if (!arrow) return;

    // Set arrow styles
    arrow.style.position = 'absolute';
    arrow.style.width = '0';
    arrow.style.height = '0';

    // Choose best position based on available space
    if (spaceRight >= 340) { // Enough space to the right
        // Position to the right of the button
        bubble.style.left = `${buttonRect.right + 15}px`;
        bubble.style.top = `${buttonRect.top}px`;
        bubble.style.right = 'auto';
        bubble.style.bottom = 'auto';

        // Position arrow on the left
        arrow.style.left = '-10px';
        arrow.style.top = '20px';
        arrow.style.borderTop = '10px solid transparent';
        arrow.style.borderBottom = '10px solid transparent';
        arrow.style.borderRight = '10px solid white';
    }
    else if (spaceLeft >= 340) { // Enough space to the left
        // Position to the left of the button
        bubble.style.right = `${window.innerWidth - buttonRect.left + 15}px`;
        bubble.style.left = 'auto';
        bubble.style.top = `${buttonRect.top}px`;
        bubble.style.bottom = 'auto';

        // Position arrow on the right
        arrow.style.right = '-10px';
        arrow.style.top = '20px';
        arrow.style.borderTop = '10px solid transparent';
        arrow.style.borderBottom = '10px solid transparent';
        arrow.style.borderLeft = '10px solid white';
    }
    else if (spaceBottom >= 250) { // Enough space below
        // Position below the button
        bubble.style.top = `${buttonRect.bottom + 15}px`;
        bubble.style.left = `${buttonRect.left - 130 + (buttonRect.width / 2)}px`;
        bubble.style.right = 'auto';
        bubble.style.bottom = 'auto';

        // Position arrow on top
        arrow.style.top = '-10px';
        arrow.style.left = '130px';
        arrow.style.borderLeft = '10px solid transparent';
        arrow.style.borderRight = '10px solid transparent';
        arrow.style.borderBottom = '10px solid white';
    }
    else if (spaceTop >= 250) { // Enough space above
        // Position above the button
        bubble.style.bottom = `${window.innerHeight - buttonRect.top + 15}px`;
        bubble.style.top = 'auto';
        bubble.style.left = `${buttonRect.left - 130 + (buttonRect.width / 2)}px`;
        bubble.style.right = 'auto';

        // Position arrow at bottom
        arrow.style.bottom = '-10px';
        arrow.style.left = '130px';
        arrow.style.borderLeft = '10px solid transparent';
        arrow.style.borderRight = '10px solid transparent';
        arrow.style.borderTop = '10px solid white';
    }
    else {
        // Default position (to the right, but with adjusted positioning)
        bubble.style.left = `${Math.max(10, buttonRect.right + 10)}px`;
        bubble.style.top = `${Math.max(10, buttonRect.top)}px`;
        bubble.style.right = 'auto';
        bubble.style.bottom = 'auto';

        // Adjust arrow as needed
        arrow.style.left = '-10px';
        arrow.style.top = '20px';
        arrow.style.borderTop = '10px solid transparent';
        arrow.style.borderBottom = '10px solid transparent';
        arrow.style.borderRight = '10px solid white';
    }
}

// Add scan result to history
function addToScanHistory(result) {
    chrome.storage.local.get(['scamHistory'], (data) => {
        const history = data.scamHistory || [];

        // Add current scan with timestamp and URL
        history.push({
            timestamp: new Date().toISOString(),
            url: window.location.href,
            threatLevel: result.threatLevel,
            explanation: result.explanation
        });

        // Limit history size (keep last 50 scans)
        if (history.length > 50) {
            history.shift();
        }

        // Save updated history
        chrome.storage.local.set({ scamHistory: history });
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

// Show an error message in a speech bubble
function showError(message, button) {
    // Hide the loading indicator first
    hideLoadingIndicator();

    if (!button) {
        button = document.getElementById('scamurai-fab');
    }

    if (!button) {
        console.error('Scamurai: Button not found for positioning error');
        return;
    }

    // Create error container
    const errorOverlay = document.createElement('div');
    errorOverlay.id = 'scamurai-error';
    errorOverlay.classList.add('scamurai-speech-bubble');

    // Populate the error overlay
    errorOverlay.innerHTML = `
      <div class="bubble-arrow"></div>
      <div class="results-content">
        <div class="result-header">
          <h2>Error</h2>
          <button id="scamurai-error-close-btn">&times;</button>
        </div>
        <div class="result-body">
          <p class="error-message">${message}</p>
          <button class="action-btn" id="try-again-btn">Try Again</button>
        </div>
      </div>
    `;

    // Add to document
    document.body.appendChild(errorOverlay);

    // Position the error bubble
    positionBubble(errorOverlay, button);

    // Make the error visible
    errorOverlay.style.display = 'block';

    // Add event listener to the close button
    document.getElementById('scamurai-error-close-btn').addEventListener('click', () => {
        errorOverlay.remove();
    });

    // Add event listener to the try again button
    document.getElementById('try-again-btn').addEventListener('click', () => {
        errorOverlay.remove();
        handleButtonClick();
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