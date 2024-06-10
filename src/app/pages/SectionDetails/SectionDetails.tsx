import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAppSelector } from "../../../hooks/store";
import { useFetchSectionQuery } from "../../../store/features/section/section.query";
import { RawArticle, IArticle } from "../../../types/article";
import { formatArticle, FetchedArticle } from '../../../utils/article'
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from "../../components/Loader/Loader";
import SectionArticleCard from "../../components/Cards/SectionArticleCard/SectionArticleCard";
import SectionDetailsSidebar from "../../components/Sidebars/SectionDetailsSidebar/SectionDetailsSidebar";
import './SectionDetails.scss';

export default function SectionDetails(): JSX.Element {
  const language = useAppSelector(state => state.i18nReducer.language)

  const [isFetchingArticles, setIsFetchingArticles] = useState(false);
  const [articles, setArticles] = useState<FetchedArticle[]>([]);

  const { id } = useParams();
  const { data: section, isFetching: isFetchingSection } = useFetchSectionQuery({ sid: id! }, { skip: !id });

  useEffect(() => {
    if (section && section.articles.length > 0) {
      setIsFetchingArticles(true);

      const paperIds = section.articles.map(article => article['@id'].replace(/\D/g, ''));
      fetchArticles(paperIds);
    }
  }, [section]);

  const fetchArticles = async (paperIds: string[]): Promise<void> => {
    const articlesRequests: Promise<FetchedArticle>[] = paperIds.map(async (docid) => {
      const article: RawArticle = await (await fetch(`${import.meta.env.VITE_API_ROOT_ENDPOINT}/papers/${docid}`)).json()

      return formatArticle(article)
    });
    
    const fetchedArticles = await Promise.all(articlesRequests);

    setArticles(fetchedArticles);
    setIsFetchingArticles(false);
  };

  return (
    <main className='sectionDetails'>
      <Breadcrumb />
      <h1 className='sectionDetails-id'>Section {id}</h1>
      {isFetchingSection || isFetchingArticles ? (
        <Loader />
      ) : (
        <div className="sectionDetails-content">
          <div className='sectionDetails-content-results'>
            <SectionDetailsSidebar articlesCount={articles.length} />
            <div className="sectionDetails-content-results-content">
              <div className='sectionDetails-content-results-content-title'>{section?.title ? section?.title[language] : ''}</div>
              <div className='sectionDetails-content-results-content-description'>{section?.description ? section?.description[language] : ''}</div>
              <div className='sectionDetails-content-results-content-cards'>
                {articles?.filter((article) => article).map((article, index) => (
                  <SectionArticleCard
                    key={index}
                    language={language}
                    article={article as IArticle}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
