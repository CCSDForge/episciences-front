import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAppSelector } from "../../../hooks/store";
import { useFetchVolumeQuery } from "../../../store/features/volume/volume.query";
import { IArticle } from "../../../types/article";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from "../../components/Loader/Loader";
import VolumeDetailsSidebar from "../../components/Sidebars/VolumeDetailsSidebar/VolumeDetailsSidebar";
import './VolumeDetails.scss';
import VolumeArticleCard from "../../components/Cards/VolumeArticleCard/VolumeArticleCard";

export default function VolumeDetails(): JSX.Element {
  const language = useAppSelector(state => state.i18nReducer.language)

  const [isFetchingArticles, setIsFetchingArticles] = useState(false);
  const [articles, setArticles] = useState<IArticle[]>([]);

  const { id } = useParams();
  const { data: volume, isFetching: isFetchingVolume } = useFetchVolumeQuery({ vid: id! }, { skip: !id });

  useEffect(() => {
    if (volume && volume.articles.length > 0) {
      setIsFetchingArticles(true);

      const docIds = volume.articles.map(article => article['@id'].replace(/\D/g, ''));
      fetchArticles(docIds);
    }
  }, [volume]);

  const fetchArticles = async (docIds: string[]) => {
    const requests = docIds.map(docid => 
      fetch(`${import.meta.env.VITE_API_ROOT_ENDPOINT}/papers/${docid}`)
        .then(response => response.json())
    );
    
    const fetchedArticles = await Promise.all(requests);

    setArticles(fetchedArticles);
    setIsFetchingArticles(false);
  };

  return (
    <main className='volumeDetails'>
      <Breadcrumb />
      <h1 className='volumeDetails-id'>Volume {id}</h1>
      {isFetchingVolume || isFetchingArticles ? (
        <Loader />
      ) : (
        <div className="volumeDetails-content">
          <div className="volumeDetails-content-year">{volume?.year}</div>
          <div className='volumeDetails-content-results'>
            <VolumeDetailsSidebar articlesCount={articles.length} />
            <div className="volumeDetails-content-results-content">
              <div className='volumeDetails-content-results-content-title'>{volume?.title ? volume?.title[language] : ''}</div>
              <div className='volumeDetails-content-results-content-description'>{volume?.description ? volume?.description[language] : ''}</div>
              <div className='volumeDetails-content-results-content-cards'>
                {articles?.map((article, index) => (
                  <VolumeArticleCard
                    key={index}
                    article={article}
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
