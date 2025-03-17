import google.generativeai as genai

genai.configure(api_key="AIzaSyBHtygbSNvVCVbMF9RUv0yCg8Onfd4rCXw") # Replace with your API key

for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(model.name)
