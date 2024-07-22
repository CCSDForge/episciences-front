import { IArticle, IArticleCitation, RawArticle } from "../types/article";

export type FetchedArticle = IArticle | undefined;

export const formatArticle = (article: RawArticle): FetchedArticle => {
  if (article['@id']) {
    const articleJournal = article.document.public_properties.journal
    const articleDB = article.document.public_properties.database
    const articleConference = article.document.public_properties.conference

    const articleContent = articleJournal?.journal_article ?? articleConference.conference_paper

    const abstract = typeof articleContent.abstract?.value === 'string' ? articleContent.abstract?.value : articleContent.abstract?.value.value 

    const pdfLink = Array.isArray(articleDB.current.files) ? articleDB.current.files[0].link : articleDB.current.files.link

    let citations: IArticleCitation[] = []
    if (articleContent.citation_list?.citation) {
      citations = articleContent.citation_list.citation.map((c) => ({
        doi: c.doi,
        citation: c.unstructured_citation
      }))
    }

    let acceptanceDate = undefined;
    if (articleContent?.acceptance_date) {
      acceptanceDate = `${articleContent?.acceptance_date.year}-${articleContent?.acceptance_date.month}-${articleContent?.acceptance_date.day}`
    }

    let authors = null;

    if (Array.isArray(articleContent.contributors.person_name)) {
      const authorOrder = {"first": 1, "additional": 2};
      const sortedAuthors = articleContent.contributors.person_name.sort((a, b) => authorOrder[a["@sequence"] as keyof typeof authorOrder] - authorOrder[b["@sequence"] as keyof typeof authorOrder]);
      authors = sortedAuthors.map(author => `${author.given_name} ${author.surname}`.trim()).join(", ")
    } else {
      authors = `${articleContent.contributors.person_name.given_name} ${articleContent.contributors.person_name.surname}`.trim()
    }

    let relatedItems: string[] = []
    if (Array.isArray(articleContent.program?.related_item)) {
      articleContent.program.related_item.forEach((item) => item.inter_work_relation && relatedItems.push(item.inter_work_relation?.value))
    } else if (articleContent.program?.related_item?.inter_work_relation) {
      relatedItems.push(articleContent.program?.related_item?.inter_work_relation?.value)
    }

    return {
      ...article,
      id: article.paperid,
      title: articleContent.titles.title,
      abstract,
      authors,
      publicationDate: articleDB.current.dates.publication_date,
      acceptanceDate,
      submissionDate: articleDB.current.dates.first_submission_date,
      tag: articleDB.current.type?.title.toLowerCase(),
      pdfLink,
      halLink: articleDB.current.repository.paper_url,
      docLink: articleDB.current.repository.doc_url,
      repositoryIdentifier: articleDB.current.identifiers.repository_identifier,
      keywords: articleContent.keywords,
      doi: articleContent.doi_data.doi,
      volumeId: articleDB.current.volume?.id,
      citations: citations,
      relatedItems: relatedItems
    };
  }

  return undefined;
}

export const formatArticleAuthors = (article: FetchedArticle): string => {
  const splitAuthors = article?.authors.split(',') ?? []

  if (splitAuthors.length > 3) {
    return `${splitAuthors.splice(0, 3).join(',')} et al`
  }

  return splitAuthors.join(',')
}

export enum ARTICLE_TYPE {
  ARTICLE = 'article',
  BOOK = 'book',
  BOOK_PART = 'bookpart',
  CONFERENCE = 'conferenceobject',
  LECTURE = 'lecture',
  OTHER = 'other',
  PRE_PRINT = 'preprint',
  REPORT = 'report',
  SOFTWARE = 'software'
}

export const articleTypes: { labelPath: string; value: string; }[] = [
  { labelPath: 'pages.articles.types.article', value: ARTICLE_TYPE.ARTICLE },
  { labelPath: 'pages.articles.types.book', value: ARTICLE_TYPE.BOOK },
  { labelPath: 'pages.articles.types.bookpart', value: ARTICLE_TYPE.BOOK_PART },
  { labelPath: 'pages.articles.types.conference', value: ARTICLE_TYPE.CONFERENCE },
  { labelPath: 'pages.articles.types.lecture', value: ARTICLE_TYPE.LECTURE },
  { labelPath: 'pages.articles.types.other', value: ARTICLE_TYPE.OTHER },
  { labelPath: 'pages.articles.types.preprint', value: ARTICLE_TYPE.PRE_PRINT },
  { labelPath: 'pages.articles.types.report', value: ARTICLE_TYPE.REPORT },
  { labelPath: 'pages.articles.types.software', value: ARTICLE_TYPE.SOFTWARE },
]