import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import { unified } from 'unified'
import remarkParse from 'remark-parse'

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { useAppSelector } from "../../../hooks/store";
import { useFetchAboutPageQuery } from "../../../store/features/about/about.query";
import AboutSidebar, { IAboutHeader } from '../../components/Sidebars/AboutSidebar/AboutSidebar';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import './About.scss';

export default function About(): JSX.Element {
  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [pageHeaders, setPageHeaders] = useState<IAboutHeader[]>([]);
  const [sidebarHeaders, setSidebarHeaders] = useState<IAboutHeader[]>([]);

  const { data: aboutPage, isFetching } = useFetchAboutPageQuery(rvcode!, { skip: !rvcode })

  const content = () => {
    return "## Aim and Scope\n\n### Lala\n\nIn ultricies purus ut tortor gravida, nec feugiat metus sodales.\n\n### Lele\n\nEtiam nunc risus, condimentum vitae euismod ac, dictum non purus. Fusce semper sem sit amet tempus dictum. Duis ac ipsum quis dui porttitor lacinia. Pellentesque id cursus nisi, ac lobortis felis. Donec ullamcorper enim vel sem ultricies placerat.\n\n## Publishing policy\n\nIn ultricies purus ut tortor gravida, nec feugiat metus sodales. Etiam nunc risus, condimentum vitae euismod ac, dictum non purus. Fusce semper sem sit amet tempus dictum. Duis ac ipsum quis dui porttitor lacinia. Pellentesque id cursus nisi, ac lobortis felis. Donec ullamcorper enim vel sem ultricies placerat.\n\n## Indexing\n\nIn ultricies purus ut tortor gravida, nec feugiat\n\n### Indexxxx\n\n metus sodales. Etiam nunc risus, condimentum vitae euismod ac, dictum\n\n### ZZZ\n\n non purus. Fusce semper sem sit amet tempus dictum. Duis ac ipsum quis dui porttitor lacinia. Pellentesque id cursus nisi, ac lobortis felis. Donec ullamcorper enim vel sem ultricies placerat.\n\n## Functioning charter\n\nIn ultricies purus ut tortor gravida, nec feugiat metus sodales. Etiam nunc risus, condimentum vitae euismod ac, dictum non purus. Fusce semper sem sit amet tempus dictum. Duis ac ipsum quis dui porttitor lacinia. Pellentesque id cursus nisi, ac lobortis felis. Donec ullamcorper enim vel sem ultricies placerat.\n\n## Gender question\n\nIn ultricies purus ut tortor gravida, nec feugiat metus sodales. Etiam nunc risus, condimentum vitae euismod ac, dictum non purus. Fusce semper sem sit amet tempus dictum. Duis ac ipsum quis dui porttitor lacinia. Pellentesque id cursus nisi, ac lobortis felis. Donec ullamcorper enim vel sem ultricies placerat.\n\n## Acknowledgements\n\nIn ultricies purus ut tortor gravida, nec feugiat metus sodales. Etiam nunc risus, condimentum vitae euismod ac, dictum non purus. Fusce semper sem sit amet tempus dictum. Duis ac ipsum quis dui porttitor lacinia. Pellentesque id cursus nisi, ac lobortis felis. Donec ullamcorper enim vel sem ultricies placerat.\n\n## Related Resources\n\nFR Lorem ipsum 😍 dolor sit amet\n\nconsectetur *adipiscing elit*. Donec tristique sed dolor a faucibus. Donec vehicula et massa non faucibus. Interdum et malesuada fames ac ante ipsum **primis in faucibus**."
  }
  // TODO: uncomment
  // const content = (): string | undefined => aboutPage?.content[language];

  const headers = (): IAboutHeader[] => {
    if (!content()) {
      return [];
    }

    const processor = unified().use(remarkParse);
    const tree = processor.parse(content());

    const headings = [];
    let lastH2 = null;

    for (const node of tree.children) {
      if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
        const textNode = node.children.find(child => child.type === 'text') as { value: string };
        
        if (textNode) {
          const header: IAboutHeader = {
            id: textNode.value.toLowerCase().replace(/\s+/g, '-'),
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
  }

  const togglePageHeader = (id: string) => {
    const newHeaders = pageHeaders.map(header => {
      if (header.id === id) {
        return { ...header, opened: !header.opened };
      }
      return header;
    });

    setPageHeaders(newHeaders);
  };

  const toggleSidebarHeader = (id: string) => {
    const newHeaders = sidebarHeaders.map(header => {
      if (header.id === id) {
        return { ...header, opened: !header.opened };
      }
      return header;
    });

    setSidebarHeaders(newHeaders);
  };

  useEffect(() => {
    setPageHeaders(headers());
    setSidebarHeaders(headers());
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
              <ReactMarkdown
                components={{
                  h2: ({ node, ...props }) => {
                    const id = props.children?.toString().toLowerCase().replace(/\s+/g, '-')

                    return (
                      <div className='about-content-body-subtitle' onClick={(): void => togglePageHeader(id!)}>
                        <h2 id={id} {...props} />
                        {pageHeaders.find(pageHeader => pageHeader.id === id)?.opened ? (
                          <img className='about-content-body-subtitle-caret' src={caretUp} alt='Caret up icon' />
                        ) : (
                          <img className='about-content-body-subtitle-caret' src={caretDown} alt='Caret down icon' />
                        )}
                      </div>
                    )
                  },
                  h3: ({ node, ...props }) => <h3 id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')} {...props} />
                }}
              >
                {content()}
              </ReactMarkdown>
            </div>
        </div>
      )}
    </main>
  )
}