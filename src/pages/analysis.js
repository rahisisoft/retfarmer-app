import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import UserLayout from "@/components/UserLayout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const translations = {
  English: {
    title: "Soil Analysis",
    language: "Language",
    upload: "Upload an image",
    analyze: "Analyze",
    analyzing: "Analyzing...",
    result: "Analysis Result",
    preview: "Image Preview",
    error: "Please provide a language and an image.",
    failed: "Failed to analyze the input. Please try again.",
    history: "Analysis History",
    clear: "Clear History",
    rate: "Rate this result"
  },
  French: {
    title: "Analyse du Sol",
    language: "Langue",
    upload: "Télécharger une image",
    analyze: "Analyser",
    analyzing: "Analyse en cours...",
    result: "Résultat de l'analyse",
    preview: "Aperçu de l'image",
    error: "Veuillez choisir une langue et une image.",
    failed: "Échec de l'analyse. Veuillez réessayer.",
    history: "Historique des analyses",
    clear: "Effacer l'historique",
    rate: "Notez ce résultat"
  },
  Kirundi: {
    title: "Isuzuma ry'ubutaka",
    language: "Ururimi",
    upload: "Shira ishusho",
    analyze: "Suzuma",
    analyzing: "Biriko birasuzumwa...",
    result: "Ibisubizo",
    preview: "Ishusho yerekanywe",
    error: "Hitamwo ururimi n’ishusho.",
    failed: "Ntivyagenze neza. Gerageza kandi.",
    history: "Amateka y'isesengura",
    clear: "Siba amateka",
    rate: "Tanga amanota kuri ibi bisubizo"
  },
  Swahili: {
    title: "Ugunduzi wa Udongo",
    language: "Lugha",
    upload: "Pakia picha",
    analyze: "Changanua",
    analyzing: "Inachanganuliwa...",
    result: "Matokeo ya Uchambuzi",
    preview: "Hakikisho la picha",
    error: "Tafadhali chagua lugha na picha.",
    failed: "Imeshindikana kuchanganua. Jaribu tena.",
    history: "Historia ya Uchambuzi",
    clear: "Futa Historia",
    rate: "Kadiria matokeo haya"
  },
};

export default function Analysis() {
  const [textInput, setTextInput] = useState("English");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentRating, setCurrentRating] = useState(0);

  const t = translations[textInput] || translations.English;

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
    if (!textInput.trim() || !selectedImage) {
      setError(t.error);
      return;
    }

    const formData = new FormData();
    formData.append("textInput", textInput);
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
      setError(t.failed);
    } finally {
      setLoading(false);
    }
  };

  const saveWithRating = () => {
    if (!analysisResult || !currentRating) return;

    const newEntry = {
      language: textInput,
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
              <label htmlFor="textInput" className="form-label fw-semibold">
                🌐 {t.language}
              </label>
              <select
                id="textInput"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="form-select"
              >
                {Object.keys(translations).map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

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
