import { IArticle, RawArticle } from "../types/article";

export type FetchedArticle = IArticle | undefined;

export const formatArticle = (article: RawArticle): FetchedArticle => {
  if (article['@id'] && article.document.public_properties.journal) {
    const articleJournal = article.document.public_properties.journal.journal_article
    const articleDB = article.document.public_properties.database

    const abstract = typeof articleJournal.abstract?.value === 'string' ? articleJournal.abstract?.value : articleJournal.abstract?.value.value 

    let authors = null;

    if (Array.isArray(articleJournal.contributors.person_name)) {
      const authorOrder = {"first": 1, "additional": 2};
      const sortedAuthors = articleJournal.contributors.person_name.sort((a, b) => authorOrder[a["@sequence"] as keyof typeof authorOrder] - authorOrder[b["@sequence"] as keyof typeof authorOrder]);
      authors = sortedAuthors.map(author => `${author.given_name} ${author.surname}`.trim()).join(", ")
    } else {
      authors = `${articleJournal.contributors.person_name.given_name} ${articleJournal.contributors.person_name.surname}`.trim()
    }

    return {
      ...article,
      id: article.paperid,
      title: articleJournal.titles.title,
      abstract,
      authors,
      publicationDate: articleDB.current.dates.publication_date,
      pdfLink: articleDB.current.files.link,
      halLink: articleDB.current.repository.paper_url,
      keywords: articleJournal.keywords,
      doi: articleJournal.doi_data.resource
    };
  }

  return undefined;
}