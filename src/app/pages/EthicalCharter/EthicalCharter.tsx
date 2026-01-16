import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import remarkGfm from 'remark-gfm';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { useAppSelector } from '../../../hooks/store';
import { useFetchEthicalCharterPageQuery } from '../../../store/features/ethicalCharter/ethicalCharter.query';
import {
  generateIdFromText,
  unifiedProcessor,
  serializeMarkdown,
  getMarkdownImageURL,
  adjustNestedListsInMarkdownContent,
} from '../../../utils/markdown';
import EthicalCharterSidebar, {
  IEthicalCharterHeader,
} from '../../components/Sidebars/EthicalCharterSidebar/EthicalCharterSidebar.tsx';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Loader from '../../components/Loader/Loader';
import './EthicalCharter.scss';

interface IEthicalCharterSection {
  id: string;
  value: string;
  opened: boolean;
}

interface IMarkdownNode {
  type: string;
  value?: string;
  children?: IMarkdownNode[];
}

type ReactChildren = React.ReactNode;

export default function EthicalCharter(): JSX.Element {
  const { t } = useTranslation();

  const language = useAppSelector(state => state.i18nReducer.language);
  const rvcode = useAppSelector(
    state => state.journalReducer.currentJournal?.code
  );
  const journalName = useAppSelector(
    state => state.journalReducer.currentJournal?.name
  );

  const [pageSections, setPageSections] = useState<IEthicalCharterSection[]>(
    []
  );
  const [sidebarHeaders, setSidebarHeaders] = useState<IEthicalCharterHeader[]>(
    []
  );

  const { data: ethicalCharterPage, isFetching } =
    useFetchEthicalCharterPageQuery(rvcode!, { skip: !rvcode });

  const parseContentSections = (
    toBeParsed: string | undefined
  ): IEthicalCharterSection[] => {
    const tree = unifiedProcessor.parse(toBeParsed);
    const sections: IEthicalCharterSection[] = [];
    let currentSection: IEthicalCharterSection | null = null;

    tree.children.forEach(node => {
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
          opened: true,
        };
      } else {
        if (!currentSection) {
          currentSection = {
            id: 'intro',
            value: '',
            opened: true,
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

  /**
   * Recursively extracts text from markdown AST(abstract syntax tree) nodes, including text within <strong>, <em>, and other nested tags.
   * This ensures proper text extraction even when headings contain formatting elements.
   * @param node - The markdown AST node to extract text from
   * @returns The extracted plain text string
   */
  const extractTextFromNode = (node: IMarkdownNode): string => {
    if (node.type === 'text') {
      return node.value;
    }
    if (node.type === 'strong' && node.children) {
      return node.children.map(extractTextFromNode).join('');
    }
    if (node.children) {
      return node.children.map(extractTextFromNode).join('');
    }
    return '';
  };

  const parseSidebarHeaders = (
    toBeParsed: string | undefined
  ): IEthicalCharterHeader[] => {
    const tree = unifiedProcessor.parse(toBeParsed);
    const headings = [];
    let lastH2 = null;

    for (const node of tree.children) {
      if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
        const titleText = node.children
          .map(extractTextFromNode)
          .join('')
          .trim();

        if (titleText) {
          const header: IEthicalCharterHeader = {
            id: generateIdFromText(titleText),
            value: titleText,
            opened: true,
            children: [],
          };

          if (node.depth === 2) {
            lastH2 = header;
            headings.push(header);
          } else if (node.depth === 3 && lastH2) {
            lastH2.children.push(header);
          } else if (node.depth === 3) {
            headings.push(header);
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
    const content = ethicalCharterPage?.content[language];
    const adjustedContent = adjustNestedListsInMarkdownContent(content);

    setPageSections(parseContentSections(adjustedContent));
    setSidebarHeaders(parseSidebarHeaders(adjustedContent));
  }, [ethicalCharterPage, language]);

  return (
    <main className="ethicalCharter">
      <Helmet>
        <title>
          {t('pages.ethicalCharter.title')} | {journalName ?? ''}
        </title>
      </Helmet>

      <Breadcrumb
        parents={[
          { path: 'home', label: `${t('pages.home.title')} >` },
          { path: 'home', label: `${t('pages.publish.title')} >` },
        ]}
        crumbLabel={t('pages.ethicalCharter.title')}
      />

      <h1 className="ethicalCharter-title">
        {t('pages.ethicalCharter.title')}
      </h1>

      {isFetching ? (
        <Loader />
      ) : !ethicalCharterPage ? (
        <div className="ethicalCharter-content">
          <p>{t('pages.ethicalCharter.description')}</p>
        </div>
      ) : (
        <div className="ethicalCharter-content">
          <EthicalCharterSidebar
            headers={sidebarHeaders}
            toggleHeaderCallback={toggleSidebarHeader}
          />
          <div className="ethicalCharter-content-body">
            {pageSections.map(section => (
              <div
                key={section.id}
                className={`ethicalCharter-content-body-section ${!section.opened && 'ethicalCharter-content-body-section-hidden'}`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  urlTransform={uri =>
                    uri.includes('/public/')
                      ? getMarkdownImageURL(uri, rvcode!)
                      : uri
                  }
                  components={{
                    a: ({ ...props }) => (
                      <Link
                        to={props.href!}
                        target="_blank"
                        className="ethicalCharter-content-body-section-link"
                      >
                        {props.children?.toString()}
                      </Link>
                    ),
                    h2: ({ ...props }) => {
                      const id = generateIdFromText(
                        props.children?.toString()!
                      );

                      return (
                        <div
                          className="ethicalCharter-content-body-section-subtitle"
                          onClick={(): void => toggleSectionHeader(id!)}
                        >
                          <h2
                            id={id}
                            className="ethicalCharter-content-body-section-subtitle-text"
                            {...props}
                          />
                          {pageSections.find(
                            pageSection => pageSection.id === id
                          )?.opened ? (
                            <img
                              className="ethicalCharter-content-body-section-subtitle-caret"
                              src={caretUp}
                              alt="Caret up icon"
                            />
                          ) : (
                            <img
                              className="ethicalCharter-content-body-section-subtitle-caret"
                              src={caretDown}
                              alt="Caret down icon"
                            />
                          )}
                        </div>
                      );
                    },
                    h3: ({ ...props }) => {
                      const getText = (children: ReactChildren): string => {
                        if (typeof children === 'string') return children;
                        if (Array.isArray(children))
                          return children.map(getText).join('');
                        if (
                          children &&
                          typeof children === 'object' &&
                          'props' in children &&
                          children.props?.children
                        )
                          return getText(children.props.children);
                        return '';
                      };
                      const id = generateIdFromText(getText(props.children));
                      return <h3 id={id} {...props} />;
                    },
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
