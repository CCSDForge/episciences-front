import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import I18nSyncHook from '../../../hooks/i18nSync';

export default function MainLayout(): JSX.Element {
  return (
    <>
      <I18nSyncHook />
      <ToastContainer bodyClassName="toast-message" />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
