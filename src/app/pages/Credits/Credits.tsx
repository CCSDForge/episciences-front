import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { useAppSelector } from "../../../hooks/store";
import { useFetchCreditsPageQuery } from "../../../store/features/credits/credits.query";
import { generateIdFromText, unifiedProcessor, serializeMarkdown } from '../../../utils/markdown';
import CreditsSidebar, { ICreditsHeader } from '../../components/Sidebars/CreditsSidebar/CreditsSidebar';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import './Credits.scss';

interface ICreditsSection {
  id: string;
  value: string;
  opened: boolean;
}

export default function Credits(): JSX.Element {
  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [pageSections, setPageSections] = useState<ICreditsSection[]>([]);
  const [sidebarHeaders, setSidebarHeaders] = useState<ICreditsHeader[]>([]);

  const { data: creditsPage, isFetching } = useFetchCreditsPageQuery(rvcode!, { skip: !rvcode })

  const parseContentSections = (toBeParsed: string | undefined): ICreditsSection[] => {
    const tree = unifiedProcessor.parse(toBeParsed);
    const sections = [];
    let currentSection = { id: '', value: '', opened: true };
  
    tree.children.forEach((node) => {
      if (node.type === 'heading' && node.depth === 2) {
        if (currentSection.id) {
          sections.push(currentSection);
          currentSection = { id: '', value: '', opened: true };
        }
        const titleText = node.children
          .filter(child => child.type === 'text')
          .map(textNode => (textNode as { value: string }).value)
          .join('');
        currentSection.id = generateIdFromText(titleText);
        currentSection.value += serializeMarkdown(node);
      } else {
        currentSection.value += serializeMarkdown(node);
      }
    });
  
    if (currentSection.id) {
      sections.push(currentSection);
    }
  
    return sections;
  };
  

  const parseSidebarHeaders = (toBeParsed: string | undefined): ICreditsHeader[] => {
    const tree = unifiedProcessor.parse(toBeParsed);
    const headings = [];
    let lastH2 = null;
  
    for (const node of tree.children) {
      if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
        const textNode = node.children.find(child => child.type === 'text') as { value: string };
        
        if (textNode) {
          const header: ICreditsHeader = {
            id: generateIdFromText(textNode.value),
            value: textNode.value,
            opened: true,
            children: []
          };
  
          if (node.depth === 2) {
            lastH2 = header;
            headings.push(header);
          } else if (node.depth === 3 && lastH2) {
            lastH2.children.push(header);
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
    const content = creditsPage?.content[language]

    setPageSections(parseContentSections(content))
    setSidebarHeaders(parseSidebarHeaders(content));
  }, [creditsPage, language]);

  return (
    <main className='credits'>
      <Breadcrumb />
      <h1 className='credits-title'>Credits</h1>
      {isFetching ? (
        <Loader />
      ) : (
        <div className='credits-content'>
          <CreditsSidebar headers={sidebarHeaders} toggleHeaderCallback={toggleSidebarHeader} />
            <div className='credits-content-body'>
            {pageSections.map(section => (
              <div
                key={section.id}
                className={`credits-content-body-section ${!section.opened && 'credits-content-body-section-hidden'}`}
              >
                <ReactMarkdown
                  components={{
                    h2: ({ node, ...props }) => {
                      const id = generateIdFromText(props.children?.toString()!)

                      return (
                        <div className='credits-content-body-section-subtitle' onClick={(): void => toggleSectionHeader(id!)}>
                          <h2 id={id} className='credits-content-body-section-subtitle-text' {...props} />
                          {pageSections.find(pageSection => pageSection.id === id)?.opened ? (
                            <img className='credits-content-body-section-subtitle-caret' src={caretUp} alt='Caret up icon' />
                          ) : (
                            <img className='credits-content-body-section-subtitle-caret' src={caretDown} alt='Caret down icon' />
                          )}
                        </div>
                      )
                    },
                    h3: ({ node, ...props }) => <h3 id={generateIdFromText(props.children?.toString()!)} {...props} />,
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
  )
}