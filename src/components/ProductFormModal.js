// components/ProductFormModal.jsx
import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useUser } from '../contexts/UserContext';

export default function ProductFormModal({ show, onClose, product = null, onSaved }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    unity: '',
    image: null
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const { user } = useUser();

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        category: '',
        price: '',
        stock: '',
        unity: '',
        image: null
      });
    }

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
    if (newCategory) form.append('new_category', newCategory);

    const endpoint = product ? `/edit-product.php?id=${product.id}` : '/add-product.php';

    try {
      await axiosInstance.post(endpoint, form);
      onSaved(); // rechargement de la liste
      onClose(); // fermer la modale
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await axiosInstance.post(`/delete-product.php?id=${product.id}`);
        onSaved();
        onClose();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const [previewImage, setPreviewImage] = useState(null);

  return (
    <div className={`modal ${show ? 'd-block show' : ''}`} tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="modal-header">
              <h5 className="modal-title">{product ? 'Edit Product' : 'Add New Product'}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="mb-3">
  <label className="form-label">Category</label>

  {newCategory === '' ? (
    <>
      <select
        name="category"
        className="form-select"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <div className="mt-2">
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => {
            setFormData({ ...formData, category: '' });
            setNewCategory(' ');
          }}
        >
          + Add new category
        </button>
      </div>
    </>
  ) : (
    <>
      <input
        type="text"
        className="form-control"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="New category name"
        required
      />
      <div className="mt-2">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => {
            setNewCategory('');
          }}
        >
          ← Back to existing categories
        </button>
      </div>
    </>
  )}
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
                <label className="form-label">Image*</label>
                <input
  type="file"
  className="form-control"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file)); // ← aperçu
    }
  }}
/>

{previewImage && (
  <div className="mt-2">
    <img
      src={previewImage}
      alt="Preview"
      style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
      className="border rounded"
    />
  </div>
)}

              </div>
            </div>
            <div className="modal-footer">
              {product && (
                <button type="button" className="btn btn-danger me-auto" onClick={handleDelete}>Delete</button>
              )}
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-success">{product ? 'Update' : 'Create'} Product</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
