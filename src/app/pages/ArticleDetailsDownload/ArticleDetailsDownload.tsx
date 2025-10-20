import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { PATHS } from '../../../config/paths'
import { useFetchArticleQuery } from "../../../store/features/article/article.query";
import Loader from "../../components/Loader/Loader";
import PDFViewer from '../../components/PDFViewer/PDFViewer';
import './ArticleDetailsDownload.scss'

export default function ArticleDetailsDownload(): JSX.Element {
  const navigate = useNavigate();

  const { id } = useParams();
  const { data: article, isFetching, isError, error } = useFetchArticleQuery({ paperid: id! }, { skip: !id });


  useEffect(() => {
    if (!article && isError && (error as FetchBaseQueryError)?.status) {
      navigate(PATHS.home);
    }
  }, [article, isError, error])

  const getLink = (): JSX.Element | null => {
    return article?.pdfLink ? <PDFViewer pdfUrl={article.pdfLink} showDownloadButton={true} prominentDownload={true} /> : null
  }

  return isFetching ? <Loader /> : <>{getLink()}</>
}