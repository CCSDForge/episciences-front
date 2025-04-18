import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { PATHS } from '../../../config/paths'
import { useFetchArticleQuery } from "../../../store/features/article/article.query";
import Loader from "../../components/Loader/Loader";
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
    return article?.pdfLink ? <iframe title="Document preview" loading={"lazy"} src={article.pdfLink} className="articleDetailsDownload-iframe" /> : null
  }

  return isFetching ? <Loader /> : <>{getLink()}</>
}