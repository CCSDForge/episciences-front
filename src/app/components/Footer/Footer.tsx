import { Link } from 'react-router-dom';

import logo from '/logo.svg';
import './Footer.scss'

export default function Footer(): JSX.Element {
  return (
    <footer className='footer'>
      <div className='footer-journal'>
        <div className='footer-journal-logo'>
          <img src={logo} alt='Journal logo'/>
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
          <Link to='/'>Documentation</Link>
          <div>|</div>
          <Link to='/'>Acknowledgements</Link>
          <div>|</div>
          <Link to='/'>Publishing policy</Link>
        </div>
        <div className='footer-episciences-legal'>
          <Link to='/'>Legal mentions</Link>
          <div>|</div>
          <Link to='/'>Privacy statement</Link>
          <div>|</div>
          <Link to='/'>Terms of use</Link>
        </div>
      </div>
    </footer>
  )
}