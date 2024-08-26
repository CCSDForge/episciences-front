import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Builder, parseString } from 'xml2js'

import { PATHS } from '../../../config/paths'
import { useAppSelector } from "../../../hooks/store";
import { useFetchArticleQuery, useFetchArticleMetadataQuery } from "../../../store/features/article/article.query";
import { getMetadataTypes, METADATA_FORMAT, METADATA_TYPE } from '../../../utils/article';

export default function ArticleDetailsMetadata(): JSX.Element {
  const navigate = useNavigate();

  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)
  
  const { id, type } = useParams();
  const { data: article, isFetching: isFetchingArticle, isError, error } = useFetchArticleQuery({ paperid: id! }, { skip: !id });
  const { data: metadata, isFetching: isFetchingMetadata, } = useFetchArticleMetadataQuery({ rvcode: rvcode!, paperid: id!, type: type as METADATA_TYPE }, { skip: !id || !type || !rvcode });

  useEffect(() => {
    if (!article && isError && (error as FetchBaseQueryError)?.status) {
      navigate(PATHS.home);
    }
  }, [article, isError, error])

  useEffect(() => {
    if (!type || !Object.values(METADATA_TYPE).includes(type as METADATA_TYPE)) {
      navigate(PATHS.home);
    }
  }, [type])

  useEffect(() => {
    if (article && metadata && !isFetchingArticle && !isFetchingMetadata) {
      onDownloadMetadata()
    }
  }, [article, metadata, isFetchingArticle, isFetchingMetadata])

  const renderMetadata = (): JSX.Element => {
    const metadataFormat = getMetadataTypes.find(t => t.type === type)

    if (!metadata || !metadataFormat) return <></>

    if (metadataFormat.format === METADATA_FORMAT.TEXT) return <>{metadata}</>

    if (metadataFormat.format === METADATA_FORMAT.XML) {
      let formattedXml: string = '';

      parseString(metadata, (_, result) => {
        const builder = new Builder({ headless: true, renderOpts: { pretty: true } });
        formattedXml = builder.buildObject(result);  
      });

      return (
          <pre>
              <code>{formattedXml}</code>
          </pre>
      );
  }

    if (metadataFormat.format === METADATA_FORMAT.JSON) {
      return (
        <pre>
          <code>{JSON.stringify(JSON.parse(metadata as string), null, 2)}</code>
        </pre>
      )
    }

    return <></>
  }

  const onDownloadMetadata = (): void => {
    const metadataFormat = getMetadataTypes.find(t => t.type === type)

    if (!metadata || !metadataFormat) return;
  
    const blob = new Blob([metadata])
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;

    a.download = `article_${id}_metadata_${metadataFormat.type}.${metadataFormat.format}`;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  return renderMetadata()
}