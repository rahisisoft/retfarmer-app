import { useEffect, useState } from 'react';
import UserLayout from "../components/UserLayout";
import Link from 'next/link';
import axiosInstance from '@/utils/axiosInstance';
import { useTranslation } from '@/hooks/useTranslation';
import Head from 'next/head';

const Userboard = () => {
  const { t } = useTranslation('userboard');
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/get_menu_items.php')
      .then(response => {
        setMenuItems(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des menus :", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <UserLayout>
      <Head>
        <title>Tableau de bord</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>
      
      <div className="container px-3 py-4">
        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : (
          <div className="dashboard-grid">
            {menuItems.map((item, index) => (
              <Link 
                href={item.href} 
                className="dashboard-card card text-decoration-none" 
                key={item.key_name}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-body text-center d-flex flex-column justify-content-center align-items-center p-3">
                  <div className="icon-wrapper mb-3 rounded-circle d-flex align-items-center justify-content-center">
                    <img
                      src={item.img}
                      alt={t[item.key_name] || item.key_name}
                      className="img-fluid"
                    />
                  </div>
                  <h5 className="card-title fw-semibold mb-0">{t[item.key_name] || item.key_name}</h5>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .dashboard-card {
          background: linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%);
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          height: 100%;
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
          color: #fff;
        }
        
        .dashboard-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 24px rgba(0, 0, 0, 0.15);
        }

        .icon-wrapper {
          width: 70px;
          height: 70px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .dashboard-card:hover .icon-wrapper {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(79, 85, 200, 0.6);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (min-width: 768px) {
          .dashboard-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
          
          .icon-wrapper {
            width: 80px;
            height: 80px;
          }
        }
        
        @media (min-width: 992px) {
          .dashboard-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        @media (max-width: 480px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.8rem;
          }
          
          .icon-wrapper {
            width: 60px;
            height: 60px;
            padding: 12px;
          }
          
          .card-title {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </UserLayout>
  );
};

export default Userboard;
