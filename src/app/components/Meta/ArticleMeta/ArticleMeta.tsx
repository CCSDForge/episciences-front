import { Helmet } from 'react-helmet-async'

import { IArticle } from '../../../../types/article'
import { IJournal } from '../../../../types/journal';
import { AvailableLanguage } from '../../../../utils/i18n'

interface IArticleMetaProps {
  language: AvailableLanguage;
  article?: IArticle;
  currentJournal?: IJournal;
  keywords: string[];
}

export default function ArticleMeta({ language, article, currentJournal, keywords }: IArticleMetaProps): JSX.Element {
  return (
    <Helmet>
      {article?.abstract && <meta name='description' content={article.abstract} />}
      {keywords.length > 0 && keywords.map((keyword, index) => (
        <meta key={index} name='keywords' content={keyword} />
      ))}
      {/* Section "citation_xxx" */}
      {currentJournal?.name && <meta name='citation_journal_title' content={currentJournal.name} />}
      {/* TODO for each author */}
      {/* TODO citation_author */}
      {/* TODO citation_author_institution */}
      {/* TODO citation_author_orcid */}
      {article?.title && <meta name='citation_title' content={article.title} />}
      {article?.publicationDate && <meta name='citation_publication_date' content={article.publicationDate} />}
      {article?.doi && <meta name='citation_doi' content={article.doi} />}
      <meta name="citation_fulltext_world_readable" content="" />
      {/* TODO dynamic */}
      <meta name="citation_pdf_url" content="https://jtcam.episciences.org/13588/pdf" />
      <meta name="citation_issn" content="2726-6141" />
      <meta name="citation_language" content="en" />
      <meta name="citation_article_type" content="Research Article" />
      {/* END OF TODO dynamic */}
      {keywords.length > 0 && keywords.map((keyword, index) => (
        <meta key={index} name='citation_keywords' content={keyword} />
      ))}
      {/* Section "DC.xxx" */}
      {/* TODO dynamic */}
      <meta name="DC.creator" content="Yvan Marthouret" />
      <meta name="DC.creator" content="Tony Zaouter" />
      <meta name="DC.creator" content="Florent Ledrappier" />
      <meta name="DC.creator" content="Guillaume Kermouche" />
      <meta name="DC.language" content="en" />
      {/* END OF TODO dynamic */}
      {article?.title && <meta name='DC.title' content={article.title} />}
      <meta name="DC.type" content="journal" />
      {/* TODO dynamic */}
      <meta name="DC.identifier" content="13588" />
      <meta name="DC.identifier" content="https://jtcam.episciences.org/13588" />
      <meta name="DC.identifier" content="https://jtcam.episciences.org/13588/pdf" />
      <meta name="DC.identifier" content="10.46298/jtcam.8945" />
      {/* END OF TODO dynamic */}
      {article?.abstract && <meta name='DC.description' content={article.abstract} />}
      {keywords.length > 0 && keywords.map((keyword, index) => (
        <meta key={index} name='DC.subject' content={keyword} />
      ))}
      {article?.publicationDate && <meta name='DC.date' content={article.publicationDate} />}
      {currentJournal?.name && <meta name='DC.relation.ispartof' content={currentJournal.name} />}
      <meta name="DC.publisher" content="Episciences.org" />
      {/* Section "og:xxx" */}
      {article?.title && <meta name='og:title' content={article.title} />}
      {/* Section "twitter:xxx" */}
    </Helmet>
  )
}