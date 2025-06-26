import Link from 'next/link';
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import BASE_API_URL from '../utils/config';
import { useTranslation } from '@/hooks/useTranslation';

const UserLayout = ({ children }) => {
  const router = useRouter();
  const { t ={}} = useTranslation('userboard'); // contexte défini ici
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const navRef = useRef(null);
  const [navHeight, setNavHeight] = useState(80);

  useEffect(() => {
  console.log("Traductions chargées dans t:", t);
}, [t]);

  useEffect(() => {
    if (navRef.current) setNavHeight(navRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token || !storedUser) {
      router.push("/");
    } else {
      setUser(storedUser);
    }

    const path = router.pathname;
    if (path.includes('/products')) setActiveTab('products');
    else if (path.includes('/profile')) setActiveTab('profile');
    else if (path.includes('/settings')) setActiveTab('settings');
    else setActiveTab('home');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    router.replace("/");
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">{t.loading || 'Loading...'}</span>
        </div>
      </div>
    );
  }

  const NavItem = ({ icon, text, active, onClick, href }) => (
    href ? (
      <Link href={href} className="text-decoration-none flex-grow-1">
        <button 
          className={`d-flex flex-column align-items-center justify-content-center w-100 border-0 bg-transparent p-2 ${active ? 'text-success' : 'text-secondary'}`}
          onClick={onClick}
        >
          <i className={`${icon} fs-5 mb-1`}></i>
          <span className="small">{text}</span>
        </button>
      </Link>
    ) : (
      <button 
        className={`d-flex flex-column align-items-center justify-content-center flex-grow-1 border-0 bg-transparent p-2 ${active ? 'text-success' : 'text-secondary'}`}
        onClick={onClick}
      >
        <i className={`${icon} fs-5 mb-1`}></i>
        <span className="small">{text}</span>
      </button>
    )
  );

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm py-2 sticky-top">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <img src="/images/logo.jpg" alt="Logo" style={{ maxHeight: '40px' }} />
            <div className="d-flex align-items-center">
              <div className="bg-secondary bg-opacity-25 rounded-circle overflow-hidden" style={{ width: '40px', height: '40px' }}>
                <img src={`${BASE_API_URL}/${user.photo}`} alt={user.name} className="h-100 w-auto" />
              </div>
              <span className="ms-2 fw-medium text-truncate" style={{ maxWidth: '150px' }}>
                {t.hello || 'Hello'}, {user.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container flex-grow-1 py-4 pb-5" style={{ paddingBottom: `${navHeight + 20}px` }}>
        {children}
      </main>

      {/* Navigation */}
      <nav ref={navRef} className="bg-white border-top py-2 position-fixed bottom-0 start-0 end-0 z-3 shadow">
        <div className="container">
          <div className="d-flex justify-content-around">
            <NavItem href="/userboard" icon="fas fa-home" text='' active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem href="/profile" icon="fas fa-user" text='' active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <NavItem href="/settings" icon="fas fa-cog" text='' active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            <NavItem icon="fas fa-sign-out-alt" text='' active={false} onClick={handleLogout} />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default UserLayout;
