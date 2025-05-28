import { useState, useEffect } from 'react';
import axiosInstance from "../utils/axiosInstance";
import UserLayout from '@/components/UserLayout';
import { useCart } from '../contexts/CartContext';
import Link from 'next/link';


export default function Market() {
  const [products, setProducts] = useState([]);
  const { cart, setCart } = useCart();
  const [query, setQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  useEffect(() => {
    // Charger les produits depuis l'API
    axiosInstance.get('/all-products.php')
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setSuccessMessage(`${product.name} has been added to your cart!`);
  
    // Effacez le message après 3 secondes
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <UserLayout>
      <div className='mt-2'>
  {successMessage && (
    <div className="alert alert-success" role="alert">
      {successMessage}
    </div>
  )}
      <div className="d-flex justify-content-between align-items-center">
      <form className="d-flex" onSubmit={handleSearch}>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
        </form>
    <Link href="/products" className="btn btn-success btn-sm">
    <i className="fas fa-plus"></i> Add product
    </Link>

    <Link href="/cart" className="btn btn-success btn-sm">
    <i className="fas fa-cart-arrow-down"></i> Cart
    </Link>

        </div>
      <div className="grid-container">
        {products.map(product => (
          <div className="card card-menu" key={product.id}>
                <p className=""><strong>{product.name}</strong><br/>
                <i>category : {product.category}</i></p>
                <p className="card-text">
                  Fbu {product.price} <br/>Stock : {product.stock} {product.unity}<br/>
                  <b>Vendeur : ?</b>
                  </p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => addToCart(product)}
                ><i className="fas fa-cart-plus"></i> Add to Cart
                </button>
          </div>
            
        ))}
      </div>
      </div>
    </UserLayout>
  );
}
