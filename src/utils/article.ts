import { TFunction } from 'i18next';
import { Cite, plugins, util } from '@citation-js/core'
import '@citation-js/plugin-csl'
import '@citation-js/plugin-doi'


import { IArticle, IArticleAuthor, IArticleCitedBy, IArticleReference, IArticleRelatedItem, RawArticle, AbstractItem, AbstractType } from "../types/article";
import { toastSuccess } from './toast';

export type FetchedArticle = IArticle | undefined;

export const formatArticle = (article: RawArticle): FetchedArticle => {
  if (article['@id']) {
    const articleJournal = article.document.journal
    const articleDB = article.document.database
    const articleConference = article.document.conference

    const articleContent = articleJournal?.journal_article ?? articleConference.conference_paper

/* Handling simple values only
 *  const abstract = typeof articleContent.abstract?.value === 'string' ? articleContent.abstract?.value : articleContent.abstract?.value.value
 */

    let abstract: AbstractType | undefined = undefined;

    // Case 1: The abstract value is an array
    if (articleContent.abstract?.value) {
      const value = articleContent.abstract.value;
      // Case 1.1: Array of strings
      if (Array.isArray(value)) {

        if (value.length > 0 && typeof value[0] === 'string') {
          abstract = {
            value: value as string[]
          };
        } else {
          //case 1.2 :Case 1.2: Array of objects containing abstracts in different languages
        abstract = {
          value: value
              .filter((item): item is AbstractItem =>
                  typeof item === 'object' &&
                  item !== null &&
                  typeof item.value === 'string' &&
                  typeof item['@xml:lang'] === 'string'
              )
        };
      }
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        // Case 2: A single object representing a single language abstract
        const singleValue = value as { '@xml:lang'?: string; value?: string };

        // Convert the single object into an array of AbstractItem
        abstract = {
          value: [{
            '@xml:lang': singleValue['@xml:lang'] ?? 'unknown',
            value: singleValue.value ?? ''
          }]
        };
      }
    }


    /** Format references */
    let references: IArticleReference[] = []
    if (articleContent.citation_list?.citation) {
      references = articleContent.citation_list.citation.map((c) => ({
        doi: c.doi,
        citation: c.unstructured_citation
      }))
    }

    /** Format citedBy */
    let citedBy: IArticleCitedBy[] = []
    if (articleDB.current.cited_by) {
      citedBy = Object.values(articleDB.current.cited_by).map((cb) => ({
        source: cb.source_id_name,
        citations: Object.values(JSON.parse(cb.citation as unknown as string)).map((c) => {
          const citation = c as Record<string, string>;
          const authors: string[] = citation.author.split(';')

          return {
            title: citation.title,
            sourceTitle: citation.source_title,
            authors: authors.map(author => ({
              fullname: author.split(',')[0].trim(),
              orcid: author.split(',')[1] ? author.split(',')[1].trim() : undefined
            })),
            reference: {
              volume: citation.volume,
              year: citation.year,
              page: citation.page
            },
            doi: citation.doi
          }
        })
      }))
    }

    /** Format acceptance date */
    let acceptanceDate = undefined;
    if (articleContent?.acceptance_date) {
      acceptanceDate = `${articleContent?.acceptance_date.year}-${articleContent?.acceptance_date.month}-${articleContent?.acceptance_date.day}`
    }

    let isImported = false;
    if (articleDB?.current.flag && articleDB?.current.flag == "imported") {
      isImported = true;
    }

    /** Format authors */
    let authors: IArticleAuthor[] = [];
    if (Array.isArray(articleContent.contributors.person_name)) {
      const authorOrder = {"first": 1, "additional": 2};
      const sortedAuthors = articleContent.contributors.person_name.sort((a, b) => authorOrder[a["@sequence"] as keyof typeof authorOrder] - authorOrder[b["@sequence"] as keyof typeof authorOrder]);
      authors = sortedAuthors.map((author) => {
        const fullname = author.given_name ? `${author.given_name} ${author.surname}`.trim() : author.surname.trim()
        const orcid = author.ORCID
        let institutions: string[] = []
        if (Array.isArray(author.affiliations?.institution)) {
          institutions = author.affiliations?.institution.map(i => i.institution_name)
        } else {
          if (author.affiliations?.institution?.institution_name) {
            institutions = [author.affiliations?.institution?.institution_name]
          }
        }

        return {
          fullname,
          orcid,
          institutions
        }
      })
    } else {
      const authorFullname = articleContent.contributors.person_name.given_name ? `${articleContent.contributors.person_name.given_name} ${articleContent.contributors.person_name.surname}`.trim() : articleContent.contributors.person_name.surname.trim()
      const authorOrcid = articleContent.contributors.person_name.ORCID
      let authorInstitutions: string[] = []
      if (Array.isArray(articleContent.contributors.person_name.affiliations?.institution)) {
        authorInstitutions = articleContent.contributors.person_name.affiliations?.institution.map(i => i.institution_name)
      } else {
        if (articleContent.contributors.person_name.affiliations?.institution?.institution_name) {
          authorInstitutions = [articleContent.contributors.person_name.affiliations?.institution?.institution_name]
        }
      }

      authors = [
        { fullname: authorFullname, orcid: authorOrcid, institutions: authorInstitutions }
      ]
    }

    /** Format relatedItems */
    const relatedItems: IArticleRelatedItem[] = []
    if (Array.isArray(articleContent.program)) {
      articleContent.program.forEach((prog) => {
        if (Array.isArray(prog?.related_item)) {
          prog.related_item.forEach((item) => {
            if (item.inter_work_relation) {
              relatedItems.push({
                value: item.inter_work_relation?.value,
                identifierType: item.inter_work_relation['@identifier-type'],
                relationshipType: item.inter_work_relation['@relationship-type'],
                citation: item.inter_work_relation.unstructured_citation
              });
            }
            if (item.intra_work_relation) {
              relatedItems.push({
                value: item.intra_work_relation?.value,
                identifierType: item.intra_work_relation['@identifier-type'],
                relationshipType: item.intra_work_relation['@relationship-type'],
                citation: item.intra_work_relation.unstructured_citation
              });
            }
          })
        } else if (prog?.related_item?.inter_work_relation) {
          relatedItems.push({
            value: prog.related_item.inter_work_relation?.value,
            identifierType: prog.related_item.inter_work_relation['@identifier-type'],
            relationshipType: prog.related_item.inter_work_relation['@relationship-type'],
            citation: prog.related_item.inter_work_relation.unstructured_citation
          });
        } else if (prog?.related_item?.intra_work_relation) {
          relatedItems.push({
            value: prog.related_item.intra_work_relation?.value,
            identifierType: prog.related_item.intra_work_relation['@identifier-type'],
            relationshipType: prog.related_item.intra_work_relation['@relationship-type'],
            citation: prog.related_item.intra_work_relation.unstructured_citation
          });
        }
      })
    } else {
      if (Array.isArray(articleContent.program?.related_item)) {
        articleContent.program.related_item.forEach((item) => {
          if (item.inter_work_relation) {
            relatedItems.push({
              value: item.inter_work_relation?.value,
              identifierType: item.inter_work_relation['@identifier-type'],
              relationshipType: item.inter_work_relation['@relationship-type'],
              citation: item.inter_work_relation.unstructured_citation
            });
          }
          if (item.intra_work_relation) {
            relatedItems.push({
              value: item.intra_work_relation?.value,
              identifierType: item.intra_work_relation['@identifier-type'],
              relationshipType: item.intra_work_relation['@relationship-type'],
              citation: item.intra_work_relation.unstructured_citation
            });
          }
      })
      } else if (articleContent.program?.related_item?.inter_work_relation) {
        relatedItems.push({
          value: articleContent.program.related_item.inter_work_relation?.value,
          identifierType: articleContent.program.related_item.inter_work_relation['@identifier-type'],
          relationshipType: articleContent.program.related_item.inter_work_relation['@relationship-type'],
          citation: articleContent.program.related_item.inter_work_relation.unstructured_citation
        });
      } else if (articleContent.program?.related_item?.intra_work_relation) {
        relatedItems.push({
          value: articleContent.program.related_item.intra_work_relation?.value,
          identifierType: articleContent.program.related_item.intra_work_relation['@identifier-type'],
          relationshipType: articleContent.program.related_item.intra_work_relation['@relationship-type'],
          citation: articleContent.program.related_item.intra_work_relation.unstructured_citation
        });
      }
    }

    /** Format fundings */
    const fundings: string[] = []
    if (Array.isArray(articleContent.program)) {
      const fundref = articleContent.program.find(p => p['@name'] && p['@name'] === 'fundref')
      if (fundref) {
        if (Array.isArray(fundref.assertion?.assertion)) {
          fundref.assertion?.assertion?.forEach((as) => fundings.push(as.value))
        } else if (fundref.assertion?.assertion?.value) {
          fundings.push(fundref.assertion?.assertion?.value)
        }
      }
    } else {
      if (articleContent.program && articleContent.program['@name'] === 'fundref') {
        if (Array.isArray(articleContent.program.assertion?.assertion)) {
          articleContent.program.assertion?.assertion?.forEach((as) => fundings.push(as.value))
        } else if (articleContent.program.assertion?.assertion?.value) {
          fundings.push(articleContent.program.assertion?.assertion?.value)
        }
      }
    }

    /** Format license */
    let license = undefined;
    if (Array.isArray(articleContent.program)) {
      const licenseRef = articleContent.program.find(p => p.license_ref && p.license_ref.value)?.license_ref
      license = licenseRef?.value
    } else {
      license = articleContent.program?.license_ref?.value
    }

    /** Format metrics */
    const metrics: { views: number; downloads: number } = { views: 0, downloads: 0 };
    if (articleDB.current.metrics) {
        metrics.downloads = articleDB.current.metrics.file_count
        metrics.views = articleDB.current.metrics.page_count
    }

    return {
      ...article,
      id: article.paperid,
      title: articleContent.titles.title,
      abstract: abstract,
      graphicalAbstract: articleDB.current.graphical_abstract_file,
      authors,
      publicationDate: articleDB.current.dates.publication_date,
      acceptanceDate,
      submissionDate: articleDB.current.dates.first_submission_date,
      modificationDate: articleDB.current.dates.modification_date,
      isImported,
      tag: articleDB.current.type?.title.toLowerCase(),
      repositoryName: articleDB.current.repository.name,
      pdfLink: articleDB.current.mainPdfUrl.length ? articleDB.current.mainPdfUrl : undefined,
      docLink: articleDB.current.repository.doc_url.length ? articleDB.current.repository.doc_url : undefined,
      repositoryIdentifier: articleDB.current.identifiers.repository_identifier,
      keywords: articleContent.keywords,
      doi: articleContent.doi_data.doi,
      volumeId: articleDB.current.volume?.id,
      references: references,
      citedBy: citedBy,
      relatedItems: relatedItems,
      fundings: fundings,
      license: license,
      metrics: metrics
    };
  }

  return undefined;
}

export const truncatedArticleAuthorsName = (article: FetchedArticle): string => {
  const authorsName = article?.authors.map(author => author.fullname) ?? []

  if (authorsName.length > 3) {
    return `${authorsName.splice(0, 3).join(', ')} et al`
  }

  return authorsName.join(', ')
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

export enum CITATION_TEMPLATE {
  APA = 'APA',
  MLA = 'MLA',
  BIBTEX = 'BibTeX'
}

export const citationCustomTemplates: { key: CITATION_TEMPLATE, url: string }[] = [
  { key: CITATION_TEMPLATE.MLA, url: `${import.meta.env.VITE_ZOTERO_HOMEPAGE}/styles/modern-language-association` }
]

export interface ICitation {
  key: CITATION_TEMPLATE;
  citation: string
}

export const getCitations = async (csl?: string): Promise<ICitation[]> => {
  const citations: ICitation[] = []

  if (!csl) return citations

  const citationData = await Cite.async(csl).catch(() => {})

  if (!citationData) return citations

  const config = plugins.config.get("@csl")

  await Promise.all(citationCustomTemplates.map(async customTemplate => {
    const templateXml = await util.fetchFileAsync(customTemplate.url)
    config.templates.add(customTemplate.key, templateXml)
  }))

  await Promise.all(Object.values(CITATION_TEMPLATE).filter(template => template !== CITATION_TEMPLATE.BIBTEX).map(async template => {
    const output = citationData.format('bibliography', {
      format: 'text',
      template
    })

    if (!citations.find(citation => citation.key === template)) {
      citations.push({
        key: template,
        citation: output
      })
    }
  }))

  return citations
}

export const copyToClipboardCitation = (citation: ICitation, t: TFunction<"translation", undefined>): void => {
  navigator.clipboard.writeText(citation.citation)
  toastSuccess(t('common.citeSuccess', { template: citation.key }))
}

export const getLicenseTranslations = (t: TFunction<"translation", undefined>): { value: string; label: string, isLink?: boolean }[] => [
  {
    value: `${import.meta.env.VITE_ARXIV_HOMEPAGE}/licenses/assumed-1991-2003`,
    label: t('pages.articleDetails.licenses.arxiv.assumed'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_ARXIV_HOMEPAGE}/licenses/nonexclusive-distrib/1.0`,
    label: t('pages.articleDetails.licenses.arxiv.nonExclusive'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nc/1.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.nonCommercial1.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nc/2.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.nonCommercial2.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nc/2.5`,
    label: t('pages.articleDetails.licenses.creativeCommons.nonCommercial2.5'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nc/3.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.nonCommercial3.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nc/4.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.nonCommercial4.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nd/1.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.noDerivatives1.0'),
    isLink: true
  },
  { 
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nd/2.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.noDerivatives2.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nd/2.5`,
    label: t('pages.articleDetails.licenses.creativeCommons.noDerivatives2.5'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nd/3.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.noDerivatives3.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nd/4.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.noDerivatives4.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nd-nc/1.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.noDerivativesNonCommercial1.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nc-nd/2.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.noDerivativesNonCommercial2.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nc-nd/2.5`,
    label: t('pages.articleDetails.licenses.creativeCommons.noDerivativesNonCommercial2.5'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nc-nd/3.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.noDerivativesNonCommercial3.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nc-nd/4.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.noDerivativesNonCommercial4.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nc-sa/1.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.nonCommercialShareAlike1.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nc-sa/2.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.nonCommercialShareAlike2.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nc-sa/2.5`,
    label: t('pages.articleDetails.licenses.creativeCommons.nonCommercialShareAlike2.5'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nc-sa/3.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.nonCommercialShareAlike3.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-nc-sa/4.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.nonCommercialShareAlike4.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-sa/1.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.shareAlike1.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-sa/2.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.shareAlike2.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-sa/2.5`,
    label: t('pages.articleDetails.licenses.creativeCommons.shareAlike2.5'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-sa/3.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.shareAlike3.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by-sa/4.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.shareAlike4.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by/1.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.generic1.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by/2.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.generic2.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by/2.5`,
    label: t('pages.articleDetails.licenses.creativeCommons.generic2.5'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by/3.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.generic3.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/licenses/by/4.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.generic4.0'),
    isLink: true
  },
  {
    value: `${import.meta.env.VITE_CREATIVE_COMMONS_HOMEPAGE}/publicdomain/zero/1.0`,
    label: t('pages.articleDetails.licenses.creativeCommons.zero1.0'),
    isLink: true
  },
  {
    value: "info:eu-repo/semantics/closedAccess",
    label: t('pages.articleDetails.licenses.others.closedAccess')
  },
  {
    value: "info:eu-repo/semantics/embargoedAccess",
    label: t('pages.articleDetails.licenses.others.embargoedAccess')
  },
  {
    value: "info:eu-repo/semantics/restrictedAccess",
    label: t('pages.articleDetails.licenses.others.restrictedAccess')
  },
  {
    value: "info:eu-repo/semantics/openAccess",
    label: t('pages.articleDetails.licenses.others.openAccess')
  }
]

export enum LINKED_PUBLICATION_IDENTIFIER_TYPE {
  URI = 'uri',
  ARXIV = 'arxiv',
  HAL = 'hal',
  DOI = 'doi',
  OTHER = 'other'
}

export enum METADATA_TYPE {
  TEI = 'tei',
  DC = 'dc',
  CROSSREF = 'crossref',
  ZBJATS = 'zbjats',
  DOAJ = 'doaj',
  BIBTEX = 'bibtex',
  CSL = 'csl',
  OPENAIRE = 'openaire',
  JSON = 'json'
}

export enum METADATA_FORMAT {
  JSON = 'json',
  TEXT = 'txt',
  XML = 'xml'
}

export const getMetadataTypes: { type: METADATA_TYPE; label: string; format: METADATA_FORMAT }[] = [
  { type: METADATA_TYPE.TEI, label: 'TEI', format: METADATA_FORMAT.XML },
  { type: METADATA_TYPE.DC, label: 'Dublin Core', format: METADATA_FORMAT.XML },
  { type: METADATA_TYPE.CROSSREF, label: 'Crossref', format: METADATA_FORMAT.XML },
  { type: METADATA_TYPE.ZBJATS, label: 'ZB Jats', format: METADATA_FORMAT.XML },
  { type: METADATA_TYPE.DOAJ, label: 'DOAJ', format: METADATA_FORMAT.XML },
  { type: METADATA_TYPE.BIBTEX, label: 'BibTeX', format: METADATA_FORMAT.TEXT },
  { type: METADATA_TYPE.CSL, label: 'CSL', format: METADATA_FORMAT.JSON },
  { type: METADATA_TYPE.OPENAIRE, label: 'OpenAire', format: METADATA_FORMAT.XML },
  { type: METADATA_TYPE.JSON, label: 'JSON', format: METADATA_FORMAT.JSON }
]

export enum INTER_WORK_RELATIONSHIP {
  IS_SAME_AS = "isSameAs",
  HAS_PREPRINT = "hasPreprint",
  IS_DERIVED_FROM = "isDerivedFrom",
  HAS_DERIVATION = "hasDerivation",
  IS_REVIEW_OF = "isReviewOf",
  HAS_REVIEW = "hasReview",
  IS_COMMENT_ON = "isCommentOn",
  HAS_COMMENT = "hasComment",
  IS_REPLY_TO = "isReplyTo",
  HAS_REPLY = "hasReply",
  BASED_ON_DATA = "basedOnData",
  IS_DATA_BASIS_FOR = "isDataBasisFor",
  HAS_RELATED_MATERIAL = "hasRelatedMaterial",
  IS_RELATED_MATERIAL = "isRelatedMaterial",
  IS_COMPILED_BY = "isCompiledBy",
  COMPILES = "compiles",
  IS_DOCUMENTED_BY = "isDocumentedBy",
  DOCUMENTS = "documents",
  IS_SUPPLEMENT_TO = "isSupplementTo",
  IS_SUPPLEMENTED_BY = "isSupplementedBy",
  IS_CONTINUED_BY = "isContinuedBy",
  CONTINUES = "continues",
  IS_PART_OF = "isPartOf",
  HAS_PART = "hasPart",
  REFERENCES = "references",
  IS_REFERENCED_BY = "isReferencedBy",
  IS_BASED_ON = "isBasedOn",
  IS_BASIS_FOR = "isBasisFor",
  REQUIRES = "requires",
  IS_REQUIRED_BY = "isRequiredBy",
  FINANCES = "finances",
  IS_FINANCED_BY = "isFinancedBy",
  IS_VERSION_OF = "isVersionOf",
  IS_RELATED_TO = "isRelatedTo"
}

export const interworkRelationShipTypes: { labelPath: string; value: string; }[] = [
  { labelPath: 'pages.articleDetails.relationships.isSameAs', value: INTER_WORK_RELATIONSHIP.IS_SAME_AS },
  { labelPath: 'pages.articleDetails.relationships.hasPreprint', value: INTER_WORK_RELATIONSHIP.HAS_PREPRINT },
  { labelPath: 'pages.articleDetails.relationships.isDerivedFrom', value: INTER_WORK_RELATIONSHIP.IS_DERIVED_FROM },
  { labelPath: 'pages.articleDetails.relationships.hasDerivation', value: INTER_WORK_RELATIONSHIP.HAS_DERIVATION },
  { labelPath: 'pages.articleDetails.relationships.isReviewOf', value: INTER_WORK_RELATIONSHIP.IS_REVIEW_OF },
  { labelPath: 'pages.articleDetails.relationships.hasReview', value: INTER_WORK_RELATIONSHIP.HAS_REVIEW },
  { labelPath: 'pages.articleDetails.relationships.isCommentOn', value: INTER_WORK_RELATIONSHIP.IS_COMMENT_ON },
  { labelPath: 'pages.articleDetails.relationships.hasComment', value: INTER_WORK_RELATIONSHIP.HAS_COMMENT },
  { labelPath: 'pages.articleDetails.relationships.isReplyTo', value: INTER_WORK_RELATIONSHIP.IS_REPLY_TO },
  { labelPath: 'pages.articleDetails.relationships.hasReply', value: INTER_WORK_RELATIONSHIP.HAS_REPLY },
  { labelPath: 'pages.articleDetails.relationships.basedOnData', value: INTER_WORK_RELATIONSHIP.BASED_ON_DATA },
  { labelPath: 'pages.articleDetails.relationships.isDataBasisFor', value: INTER_WORK_RELATIONSHIP.IS_DATA_BASIS_FOR },
  { labelPath: 'pages.articleDetails.relationships.hasRelatedMaterial', value: INTER_WORK_RELATIONSHIP.HAS_RELATED_MATERIAL },
  { labelPath: 'pages.articleDetails.relationships.isRelatedMaterial', value: INTER_WORK_RELATIONSHIP.IS_RELATED_MATERIAL },
  { labelPath: 'pages.articleDetails.relationships.isCompiledBy', value: INTER_WORK_RELATIONSHIP.IS_COMPILED_BY },
  { labelPath: 'pages.articleDetails.relationships.compiles', value: INTER_WORK_RELATIONSHIP.COMPILES },
  { labelPath: 'pages.articleDetails.relationships.isDocumentedBy', value: INTER_WORK_RELATIONSHIP.IS_DOCUMENTED_BY },
  { labelPath: 'pages.articleDetails.relationships.documents', value: INTER_WORK_RELATIONSHIP.DOCUMENTS },
  { labelPath: 'pages.articleDetails.relationships.isSupplementTo', value: INTER_WORK_RELATIONSHIP.IS_SUPPLEMENT_TO },
  { labelPath: 'pages.articleDetails.relationships.isSupplementedBy', value: INTER_WORK_RELATIONSHIP.IS_SUPPLEMENTED_BY },
  { labelPath: 'pages.articleDetails.relationships.isContinuedBy', value: INTER_WORK_RELATIONSHIP.IS_CONTINUED_BY },
  { labelPath: 'pages.articleDetails.relationships.continues', value: INTER_WORK_RELATIONSHIP.CONTINUES },
  { labelPath: 'pages.articleDetails.relationships.isPartOf', value: INTER_WORK_RELATIONSHIP.IS_PART_OF },
  { labelPath: 'pages.articleDetails.relationships.hasPart', value: INTER_WORK_RELATIONSHIP.HAS_PART },
  { labelPath: 'pages.articleDetails.relationships.references', value: INTER_WORK_RELATIONSHIP.REFERENCES },
  { labelPath: 'pages.articleDetails.relationships.isReferencedBy', value: INTER_WORK_RELATIONSHIP.IS_REFERENCED_BY },
  { labelPath: 'pages.articleDetails.relationships.isBasedOn', value: INTER_WORK_RELATIONSHIP.IS_BASED_ON },
  { labelPath: 'pages.articleDetails.relationships.isBasisFor', value: INTER_WORK_RELATIONSHIP.IS_BASIS_FOR },
  { labelPath: 'pages.articleDetails.relationships.requires', value: INTER_WORK_RELATIONSHIP.REQUIRES },
  { labelPath: 'pages.articleDetails.relationships.isRequiredBy', value: INTER_WORK_RELATIONSHIP.IS_REQUIRED_BY },
  { labelPath: 'pages.articleDetails.relationships.finances', value: INTER_WORK_RELATIONSHIP.FINANCES },
  { labelPath: 'pages.articleDetails.relationships.isFinancedBy', value: INTER_WORK_RELATIONSHIP.IS_FINANCED_BY },
  { labelPath: 'pages.articleDetails.relationships.isVersionOf', value: INTER_WORK_RELATIONSHIP.IS_VERSION_OF },
  { labelPath: 'pages.articleDetails.relationships.isRelatedTo', value: INTER_WORK_RELATIONSHIP.IS_RELATED_TO },
]