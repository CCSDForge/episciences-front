import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import remarkGfm from 'remark-gfm';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { useAppSelector } from '../../../hooks/store';
import { useFetchAcknowledgementsPageQuery } from '../../../store/features/acknowledgements/acknowledgements.query';
import { generateIdFromText, unifiedProcessor, serializeMarkdown, getMarkdownImageURL, adjustNestedListsInMarkdownContent } from '../../../utils/markdown';
import AcknowledgementsSidebar, { IAcknowledgementsHeader } from '../../components/Sidebars/AcknowledgementsSidebar/AcknowledgementsSidebar';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Loader from '../../components/Loader/Loader';
import './Acknowledgements.scss';

interface IAcknowledgementsSection {
  id: string;
  value: string;
  opened: boolean;
}

export default function Acknowledgements(): JSX.Element {
  const { t } = useTranslation();

  const language = useAppSelector(state => state.i18nReducer.language);
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code);
  const journalName = useAppSelector(state => state.journalReducer.currentJournal?.name);

  const [pageSections, setPageSections] = useState<IAcknowledgementsSection[]>([]);
  const [sidebarHeaders, setSidebarHeaders] = useState<IAcknowledgementsHeader[]>([]);

  const { data: acknowledgementsPage, isFetching } = useFetchAcknowledgementsPageQuery(rvcode!, { skip: !rvcode });

  const parseContentSections = (toBeParsed: string | undefined): IAcknowledgementsSection[] => {
    if (!toBeParsed) return [];

    const tree = unifiedProcessor.parse(toBeParsed);
    const sections: IAcknowledgementsSection[] = [];
    let currentSection: IAcknowledgementsSection | null = null;

    tree.children.forEach((node) => {
      if (node.type === 'heading' && node.depth === 2) {
        if (currentSection) {
          sections.push(currentSection);
        }
        const titleText = node.children
          .filter(child => child.type === 'text')
          .map(textNode => (textNode as { value: string }).value)
          .join('');
        currentSection = {
          id: generateIdFromText(titleText),
          value: serializeMarkdown(node),
          opened: true
        };
      } else {
        if (!currentSection) {
          currentSection = {
            id: 'intro',
            value: '',
            opened: true
          };
        }
        currentSection.value += serializeMarkdown(node) + '\n';
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  const parseSidebarHeaders = (toBeParsed: string | undefined): IAcknowledgementsHeader[] => {
    if (!toBeParsed) return [];

    const tree = unifiedProcessor.parse(toBeParsed);
    const headings = [];
    let lastH2 = null;

    for (const node of tree.children) {
      if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
        const titleText = node.children
          .filter(child => child.type === 'text')
          .map(textNode => (textNode as { value: string }).value)
          .join('');

        if (titleText) {
          const header: IAcknowledgementsHeader = {
            id: generateIdFromText(titleText),
            value: titleText,
            opened: true,
            children: []
          };

          if (node.depth === 2) {
            lastH2 = header;
            headings.push(header);
          } else if (node.depth === 3) {
              if(lastH2){
                  //case: We have a parent H2, add H3 as a child
                  lastH2.children.push(header);
              } else {
                  // Case: No H2, add H3 directly to the list
                  headings.push(header);
              }
          }
        }
      }
    }

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
    const content = acknowledgementsPage?.content[language];
    const adjustedContent = adjustNestedListsInMarkdownContent(content);

    setPageSections(parseContentSections(adjustedContent));
    setSidebarHeaders(parseSidebarHeaders(adjustedContent));
  }, [acknowledgementsPage, language]);

  return (
    <main className='acknowledgements'>
      <Helmet>
        <title>{t('pages.acknowledgements.title')} | {journalName ?? ''}</title>
      </Helmet>

      <Breadcrumb
        parents={[
          { path: 'home', label: `${t('pages.home.title')} > ${t('common.about')} >` }
        ]}
        crumbLabel={t('pages.acknowledgements.title')}
      />

      <h1 className='acknowledgements-title'>{t('pages.acknowledgements.title')}</h1>

      {isFetching ? (
        <Loader />
      ) : !acknowledgementsPage ? (
        <div className='acknowledgements-content'>
          <p>{t('pages.acknowledgements.description')}</p>
        </div>
      ) : (
        <div className='acknowledgements-content'>
          <AcknowledgementsSidebar headers={sidebarHeaders} toggleHeaderCallback={toggleSidebarHeader} />
          <div className='acknowledgements-content-body'>
            {pageSections.map(section => (
              <div
                key={section.id}
                className={`acknowledgements-content-body-section ${!section.opened && 'acknowledgements-content-body-section-hidden'}`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  urlTransform={uri => uri.includes('/public/') ? getMarkdownImageURL(uri, rvcode!) : uri}
                  components={{
                    a: ({ ...props }) => <Link to={props.href!} target='_blank' className='acknowledgements-content-body-section-link'>{props.children?.toString()}</Link>,
                    h2: ({ ...props }) => {
                      const id = generateIdFromText(props.children?.toString()!)

                      return (
                        <div className='acknowledgements-content-body-section-subtitle' onClick={(): void => toggleSectionHeader(id!)}>
                          <h2 id={id} className='acknowledgements-content-body-section-subtitle-text' {...props} />
                          {pageSections.find(pageSection => pageSection.id === id)?.opened ? (
                            <img className='acknowledgements-content-body-section-subtitle-caret' src={caretUp} alt='Caret up icon' />
                          ) : (
                            <img className='acknowledgements-content-body-section-subtitle-caret' src={caretDown} alt='Caret down icon' />
                          )}
                        </div>
                      )
                    },
                    h3: ({ ...props }) => <h3 id={generateIdFromText(props.children?.toString()!)} {...props} />,
                  }}
                >
                  {section.value}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}