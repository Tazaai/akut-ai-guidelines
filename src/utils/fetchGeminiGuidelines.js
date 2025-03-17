export const fetchGeminiGuidelines = async (prompt) => {
  const API_KEY = "AIzaSyBHtygbSNvVCVbMF9RUv0yCg8Onfd4rCXw";  // Directly using your API key
  const MODEL_NAME = "models/gemini-1.5-pro";  // Updated model name
  const url = `https://generativelanguage.googleapis.com/v1/${MODEL_NAME}:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }]}]
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini API";
};
