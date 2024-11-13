import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { PATHS } from '../../../config/paths'
import { useFetchArticleQuery } from "../../../store/features/article/article.query";
import Loader from "../../components/Loader/Loader";
import './ArticleDetailsNotice.scss'

export default function ArticleDetailsNotice(): JSX.Element {
  const navigate = useNavigate();

  const { id } = useParams();
  const { data: article, isFetching, isError, error } = useFetchArticleQuery({ paperid: id! }, { skip: !id });


  useEffect(() => {
    if (!article && isError && (error as FetchBaseQueryError)?.status) {
      navigate(PATHS.home);
    }
  }, [article, isError, error])

  /**
   * Warning: this does not work with arXiv, and any target with
   * Content-Security-Policy: frame-ancestors 'none';
   */
  const getLink = (): JSX.Element | null => {
    return article?.docLink ? <iframe src={article.docLink} className="articleDetailsNotice-iframe" /> : null
  }

  return isFetching ? <Loader /> : <>{getLink()}</>
}