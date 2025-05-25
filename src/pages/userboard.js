import UserLayout from "../components/UserLayout"
import Link from 'next/link';

const Userboard = () => {
  return (
    <UserLayout>
    {/* Menu en grid avec box-shadow */}
    <div className="grid-container">
              <Link href="/plant" className="card card-menu text-decoration-none">
                <img
                    src="/images/detect.jpeg"
                    alt="Logo"
                    className="img-fluid w-50 m-auto"
                  />
                <h5>Desease Detect</h5> 
                <h6>(Kumenya indwara z'ibimera)</h6>
              </Link>
              <Link href="/feed" className="card card-menu text-decoration-none">
                    <img
                    src="/images/feed.jpeg"
                    alt="Logo"
                    className="img-fluid w-50 m-auto"
                  />
                <h5>FeedCheck </h5>
                <h6>(Izuma ry'Igiti Rigaburirwa ibitungwa)</h6>
              </Link>
              <Link href="/weather" className="card card-menu text-decoration-none">
                <img
                    src="/images/weather.jpeg"
                    alt="Logo"
                    className="img-fluid w-50 m-auto"
                  />
                <h5>Forecast</h5>
                <h6>(Itegure ibihe)</h6>
              </Link>
              <Link href="/analysis" className="card card-menu text-decoration-none">
                <img
                    src="/images/soil.jpeg"
                    alt="Logo"
                    className="img-fluid w-50 m-auto"
                  />
                <h5>Soil Analysis</h5>
                <h6>(Izuma ry'ubutaka)</h6>
              </Link>
              <Link href="/market" className="card card-menu text-decoration-none">
                <img
                    src="/images/market.jpeg"
                    alt="Logo"
                    className="img-fluid w-50 m-auto"
                  />
                <h5>Ruzizi Market</h5> 
                <h6>(Isoko)</h6> 
              </Link>
              <Link href="/message" className="card card-menu text-decoration-none">
                <img
                    src="/images/chat.jpeg"
                    alt="Logo"
                    className="img-fluid w-50 m-auto"
                  />
                <h5>Farming Assistant</h5>
                <h6>(UmufashaIhinguriro)</h6>
              </Link>
            </div>
    </UserLayout>
    
  );
};

export default Userboard;
