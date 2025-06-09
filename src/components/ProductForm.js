// components/ProductForm.jsx
import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useRouter } from 'next/router';

export default function ProductForm({ product = null }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    unity: '',
    image: null
  });
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (product) setFormData(product);
    axiosInstance.get('/categories.php')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) form.append(key, formData[key]);

    const endpoint = product ? `/edit-product.php?id=${product.id}` : '/add-product.php';
    try {
      await axiosInstance.post(endpoint, form);
      router.push('/market');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h4>{product ? 'Edit Product' : 'Add New Product'}</h4>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Unity</label>
          <input type="text" className="form-control" name="unity" value={formData.unity} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input type="file" className="form-control" name="image" accept="image/*" onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-success">{product ? 'Update' : 'Create'} Product</button>
      </form>
    </div>
  );
}
