import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import remarkGfm from 'remark-gfm';
import { Helmet } from 'react-helmet-async';

import { useAppSelector } from '../../../hooks/store';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Loader from '../../components/Loader/Loader';
import './Accessibility.scss';

export default function Accessibility(): JSX.Element {
  const { t } = useTranslation();

  const language = useAppSelector(state => state.i18nReducer.language);
  const journalName = useAppSelector(
    state => state.journalReducer.currentJournal?.name
  );

  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMarkdown = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/locales/${language}/accessibility.md`);
        const text = await response.text();
        setMarkdownContent(text);
      } catch (error) {
        console.error('Error fetching accessibility markdown:', error);
        setMarkdownContent('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkdown();
  }, [language]);

  return (
    <main className="accessibility">
      <Helmet>
        <title>
          {t('pages.accessibility.title')} | {journalName ?? ''}
        </title>
      </Helmet>

      <Breadcrumb
        parents={[{ path: 'home', label: `${t('pages.home.title')} >` }]}
        crumbLabel={t('pages.accessibility.title')}
      />

      <h1 className="accessibility-title">{t('pages.accessibility.title')}</h1>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="accessibility-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ ...props }) => (
                <a
                  href={props.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="accessibility-content-link"
                >
                  {props.children}
                </a>
              ),
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      )}
    </main>
  );
}
