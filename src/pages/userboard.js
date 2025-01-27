import UserLayout from "../components/UserLayout"
import Link from 'next/link';

const Userboard = () => {
  return (
    <UserLayout>
    {/* Menu en grid avec box-shadow */}
    <div className="grid-container">
              <Link href="/plant" className="card card-menu text-decoration-none">
                <i className="fa-solid fa-leaf card-icon mb-2"></i>
                <h5>Desease Detect</h5>
              </Link>
              <Link href="/weather" className="card card-menu text-decoration-none">
                <i className="fas fa-cloud-sun-rain card-icon mb-2"></i>
                <h5>Forecast</h5>
              </Link>
              <Link href="/analysis" className="card card-menu text-decoration-none">
                <i className="fas fa-temperature-high card-icon mb-2"></i>
                <h5>Soil Analysis</h5>
              </Link>
              <Link href="/market" className="card card-menu text-decoration-none">
                <i className="fas fa-cart-plus card-icon mb-2"></i>
                <h5>Market Place</h5> 
              </Link>
              <Link href="/message" className="card card-menu text-decoration-none">
                <i className="fas fa-comment card-icon"></i>
                <h5>Chat Box</h5>
              </Link>
            </div>
    </UserLayout>
    
  );
};

export default Userboard;
