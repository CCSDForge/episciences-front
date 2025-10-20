import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async'

import { IArticle, IArticleAuthor } from '../../../../types/article'
import { IJournal } from '../../../../types/journal';
import { AvailableLanguage } from '../../../../utils/i18n'
import { extractAbstractText } from '../../../../utils/article'

interface IArticleMetaProps {
  language: AvailableLanguage;
  article?: IArticle;
  currentJournal?: IJournal;
  keywords: string[];
  authors: IArticleAuthor[];
}

export default function ArticleMeta({ language, article, currentJournal, keywords, authors }: IArticleMetaProps): JSX.Element {
  return (
    <Helmet>

        {article?.title && (
            <title>
                {article.title}
                {currentJournal?.name ? ` | ${currentJournal.name}` : ''}
            </title>
        )}

      {article?.abstract && <meta name='description' content={extractAbstractText(article.abstract)} />}

      {keywords.length > 0 && keywords.map((keyword, index) => (
        <meta key={index} name='keywords' content={keyword} />
      ))}

      {/* Section "citation_xxx" */}
      {currentJournal?.name && <meta name='citation_journal_title' content={currentJournal.name} />}
      {authors.length > 0 && authors.map((author, index) => (
        <Fragment key={index}>
          <meta name='citation_author' content={author.fullname} />
          {author.institutions && author.institutions.length > 0 && author.institutions.map((institution, institutionIndex) => (
            <meta key={institutionIndex} name='citation_author_institution' content={institution} />
          ))}
          {author.orcid && <meta name='citation_author_orcid' content={author.orcid} />}
        </Fragment>
      ))}

      {article?.title && <meta name='citation_title' content={article.title} />}

      {article?.publicationDate && <meta name='citation_publication_date' content={article.publicationDate} />}

      {article?.doi && <meta name='citation_doi' content={article.doi} />}

      {/* Constant - always blank */}
      <meta name="citation_fulltext_world_readable" content="" />

      {article?.pdfLink && <meta name="citation_pdf_url" content={article.pdfLink} />}

      <meta name="citation_issn" content={currentJournal?.settings?.find((setting) => setting.setting === "ISSN")?.value} />

      <meta name="citation_language" content={language} />

      {article?.tag && <meta name="citation_article_type" content={article.tag} />}

      {keywords.length > 0 && keywords.map((keyword, index) => (
        <meta key={index} name='citation_keywords' content={keyword} />
      ))}

      {/* Section "DC.xxx" */}
      {authors.length > 0 && authors.map((author, index) => (
        <meta key={index} name='DC.creator' content={author.fullname} />
      ))}

      <meta name="DC.language" content={language} />

      {article?.title && <meta name='DC.title' content={article.title} />}

      {/* Constant */}
      <meta name="DC.type" content="journal" />

      {article?.id && <meta name="DC.identifier" content={article.id.toString()} />}
      {article?.docLink && <meta name="DC.identifier" content={article.docLink} />}
      {article?.pdfLink && <meta name="DC.identifier" content={article.pdfLink} />}

      {article?.abstract && <meta name='DC.description' content={extractAbstractText(article.abstract)} />}

      {keywords.length > 0 && keywords.map((keyword, index) => (
        <meta key={index} name='DC.subject' content={keyword} />
      ))}

      {article?.publicationDate && <meta name='DC.date' content={article.publicationDate} />}

      {currentJournal?.name && <meta name='DC.relation.ispartof' content={currentJournal.name} />}

      {/* Constant */}
      <meta name="DC.publisher" content="Episciences.org" />

      {/* Section "og:xxx" */}
      {article?.title && <meta name='og:title' content={article.title} />}

      {article?.tag && <meta name="og:type" content={article.tag} />}

      {article?.publicationDate && <meta name='og:article:published_time' content={article.publicationDate} />}
      {article?.modificationDate && <meta name='og:article:modified_time' content={article.modificationDate} />}

      {authors.length > 0 && authors.map((author, index) => (
        <meta key={index} name='og:article:author' content={author.fullname} />
      ))}

      {keywords.length > 0 && keywords.map((keyword, index) => (
        <meta key={index} name='og:article:tag' content={keyword} />
      ))}

      <meta name="og:locale" content={language} />

      {article?.docLink && <meta name="og:url" content={article.docLink} />}

      {article?.abstract && <meta name='og:description' content={extractAbstractText(article.abstract)} />}

      {/* Constant */}
      <meta name="og:site_name" content="Episciences.org" />

      {/* Section "twitter:xxx" */}

      {/* Constant */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@episciences" />

      {article?.title && <meta name='twitter:title' content={article.title} />}

      {article?.abstract && <meta name='twitter:description' content={extractAbstractText(article.abstract)} />}

      {/* Constant */}
      <link href="https://inbox.episciences.org/" rel="http://www.w3.org/ns/ldp#inbox" />
    </Helmet>
  )
}