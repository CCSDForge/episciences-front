import { useState } from "react";
import { useParams } from "react-router-dom";

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { useFetchArticleQuery } from "../../../store/features/article/article.query";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from "../../components/Loader/Loader";
import ArticleDetailsSidebar from "../../components/Sidebars/ArticleDetailsSidebar/ArticleDetailsSidebar";
import './ArticleDetails.scss'

enum ARTICLE_SECTION {
  ABSTRACT = 'abstract',
  KEYWORDS = 'keywords',
  PREVIEW = 'preview'
}

export default function ArticleDetails(): JSX.Element {
  const { id } = useParams();
  const { data: article, isFetching } = useFetchArticleQuery({ paperid: id! }, { skip: !id });

  const [openedSections, setOpenedSections] = useState<{ key: ARTICLE_SECTION, isOpened: boolean }[]>([
    { key: ARTICLE_SECTION.ABSTRACT, isOpened: true },
    { key: ARTICLE_SECTION.KEYWORDS, isOpened: true },
    { key: ARTICLE_SECTION.PREVIEW, isOpened: true }
  ]);

  const renderSection = (sectionKey: ARTICLE_SECTION, sectionTitle: string, sectionContent: JSX.Element): JSX.Element => {
    const isOpenedSection = openedSections.find(section => section.key === sectionKey)?.isOpened

    return (
      <div className='articleDetails-content-article-section'>
        <div className={`articleDetails-content-article-section-title ${!isOpenedSection && 'articleDetails-content-article-section-closed'}`} onClick={(): void => toggleSection(sectionKey)}>
          <div className='articleDetails-content-article-section-title-text'>{sectionTitle}</div>
          {isOpenedSection ? (
            <img className='articleDetails-content-article-section-title-caret' src={caretUp} alt='Caret up icon' />
          ) : (
            <img className='articleDetails-content-article-section-title-caret' src={caretDown} alt='Caret down icon' />
          )}
        </div>
        <div className={`articleDetails-content-article-section-content ${isOpenedSection && 'articleDetails-content-article-section-content-opened'}`}>{sectionContent}</div>
      </div>
    )
  }

  const toggleSection = (sectionKey: ARTICLE_SECTION) => {
    const updatedSections = openedSections.map((section) => {
      if (section.key === sectionKey) {
        return { ...section, isOpened: !section.isOpened };
      }

      return { ...section };
    });

    setOpenedSections(updatedSections);
  }

  return (
    <main className='articleDetails'>
      <Breadcrumb />
      {isFetching ? (
        <Loader />
      ) : (
        <div className="articleDetails-content">
          <ArticleDetailsSidebar article={article} />
          <div className="articleDetails-content-article">
            <h1 className="articleDetails-content-article-title">{article?.title}</h1>
            <div className="articleDetails-content-article-authors">{article?.authors}</div>
            {renderSection(ARTICLE_SECTION.ABSTRACT, 'Abstract', <>{article?.abstract}</>)}
            {renderSection(ARTICLE_SECTION.KEYWORDS, 'Keywords', <>{article?.keywords?.join(', ')}</>)}
            {renderSection(ARTICLE_SECTION.PREVIEW, 'Preview', <iframe src={article?.halLink} className="articleDetails-content-article-section-content-preview" />)}
          </div>
        </div>
      )}
    </main>
  )
}