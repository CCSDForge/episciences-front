import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useTranslation } from 'react-i18next';

import downloadIcon from '/icons/download-black.svg';
import closeIcon from '/icons/close-black.svg';
import { PATHS } from '../../../config/paths'
import { useAppSelector } from "../../../hooks/store";
import { useFetchArticleQuery } from "../../../store/features/article/article.query";
import Loader from "../../components/Loader/Loader";
import PDFViewer from '../../components/PDFViewer/PDFViewer';
import './ArticleDetailsDownload.scss'

export default function ArticleDetailsDownload(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { id } = useParams();
  const { data: article, isFetching, isError, error } = useFetchArticleQuery({ paperid: id! }, { skip: !id });
  const journalName = useAppSelector(state => state.journalReducer.currentJournal?.name);


  useEffect(() => {
    if (!article && isError && (error as FetchBaseQueryError)?.status) {
      navigate(PATHS.home);
    }
  }, [article, isError, error])

  const handleDownload = (): void => {
    if (article?.pdfLink) {
      window.open(article.pdfLink, '_blank');
    }
  };

  const handleCloseTab = (): void => {
    window.close();
  };

  const getLink = (): JSX.Element | null => {
    return article?.pdfLink ? <PDFViewer pdfUrl={article.pdfLink} showDownloadButton={false} prominentDownload={false} /> : null
  }

  return isFetching ? <Loader /> : (
    <div className="articleDetailsDownload">
      <div className="articleDetailsDownload-header">
        <div className="articleDetailsDownload-header-title">{journalName}</div>
        <div className="articleDetailsDownload-header-buttons">
          <div className="articleDetailsDownload-header-download" onClick={handleDownload}>
            <img src={downloadIcon} className="articleDetailsDownload-header-download-icon" alt="" />
            <span className="articleDetailsDownload-header-download-text">{t('pages.pdfViewer.download')}</span>
          </div>
          <div className="articleDetailsDownload-header-close" onClick={handleCloseTab}>
            <img src={closeIcon} className="articleDetailsDownload-header-close-icon" alt="" />
            <span className="articleDetailsDownload-header-close-text">{t('pages.pdfViewer.closeTab')}</span>
          </div>
        </div>
      </div>
      {getLink()}
    </div>
  )
}