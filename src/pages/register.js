import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import Link from "next/link";

const countries = [
  { name: "Burundi", code: "BU", dial_code: "+257" },
  { name: "Democratic Republic of Congo", code: "DRC", dial_code: "+243" },
  { name: "Rwanda", code: "RW", dial_code: "+250" },
];

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    phone: "",
    job: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shakeFields, setShakeFields] = useState([]);

  // Validation rules
  const passwordRules = [
    { regex: /.{8,}/, label: "At least 8 characters" },
    { regex: /[A-Z]/, label: "One uppercase letter" },
    { regex: /[a-z]/, label: "One lowercase letter" },
    { regex: /[0-9]/, label: "One number" },
    { regex: /[^A-Za-z0-9]/, label: "One special character" },
  ];

  // Validate fields on change
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required.";
        return "";
      case "email":
        // Simple email regex
        if (!value.trim()) return "Email is required.";
        if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value.trim())
        )
          return "Invalid email address.";
        return "";
      case "password":
        if (!value) return "Password is required.";
        // Check password rules
        for (const rule of passwordRules) {
          if (!rule.regex.test(value)) {
            return `Password must have ${rule.label.toLowerCase()}.`;
          }
        }
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password.";
        if (value !== form.password) return "Passwords do not match.";
        return "";
      case "country":
        if (!value) return "Country is required.";
        return "";
      case "phone":
        if (!value.trim()) return "Phone number is required.";
        if (!/^\d+$/.test(value.trim()))
          return "Phone must contain only numbers.";
        return "";
      case "job":
        if (!value.trim()) return "Job is required.";
        return "";
      default:
        return "";
    }
  };

  // Validate all fields
  const validateAll = () => {
    const newErrors = {};
    Object.entries(form).forEach(([key, val]) => {
      const err = validateField(key, val);
      if (err) newErrors[key] = err;
    });
    return newErrors;
  };

  // On input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Validate on change for immediate feedback
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Shake animation helper: add field name to shakeFields, then remove after 500ms
  const triggerShake = (fields) => {
    setShakeFields(fields);
    setTimeout(() => setShakeFields([]), 500);
  };

  const selectedCountry = countries.find((c) => c.code === form.country);

  // Password strength for progress bar
  const passwordStrength = passwordRules.map((rule) =>
    rule.regex.test(form.password)
  );
  const strengthPercent =
    (passwordStrength.filter(Boolean).length / passwordRules.length) * 100;
  const getStrengthColor = () => {
    if (strengthPercent < 40) return "danger";
    if (strengthPercent < 80) return "warning";
    return "success";
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

    const countryName = selectedCountry?.name || "";

    setLoading(true);
    try {
      const res = await axiosInstance.post("register.php", {
        name: form.name,
        email: form.email,
        password: form.password,
        country: countryName,
        phone: form.phone,
        job: form.job,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="text-center mb-4">
          <img src="/images/logo.jpeg" alt="Logo" className="img-fluid" />
          <h3 className="mt-2">Create an account</h3>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {[
            { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
            { label: "Email address", name: "email", type: "email", placeholder: "email@example.com" },
            {
              label: "Country",
              name: "country",
              type: "select",
              options: countries.map((c) => ({ value: c.code, label: c.name })),
            },
            {
              label: "Phone",
              name: "phone",
              type: "phone",
              placeholder: "123456789",
            },
            {
              label: "Job",
              name: "job",
              type: "text",
              placeholder: "Web Developer, Student...",
            },
          ].map(({ label, name, type, placeholder, options }) => (
            <div
              key={name}
              className={`mb-3 ${shakeFields.includes(name) ? "animate-shake" : ""}`}
            >
              <label className="form-label">{label}</label>
              {type === "select" ? (
                <select
                  name={name}
                  className={`form-select ${errors[name] ? "is-invalid" : ""}`}
                  onChange={handleChange}
                  value={form[name]}
                  required
                >
                  <option value="">Select country</option>
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : type === "phone" ? (
                <div className="input-group">
                  <span className="input-group-text">{selectedCountry?.dial_code || "+"}</span>
                  <input
                    name={name}
                    className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                    placeholder={placeholder}
                    onChange={handleChange}
                    value={form[name]}
                    required
                  />
                </div>
              ) : (
                <input
                  name={name}
                  type={type}
                  className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                  placeholder={placeholder}
                  onChange={handleChange}
                  value={form[name]}
                  required
                />
              )}
              {errors[name] && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {errors[name]}
                </div>
              )}
            </div>
          ))}

          {/* Password Field with show/hide */}
          <div className={`mb-3 ${shakeFields.includes("password") ? "animate-shake" : ""}`}>
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="Password"
                onChange={handleChange}
                value={form.password}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
            {errors.password && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.password}
              </div>
            )}

            {form.password && (
              <>
                <div className="mt-2">
                  <div className="progress">
                    <div
                      className={`progress-bar bg-${getStrengthColor()}`}
                      role="progressbar"
                      style={{ width: `${strengthPercent}%` }}
                      aria-valuenow={strengthPercent}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
                <ul className="mt-2 ps-3" style={{ fontSize: "0.9em" }}>
                  {passwordRules.map((rule, index) => (
                    <li
                      key={index}
                      style={{ color: passwordStrength[index] ? "green" : "red" }}
                    >
                      {passwordStrength[index] ? "✅" : "❌"} {rule.label}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Confirm Password with show/hide */}
          <div className={`mb-3 ${shakeFields.includes("confirmPassword") ? "animate-shake" : ""}`}>
            <label className="form-label">Confirm Password</label>
            <div className="input-group">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                placeholder="Confirm Password"
                onChange={handleChange}
                value={form.confirmPassword}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                tabIndex={-1}
              >
                <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
            style={{ position: "relative" }}
          >
            {loading && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && (
          <div
            className="alert alert-info mt-3 fade show"
            role="alert"
            style={{ animation: "fadein 0.5s" }}
          >
            {message}
          </div>
        )}

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link href="/" className="text-decoration-none">
            Login here
          </Link>
        </p>

        {/* CSS for shake animation */}
        <style jsx>{`
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            20%,
            60% {
              transform: translateX(-10px);
            }
            40%,
            80% {
              transform: translateX(10px);
            }
          }
          .animate-shake {
            animation: shake 0.5s;
          }
          @keyframes fadein {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default Register;
