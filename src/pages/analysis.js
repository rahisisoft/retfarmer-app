import { useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import UserLayout from "@/components/UserLayout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

export default function Analysis() {
  const { language, changeLanguage } = useContext(LanguageContext);
  const { t } = useTranslation("soil");

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentRating, setCurrentRating] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("soilAnalysisHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("soilAnalysisHistory", JSON.stringify(history));
  }, [history]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const analyzeInput = async () => {
    if (!language || !selectedImage) {
      setError(t.error || "Please select a language and image.");
      return;
    }

    const formData = new FormData();
    formData.append("textInput", language);
    formData.append("image", selectedImage);

    try {
      setLoading(true);
      setError(null);
      setAnalysisResult(null);
      setCurrentRating(0);

      const response = await axiosInstance.post("/gemini-api-3.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resultText = response.data.text;
      setAnalysisResult(resultText);
    } catch (err) {
      console.error("Error analyzing input:", err);
      setError(t.failed || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveWithRating = () => {
    if (!analysisResult || !currentRating) return;

    const newEntry = {
      language,
      image: imagePreview,
      result: analysisResult,
      rating: currentRating,
      timestamp: new Date().toISOString(),
    };

    setHistory((prev) => [newEntry, ...prev]);
    setAnalysisResult(null);
    setCurrentRating(0);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("soilAnalysisHistory");
  };

  return (
    <UserLayout>
      <div className="container py-4">
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h2 className="text-center text-primary mb-4">🌿 {t.title}</h2>

            

            <div className="mb-3">
              <label htmlFor="imageInput" className="form-label fw-semibold">
                🖼️ {t.upload}
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
              <div className="mb-3 text-center">
                <h6 className="text-muted">{t.preview}:</h6>
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="img-fluid border rounded"
                  style={{ maxHeight: "300px", objectFit: "contain" }}
                />
              </div>
            )}

            <div className="d-grid">
              <button
                onClick={analyzeInput}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    {t.analyzing}
                  </>
                ) : (
                  <>🔍 {t.analyze}</>
                )}
              </button>
            </div>

            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                ❌ {error}
              </div>
            )}

            {analysisResult && (
              <div className="mt-4">
                <h4 className="text-success">✅ {t.result}</h4>
                <div className="mt-2 p-3 border rounded bg-light">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {analysisResult}
                  </ReactMarkdown>
                </div>

                <div className="mt-3">
                  <label className="form-label fw-semibold">⭐ {t.rate}</label>
                  <div className="mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setCurrentRating(star)}
                        style={{
                          cursor: "pointer",
                          color: star <= currentRating ? "#ffc107" : "#ccc",
                          fontSize: "1.5rem",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <button className="btn btn-success" onClick={saveWithRating} disabled={!currentRating}>
                    💾 Save with Rating
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-secondary">🕘 {t.history}</h5>
                <button className="btn btn-sm btn-outline-danger" onClick={handleClearHistory}>
                  🗑 {t.clear}
                </button>
              </div>
              <ul className="list-group">
                {history.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action"
                    onClick={() => setAnalysisResult(item.result)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{item.language}</strong> – {new Date(item.timestamp).toLocaleString()}<br />
                        {item.rating && (
                          <span>
                            Rating: {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                          </span>
                        )}
                      </div>
                      {item.image && (
                        <img
                          src={item.image}
                          alt="preview"
                          height={40}
                          className="rounded border"
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
