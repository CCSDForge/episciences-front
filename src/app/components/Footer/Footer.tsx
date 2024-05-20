import { Link } from 'react-router-dom';

import logo from '/logo.svg';
import logoJpeSmall from '/icons/logo-jpe-small.svg';
import './Footer.scss'

export default function Footer(): JSX.Element {
  return (
    <footer className='footer'>
      <div className='footer-journal'>
        <div className='footer-journal-logo'>
          <img src={logoJpeSmall} alt='Journal logo'/>
          <Link to='/'>See the journal’s notice</Link>
          <div>|</div>
          <Link to='/'>Contact</Link>
          <div>|</div>
          <Link to='/'>Credits</Link>
        </div>
        <div className='footer-journal-rss'>
          <Link to='/'>eISSN 1365-8050</Link>
          <div>|</div>
          <Link to='/'>RSS</Link>
        </div>
      </div>
      <div className='footer-episciences'>
        <div className='footer-episciences-logo'>
          <img src={logo} alt='Episciences logo'/>
          <Link to={import.meta.env.VITE_EPISCIENCES_DOCUMENTATION_PAGE} target='_blank'>Documentation</Link>
          <div>|</div>
          <Link to={import.meta.env.VITE_EPISCIENCES_ACKNOWLEDGEMENTS_PAGE} target='_blank'>Acknowledgements</Link>
          <div>|</div>
          <Link to='/'>Publishing policy</Link>
        </div>
        <div className='footer-episciences-legal'>
          <Link to={import.meta.env.VITE_EPISCIENCES_LEGAL_TERMS_PAGE} target='_blank'>Legal mentions</Link>
          <div>|</div>
          <Link to={import.meta.env.VITE_EPISCIENCES_LEGAL_PRIVACY_STATEMENT_PAGE} target='_blank'>Privacy statement</Link>
          <div>|</div>
          <Link to={import.meta.env.VITE_EPISCIENCES_LEGAL_PRIVACY_TERMS_OF_USE_PAGE} target='_blank'>Terms of use</Link>
        </div>
      </div>
    </footer>
  )
}