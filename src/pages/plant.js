import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import axiosInstance from "../utils/axiosInstance";
import UserLayout from "@/components/UserLayout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useTranslation } from '@/hooks/useTranslation';

export default function Plant() {
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation('plant');

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [rating, setRating] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger l'historique uniquement au montage initial
  useEffect(() => {
    const stored = localStorage.getItem("analysisHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  // Sauvegarder l'historique seulement quand il change
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("analysisHistory", JSON.stringify(history));
    }
  }, [history]);

  // Gestion propre des URLs d'aperçu d'image
  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setImagePreview(objectUrl);
      
      // Nettoyage: révoquer l'URL quand elle n'est plus nécessaire
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImagePreview(null);
    }
  }, [selectedImage]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  }, []);

  const analyzeInput = useCallback(async () => {
    if (!language || !selectedImage) {
      setError(t.error || "Please select an image and ensure language is set");
      return;
    }

    const formData = new FormData();
    formData.append("textInput", language);
    formData.append("image", selectedImage);

    try {
      setLoading(true);
      setError(null);
      setAnalysisResult(null);
      setRating(0);

      const response = await axiosInstance.post("/gemini-api.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAnalysisResult(response.data.text);
    } catch (err) {
      console.error("Error analyzing input:", err);
      setError(t.failed || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [language, selectedImage, t]);

  const saveResultWithRating = useCallback(() => {
    const newEntry = {
      language,
      image: imagePreview,
      result: analysisResult,
      rating,
      timestamp: new Date().toISOString(),
    };
    
    setHistory((prev) => {
      const newHistory = [newEntry, ...prev];
      localStorage.setItem("analysisHistory", JSON.stringify(newHistory));
      return newHistory;
    });
    
    setAnalysisResult(null);
    setRating(0);
  }, [language, imagePreview, analysisResult, rating]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem("analysisHistory");
  }, []);

  const renderStars = useCallback((value, setValue, disabled = false) => (
    <div>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => !disabled && setValue(i)}
          style={{
            fontSize: "1.5rem",
            color: i <= value ? "gold" : "#ccc",
            cursor: disabled ? "default" : "pointer",
          }}
        >
          ★
        </span>
      ))}
    </div>
  ), []);

  // Mémoïsation de la section d'historique pour optimiser les rendus
  const historySection = useMemo(() => {
    if (history.length === 0) return null;
    
    return (
      <div className="card shadow-sm border-0 mt-4">
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
                    <strong>{item.language}</strong> – {new Date(item.timestamp).toLocaleString()}
                    {" • "}⭐ {item.rating || "N/A"}
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
    );
  }, [history, t, handleClearHistory]);

  return (
    <UserLayout>
      <div className="container py-4">
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h2 className="text-center text-primary mb-4">🌿 {t.title || "Plant Analysis"}</h2>

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
                disabled={loading || !selectedImage}
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
                <div className="mt-3">
                  <label className="form-label fw-semibold">⭐ {t.rate || "Rate Result"}</label>
                  {renderStars(rating, setRating)}
                  <button
                    className="btn btn-outline-success mt-2"
                    onClick={saveResultWithRating}
                    disabled={rating === 0}
                  >
                    ✅ {t.save || "Save Result"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {historySection}
      </div>
    </UserLayout>
  );
}