import { useEffect, useState, useContext, useTransition } from 'react';
import UserLayout from "../components/UserLayout";
import Link from 'next/link';
import { LanguageContext } from "@/contexts/LanguageContext";
import axiosInstance from '@/utils/axiosInstance';
import { useTranslation } from '@/hooks/useTranslation';

const Userboard = () => {
 
  //const { t = {} } = useContext(LanguageContext);
  const { t } = useTranslation('userboard');
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    axiosInstance.get('/get_menu_items.php')
      .then(response => {
        setMenuItems(response.data);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des menus :", error);
      });
  }, []);

  return (
    <UserLayout>
      <div className="container">
        <div className="row row-cols-2 row-cols-md-3 g-4">
          {menuItems.map(item => (
            <div className="col" key={item.key_name}>
              <Link href={item.href} className="card card-menu text-decoration-none h-100">
                <div className="card-body text-center">
                  <img
                    src={item.img}
                    alt={t[item.key_name] || item.key_name}
                    className="img-fluid w-50 mb-3"
                  />
                  <h5 className="card-title">{t[item.key_name] || item.key_name}</h5>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default Userboard;
