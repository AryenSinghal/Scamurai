import os
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Gemini API with your API key
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    logger.error("GEMINI_API_KEY not found in environment variables")
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

# Predefined prompt template
PROMPT_TEMPLATE = """
You are Scamurai, an advanced scam detection assistant designed to help elderly users 
identify potential scams in online communication. Analyze the following content 
carefully and determine if it appears to be a scam.

Content to analyze:
```
{content}
```

URL/Source: {url}

Provide an analysis with the following:
1. A threat level score from 1-10 (where 1 is safe and 10 is definitely a scam)
2. A clear explanation of your analysis in simple language suitable for elderly users
3. Three specific safety tips based on this particular content

Format your response as a JSON object with these fields:
- threatLevel: (number between 1-10)
- explanation: (string with your analysis)
- tips: (array of strings with safety tips)

Only respond with the JSON object, nothing else.
"""

@app.route('/api/scan', methods=['POST'])
def scan_content():
    """
    Endpoint to scan content for potential scams
    
    Expected POST body:
    {
        "content": "Text content to analyze",
        "url": "URL or source of the content"
    }
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data or 'content' not in data:
            return jsonify({"error": "Missing required fields"}), 400
        
        content = data.get('content', '')
        url = data.get('url', 'Unknown source')
        
        # Log request (excluding potentially sensitive content)
        logger.info(f"Received scan request from: {url}")
        
        # Generate the prompt with the content
        prompt = PROMPT_TEMPLATE.format(content=content, url=url)
        
        # Call Gemini API
        response = model.generate_content(prompt)
        
        # Parse response text as JSON
        try:
            result = json.loads(response.text)
            
            # Validate the response format
            if not isinstance(result, dict):
                logger.error(f"Invalid response format from Gemini API: {response.text}")
                return jsonify({
                    "threatLevel": 5,
                    "explanation": "Sorry, I couldn't properly analyze this content. Please try again or ask for help.",
                    "tips": [
                        "When in doubt, don't provide personal information.",
                        "Ask a trusted friend or family member for a second opinion.",
                        "Contact the supposed sender through official channels to verify."
                    ]
                }), 200
            
            # Log the threat level (but not the full analysis to protect privacy)
            logger.info(f"Analysis complete. Threat level: {result.get('threatLevel', 'N/A')}")
            
            # Return the result
            return jsonify(result), 200
            
        except json.JSONDecodeError:
            logger.error(f"Failed to parse Gemini API response as JSON: {response.text}")
            
            # Fallback response
            return jsonify({
                "threatLevel": 5,
                "explanation": "Sorry, I couldn't properly analyze this content. Please try again or ask for help.",
                "tips": [
                    "When in doubt, don't provide personal information.",
                    "Ask a trusted friend or family member for a second opinion.",
                    "Contact the supposed sender through official channels to verify."
                ]
            }), 200
    
    except Exception as e:
        logger.exception(f"Error processing scan request: {str(e)}")
        return jsonify({"error": "An internal error occurred"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    # Get port from environment variable or use default
    port = int(os.getenv('PORT', 5000))
    
    # Run the app
    app.run(host='0.0.0.0', port=port, debug=True)