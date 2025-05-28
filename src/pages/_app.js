// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-calendar/dist/Calendar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/globals.css';
import 'nprogress/nprogress.css';

import NProgress from 'nprogress';
import Router from 'next/router';
import { useEffect } from 'react';
import { UserProvider } from '../contexts/UserContext';
import { CartProvider } from '../contexts/CartContext';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Dynamically import Bootstrap JS on client side only
    if (typeof document !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }

    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteDone);
    Router.events.on('routeChangeError', handleRouteDone);

    // Cleanup event listeners on unmount
    return () => {
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteDone);
    };
  }, []);

  return (
    <>
      <Head>
        {/* Ajouter Bootstrap Icons via CDN ici */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
          rel="stylesheet"
        />
      </Head>

      <UserProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </UserProvider>
    </>
  );
}
