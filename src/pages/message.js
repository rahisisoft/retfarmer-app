import { useState, useRef, useEffect } from "react";
import axios from "axios";
import UserLayout from "@/components/UserLayout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useTranslation } from '@/hooks/useTranslation';

const STORAGE_KEY = "chat_conversations";

export default function Message() {
  const { t } = useTranslation('chat');
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setConversations(JSON.parse(saved));
    }
    // Optional: detect user prefers dark mode
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  const extractText = (data) => {
    const candidate = data.candidates?.[0];
    if (candidate?.content?.parts) {
      return candidate.content.parts.map((part) => part.text).join("\n");
    }
    return "No valid response.";
  };

  const analyzeInput = async () => {
    if (!textInput.trim()) {
      setError("❗ Please type something.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const apiKey = "AIzaSyDkeRv6K0ORqHrGHK8H83ytc2-iWhecxnA"; // Remplace par ta vraie clé API
      const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const requestData = {
  contents: [
    {
      role: "user",
      parts: [
        {
          text:
            "Tu es un assistant RETFARMER spécialisé uniquement dans l'agriculture. Ne réponds qu'aux questions liées à l'agriculture. Si une question ne concerne pas l’agriculture, indique poliment que tu ne peux répondre qu’à des sujets agricoles.\n\nQuestion : " +
            textInput,
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

      const reply = extractText(response.data);
      setConversations((prev) => [...prev, { question: textInput, answer: reply }]);
      setTextInput("");
    } catch (err) {
      console.error("Error:", err);
      setError("❌ Failed to treat the input. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) analyzeInput();
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setConversations([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <UserLayout>
      <div className={`container py-4 ${darkMode ? "dark" : "light"}`} style={{ maxWidth: "700px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2><img src="images/chat.jpg" className="w-25"/> {t.title || "RETFARMER Assistant"}</h2>
          <div>
            <button className="btn btn-outline-secondary me-2" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>
           
          </div>
        </div>

        <div
          className="chat-container mb-3"
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: darkMode
              ? "0 0 15px rgba(255,255,255,0.1)"
              : "0 0 8px rgba(0,0,0,0.1)",
            backgroundColor: darkMode ? "#121212" : "#f9f9f9",
          }}
        >
          {conversations.length === 0 && (
            <p className="text-muted text-center" style={{ marginTop: "50px" }}>
              Start the conversation by typing below!
            </p>
          )}

          {conversations.map((conv, idx) => (
            <div key={idx} className="chat-message">
              <div className="chat-bubble user-bubble">
                <strong>You:</strong>
                <ReactMarkdown>{conv.question}</ReactMarkdown>
              </div>
              <div className="chat-bubble ai-bubble mt-2">
                <strong>RETFARMER:</strong>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {conv.answer}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="input-group">
          <textarea
            className="form-control"
            placeholder={t.placeholder || "Type your question"}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows="3"
            style={{ resize: "none" }}
            disabled={loading}
          />
          <button
            className="btn btn-success"
            onClick={analyzeInput}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" />
                Sending...
              </>
            ) : (
              t.button
            )}
          </button>
        </div>

        <style jsx>{`
          .chat-message {
            margin-bottom: 1.5rem;
          }
          .chat-bubble {
            position: relative;
            padding: 12px 20px;
            border-radius: 20px;
            max-width: 75%;
            font-size: 1rem;
            line-height: 1.4;
            white-space: pre-wrap;
            word-break: break-word;
          }
          .user-bubble {
            background-color: ${darkMode ? "#0d6efd" : "#0d6efd"};
            color: white;
            margin-left: auto;
            border-bottom-right-radius: 4px;
          }
          .user-bubble::after {
            content: "";
            position: absolute;
            bottom: 0;
            right: -10px;
            width: 0;
            height: 0;
            border-top: 10px solid ${darkMode ? "#0d6efd" : "#0d6efd"};
            border-left: 10px solid transparent;
            border-bottom: 0 solid transparent;
          }
          .ai-bubble {
            background-color: ${darkMode ? "#2c2c2c" : "#e9ecef"};
            color: ${darkMode ? "#eee" : "#212529"};
            margin-right: auto;
            border-bottom-left-radius: 4px;
          }
          .ai-bubble::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: -10px;
            width: 0;
            height: 0;
            border-top: 10px solid ${darkMode ? "#2c2c2c" : "#e9ecef"};
            border-right: 10px solid transparent;
            border-bottom: 0 solid transparent;
          }
          .dark {
            background-color: #121212;
            color: #eee;
          }
          .light {
            background-color: #fff;
            color: #212529;
          }
          textarea:disabled {
            background-color: #e9ecef;
          }
        `}</style>
      </div>
    </UserLayout>
  );
}
