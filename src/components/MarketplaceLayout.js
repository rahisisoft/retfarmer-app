import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const MarketplaceLayout = ({ children, openProductForm }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token || !storedUser) {
      router.push('/login');
    } else {
      setUser(storedUser);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.replace('/login');
  };

  if (!user) return <p className="text-center mt-5">Loading Marketplace...</p>;

  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container">
          <Link href="/" className="navbar-brand fw-bold">
            <img src="/images/logo.jpg" alt="Logo" style={{ maxHeight: '40px' }} />
          </Link>

          <form className="d-none d-md-flex mx-auto w-50">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search for products"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              <i className="fas fa-search"></i>
            </button>
          </form>

          <div className="d-flex align-items-center">
            <Link href="/cart" className="btn btn-outline-dark me-3">
              <i className="fas fa-shopping-cart"></i>
            </Link>

            <div className="dropdown">
              <button
                className="btn btn-light dropdown-toggle"
                type="button"
                id="userMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="/profile-placeholder.png"
                  alt="Profile"
                  className="rounded-circle"
                  width="30"
                  height="30"
                />
                <span className="ms-2">{user.name} </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                <li><Link className="dropdown-item" href="/orders">My Orders</Link></li>
                <li><Link className="dropdown-item" href="/profile">Profile</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '90px' }}>
        {children}
      </div>

      {/* Footer */}
      <footer className="fixed-bottom bg-white border-top shadow-sm">
  <div className="d-flex justify-content-around py-2">
    <Link href="/" className="text-dark text-center">
      <i className="fas fa-home"></i>
      <div style={{ fontSize: '12px' }}>Home</div>
    </Link>
    <Link href="/categories" className="text-dark text-center">
      <i className="fas fa-th-large"></i>
      <div style={{ fontSize: '12px' }}>Categories</div>
    </Link>
    <Link href="/cart" className="text-dark text-center">
      <i className="fas fa-shopping-cart"></i>
      <div style={{ fontSize: '12px' }}>Cart</div>
    </Link>

    {/* Nouveau bouton Add Product */}
    {user?.role === 'user' && (
  <button
    onClick={openProductForm}
    className="btn btn-light d-flex flex-column align-items-center"
    style={{ border: 'none', background: 'transparent' }}
  >
    <i className="fas fa-plus-circle" style={{ fontSize: '1.2rem' }}></i>
    <div style={{ fontSize: '12px' }}>Add Product</div>
  </button>
    )}

    <Link href="/profile" className="text-dark text-center">
      <i className="fas fa-user"></i>
      <div style={{ fontSize: '12px' }}>Profile</div>
    </Link>
  </div>
</footer>

    </div>
  );
};

export default MarketplaceLayout;
