import axiosInstance from "../utils/axiosInstance";
import { useState, useEffect } from 'react';


export default function ProductForm({ fetchProducts }) {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "", description: "", price: "", stock: "", unity: "", image: null, category_id: ""
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get("/all-categories.php");
            setCategories(response.data);
        } catch (err) {
            setError("Failed to fetch categories.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            await axiosInstance.post("/add-product.php", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            fetchProducts();
            setSuccess("Product saved successfully!");
            setFormData({ name: "", description: "", price: "", stock: "", unity: "", image: null, category_id: "" });
            setPreview(null);
        } catch (err) {
            setError("Failed to save product.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card p-3 mb-3" encType="multipart/form-data">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <input className="form-control mb-2" type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <input className="form-control mb-2" type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            <input className="form-control mb-2" type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
            <input className="form-control mb-2" type="number" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
            <input className="form-control mb-2" type="text" placeholder="Unity" value={formData.unity} onChange={(e) => setFormData({ ...formData, unity: e.target.value })} required />
            
            <select className="form-control mb-2" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
            
            <input className="form-control mb-2" type="file" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Preview" className="img-thumbnail mb-2" width={100} />}
            
            <button className="btn btn-primary" type="submit">Save</button>
        </form>
    );
}
