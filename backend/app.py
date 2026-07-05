from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests
import base64
import google.generativeai as genai
import re

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

# Create Flask app
app = Flask(__name__)
CORS(app)


# ---------------- HOME ---------------- #

@app.route("/")
def home():
    return {
        "message": "Backend Running"
    }


# ---------------- IMAGE UPLOAD ---------------- #

@app.route("/upload", methods=["POST"])
def upload():

    if "image" not in request.files:
        return {"error": "No image uploaded"}, 400

    image = request.files["image"]

    private_key = os.getenv("IMAGEKIT_PRIVATE_KEY")

    auth = base64.b64encode(f"{private_key}:".encode()).decode()

    response = requests.post(
        "https://upload.imagekit.io/api/v1/files/upload",
        headers={
            "Authorization": f"Basic {auth}"
        },
        data={
            "fileName": image.filename
        },
        files={
            "file": image.stream
        }
    )

    return response.json()


# ---------------- GEMINI AI ---------------- #

@app.route("/improve-description", methods=["POST"])
def improve_description():

    data = request.get_json()

    description = data.get("description", "")

    prompt = f"""
You are an AI assistant for a civic complaint application.

The user complaint is:

{description}

Perform ALL the following tasks.

1. Rewrite the complaint professionally.
2. Predict the category from ONLY these:
   - Road
   - Garbage
   - Water
   - Electricity
3. Predict the priority:
   - Low
   - Medium
   - High

Return ONLY in this exact format:

Description: <improved complaint>

Category: <category>

Priority: <priority>
"""

    response = model.generate_content(prompt)

    text = response.text.strip()

    import re

    improved = re.search(r"Description:\s*(.*)", text)
    category = re.search(r"Category:\s*(Road|Garbage|Water|Electricity)", text)
    priority = re.search(r"Priority:\s*(Low|Medium|High)", text, re.IGNORECASE)

    improved = improved.group(1).strip() if improved else description
    category = category.group(1).strip() if category else ""
    priority = priority.group(1).capitalize() if priority else "Low"

    return {
        "improvedText": improved,
        "category": category,
        "priority": priority
    }


# ---------------- RUN SERVER ---------------- #

if __name__ == "__main__":
    app.run(debug=True)