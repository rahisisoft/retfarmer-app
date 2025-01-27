import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/globals.css';
import 'nprogress/nprogress.css'; // Import NProgress styles
import NProgress from 'nprogress'; // Import NProgress
import Router from 'next/router';
import { useEffect } from 'react';
import { UserProvider } from '../contexts/UserContext';
import { CartProvider } from '../contexts/CartContext';


export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Dynamically import Bootstrap JS on the client side
    typeof document !== undefined
      ? require('bootstrap/dist/js/bootstrap.bundle.min.js')
      : null;
    // Start NProgress on route change start
    Router.events.on('routeChangeStart', () => NProgress.start());
    // Stop NProgress on route change complete or error
    Router.events.on('routeChangeComplete', () => NProgress.done());
    Router.events.on('routeChangeError', () => NProgress.done());

    // Cleanup listeners on unmount
    return () => {
      Router.events.off('routeChangeStart', () => NProgress.start());
      Router.events.off('routeChangeComplete', () => NProgress.done());
      Router.events.off('routeChangeError', () => NProgress.done());
    };
  }, []);

  return (
    <UserProvider>
      <CartProvider>
      <Component {...pageProps} />
      </CartProvider>
    </UserProvider>
  );
}
