import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useRouter } from "next/router";
import { setToken } from "../utils/auth";

const Login = () => {
const [form, setForm] = useState({ name: "", password: "", remember: false });
const [loading, setLoading] = useState(true);
const router = useRouter();


const handleInputChange = (e) => {
const { name, value, type, checked } = e.target;
setForm({ ...form, [name]: type === "checkbox" ? checked : value });
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
const response = await axiosInstance.post("/login.php", form);
if (response.data.status === "success") {
setToken(response.data.token);
if(response.data.user.role=='admin') router.push("/dashboard");
else
router.push("/userboard");
//alert(response.data.user.role);
} else {
alert(response.data.message); // Replace with a toast or better error handling
}
} catch (error) {
alert(error.response?.data?.error || "Login failed. Please try again.");
}
};

return (
<div className="container d-flex justify-content-center align-items-center vh-100">
<div className="row w-100">
<div className="col-md-6 col-lg-4 mx-auto">
<div className="card shadow">
<div className="card-body">
<h4 className="card-title text-center">
        <img
        src="/images/logo.png"
        alt="Logo"
        className="img-fluid rounded-circle"
      />  
    Login
</h4>
<form onSubmit={handleSubmit}>

<div className="mb-3 form-floating">
<input
type="text"
className="form-control"
name="name"
value={form.name}
onChange={handleInputChange}
required
/>
<label>Username</label>
</div>

<div className="mb-3 form-floating">

<input
type="password"
className="form-control"
name="password"
value={form.password}
onChange={handleInputChange}
required
/>
<label>Password</label>
</div>

<button type="submit" className="btn btn-primary w-100">Login</button>
<a className="btn btn-secondary w-100 mt-2" href="/register">
Register
</a>
</form>
<div className="text-center mt-2">
<a href="/forgot" className="btn btn-info w-100">Forgot password</a>
</div>
</div>
</div>
</div>
</div>
</div>
);
};

export default Login;
