import { useContext, useEffect, useState, useCallback, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import UserLayout from "@/components/UserLayout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useTranslation } from '@/hooks/useTranslation';

export default function PlantChat() {
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation('plant');

  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("analysisHistory");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("analysisHistory", JSON.stringify(history));
    scrollToBottom();
  }, [history]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handlers
  const handleTextChange = useCallback((e) => {
    setInputText(e.target.value);
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem("analysisHistory");
  }, []);

  const removeImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const analyzeInput = useCallback(async () => {
    if (!inputText && !selectedImage) return;

    // 1️⃣ Add user message
    const userMessage = {
      type: "user",
      content: inputText,
      image: selectedImage ? imagePreview : null,
      timestamp: new Date().toISOString()
    };
    setHistory(prev => [...prev, userMessage]);

    // 2️⃣ Prepare API call
    const formData = new FormData();
    formData.append("lang", language);
    formData.append("textInput", inputText);
    if (selectedImage) formData.append("image", selectedImage);

    const apiUrl = selectedImage ? "/gemini-api.php" : "/gemini-api-4.php";

    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 3️⃣ Add bot message
      const botMessage = {
        type: "bot",
        result: response.data,
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [...prev, botMessage]);

    } catch (err) {
      console.error(err);
      setError(t.failed || "Analysis failed. Please try again.");
      
      // Add error message to chat
      const errorMessage = {
        type: "bot",
        result: { answer: t.failed || "Analysis failed. Please try again." },
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setInputText("");
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [inputText, selectedImage, language, t, imagePreview]);

  const renderMessageBubble = (msg) => {
    const isUser = msg.type === "user";
    const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
      <div
        key={msg.timestamp}
        className={`d-flex mb-3 ${isUser ? "justify-content-end" : "justify-content-start"}`}
      >
        <div className={`d-flex flex-column ${isUser ? "align-items-end" : "align-items-start"}`} style={{ maxWidth: "85%" }}>
          <div className={`p-3 rounded ${isUser ? "bg-primary text-white" : "bg-light text-dark"}`} 
               style={{ 
                 borderRadius: isUser ? "18px 18px 5px 18px" : "18px 18px 18px 5px",
                 boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
               }}>
            {isUser ? (
              <>
                {msg.image ? (
                  <div className="mb-2">
                    <img 
                      src={msg.image} 
                      alt="Uploaded" 
                      className="img-fluid rounded" 
                      style={{ maxHeight: "200px" }} 
                    />
                  </div>
                ) : null}
                {msg.content && <div>{msg.content}</div>}
              </>
            ) : (
              <>
                {msg.result?.answer && (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.result.answer}</ReactMarkdown>
                )}
                {msg.result?.detection && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <h6 className="border-bottom pb-2">🔍 {t.analysisResults || "Analysis Results"}</h6>
                    <div className="small">
                      <div className="d-flex mb-1">
                        <span className="fw-medium me-2">{t.plant || "Plant"}:</span>
                        <span>{msg.result.detection.culture}</span>
                      </div>
                      <div className="d-flex mb-1">
                        <span className="fw-medium me-2">{t.disease || "Disease"}:</span>
                        <span>{msg.result.detection.maladie}</span>
                      </div>
                    </div>
                    
                    {msg.result.treatment?.treatment && (
                      <>
                        <h6 className="mt-3 border-bottom pb-2">💊 {t.treatment || "Treatment"}</h6>
                        <div className="small">
                          <div className="d-flex mb-1">
                            <span className="fw-medium me-2">{t.type || "Type"}:</span>
                            <span>{msg.result.treatment.treatment.type_traitement}</span>
                          </div>
                          <div className="d-flex mb-1">
                            <span className="fw-medium me-2">{t.product || "Product"}:</span>
                            <span>{msg.result.treatment.treatment.nom_produit}</span>
                          </div>
                          <div className="d-flex mb-1">
                            <span className="fw-medium me-2">{t.dose || "Dose / Ha or L"}:</span>
                            <span>{msg.result.treatment.treatment.dose_ha_l}</span>
                          </div>
                          <div className="d-flex mb-1">
                            <span className="fw-medium me-2">{t.frequency || "Frequency (days)"}:</span>
                            <span>{msg.result.treatment.treatment.frequence_jours}</span>
                          </div>
                          <div className="d-flex mb-1">
                            <span className="fw-medium me-2">{t.method || "Method"}:</span>
                            <span>{msg.result.treatment.treatment.methode_application}</span>
                          </div>
                          <div className="d-flex">
                            <span className="fw-medium me-2">{t.notes || "Precautions / Notes"}:</span>
                            <span>{msg.result.treatment.treatment.precautions_notes}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {msg.result?.audio && (
                  <div className="mt-2">
                    <h6>🎧 {t.audioExplanation || "Audio Explanation"}</h6>
                    <audio controls className="w-100 mt-2">
                      <source src={URL.createObjectURL(new Blob(
                        [Uint8Array.from(atob(msg.result.audio), c => c.charCodeAt(0))],
                        { type: "audio/mp3" }
                      ))} type="audio/mp3" />
                    </audio>
                  </div>
                )}
                {msg.result?.image && (
                  <div className="mt-2">
                    <h6>🖼️ {t.visualExplanation || "Visual Explanation"}</h6>
                    <img src={msg.result.image} alt="Analysis" className="img-fluid rounded mt-2" style={{ maxHeight: 200 }} />
                  </div>
                )}
              </>
            )}
          </div>
          <small className={`text-muted mt-1 ${isUser ? "text-end" : "text-start"}`} style={{ fontSize: "0.7rem" }}>
            {time}
          </small>
        </div>
      </div>
    );
  };

  return (
    <UserLayout>
      <div className="container py-4">
        <div className="card shadow-sm border-0" style={{ height: "85vh", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div className="card-header py-3 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                     style={{ width: "40px", height: "40px" }}>
                  <span className="text-white">🌿</span>
                </div>
                <div>
                  <h5 className="mb-0">{t.title || "Plant Doctor"}</h5>
                  <small className="text-muted">{t.subtitle || "Retfarmer Assistant plant health analysis"}</small>
                </div>
              </div>
              <button className="btn btn-sm btn-outline-danger" onClick={handleClearHistory}>
                <i className="bi bi-trash me-1"></i> {t.clear || "Clear History"}
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="card-body flex-grow-1 overflow-auto py-3 bg-light">
            {history.length === 0 ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="text-center text-muted">
                  <img
                    src="/images/chat.jpg"
                    alt="Virtual Agro"
                    className="img-fluid w-50 mb-3"
                  />
                  <h5 className="mt-2">{t.welcome || "Welcome to RetFarmer Assistant"}</h5>
                  <p className="mb-0">{t.instructions || "Send a message or image to analyze your plants"}</p>
                </div>
              </div>
            ) : (
              <div>
                {history.map(msg => renderMessageBubble(msg))}
                <div ref={chatEndRef}></div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="card-footer border-0 pt-0">
            {imagePreview && (
              <div className="mb-2 position-relative" style={{ width: "fit-content" }}>
                <img src={imagePreview} alt="preview" className="img-fluid rounded" style={{ maxHeight: 150 }} />
                <button 
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
                  style={{ width: "24px", height: "24px", padding: 0 }}
                  onClick={removeImage}
                >
                  ×
                </button>
              </div>
            )}
            
            {error && <div className="alert alert-danger mb-2 py-2">{error}</div>}
            
            <div className="input-group">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <i className="bi bi-image"></i>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <input
                type="text"
                className="form-control"
                placeholder={t.holder || "Type a message or attach image..."}
                value={inputText}
                onChange={handleTextChange}
                onKeyDown={(e) => { 
                  if (e.key === "Enter" && !e.shiftKey) { 
                    e.preventDefault(); 
                    analyzeInput(); 
                  } 
                }}
              />
              <button 
                className="btn btn-primary" 
                onClick={analyzeInput} 
                disabled={loading || (!inputText && !selectedImage)}
              >
                {loading ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <i className="bi bi-send"></i>
                )}
              </button>
            </div>
            <div className="mt-2 text-center">
              <small className="text-muted">
                {t.note || "Note: For best results, provide clear images of affected plant leaves"}
              </small>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}