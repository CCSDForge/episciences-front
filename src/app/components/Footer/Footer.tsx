import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import logo from '/logo.svg';
import logoJpeSmall from '/icons/logo-jpe-small.svg';
import { useAppSelector } from '../../../hooks/store';
import './Footer.scss'
import { PATHS } from '../../../config/paths';

export default function Footer(): JSX.Element {
  const { t } = useTranslation();

  const currentJournal = useAppSelector(state => state.journalReducer.currentJournal);

  const getJournalNotice = (): string | undefined => {
    return currentJournal?.settings?.find((setting) => setting.setting === "contactJournalNotice")?.value
  }

  const getContact = (): string | undefined => {
    const code = currentJournal?.code

    if (!code) return;

    return `mailto:${code}${import.meta.env.VITE_EMAILS_SUFFIX}`
  }

  const getISSN = (): string | undefined => {
    return currentJournal?.settings?.find((setting) => setting.setting === "ISSN")?.value
  }

  const getRSS = (): string | undefined => {
    const code = currentJournal?.code

    if (!code) return;

    return `${import.meta.env.VITE_API_ROOT_ENDPOINT}/feed/rss/${code}`
  }

  return (
    <footer className='footer'>
      <div className='footer-journal'>
        <div className='footer-journal-logo'>
          <img src={logoJpeSmall} alt='Journal logo'/>
          {getJournalNotice() && <Link to={getJournalNotice()!} target='_blank'>{t('components.footer.links.notice')}</Link>}
          <div>|</div>
          {getContact() && <Link to={getContact()!} target='_blank'>{t('components.footer.links.contact')}</Link>}
          <div>|</div>
          <Link to={PATHS.credits}>{t('components.footer.links.credits')}</Link>
        </div>
        <div className='footer-journal-rss'>
          {getISSN() && <div>{`eISSN ${getISSN()}`}</div>}
          {getISSN() && <div>|</div>}
          {getRSS() && <Link to={getRSS()!} target='_blank'>{t('components.footer.links.rss')}</Link>}
        </div>
      </div>
      <div className='footer-episciences'>
        <div className='footer-episciences-logo'>
          <img src={logo} alt='Episciences logo'/>
          <Link to={import.meta.env.VITE_EPISCIENCES_DOCUMENTATION_PAGE} target='_blank'>{t('components.footer.links.documentation')}</Link>
          <div>|</div>
          <Link to={import.meta.env.VITE_EPISCIENCES_ACKNOWLEDGEMENTS_PAGE} target='_blank'>{t('components.footer.links.acknowledgements')}</Link>
          <div>|</div>
          <Link to={`${PATHS.about}#publishing-policy`}>{t('components.footer.links.publishingPolicy')}</Link>
        </div>
        <div className='footer-episciences-legal'>
          <Link to={import.meta.env.VITE_EPISCIENCES_LEGAL_TERMS_PAGE} target='_blank'>{t('components.footer.links.legalMentions')}</Link>
          <div>|</div>
          <Link to={import.meta.env.VITE_EPISCIENCES_LEGAL_PRIVACY_STATEMENT_PAGE} target='_blank'>{t('components.footer.links.privacyStatement')}</Link>
          <div>|</div>
          <Link to={import.meta.env.VITE_EPISCIENCES_LEGAL_PRIVACY_TERMS_OF_USE_PAGE} target='_blank'>{t('components.footer.links.termsOfUse')}</Link>
        </div>
      </div>
    </footer>
  )
}