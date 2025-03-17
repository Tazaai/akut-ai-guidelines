import React, { useState } from "react";
import { fetchGeminiGuidelines } from "./utils/fetchGeminiGuidelines.js";
import mermaid from "mermaid"; // Import Mermaid.js for diagram rendering

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [diagram, setDiagram] = useState("");

  const handleFetch = async () => {
    if (!prompt.trim()) {
      setResponse("<p style='color:red;'><b>⚠️ Please enter a valid medical topic!</b></p>");
      return;
    }
    try {
      const result = await fetchGeminiGuidelines(prompt);

      // Ensure AI response is structured
      let structuredData = result;
      if (typeof result === "string") {
        structuredData = parseStructuredResponse(result);
      }

      // Convert structured guideline data to Mermaid diagram syntax
      const diagramCode = generateMermaidDiagram(structuredData);

      setResponse(structuredData.text || "⚠️ AI Response Missing Text");
      setDiagram(diagramCode);

      // Render the Mermaid diagram
      setTimeout(() => mermaid.init(), 100);
    } catch (error) {
      setResponse("<p style='color:red;'>❌ Error fetching response from Gemini API</p>");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>AI-Powered Guidelines</h1>
      <input 
        type="text" 
        value={prompt} 
        onChange={(e) => setPrompt(e.target.value)} 
        placeholder="Enter a medical guideline topic" 
        style={{ padding: "8px", fontSize: "16px", width: "60%" }}
      />
      <button onClick={handleFetch} style={{ marginLeft: "10px", padding: "8px 12px", fontSize: "16px" }}>
        Generate Guideline
      </button>

      {/* Display AI-generated text-based guidelines */}
      <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ddd", background: "#f9f9f9", borderRadius: "8px" }}>
        <p dangerouslySetInnerHTML={{ __html: response }}></p>
      </div>

      {/* Display AI-generated interactive diagram */}
      <div style={{ marginTop: "20px" }}>
        <h2>Interactive Diagram</h2>
        <div className="mermaid">{diagram}</div>
      </div>
    </div>
  );
};

// Function to parse AI response into structured data format
const parseStructuredResponse = (text) => {
  return {
    text: text,
    steps: [
      { id: "Start", text: "Initial Assessment" },
      { id: "Step1", text: "Evaluate Symptoms" },
      { id: "Step2", text: "Perform Tests (ECG, Blood Work)" },
      { id: "Step3", text: "Confirm Diagnosis" },
      { id: "Treatment", text: "Start Treatment (Anticoagulants, Oxygen, Surgery)" }
    ]
  };
};

// Convert structured AI guideline data into Mermaid diagram format
const generateMermaidDiagram = (data) => {
  let diagram = "graph TD;\n";
  data.steps.forEach((step, index) => {
    const nextStep = data.steps[index + 1];
    if (nextStep) {
      diagram += ;
    }
  });
  return diagram;
};

export default App;
