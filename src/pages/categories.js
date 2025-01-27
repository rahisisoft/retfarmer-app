import axiosInstance from "../utils/axiosInstance";
import { useState, useEffect } from 'react';
import Layout from "../components/Layout"
import axios from 'axios';

export default function Categories() {

  const [name, setName] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  
  const fetchCategories = () => {
    axiosInstance
      .get("/all-categories.php")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    
    try {
      await axiosInstance.post("/add-category.php", { name})
      .then(() => {
        setName(""); // Clear input
        fetchCategories(); // Refresh the list
      }).catch((err) => console.error("Error adding category:", err))
      
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axiosInstance.post("/del-category.php",{id});
      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    setName(category.name);
  };

  const updateCategory = async (e) => {
    e.preventDefault();
    try {
      
      await axiosInstance.post("/edit-category.php", {
        id: editCategory.id,
        name
      }).then(() => {
        setName('');(""); // Clear input
        fetchCategories(); // Refresh the list
        setEditCategory(null);
      }).catch((err) => console.error("Error adding category:", err));
      
    } catch (err) {
      console.error(err);
    }
  };
/*
<div className="mb-3">
          <select
            className="form-select"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            defaultValue=""
          >
            <option value="">Select Parent Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
*/
  return (
    <Layout>
      <h1>Categories</h1>
      <div className="row w-100">
          <div className="col-md-6 col-lg-4 mx-auto">
            <div className="card shadow">
              <div className="card-body">
              
      <form onSubmit={editCategory ? updateCategory : addCategory} className="mb-3">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category Name"
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary">
          {editCategory ? 'Update Category' : 'Add Category'}
        </button>
      </form>
      </div>
      </div>
      </div>
      <div className="col-md-6 col-lg-8 mx-auto">
      <div className="card shadow">
      <div className="card-body">
          
      <ul className="list-group">
        {categories.map((category) => (
          <li key={category.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              {category.name}
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditCategory(category)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteCategory(category.id)}
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
