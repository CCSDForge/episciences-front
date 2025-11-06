import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import remarkGfm from 'remark-gfm';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { useAppSelector } from "../../../hooks/store";
import { useFetchEditorialWorkflowPageQuery, useFetchEthicalCharterPageQuery, useFetchPrepareSubmissionPageQuery } from "../../../store/features/forAuthor/forAuthor.query";
import { generateIdFromText, unifiedProcessor, serializeMarkdown, getMarkdownImageURL, adjustNestedListsInMarkdownContent } from '../../../utils/markdown';
import { FOR_AUTHORS_SECTION, getForAuthorsSectionSortOrder } from '../../../utils/forAuthors';
import ForAuthorsSidebar, { IForAuthorsHeader } from '../../components/Sidebars/ForAuthorsSidebar/ForAuthorsSidebar';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import './ForAuthors.scss';
import {Helmet} from "react-helmet-async";

type ForAuthorsSectionType = FOR_AUTHORS_SECTION;

interface IForAuthorsSection {
  id: string;
  value: string;
  opened: boolean;
  cards?: { id: string; title: string; content: string; index: number }[];
  title: string;
  sectionType: ForAuthorsSectionType;
}

export default function ForAuthors(): JSX.Element {
  const { t } = useTranslation();

  const language = useAppSelector(state => state.i18nReducer.language);
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code);
  const journalName = useAppSelector(state => state.journalReducer.currentJournal?.name);

  const [pageSections, setPageSections] = useState<IForAuthorsSection[]>([]);
  const [sidebarHeaders, setSidebarHeaders] = useState<IForAuthorsHeader[]>([]);

  const { data: editorialWorkflowPage, isFetching: isFetchingEditorialWorkflow } = useFetchEditorialWorkflowPageQuery(rvcode!, { skip: !rvcode });
  const { data: ethicalCharterPage, isFetching: isFetchingEthicalCharter } = useFetchEthicalCharterPageQuery(rvcode!, { skip: !rvcode });
  const { data: prepareSubmissionPage, isFetching: isFetchingPrepareSubmission } = useFetchPrepareSubmissionPageQuery(rvcode!, { skip: !rvcode });

  const parseContentSections = (toBeParsed: Record<ForAuthorsSectionType, { title: string | undefined; content: string | undefined }>): IForAuthorsSection[] => {
    const sections: IForAuthorsSection[] = [];

    Object.entries(toBeParsed).forEach((toBeParsedEntry) => {
      const sectionType = toBeParsedEntry[0] as ForAuthorsSectionType;
      const withNumerotation = sectionType === FOR_AUTHORS_SECTION.PREPARE_SUBMISSION;
      const title = toBeParsedEntry[1].title ?? '';
      const content = toBeParsedEntry[1].content ?? '';
      const adjustedContent = adjustNestedListsInMarkdownContent(content);

      const parsedContent = `## ${title} \n\n\n ${adjustedContent}`;
      const tree = unifiedProcessor.parse(parsedContent);

      let currentSection: IForAuthorsSection = withNumerotation ? { id: '', value: '', title: title || '', sectionType, opened: true, cards: [] } : { id: '', value: '', title: title || '', sectionType, opened: true };
      let h3Counter = 0;
      let currentCardContent = '';

      tree.children.forEach((node) => {
        if (node.type === 'heading' && node.depth === 2) {
          if (currentSection.id) {
            sections.push(currentSection);
            currentSection = withNumerotation ? { id: '', value: '', title: title || '', sectionType, opened: true, cards: [] } : { id: '', value: '', title: title || '', sectionType, opened: true };
          }

          const titleText = node.children
            .filter(child => child.type === 'text')
            .map(textNode => (textNode as { value: string }).value)
            .join('');

          currentSection.id = generateIdFromText(titleText);
          currentSection.value += serializeMarkdown(node);
        } else if (withNumerotation) {
          if (node.type === 'heading' && node.depth === 3) {
            h3Counter += 1;

            const h3Id = generateIdFromText(node.children.map(child => (child as { value: string }).value).join(''));
            const h3Title = node.children.map(child => (child as { value: string }).value).join('');

            if (currentCardContent) {
              const lastCard = currentSection.cards![currentSection.cards!.length - 1];
              lastCard.content = currentCardContent.trim();
            }

            currentCardContent = '';
            currentSection.cards!.push({ id: h3Id, title: h3Title, content: '', index: h3Counter });
          } else if (currentSection.cards && currentSection.cards.length > 0) {
            currentCardContent += serializeMarkdown(node);
          } else {
            currentSection.value += serializeMarkdown(node);
            currentSection.value += '\n'
          }
        } else {
          currentSection.value += serializeMarkdown(node);
          currentSection.value += '\n'
        }
      });

      if (currentCardContent && currentSection.cards && currentSection.cards.length > 0) {
        const lastCard = currentSection.cards[currentSection.cards.length - 1];
        lastCard.content = currentCardContent.trim();
      }

      if (currentSection.id) {
        sections.push(currentSection);
      }
    });
    sections.sort((a, b) => {
      const orderA = getForAuthorsSectionSortOrder(a.sectionType);
      const orderB = getForAuthorsSectionSortOrder(b.sectionType);
      return orderA - orderB;
    });
    return sections;
  };

  const parseSidebarHeaders = (toBeParsed: Record<ForAuthorsSectionType, { title: string | undefined; content: string | undefined }>): IForAuthorsHeader[] => {

    const headerMap: Record<ForAuthorsSectionType, IForAuthorsHeader> = {} as Record<ForAuthorsSectionType, IForAuthorsHeader>;

    Object.entries(toBeParsed).forEach((toBeParsedEntry) => {
      const sectionType = toBeParsedEntry[0] as ForAuthorsSectionType;
      const withNumerotation = sectionType === FOR_AUTHORS_SECTION.PREPARE_SUBMISSION;
      const title = toBeParsedEntry[1].title ?? '';
      const content = toBeParsedEntry[1].content ?? '';
      const adjustedContent = adjustNestedListsInMarkdownContent(content);

      const parsedContent = `## ${title} \n\n\n ${adjustedContent}`;
      const tree = unifiedProcessor.parse(parsedContent);

      let lastH2 = null;
      let h3Counter = 0;

      for (const node of tree.children) {
        if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
          const textNode = node.children.find(child => child.type === 'text') as { value: string };

          if (textNode) {
            const id = generateIdFromText(textNode.value);
            let value = textNode.value;

            if (withNumerotation && node.depth === 3) {
              h3Counter += 1;
              value = `${h3Counter}. ${value}`;
            }

            const header: IForAuthorsHeader = {
              id,
              value,
              opened: true,
              children: []
            };

            if (node.depth === 2) {
              lastH2 = header;
              headerMap[sectionType] = header;
              h3Counter = 0;
            } else if (node.depth === 3 && lastH2) {
              lastH2.children.push(header);
            }
          }
        }
      }
    });

    const sectionTypes = Object.keys(headerMap) as ForAuthorsSectionType[];

    sectionTypes.sort((a, b) => {
      const orderA = getForAuthorsSectionSortOrder(a);
      const orderB = getForAuthorsSectionSortOrder(b);
      return orderA - orderB;
    });

    const headings: IForAuthorsHeader[] = [];
    sectionTypes.forEach(sectionType => {
      headings.push(headerMap[sectionType]);
    });

    return headings;
  };

  const toggleSectionHeader = (id: string): void => {
    const newSections = pageSections.map(section => {
      if (section.id === id) {
        return { ...section, opened: !section.opened };
      }
      return section;
    });

    setPageSections(newSections);
  };

  const toggleSidebarHeader = (id: string): void => {
    const newHeaders = sidebarHeaders.map(header => {
      if (header.id === id) {
        return { ...header, opened: !header.opened };
      }
      return header;
    });

    setSidebarHeaders(newHeaders);
  };

  useEffect(() => {
    const content: Record<ForAuthorsSectionType, { title: string | undefined; content: string | undefined }> = {
      [FOR_AUTHORS_SECTION.EDITORIAL_WORKFLOW]: {
        title: editorialWorkflowPage?.title[language],
        content: editorialWorkflowPage?.content[language]
      },
      [FOR_AUTHORS_SECTION.ETHICAL_CHARTER]: {
        title: ethicalCharterPage?.title[language],
        content: ethicalCharterPage?.content[language]
      },
      [FOR_AUTHORS_SECTION.PREPARE_SUBMISSION]: {
        title: prepareSubmissionPage?.title[language],
        content: prepareSubmissionPage?.content[language]
      },
    };

    setPageSections(parseContentSections(content));
    setSidebarHeaders(parseSidebarHeaders(content));
  }, [editorialWorkflowPage, ethicalCharterPage, prepareSubmissionPage, language]);

  return (
    <main className='forAuthors'>

      <Helmet>
        <title>{t('pages.forAuthors.title')} | {journalName ?? ''}</title>
      </Helmet>

      <Breadcrumb parents={[
        { path: 'home', label: `${t('pages.home.title')} >` },
        { path: 'publish', label: `${t('pages.publish.title')} >` }
      ]} crumbLabel={t('pages.forAuthors.title')} />
      <h1 className='forAuthors-title'>{t('pages.forAuthors.title')}</h1>

      {isFetchingEditorialWorkflow || isFetchingEthicalCharter || isFetchingPrepareSubmission ? (
        <Loader />
      ) : (
        <div className='forAuthors-content'>
          <ForAuthorsSidebar headers={sidebarHeaders} toggleHeaderCallback={toggleSidebarHeader} />
          <div className='forAuthors-content-body'>
            {pageSections.map(section => (
              <div
                key={section.id}
                className={`forAuthors-content-body-section ${!section.opened && 'forAuthors-content-body-section-hidden'}`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  urlTransform={uri => uri.includes('/public/') ? getMarkdownImageURL(uri, rvcode!) : uri}
                  components={{
                    a: ({ ...props }) => <Link to={props.href!} target='_blank' className='forAuthors-content-body-section-link'>{props.children?.toString()}</Link>,
                    h2: ({ ...props }) => {
                      const id = generateIdFromText(props.children?.toString()!);

                      return (
                        <div className='forAuthors-content-body-section-subtitle' onClick={(): void => toggleSectionHeader(id!)}>
                          <h2 id={id} className='forAuthors-content-body-section-subtitle-text' {...props} />
                          {pageSections.find(pageSection => pageSection.id === id)?.opened ? (
                            <img className='forAuthors-content-body-section-subtitle-caret' src={caretUp} alt='Caret up icon' />
                          ) : (
                            <img className='forAuthors-content-body-section-subtitle-caret' src={caretDown} alt='Caret down icon' />
                          )}
                        </div>
                      );
                    },
                    h3: ({ ...props }) => <h3 id={generateIdFromText(props.children?.toString()!)} {...props} />,
                  }}
                >
                  {section.value}
                </ReactMarkdown>
                <div className='forAuthors-content-body-section-cards'>
                  {section.cards?.map((card, index) => (
                    <div key={index} className={`forAuthors-content-body-section-cards-card ${!section.opened && 'forAuthors-content-body-section-cards-card-hidden'}`}>
                      <div className='forAuthors-content-body-section-cards-card-index'>{card.index}</div>
                      <div className='forAuthors-content-body-section-cards-card-content'>
                        <h3 id={card.id} className='forAuthors-content-body-section-cards-card-content-title'>{card.title}</h3>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{card.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
