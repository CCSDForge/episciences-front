import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAppSelector } from "../../../hooks/store";
import { formatArticle, FetchedArticle } from "../../../utils/article";
import { useFetchVolumeQuery } from "../../../store/features/volume/volume.query";
import { RawArticle, IArticle } from "../../../types/article";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from "../../components/Loader/Loader";
import VolumeArticleCard from "../../components/Cards/VolumeArticleCard/VolumeArticleCard";
import VolumeDetailsSidebar from "../../components/Sidebars/VolumeDetailsSidebar/VolumeDetailsSidebar";
import './VolumeDetails.scss';

export default function VolumeDetails(): JSX.Element {
  const language = useAppSelector(state => state.i18nReducer.language)

  const [isFetchingArticles, setIsFetchingArticles] = useState(false);
  const [articles, setArticles] = useState<FetchedArticle[]>([]);

  const { id } = useParams();
  const { data: volume, isFetching: isFetchingVolume } = useFetchVolumeQuery({ vid: id! }, { skip: !id });

  useEffect(() => {
    if (volume && volume.articles.length > 0) {
      setIsFetchingArticles(true);

      const paperIds = volume.articles.map(article => article['@id'].replace(/\D/g, ''));
      fetchArticles(paperIds);
    }
  }, [volume]);

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
    <main className='volumeDetails'>
      {volume && <Breadcrumb id={volume?.num} />}
      {isFetchingVolume || isFetchingArticles ? (
        <Loader />
      ) : (
        <div className="volumeDetails-volume">
          <h1 className='volumeDetails-id'>Volume {volume?.num}</h1>
          <div className="volumeDetails-content">
            <div className="volumeDetails-content-year">{volume?.year}</div>
            <div className='volumeDetails-content-results'>
              <VolumeDetailsSidebar articlesCount={articles.length} />
              <div className="volumeDetails-content-results-content">
                <div className='volumeDetails-content-results-content-title'>{volume?.title ? volume?.title[language] : ''}</div>
                {volume?.committee && volume.committee.length > 0 && (
                  <div className='volumeDetails-content-results-content-committee'>
                    {volume?.committee.map((member) => member.screenName).join(', ')}
                    <span className="volumeDetails-content-results-content-committee-note">(comité du volume)</span>
                  </div>
                )}
                <div className='volumeDetails-content-results-content-description'>{volume?.description ? volume?.description[language] : ''}</div>
                <div className='volumeDetails-content-results-content-cards'>
                  {articles?.filter((article) => article).map((article, index) => (
                    <VolumeArticleCard
                      key={index}
                      language={language}
                      article={article as IArticle}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
