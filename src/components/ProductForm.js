import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useRouter } from 'next/router';
import { useUser } from '../contexts/UserContext';

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
  const [newCategory, setNewCategory] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (product) {
      if (user?.id !== product.user_id) {
        alert('Access denied.');
        router.push('/market');
      } else {
        setFormData({
          name: product.name || '',
          category: product.category || '',
          price: product.price || '',
          stock: product.stock || '',
          unity: product.unity || '',
          image: null // ne pas précharger le fichier image
        });
        if (product.image) {
          setPreviewImage(`/uploads/${product.image}`);
        }
      }
    }

    axiosInstance.get('/categories.php')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, [product, user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, image: file });
        setPreviewImage(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category && !newCategory.trim()) {
      alert('Please select a category or enter a new one.');
      return;
    }

    if (!user?.id) {
      alert('User not authenticated.');
      return;
    }

    const form = new FormData();
    for (const key in formData) {
      if (key !== 'image' && formData[key]) {
        form.append(key, formData[key]);
      }
    }
    if (formData.image) {
      form.append('image', formData.image);
    }
    if (newCategory.trim()) {
      form.append('new_category', newCategory.trim());
    }
    form.append('user_id', user.id);

    const endpoint = product ? `/edit-product.php?id=${product.id}` : '/add-product.php';

    try {
      await axiosInstance.post(endpoint, form, {
  headers: { 'Content-Type': 'multipart/form-data' }, // ou même ne pas mettre du tout
});
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
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* CHOIX CATEGORIE */}
        {newCategory === '' ? (
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
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
          </div>
        ) : (
          <div className="mb-3">
            <label className="form-label">New Category</label>
            <input
              type="text"
              className="form-control"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category name"
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
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Unity</label>
          <input
            type="text"
            className="form-control"
            name="unity"
            value={formData.unity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            name="image"
            accept="image/*"
            onChange={handleChange}
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

        <button type="submit" className="btn btn-success">
          {product ? 'Update' : 'Create'} Product
        </button>

        {product && (
          <button
            type="button"
            className="btn btn-danger ms-2"
            onClick={async () => {
              if (confirm('Are you sure you want to delete this product?')) {
                try {
                  await axiosInstance.post(`/delete-product.php?id=${product.id}`);
                  router.push('/market');
                } catch (error) {
                  console.error(error);
                }
              }
            }}
          >
            Delete
          </button>
        )}
      </form>
    </div>
  );
}
