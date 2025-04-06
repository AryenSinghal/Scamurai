import os
import json
import logging
from flask import Flask, request, jsonify, render_template, send_from_directory
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
# Update the Flask app initialization
app = Flask(__name__, 
            static_folder='static',
            static_url_path='',  # This makes the static folder accessible at the root URL
            template_folder='templates')
CORS(app)  # Enable CORS for all routes

# Initialize Gemini API with your API key
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    logger.error("GEMINI_API_KEY not found in environment variables")
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

# Predefined prompt template
PROMPT_TEMPLATE = """
You are Scamurai, an advanced scam detection assistant designed to help elderly users 
identify potential scams in online communication.

Speak as a wise Japanese monk would speak to a trusted friend — calm, brief, and clear. Do not use more words than necessary. 
Let your wisdom be heard in stillness. Avoid technical jargon and complex explanations.

Analyze the following content carefully and determine if it appears to be a scam.

Ignore interface elements such as: "Click here to get older messages", "Return call",
or any other UI text that is part of standard messaging platforms like WhatsApp or email apps.

Content to analyze:
```
{content}
```

URL/Source: {url}

Provide an analysis with the following:
1. A threat level score from 1-10 (where 1 is safe and 10 is definitely a scam)
2. A non-technical explanation based on the threat level:
   - If threat level < 5: Provide a 2-3 line explanation about why this content appears safe
   - If threat level >= 5: 
     a) Provide a 1-2 line preface explanation
     b) For threat levels 5-7: Include 2 bullet points stating exact but 0.5 line reasons why you think it's a scam
     c) For threat levels 8-10: Include 2 bullet points stating exact but 0.5 line reasons why you think it's a scam
     d) Use simple language and avoid technical jargon.

Format your response as a JSON object with these fields:
- threatLevel: (number between 1-10)
- explanation: (string with your preface analysis)
- reasons: (array of strings with bullet points explaining why it's a scam, ONLY if threatLevel >= 5)

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
        
        # Call Gemini API with additional parameters to encourage JSON output
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.1,  # Lower temperature for more deterministic output
                "top_p": 0.92,
                "top_k": 40,
            }
        )
        
        # Extract and clean the response text
        response_text = response.text.strip()
        
        # Try to find JSON in the response (in case there's surrounding text)
        json_start = response_text.find('{')
        json_end = response_text.rfind('}')
        
        if json_start >= 0 and json_end > json_start:
            try:
                # Extract just the JSON part
                json_text = response_text[json_start:json_end+1]
                result = json.loads(json_text)
                
                # Validate the response format
                if not isinstance(result, dict):
                    logger.error(f"Invalid response format from Gemini API: {response_text}")
                    return jsonify({
                        "threatLevel": 5,
                        "explanation": "Sorry, I couldn't properly analyze this content. Please try again or ask for help.",
                        "reasons": [
                            "The content contains elements that are difficult to verify",
                            "Some patterns in the message resemble known scam techniques"
                        ]
                    }), 200
                
                # Log the threat level (but not the full analysis to protect privacy)
                logger.info(f"Analysis complete. Threat level: {result.get('threatLevel', 'N/A')}")
                
                # Return the result
                return jsonify(result), 200
                
            except json.JSONDecodeError:
                logger.error(f"Failed to parse extracted JSON from Gemini API response: {json_text}")
                return jsonify({
                    "threatLevel": 5,
                    "explanation": "Sorry, I couldn't properly analyze this content. Please try again or ask for help.",
                    "reasons": [
                        "The content contains elements that are difficult to verify",
                        "Some patterns in the message resemble known scam techniques"
                    ]
                }), 200
        else:
            # No JSON structure found in response
            logger.error(f"No JSON structure found in Gemini API response: {response_text}")
            return jsonify({
                "threatLevel": 5,
                "explanation": "Sorry, I couldn't properly analyze this content. Please try again or ask for help.",
                "reasons": [
                    "The content contains elements that are difficult to verify",
                    "Some patterns in the message resemble known scam techniques"
                ]
            }), 200
    
    except Exception as e:
        logger.exception(f"Error processing scan request: {str(e)}")
        return jsonify({"error": "An internal error occurred"}), 500

@app.route('/api/training-scenarios', methods=['POST'])
def get_training_scenarios():
    """
    Endpoint to generate training scenarios for the Scamurai Dojo
    
    Expected POST body:
    {
        "contentType": "email" or "chat",
        "originalContent": "The content that was scanned"
    }
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data or 'contentType' not in data:
            return jsonify({"error": "Missing required fields"}), 400
        
        content_type = data.get('contentType', '')
        original_content = data.get('originalContent', '')
        
        # Log request
        logger.info(f"Received training scenarios request for content type: {content_type}")
        

        TRAINING_PROMPT = """
            You are Scamurai, an advanced scam detection assistant helping to train elderly users to identify online scams.

            Generate 4 realistic examples of {content_type} scams similar to the original content below. Each example should 
            test a different scam pattern but be somewhat similar to the original.

            Original content:
            {original_content}

            Copy
            For each example, include:
            1. The scam content (message or email body)
            2. Whether it's a scam (true) or safe (false) - provide this as the "isScam" boolean property
            3. An explanation of why it's a scam or safe that would be helpful to an elderly user learning to identify scams. 
            4. For the explanation: use simple language, avoid technical jargon, keep it simple and concise.

            Format your response as a JSON object with an array of 4 scenarios like this:
            {{
                "scenarios": [
                    {{
                        "content": "Example scam text here...",
                        "isScam": true,
                        "explanation": "This is a scam because it creates false urgency to make you act without thinking. The message claims your account will be locked immediately, which is a common tactic to pressure you. Legitimate companies don't use such threatening language."
                    }},
                    {{
                        "content": "Example safe message here...",
                        "isScam": false,
                        "explanation": "This message is safe because it comes from a legitimate service you use, doesn't ask for personal information, and provides a proper way to contact customer support if needed."
                    }},
                    ... (2 more scenarios)
                ]
            }}

            Make sure to include both scam and safe examples to help users learn to distinguish between them. Create varied and realistic messages that elderly users might encounter.

            Only provide the JSON object, nothing else.
        """


        prompt = TRAINING_PROMPT.format(content_type=content_type, original_content=original_content)
        
        # Call Gemini API
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.7,  # Higher temperature for more varied examples
                "top_p": 0.95,
                "top_k": 40,
            }
        )
        
        # Extract and clean the response text
        response_text = response.text.strip()
        
        # Try to find JSON in the response
        json_start = response_text.find('{')
        json_end = response_text.rfind('}')
        
        if json_start >= 0 and json_end > json_start:
            try:
                # Extract just the JSON part
                json_text = response_text[json_start:json_end+1]
                result = json.loads(json_text)
                
                # Validate the response format
                if not isinstance(result, dict) or 'scenarios' not in result:
                    logger.error(f"Invalid response format from Gemini API: {response_text}")
                    return jsonify({"error": "Failed to generate scenarios"}), 500
                
                # Return the scenarios
                return jsonify(result), 200
                
            except json.JSONDecodeError:
                logger.error(f"Failed to parse JSON from Gemini API response: {json_text}")
                return jsonify({"error": "Failed to parse scenarios"}), 500
        else:
            # No JSON structure found in response
            logger.error(f"No JSON structure found in Gemini API response: {response_text}")
            return jsonify({"error": "Failed to generate scenarios"}), 500
    
    except Exception as e:
        logger.exception(f"Error generating training scenarios: {str(e)}")
        return jsonify({"error": "An internal error occurred"}), 500

# Serve React frontend
@app.route('/dojo')
def dojo():
    return render_template('index.html')

# Root route
@app.route('/')
def index():
    return render_template('index.html')

# Catch-all route to handle React routing
@app.route('/<path:path>')
def catch_all(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return render_template('index.html')

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    # Get port from environment variable or use default
    port = int(os.getenv('PORT', 5001))
    
    # Run the app
    app.run(host='0.0.0.0', port=port, debug=True)