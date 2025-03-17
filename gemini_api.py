import requests
import json
import os

# Load API Key from Environment Variable
API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = "gemini-1.5-pro"

# Function to send a request to Gemini
def ask_gemini(prompt):
    url = f"https://generativelanguage.googleapis.com/v1/models/{MODEL_NAME}:generateContent?key={API_KEY}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()["candidates"][0]["content"]["parts"][0]["text"]
    else:
        return f"Error {response.status_code}: {response.json()}"

# Example test
if __name__ == "__main__":
    print(ask_gemini("Hello, Gemini! Can you generate an AI-driven guideline?"))
