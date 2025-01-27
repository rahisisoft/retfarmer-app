import { useState } from "react";
import axios from "axios";
import UserLayout from "@/components/UserLayout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Message() {
  const [textInput, setTextInput] = useState(""); // Text input
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extract the text content
const extractText = (data) => {
    // Access the first candidate
    const candidate = data.candidates[0];
    if (candidate && candidate.content && candidate.content.parts) {
      return candidate.content.parts.map((part) => part.text).join("\n");
    }
    return null;
  };

  const analyzeInput = async () => {
    if (!textInput.trim()) {
      setError("Please provide text");
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      setAnalysisResult(null);
  
      const apiKey = "AIzaSyDkeRv6K0ORqHrGHK8H83ytc2-iWhecxnA"; // Replace with your actual API key
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
      
      const requestData = {
          contents: [
            {
              parts: [
                {
                  text: textInput,// Input text for the API
                },
              ],
            },
          ],
        };
  
      const response = await axios.post(endpoint, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      setAnalysisResult(extractText(response.data));
    } catch (err) {
      console.error("Error treating input:", err);
      setError("Failed to treat the input. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <UserLayout>
      <h1>Chat Box</h1>
      <div>
        <label htmlFor="textInput" className="form-label">
          Your Question in any Language
        </label>
        <textarea
          id="textInput"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="form-control"
          rows="5"
        />
      </div>
      <button onClick={analyzeInput} disabled={loading} className="btn btn-primary" style={{ marginTop: "10px" }}>
        {loading ? "Treating ..." : "Treat"}
      </button>
      <hr/>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {analysisResult && (
        <div>
          <h3>Treatment Result:</h3>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysisResult}</ReactMarkdown>
        </div>
      )}
    </UserLayout>
  );
}
