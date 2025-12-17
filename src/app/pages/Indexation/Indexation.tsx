import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../hooks/store';
import { Link } from 'react-router-dom';
import { getMarkdownImageURL } from '../../../utils/markdown';
import { useFetchIndexationPageQuery } from '../../../store/features/indexation/indexation.query';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Loader from '../../components/Loader/Loader';
import './Indexation.scss';
import { Helmet } from 'react-helmet-async';

export default function Indexation(): JSX.Element {
  const { t } = useTranslation();

  const language = useAppSelector(state => state.i18nReducer.language);
  const rvcode = useAppSelector(
    state => state.journalReducer.currentJournal?.code
  );
  const journalName = useAppSelector(
    state => state.journalReducer.currentJournal?.name
  );

  const { data: indexationPage, isFetching } = useFetchIndexationPageQuery(
    rvcode!,
    { skip: !rvcode }
  );

  const content = indexationPage?.content[language];

  return (
    <main className="indexation">
      <Helmet>
        <title>
          {t('pages.indexation.title')} | {journalName ?? ''}
        </title>
      </Helmet>

      <Breadcrumb
        parents={[
          {
            path: 'home',
            label: `${t('pages.home.title')} > ${t('common.about')} >`,
          },
        ]}
        crumbLabel={t('pages.indexation.title')}
      />
      <h1 className="indexation-title">{t('pages.indexation.title')}</h1>
      {isFetching ? (
        <Loader />
      ) : (
        <div className="indexation-content">
          <div className="indexation-sidebar"></div>
          <div className="indexation-content-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              urlTransform={uri =>
                uri.includes('/public/')
                  ? getMarkdownImageURL(uri, rvcode!)
                  : uri
              }
              components={{
                a: ({ ...props }) => (
                  <Link
                    to={props.href!}
                    target="_blank"
                    className="indexation-link"
                  >
                    {props.children?.toString()}
                  </Link>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </main>
  );
}
