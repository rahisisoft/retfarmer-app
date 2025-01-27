import { useState } from "react";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import UserLayout from "@/components/UserLayout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Plant() {
  const [textInput, setTextInput] = useState(""); // Text input
  const [selectedImage, setSelectedImage] = useState(null); // Image input
  const [imagePreview, setImagePreview] = useState(null); // Preview URL
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
    } else {
      setImagePreview(null); // Clear preview if no file is selected
    }
  };

  const analyzeInput = async () => {
    if (!textInput.trim() && !selectedImage) {
      setError("Please provide text or an image to analyze.");
      return;
    }

    const formData = new FormData();
    formData.append("textInput", textInput);
    formData.append("image", selectedImage);

    try {
      setLoading(true);
      setError(null);
      setAnalysisResult(null);

      // Appelez votre serveur PHP qui interagit avec l'API Gemini
      const response = await axiosInstance.post("/gemini-api.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAnalysisResult(response.data.text);
    } catch (err) {
      console.error("Error analyzing input:", err);
      setError("Failed to analyze the input. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <h1>Disease Detection</h1>
      <div>
        <label htmlFor="textInput" className="form-label">
          Language :
        </label>

        <select
            id="textInput"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="form-control"
            required
          >
            <option value="English">English</option>
            <option value="French">French</option>
            <option value="Kirundi">Kirundi</option>
            <option value="Swahili">Swahili</option>
      </select>
      </div>
      <div>
        <label htmlFor="imageInput" className="form-label">
          Upload an image :
        </label>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          onChange={handleImageChange}
          className="form-control"
        />
      </div>
      {imagePreview && (
        <div style={{ marginTop: "10px" }}>
          <h5>Image Preview:</h5>
          <img
            src={imagePreview}
            alt="Selected"
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              objectFit: "contain",
              border: "1px solid #ccc",
              padding: "5px",
            }}
          />
        </div>
      )}
      <button
        onClick={analyzeInput}
        disabled={loading}
        className="btn btn-primary"
        style={{ marginTop: "10px" }}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {analysisResult && (
        <div>
          <h3>Analysis Result:</h3>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysisResult}</ReactMarkdown>
        </div>
      )}
    </UserLayout>
  );
}
