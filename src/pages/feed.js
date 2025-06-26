import { useState, useEffect, useCallback, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import UserLayout from "@/components/UserLayout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

export default function FeedCheck() {
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation("feed");

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("feedAnalysisHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("feedAnalysisHistory", JSON.stringify(history));
  }, [history]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const analyzeInput = useCallback(async () => {
    if (!language || !selectedImage) {
      setError(t.error || "Please provide a language and an image.");
      return;
    }

    const formData = new FormData();
    formData.append("textInput", language);
    formData.append("image", selectedImage);

    try {
      setLoading(true);
      setError(null);
      setAnalysisResult(null);

      const response = await axiosInstance.post("/gemini-api-2.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resultText = response.data.text;
      setAnalysisResult(resultText);

      const newEntry = {
        language,
        image: imagePreview,
        result: resultText,
        timestamp: new Date().toISOString(),
      };

      setHistory((prev) => [newEntry, ...prev]);
    } catch (err) {
      console.error("Error analyzing input:", err);
      setError(t.failed || "Analysis failed");
    } finally {
      setLoading(false);
    }
  }, [language, selectedImage, imagePreview, t]);

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("feedAnalysisHistory");
  };

  return (
    <UserLayout>
      <div className="container py-4">
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h2 className="text-center text-primary mb-4">🌾 {t.title || "Feed Check"}</h2>

            <div className="mb-3">
              <label htmlFor="imageInput" className="form-label fw-semibold">
                🖼️ {t.upload || "Upload Image"}
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
                <h6 className="text-muted">{t.preview || "Preview"}:</h6>
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
                    {t.analyzing || "Analyzing..."}
                  </>
                ) : (
                  <>🔍 {t.analyze || "Analyze"}</>
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
                <h4 className="text-success">✅ {t.result || "Result"}</h4>
                <div className="mt-2 p-3 border rounded bg-light">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {analysisResult}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-secondary">🕘 {t.history || "History"}</h5>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleClearHistory}
                >
                  🗑 {t.clear || "Clear"}
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
                      <span>
                        <strong>{item.language}</strong> –{" "}
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
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
