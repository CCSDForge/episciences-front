import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAppSelector } from "../../../hooks/store";
import { useFetchAcknowledgementsPageQuery } from "../../../store/features/acknowledgements/acknowledgements.query";
import { getMarkdownImageURL } from '../../../utils/markdown';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import './Acknowledgements.scss';



export default function Acknowledgements(): JSX.Element {
  const { t } = useTranslation();

  const language = useAppSelector(state => state.i18nReducer.language);
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code);
  const journalName = useAppSelector(state => state.journalReducer.currentJournal?.name);

  const { data: acknowledgementsPage, isFetching } = useFetchAcknowledgementsPageQuery(rvcode!, { skip: !rvcode });

  const content = acknowledgementsPage?.content[language];

  return (
      <main className='acknowledgments'>
          <Helmet>
              <title>{t('pages.acknowledgements.title')} | {journalName ?? ''}</title>
          </Helmet>

          <Breadcrumb parents={[
              { path: 'home', label: `${t('pages.home.title')} > ${t('common.about')} >` }
          ]} crumbLabel={t('pages.acknowledgements.title')} />
          <h1 className='acknowledgments-title'>{t('pages.acknowledgements.title')}</h1>
          {isFetching ? (
              <Loader />
          ) : (
              <div className='acknowledgments-content'>
                  <div className='acknowledgments-sidebar'></div>
                  <div className='acknowledgments-content-body'>
                      <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          urlTransform={uri => uri.includes('/public/') ? getMarkdownImageURL(uri, rvcode!) : uri}
                          components={{
                              a: ({ ...props }) => (
                                  <Link
                                      to={props.href!}
                                      target='_blank'
                                      className='acknowledgments-link'
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