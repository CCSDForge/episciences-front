import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { useAppSelector } from "../../../hooks/store";
import { useFetchAboutPageQuery } from "../../../store/features/about/about.query";
import { generateIdFromText, unifiedProcessor, serializeMarkdown } from '../../../utils/markdown';
import AboutSidebar, { IAboutHeader } from '../../components/Sidebars/AboutSidebar/AboutSidebar';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import './About.scss';

interface IAboutSection {
  id: string;
  value: string;
  opened: boolean;
}

export default function About(): JSX.Element {
  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [pageSections, setPageSections] = useState<IAboutSection[]>([]);
  const [sidebarHeaders, setSidebarHeaders] = useState<IAboutHeader[]>([]);

  const { data: aboutPage, isFetching } = useFetchAboutPageQuery(rvcode!, { skip: !rvcode })

  const content = (): string | undefined => aboutPage?.content[language];

  const parseContentSections = (toBeParsed: string | undefined): IAboutSection[] => {
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
  

  const parseSidebarHeaders = (toBeParsed: string | undefined): IAboutHeader[] => {
    const tree = unifiedProcessor.parse(toBeParsed);
    const headings = [];
    let lastH2 = null;
  
    for (const node of tree.children) {
      if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
        const textNode = node.children.find(child => child.type === 'text') as { value: string };
        
        if (textNode) {
          const header: IAboutHeader = {
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
    setPageSections(parseContentSections(content()))
    setSidebarHeaders(parseSidebarHeaders(content()));
  }, [aboutPage]);

  return (
    <main className='about'>
      <Breadcrumb />
      <h1 className='about-title'>The journal</h1>
      {isFetching ? (
        <Loader />
      ) : (
        <div className='about-content'>
          <AboutSidebar headers={sidebarHeaders} toggleHeaderCallback={toggleSidebarHeader} />
            <div className='about-content-body'>
            {pageSections.map(section => (
              <div
                key={section.id}
                className={`about-content-body-section ${!section.opened && 'about-content-body-section-hidden'}`}
              >
                <ReactMarkdown
                  components={{
                    h2: ({ node, ...props }) => {
                      const id = generateIdFromText(props.children?.toString()!)

                      return (
                        <div className='about-content-body-section-subtitle' onClick={(): void => toggleSectionHeader(id!)}>
                          <h2 id={id} className='about-content-body-section-subtitle-text' {...props} />
                          {pageSections.find(pageSection => pageSection.id === id)?.opened ? (
                            <img className='about-content-body-section-subtitle-caret' src={caretUp} alt='Caret up icon' />
                          ) : (
                            <img className='about-content-body-section-subtitle-caret' src={caretDown} alt='Caret down icon' />
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