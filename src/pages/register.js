import axiosInstance from "../utils/axiosInstance";
import { useState } from "react";
import { useRouter } from "next/router";

const Register = () => {
  const [form, setForm] = useState({ name: "", password: "", email: "",role:"user",status:"0" });
  const router = useRouter();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/register.php", form);
      if (response.data.status === "success") {
        alert("Registration successful!");
        //router.push("/login");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="row w-100">
          <div className="col-md-6 col-lg-4 mx-auto">
            <div className="card shadow">
              <div className="card-body">
                <h4 className="card-title text-center">Register</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleInputChange}
            required
          />
          <input style={{display:"none"}}
            name="status"
            type="text"
            className="form-control"
            value="0"
            onChange={handleInputChange}
          />

        <input style={{display:"none"}}
            name="role"
            type="text"
            className="form-control"
            value="user"
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Register</button>
        <a href="/" className="btn btn-success w-100 mt-2">Login In</a>
      </form>
      </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Register;
