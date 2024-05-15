import { useNavigate, Link } from 'react-router-dom';

import logo from '/logo.svg';
import Button from '../Button/Button';
import './Header.scss'
import SearchInput from '../SearchInput/SearchInput';

export default function Header(): JSX.Element {
  const navigate = useNavigate();

  const updateSearch = (search: string) => {
    // TODO : put in redux ?
    console.log('TODO', search)
  }

  const submitSearch = (): void => {
    console.log('TODO')
  }

  return (
    <header className='header'>
      <div className='header-preheader'>
        <div className='header-preheader-logo'>
          <img src={logo} alt='Episciences logo'/>
        </div>
        <div className='header-preheader-links'>
          <div className='header-preheader-links-access'>Open Access journals</div>
          <div className='header-preheader-links-buttons'>
            <div className='header-preheader-links-buttons-switch'>EN</div>
            <div>|</div>
            <div className='header-preheader-links-buttons-connect'>Connect</div>
          </div>
        </div>
      </div>
      <div className='header-journal'>
        <div className='header-journal-logo'>
          <img src={logo} alt='Journal logo' onClick={(): void => navigate('/')} />
        </div>
        <div className='header-journal-title'>Journal of Philosophical Economics</div>
      </div>
      <div className='header-postheader'>
        <div className='header-postheader-links'>
          <Link to='/'>Content</Link>
          <Link to='/'>About</Link>
          <Link to='/boards'>Boards</Link>
          <Link to='/'>For authors</Link>
        </div>
        <div className='header-postheader-search'>
          <div className='header-postheader-search-delimiter'></div>
          <div className='header-postheader-search-search'>
            <SearchInput placeholder='search' onChangeCallback={updateSearch}/>
          </div>
          <div className='header-postheader-search-submit'>
            <Button text='Submit' onClickCallback={submitSearch}/>
          </div>
        </div>
      </div>
    </header>
  )
}