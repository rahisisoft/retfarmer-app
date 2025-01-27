import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useRouter } from "next/router";
import Link from 'next/link';


const Layout = ({ children }) => {

  const [user, setUser] = useState(null);
  const router = useRouter();
  
    useEffect(() => {

        const fetchUser = async () => {
          try {
            const response = await axiosInstance.get("/validate.php");
            if (response.data.status === "success") {
              setUser(response.data.user);
            } else {
              router.push("/"); // Redirect to login if not authenticated
            }
          } catch (error) {
            router.push("/"); // Redirect to login on error
          }
        };
    
        fetchUser();
      }, [router]);
    
        const logoutUser = async () => {
          try {
            const response = await axiosInstance.get("/logout.php");
          setUser(null); // Clear user on logout
          document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          localStorage.removeItem('user');
          router.push("/"); // Redirect to login on error
          } catch (error) {
            alert("Error during logout:", error);
          }
        };
        const handleLogout = () => {
          logoutUser();
        };
        
    if (!user) {
            return <p>Loading...</p>; // Show a loader while fetching user data
    }

  return (
  <div className="container-fluid">
    <div className="row">
      {/* Sidebar */}
      <nav className="col-md-2 d-none d-md-block bg-light sidebar">
        <div className="position-sticky">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link href="/dashboard" className="nav-link">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/orders" className="nav-link">
                Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/categories" className="nav-link">
                Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/users" className="nav-link">
                Users
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center py-3">
          <h1 className="h3">Agricore Admin Panel</h1>
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
              <span className="ms-2">Hello ! {user?.name || 'Loading...'}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileMenu">
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
                <Link href="#" className="dropdown-item" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </header>

        {children}
      </main>
    </div>
  </div>
  )
}
;

export default Layout;
