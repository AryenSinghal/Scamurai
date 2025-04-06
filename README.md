# Scamurai - Browser Extension for Scam Detection

Scamurai is a browser extension designed to help elderly users detect scams on popular websites like Gmail and WhatsApp Web. The extension provides a simple, accessible interface for analyzing potentially suspicious content using Google's Gemini AI.

## Project Structure

The project consists of two main components:

1. **Browser Extension** - Chrome/Firefox extension that injects a floating samurai button on supported websites, allowing users to scan content for potential scams.
2. **Training Dojo** - A user-interactive React & Flask webapp which provides custom-generated examples of scam emails/texts to teach the user how to recognize scams.

## Features

- **Floating Action Button (FAB)** - Large, accessible button that appears on supported websites
- **Simple One-Click Scanning** - Users can check suspicious content with a single click
- **AI-Powered Analysis** - Uses Google's Gemini AI to analyze content for scam indicators
- **User-Friendly Results** - Presents findings with clear threat levels and simple explanations in a cool samurai voice

## Installation Instructions

### Setting Up the Backend

1. Clone this repository
2. Navigate to the `scamurai-backend` directory
3. Create a virtual environment (recommended)
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. Install dependencies
   ```
   pip install -r requirements.txt
   ```
5. Create a `.env` file based on `.env.template`
   ```
   cp .env.template .env
   ```
6. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey) and add it to the `.env` file
7. Start the backend server
   ```
   python app.py
   ```

### Installing the Browser Extension

#### Chrome
1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" (toggle in the top-right corner)
3. Click "Load unpacked" and select the `scamurai-extension` directory
4. The Scamurai extension should now be installed and visible in your toolbar

#### Firefox
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Navigate to the `scamurai-extension` directory and select any file (e.g., `manifest.json`)
4. The Scamurai extension should now be installed and visible in your toolbar

## Usage

1. Visit a supported website (currently Gmail or WhatsApp Web)
2. Look for the Scamurai floating button in the corner of the page
3. Click the button to analyze the current content for potential scams
4. Review the results in the overlay window
5. Follow the provided safety tips if a scam is detected

## Customization

### Supported Websites
You can modify the list of supported websites by editing the `manifest.json` file:
- Update the `matches` array in the `content_scripts` section
- Update the `host_permissions` array

### Button Position
You can change the position of the floating button by modifying the `buttonPosition` property in the `CONFIG` object at the top of `content-script.js`:
- Options: 'bottom-right', 'bottom-left', 'top-right', 'top-left'

### Backend URL
Update the `backendUrl` property in the `CONFIG` object in `content-script.js` to point to your deployed backend server.

## Deployment

### Backend Deployment
The backend can be deployed to any service that supports Python/Flask applications:
- Heroku
- Render
- AWS Lambda
- Google Cloud Run

Remember to set the `GEMINI_API_KEY` environment variable in your deployment environment.

### Extension Publishing
To publish the extension to the Chrome Web Store or Firefox Add-ons:
1. Create a ZIP file of the `scamurai-extension` directory
2. Create a developer account on the respective store
3. Submit your extension following the store's guidelines

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini API for the AI-powered scam detection
- All contributors and users who help improve this tool