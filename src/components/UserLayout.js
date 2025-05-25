import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useRouter } from "next/router";
import Link from 'next/link';
import { useResetAllContexts } from "../contexts/ContextManager";

const UserLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const resetAllContexts = useResetAllContexts();

  // Check if the user is already logged in (via session or token)
useEffect(() => {
  const checkSession = async () => {
  try {
  const response = await axiosInstance.get("/validate.php");
  if (response.data.status === "error") {
    router.push("/login");
  } else {
  setUser(response.data.user);
  }
  } catch (error) {
  //setLoading(false);
  }
  };
  
  checkSession();
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
          resetAllContexts();
          logoutUser();
        };
        
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
              <span className="ms-2">Hello ! {user?.name || 'Loading...'}</span>
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
                <Link href="#" className="dropdown-item" onClick={handleLogout}>
                  Logout
                </Link>
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
