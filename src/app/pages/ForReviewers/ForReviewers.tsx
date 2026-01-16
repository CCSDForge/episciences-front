import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import remarkGfm from 'remark-gfm';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { useAppSelector } from '../../../hooks/store';
import { useFetchForReviewersPageQuery } from '../../../store/features/forReviewers/forReviewers.query';
import {
  generateIdFromText,
  unifiedProcessor,
  serializeMarkdown,
  getMarkdownImageURL,
  adjustNestedListsInMarkdownContent,
} from '../../../utils/markdown';
import ForReviewersSidebar, {
  IForReviewersHeader,
} from '../../components/Sidebars/ForReviewersSidebar/ForReviewersSidebar';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Loader from '../../components/Loader/Loader';
import './ForReviewers.scss';

interface IForReviewersSection {
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

export default function ForReviewers(): JSX.Element {
  const { t } = useTranslation();

  const language = useAppSelector(state => state.i18nReducer.language);
  const rvcode = useAppSelector(
    state => state.journalReducer.currentJournal?.code
  );
  const journalName = useAppSelector(
    state => state.journalReducer.currentJournal?.name
  );

  const [pageSections, setPageSections] = useState<IForReviewersSection[]>([]);
  const [sidebarHeaders, setSidebarHeaders] = useState<IForReviewersHeader[]>(
    []
  );

  const { data: forReviewersPage, isFetching } = useFetchForReviewersPageQuery(
    rvcode!,
    { skip: !rvcode }
  );

  /**
   * Recursively extracts text from markdown AST(abstract syntax tree)  nodes, including text within <strong>, <em>, and other nested tags.
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

  const parseContentSections = (
    toBeParsed: string | undefined
  ): IForReviewersSection[] => {
    const tree = unifiedProcessor.parse(toBeParsed);
    const sections: IForReviewersSection[] = [];
    let currentSection: IForReviewersSection | null = null;

    tree.children.forEach(node => {
      if (node.type === 'heading' && node.depth === 2) {
        if (currentSection) {
          sections.push(currentSection);
        }
        const titleText = node.children
          .map(extractTextFromNode)
          .join('')
          .trim();
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

  const parseSidebarHeaders = (
    toBeParsed: string | undefined
  ): IForReviewersHeader[] => {
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
          const header: IForReviewersHeader = {
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
    const content = forReviewersPage?.content[language];
    const adjustedContent = adjustNestedListsInMarkdownContent(content);

    setPageSections(parseContentSections(adjustedContent));
    setSidebarHeaders(parseSidebarHeaders(adjustedContent));
  }, [forReviewersPage, language]);

  return (
    <main className="forReviewers">
      <Helmet>
        <title>
          {t('pages.forReviewers.title')} | {journalName ?? ''}
        </title>
      </Helmet>

      <Breadcrumb
        parents={[
          { path: 'home', label: `${t('pages.home.title')} >` },
          { path: 'home', label: `${t('pages.publish.title')} >` },
        ]}
        crumbLabel={t('pages.forReviewers.title')}
      />

      <h1 className="forReviewers-title">{t('pages.forReviewers.title')}</h1>

      {isFetching ? (
        <Loader />
      ) : !forReviewersPage ? (
        <div className="forReviewers-content">
          <p>{t('pages.forReviewers.description')}</p>
        </div>
      ) : (
        <div className="forReviewers-content">
          <ForReviewersSidebar
            headers={sidebarHeaders}
            toggleHeaderCallback={toggleSidebarHeader}
          />
          <div className="forReviewers-content-body">
            {pageSections.map(section => (
              <div
                key={section.id}
                className={`forReviewers-content-body-section ${!section.opened && 'forReviewers-content-body-section-hidden'}`}
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
                        className="forReviewers-content-body-section-link"
                      >
                        {props.children?.toString()}
                      </Link>
                    ),
                    h2: ({ ...props }) => {
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

                      return (
                        <div
                          className="forReviewers-content-body-section-subtitle"
                          onClick={(): void => toggleSectionHeader(id!)}
                        >
                          <h2
                            id={id}
                            className="forReviewers-content-body-section-subtitle-text"
                            {...props}
                          />
                          {pageSections.find(
                            pageSection => pageSection.id === id
                          )?.opened ? (
                            <img
                              className="forReviewers-content-body-section-subtitle-caret"
                              src={caretUp}
                              alt="Caret up icon"
                            />
                          ) : (
                            <img
                              className="forReviewers-content-body-section-subtitle-caret"
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
