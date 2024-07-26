import { Outlet } from "react-router-dom";
import { MathJax } from "better-react-mathjax";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default function MainLayout(): JSX.Element {
  return (
    <>
      <ToastContainer bodyClassName='toast-message' />
      <Header />
      <MathJax>
        <Outlet />
      </MathJax>
      <Footer />
    </>
  )
}