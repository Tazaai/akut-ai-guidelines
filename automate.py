import subprocess
import google.generativeai as genai

# Configure Gemini API
genai.configure(api_key="AIzaSyBHtygbSNvVCVbMF9RUv0yCg8Onfd4rCXw") # Replace with your API key

model = genai.GenerativeModel('models/gemini-1.5-pro-latest')

def run_command(command):
    """Runs a command in Cloud Shell and returns the output."""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        return result.stdout, result.stderr
    except Exception as e:
        return None, str(e)

def analyze_output(output):
    """Analyzes the output using Gemini API and returns a decision."""
    prompt = f"Analyze the following output and suggest the next step: {output}"
    response = model.generate_content(prompt)
    return response.text

# Example Workflow:

# 1. Start the React app (using gcloud to send commands)
stdout, stderr = run_command("gcloud beta cloud-shell ssh --authorize-session --command='cd akut-ai-guidelines/my-guideline-app && npm start'")

if stderr:
    print(f"Error starting React app: {stderr}")
    decision = analyze_output(stderr)
    print(f"Gemini suggests: {decision}")
    # Implement decision based on Gemini's suggestion (e.g., try a different command)
else:
    print(f"React app started: {stdout}")

# 2. Check if the app is running (using gcloud to check port)
stdout, stderr = run_command("gcloud beta cloud-shell ssh --authorize-session --command='netstat -tuln | grep 46787'")

if not stdout:
    print("React app is not running on port 46787.")
    decision = analyze_output("React app is not running on port 46787.")
    print(f"Gemini suggests: {decision}")
    # Implement decision (e.g., restart the app, try a different port)
else:
    print("React app is running on port 46787.")
