import { IArticle, RawArticle } from "../types/article";

export type FetchedArticle = IArticle | undefined;

export const formatArticle = (article: RawArticle): FetchedArticle => {
  if (article['@id']) {
    const articleJournal = article.document.public_properties.journal
    const articleDB = article.document.public_properties.database
    const articleConference = article.document.public_properties.conference

    const articleContent = articleJournal?.journal_article ?? articleConference.conference_paper

    const abstract = typeof articleContent.abstract?.value === 'string' ? articleContent.abstract?.value : articleContent.abstract?.value.value 

    const acceptanceDate = `${articleJournal?.journal_article.acceptance_date.year}-${articleJournal?.journal_article.acceptance_date.month}-${articleJournal?.journal_article.acceptance_date.day}`

    let authors = null;

    if (Array.isArray(articleContent.contributors.person_name)) {
      const authorOrder = {"first": 1, "additional": 2};
      const sortedAuthors = articleContent.contributors.person_name.sort((a, b) => authorOrder[a["@sequence"] as keyof typeof authorOrder] - authorOrder[b["@sequence"] as keyof typeof authorOrder]);
      authors = sortedAuthors.map(author => `${author.given_name} ${author.surname}`.trim()).join(", ")
    } else {
      authors = `${articleContent.contributors.person_name.given_name} ${articleContent.contributors.person_name.surname}`.trim()
    }

    return {
      ...article,
      id: article.paperid,
      title: articleContent.titles.title,
      abstract,
      authors,
      publicationDate: articleDB.current.dates.publication_date,
      acceptanceDate,
      tag: articleDB.current.type?.title.toLowerCase(),
      pdfLink: articleDB.current.files.link,
      halLink: articleDB.current.repository.paper_url,
      docLink: articleDB.current.repository.doc_url,
      repositoryIdentifier: articleDB.current.identifiers.repository_identifier,
      keywords: articleContent.keywords,
      doi: articleContent.doi_data.resource
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
  CONFERENCE = 'conferenceobject',
  PRE_PRINT = 'preprint'
}

export const articleTypes: { labelPath: string; value: string; }[] = [
  { labelPath: 'pages.articles.types.article', value: ARTICLE_TYPE.ARTICLE },
  { labelPath: 'pages.articles.types.conference', value: ARTICLE_TYPE.CONFERENCE },
  { labelPath: 'pages.articles.types.preprint', value: ARTICLE_TYPE.PRE_PRINT },
]