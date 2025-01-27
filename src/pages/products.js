import axiosInstance from "../utils/axiosInstance";
import { useState, useEffect } from 'react';
import UserLayout from "../components/UserLayout"
import AutocompleteInput from "../components/AutocompleteInput";
import { useUser } from '../contexts/UserContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [unity, setUnity] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [category, setCategory] = useState(null);

  
  const [formData, setFormData] = useState({
    search: "",
  });

  const { user } = useUser();
  useEffect(() => {
    if (user?.id) {
      setSellerId(user.id);
    }
  }, [user]);
  
  
    // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    //setCategoryName(value);
  };

  
  const handleAutocompleteChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      search: value ? value.label : "",
    }));
    setCategoryId(value?.id);
  };
  
 useEffect(() => {
  if (user?.id) {
    const sellerId = user.id; // Use local variable instead of state
    setSellerId(sellerId); // Still update the state if needed elsewhere

    // Make the API call with the local `sellerId`
    axiosInstance
      .post("/all-seller-products.php", { id: sellerId })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }
}, [user]);

  const fetchProducts = () => {
    axiosInstance
      .post("/all-seller-products.php",{id:sellerId})
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category_id', categoryId);
    formData.append('seller_id', sellerId);
    formData.append('unity', unity);
    //if (image) formData.append('image', image);

    try {
      await axiosInstance.post("/add-product.php", formData)
      .then(() => {
        fetchProducts(); // Refresh the list;
        resetForm();
    }).catch((err) => console.error("Error adding Product:", err))
      
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setStock(product.stock);
    setCategoryId(product.category_id);
    setSellerId(product.seller_id);
    setUnity(product.unity);
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', editProduct.id);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category_id', categoryId);
    formData.append('seller_id', sellerId);
    formData.append('unity', unity);
    //if (image) formData.append('image', image);

    try {
      await axiosInstance.post("/edit-product.php", formData)
      .then(() => {
        fetchProducts(); // Refresh the list;
        resetForm();
    }).catch((err) => console.error("Error Editing Product:", err))
      
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axiosInstance.post("del-product.php", { id });
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setCategoryId('');
    //setSellerId('');
    //setImage(null);
    setEditProduct(null);
  };

  return (
    <UserLayout>
      <h1>Products</h1>
      <div className="row w-100">
          <div className="col-md-6 col-lg-4 mx-auto">
            <div className="card shadow" >
              <div className="card-body">
      <form onSubmit={editProduct ? updateProduct : addProduct} className="mb-3">
      <div className="mb-3">
        <AutocompleteInput
          apiUrl="/all-catSearches.php" // Replace with your actual API endpoint
          onChange={handleAutocompleteChange }
          value={name}
        />
      </div>
      
        <div className="mb-3 form-floating">
          <input
            type="text"
            className="form-control"
            id="productName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
            required
            
          />
          <label htmlFor="productName">Product Name</label>
        </div>
        <div className="mb-3 form-floating">
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          />
          <label>Description</label>
        </div>
        <div className="mb-3 form-floating">
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            required
          />
          <label>Price</label>
        </div>
        <div className="mb-3 form-floating">
          <input
            type="number"
            className="form-control"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Stock"
            required
          />
          <label>Stock</label>
        </div>

        <div className="mb-3 form-floating">
          <select
            className="form-select"
            id="unity"
            name="unity"
            value={unity}
            onChange={(e) => setUnity(e.target.value)}
            required
          >
            <option value="">-- Choose unity --</option>
            <option value="Kg">Kg</option>
            <option value="Pce">Pce</option>
          </select>
          <label>Unity</label>
        </div>
        
          <input style={{display:"none"}}
            type="text"
            className="form-control"
            value={sellerId}
            onChange={(e) => setSelleId(e.target.value)}
          />
          
        <button type="submit" className="btn btn-primary">
          {editProduct ? 'Update Product' : 'Add Product'}
        </button>
      </form>
      </div>
      </div>
      </div>
      <div className="col-md-6 col-lg-8 mx-auto">
      <div className="card shadow">
      <div className="card-body">
          <h4 className="card-title text-center">List</h4>
      <ul className="list-group">
        {products.map((product) => (
          <li key={product.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              Name : {product.name} <i>Cat: {product.category}</i>
              <div>
                <button
                  className="btn btn-warning btn-sm m-2"
                  onClick={() => handleEditProduct(product)}
                >
                  <i className="fa fa-edit"></i> Details
                </button>
                <button
                  className="btn btn-danger btn-sm m-2"
                  onClick={() => deleteProduct(product.id)}
                >
                  <i className="fa fa-times"></i> Delete
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
    </UserLayout>
  );
}
