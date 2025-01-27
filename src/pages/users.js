import axiosInstance from "../utils/axiosInstance";
import { useState, useEffect } from 'react';
import Layout from "../components/Layout"
import axios from 'axios';

export default function Users() {

    const [formData, setFormData] = useState({
        id:"",
        name: "",
        old_name:"",
        email: "",
        role: "user",
        password: "",
        confirmPassword: "",
        status: "0", // Default to enabled
      });
    
const [errorMessage, setErrorMessage] = useState("");
const [successMessage, setSuccessMessage] = useState("");
  
  const [editUser, setEditUser] = useState(null);
  const [users, setUsers] = useState([]);
  
  const fetchUsers = () => {
    axiosInstance
      .get("/all-users.php")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Passwords do not match!");
        return;
      }
    
      try {
        const response = await axiosInstance.post("/add-user.php",formData);        
        // Refresh the list
        fetchUsers();
        // Set success message
        setSuccessMessage(response.data.message || "User added successfully!");
      
        // Reset form data
        setFormData({
            id:"",
          name: "",
          old_name: "",
          email: "",
          role: "user",
          password: "",
          confirmPassword: "",
          status: "0",
        });
      } catch (err) {
        // Set error message
        setErrorMessage(`Error adding user: ${err.response?.data?.message || err.message}`);
      }
      
  };

  const deleteUser = async (id) => {
    try {
      await axiosInstance.post("/del-user.php",{id});
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditUser = (user) => {
    setFormData({
        id:user.id,
        name:user.name,
        old_name:user.name,
        email:user.email,
        role:user.role,
        password: "",
        confirmPassword: "",
        status:user.status,
      });
      setEditUser(user);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
        const response = await axiosInstance.post("/edit-user.php",formData);        
        // Refresh the list
        fetchUsers();
        setEditUser(null);
        // Set success message
        if(response.data.status=='success') 
            setSuccessMessage(response.data.message || "User Edited successfully!");
        else 
        setErrorMessage(response?.data.message);
        // Reset form data
        setFormData({
            id:"",
          name: "",
          old_name: "",
          email: "",
          role: "user",
          password: "",
          confirmPassword: "",
          status: "0",
        });
      } catch (err) {
        // Set error message
        setErrorMessage(`Error Editing user: ${err.response?.data?.message || err.message}`);
      }
  };

  return (
    <Layout>
      <h1>Users</h1>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <div className="row w-100">
          <div className="col-md-6 col-lg-4 mx-auto">
            <div className="card shadow">
              <div className="card-body">
              
        <form onSubmit={editUser ? updateUser : addUser}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
          type="text" name="old_name" style={{display:"none"}} id="old_name" value={formData.old_name} onChange={handleChange} 
          />
          <input
          type="text" name="id" style={{display:"none"}} id="id" value={formData.id} onChange={handleChange} 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={editUser === null}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required={editUser === null}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            className="form-select"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="0">Disabled</option>
            <option value="1">Enabled</option>
            
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
        {editUser ? 'Update User' : 'Add User'}
        </button>
      </form>
      </div>
      </div>
      </div>
      <div className="col-md-6 col-lg-8 mx-auto">
      <div className="card shadow">
      <div className="card-body">
          
      <ul className="list-group">
        {users.map((user) => (
          <li key={user.id} className={`list-group-item ${user.status===0 ? "text-danger" : ""}`}>
            <div className="d-flex justify-content-between align-items-center">
              {user.name}
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      </div>
      </div>
      </div>
      </div>
    </Layout>
  );
}
