import Link from 'next/link';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const UserLayout = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token || !storedUser) {
      router.push("/");
    } else {
      setUser(storedUser);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    //router.push("/");
    router.replace("/");
  };
   
    
    //if (!user) return <p className="text-center mt-5">Loading dashboard...</p>;    
    if (!user) {
            return <p>Loading...</p>; // Show a loader while fetching user data
    }

    
  return (
    <div className="main_user_content bg-success">
      {/* Menu fixe */}
      <nav className="navbar navbar-expand-lg navbar-light  bg-white fixed-top">
        <div className="container-fluid">
        <Link className="fw-bold h3" href="/userboard"><i className="fas fa-arrow-left"></i></Link> 
        <img
        src="/images/logo.jpeg"
        alt="Logo"
        width="30%"
        className="img-fluid"
        />  
          <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle"
              type="button"
              id="profileMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={'profile-placeholder.png'} // Replace with actual user profile image URL
                alt="Profile"
                className="rounded-circle"
                width="30"
                height="30"
              />
              <span className="ms-2">Hello ! {user.name || 'Loading...'}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileMenu">
  <li>
    <Link href="/products" className="dropdown-item">
      Products
    </Link>
  </li>
  <li>
    <Link href="/profile" className="dropdown-item">
      Profile
    </Link>
  </li>
  <li>
    <Link href="/settings" className="dropdown-item">
      Settings
    </Link>
  </li>
  <li>
    <hr className="dropdown-divider" />
  </li>
  <li>
    <button
      type="button"
      className="dropdown-item text-danger"
      onClick={handleLogout}
    >
      <i className="bi bi-box-arrow-right me-2"></i> Logout
    </button>
  </li>
</ul>

          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div
  className="container mt-4 mb-10"
  style={{ paddingTop: '80px', paddingBottom: '80px' }} // Adjust the bottom padding
>
  <div className="row">
    <div className="col-lg-12">{children}</div>
  </div>
</div>

{/* Footer fixe */}
<div
  className="fixed-footer bg-white text-white mt-4"
  style={{
    height: '80px', // Ensure height matches the padding-bottom
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <Link className="text-dark fw-bold h3" href="/userboard">
    <i className="fas fa-home"></i>
  </Link>
</div>

    </div>
  );
};
//export const useUser = () => useContext(UserContext);
export default UserLayout;
