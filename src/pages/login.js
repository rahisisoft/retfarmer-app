import React, { useState, useEffect,useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import { LanguageContext } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import WeatherNotifier from "@/components/WeatherNotifier";

function Login() {
  const { language, changeLanguage } = useContext(LanguageContext);
  const { t } = useTranslation('login');
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const flags = {
    en: { name: "English", icon: "🇬🇧" },
    fr: { name: "Français", icon: "🇫🇷" },
    rn: { name: "Kirundi", icon: "🇧🇮" },
    sw: { name: "Swahili", icon: "🇹🇿" }
  };

   const openTranslations = () => {
    router.push('/translations');  // adapte le chemin si besoin
  };

  // Rediriger automatiquement si token déjà présent
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));

    if (token && user) {
      router.push("/userboard");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("login.php", {
        email: form.email,
        password: form.password,
      });

      const token = res.data?.token;
      const user = res.data?.user;

      if (!token || !user) throw new Error("Invalid response from server");

      const storage =localStorage;
      storage.setItem("token", token);
      storage.setItem("user", JSON.stringify(user));

      router.push("/userboard");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <WeatherNotifier />
    
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-4">
          <img src="/images/logo.jpg" alt="Logo" className="img-fluid" />
          <h3 className="mt-2">{t.title || "Injira kuri Konti yawe"}</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <h4>🌐 {t.language}</h4>
          <select
          className="form-select"
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          {Object.entries(flags).map(([langCode, { icon, name }]) => (
            <option key={langCode} value={langCode}>
              {icon} {name}
            </option>
          ))}
        </select>
          </div>
          <div className="mb-3">
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder={t.email}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 position-relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className="form-control pe-5"
              placeholder={t.password}
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary position-absolute top-0 end-0 mt-1 me-2"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
          </div>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="form-check-input"
              id="rememberCheck"
            />
            <label className="form-check-label" htmlFor="rememberCheck">
              {t.remember || "Nunyibuke"}
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span> Logging in...
              </>
            ) : (
              t.login
            )}
          </button>
          {error && <p className="text-danger mt-3">{error}</p>}
        </form>
        <p className="mt-3 text-center">
          <a className="btn btn-secondary w-100 mt-2" href="/register">
            {t.register}
          </a>
        </p>
      </div>
    </div>
    </>
  );
}

export default Login;
