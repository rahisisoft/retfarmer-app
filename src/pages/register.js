import React, { useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import Link from "next/link";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useTranslation } from '@/hooks/useTranslation';

function Register() {
  const { t } = useTranslation('register');
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shakeFields, setShakeFields] = useState([]);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required.";
        return "";
      case "phone":
        if (!value.trim()) return "Phone number is required.";
        if (!/^\d+$/.test(value.trim())) return "Phone must contain only numbers.";
        return "";
      case "password":
        if (!value) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters.";
        return "";
      default:
        return "";
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.entries(form).forEach(([key, val]) => {
      const err = validateField(key, val);
      if (err) newErrors[key] = err;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const triggerShake = (fields) => {
    setShakeFields(fields);
    setTimeout(() => setShakeFields([]), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const newErrors = validateAll();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerShake(Object.keys(newErrors));
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("register.php", form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-4">
          <img src="/images/logo.jpg" alt="Logo" className="img-fluid w-50" />
          <h3 className="mt-2">{t.title}</h3>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Nom */}
          <div className={`mb-3 ${shakeFields.includes("name") ? "animate-shake" : ""}`}>
            <label className="form-label">{t.name}</label>
            <input
              name="name"
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={form.name}
              onChange={handleChange}
              required
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          {/* Téléphone */}
          <div className={`mb-3 ${shakeFields.includes("phone") ? "animate-shake" : ""}`}>
            <label className="form-label">{t.phone}</label>
            <input
              name="phone"
              type="text"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              value={form.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>

          {/* Mot de passe */}
          <div className={`mb-3 ${shakeFields.includes("password") ? "animate-shake" : ""}`}>
            <label className="form-label">{t.password}</label>
            <div className="input-group">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(prev => !prev)}
                tabIndex={-1}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
            {loading ? t.registering : t.register}
          </button>
        </form>

        {message && <div className="alert alert-info mt-3">{message}</div>}

        <p className="mt-3 text-center">
          {t.already_account}? <Link href="/">{t.login_here}</Link>
        </p>

        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-10px); }
            40%, 80% { transform: translateX(10px); }
          }
          .animate-shake {
            animation: shake 0.5s;
          }
        `}</style>
      </div>
    </div>
  );
}

export default Register;
