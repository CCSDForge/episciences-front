import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';
import { MathJax } from 'better-react-mathjax';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import download from '/icons/download-red.svg';
import { PATHS } from '../../../../config/paths';
import { IArticle } from '../../../../types/article';
import { articleTypes } from '../../../../utils/article';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import DisplayAbstract from '../DisplayAbstract/DisplayAbstract';
import './SectionArticleCard.scss'

interface ISectionArticleCardProps {
  language: AvailableLanguage;
  t: TFunction<"translation", undefined>
  article: IArticle;
}

export default function SectionArticleCard({ language, t, article }: ISectionArticleCardProps): JSX.Element {
  const [openedAbstract, setOpenedAbstract] = useState(false)

  const toggleAbstract = (): void => setOpenedAbstract(!openedAbstract)

  return (
    <div className="sectionArticleCard">
      {article.tag && <div className='volumeArticleCard-tag'>{t(articleTypes.find((tag) => tag.value === article.tag)?.labelPath!)}</div>}
      <Link to={`/${PATHS.articles}/${article.id}`}>
        <div className='sectionArticleCard-title'>
          <MathJax dynamic>{article.title}</MathJax>
        </div>
      </Link>
      <div className='sectionArticleCard-authors'>{article.authors.map(author => author.fullname).join(', ')}</div>
      {article.abstract && (
        <div className='sectionArticleCard-abstract'>
          <div className={`sectionArticleCard-abstract-title ${!openedAbstract && 'sectionArticleCard-abstract-title-closed'}`} onClick={toggleAbstract}>
            <div className='sectionArticleCard-abstract-title-text'>{t('common.abstract')}</div>
            {openedAbstract ? (
              <img className='sectionArticleCard-abstract-title-caret' src={caretUp} alt='Caret up icon' />
            ) : (
              <img className='sectionArticleCard-abstract-title-caret' src={caretDown} alt='Caret down icon' />
            )}
          </div>
          <div className={`sectionArticleCard-abstract-content ${openedAbstract && 'sectionArticleCard-abstract-content-opened'}`}>
              <DisplayAbstract abstract={article.abstract} language={language} />
          </div>
        </div>
      )}
      <div className='sectionArticleCard-anchor'>
        <div className='sectionArticleCard-anchor-publicationDate'>{formatDate(article.publicationDate, language)}</div>
        <div className="sectionArticleCard-anchor-icons">
          {article.pdfLink && (
            <Link to={article.pdfLink} target='_blank'>
              <div className="sectionArticleCard-anchor-icons-download">
                <img className="sectionArticleCard-anchor-icons-download-download-icon" src={download} alt='Download icon' />
                <div className="sectionArticleCard-anchor-icons-download-text">{t('common.pdf')}</div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}