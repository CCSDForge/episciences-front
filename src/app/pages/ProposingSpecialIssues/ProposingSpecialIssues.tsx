import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { useAppSelector } from '../../../hooks/store';
import { getLocalizedContent } from '../../../utils/i18n';
import { useFetchProposingSpecialIssuesPageQuery } from '../../../store/features/proposingSpecialIssues/proposingSpecialIssues.query';
import {
  generateIdFromText,
  unifiedProcessor,
  serializeMarkdown,
  getMarkdownImageURL,
  adjustNestedListsInMarkdownContent,
} from '../../../utils/markdown';
import ProposingSpecialIssuesSidebar, {
  IProposingSpecialIssuesHeader,
} from '../../components/Sidebars/ProposingSpecialIssuesSidebar/ProposingSpecialIssuesSidebar';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Loader from '../../components/Loader/Loader';
import './ProposingSpecialIssues.scss';

interface IProposingSpecialIssuesSection {
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

export default function ProposingSpecialIssues(): JSX.Element {
  const { t } = useTranslation();

  const language = useAppSelector(state => state.i18nReducer.language);
  const rvcode = useAppSelector(
    state => state.journalReducer.currentJournal?.code
  );
  const journalName = useAppSelector(
    state => state.journalReducer.currentJournal?.name
  );

  const [pageSections, setPageSections] = useState<
    IProposingSpecialIssuesSection[]
  >([]);
  const [sidebarHeaders, setSidebarHeaders] = useState<
    IProposingSpecialIssuesHeader[]
  >([]);

  const { data: proposingSpecialIssuesPage, isFetching } =
    useFetchProposingSpecialIssuesPageQuery(rvcode!, { skip: !rvcode });

  const extractTextFromNode = (node: IMarkdownNode): string => {
    if (node.type === 'text') {
      return node.value ?? '';
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
  ): IProposingSpecialIssuesSection[] => {
    const tree = unifiedProcessor.parse(toBeParsed);
    const sections: IProposingSpecialIssuesSection[] = [];
    let currentSection: IProposingSpecialIssuesSection | null = null;

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
  ): IProposingSpecialIssuesHeader[] => {
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
          const header: IProposingSpecialIssuesHeader = {
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
    const content = getLocalizedContent(
      proposingSpecialIssuesPage?.content,
      language
    );
    const adjustedContent = adjustNestedListsInMarkdownContent(content);

    setPageSections(parseContentSections(adjustedContent));
    setSidebarHeaders(parseSidebarHeaders(adjustedContent));
  }, [proposingSpecialIssuesPage, language]);

  return (
    <main className="proposingSpecialIssues">
      <Helmet>
        <title>
          {t('pages.proposingSpecialIssues.title')} | {journalName ?? ''}
        </title>
      </Helmet>

      <Breadcrumb
        parents={[
          { path: 'home', label: `${t('pages.home.title')} >` },
          { path: 'home', label: `${t('pages.publish.title')} >` },
        ]}
        crumbLabel={t('pages.proposingSpecialIssues.title')}
      />

      <h1 className="proposingSpecialIssues-title">
        {t('pages.proposingSpecialIssues.title')}
      </h1>

      {isFetching ? (
        <Loader />
      ) : !proposingSpecialIssuesPage ? (
        <div className="proposingSpecialIssues-content">
          <p>{t('pages.proposingSpecialIssues.description')}</p>
        </div>
      ) : pageSections.length === 0 ? (
        <div className="proposingSpecialIssues-content">
          <p>{t('common.contentNotAvailable')}</p>
        </div>
      ) : (
        <div className="proposingSpecialIssues-content">
          <ProposingSpecialIssuesSidebar
            headers={sidebarHeaders}
            toggleHeaderCallback={toggleSidebarHeader}
          />
          <div className="proposingSpecialIssues-content-body">
            {pageSections.map(section => (
              <div
                key={section.id}
                className={`proposingSpecialIssues-content-body-section ${!section.opened && 'proposingSpecialIssues-content-body-section-hidden'}`}
              >
                <MarkdownRenderer
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
                        className="proposingSpecialIssues-content-body-section-link"
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
                          className="proposingSpecialIssues-content-body-section-subtitle"
                          onClick={(): void => toggleSectionHeader(id!)}
                        >
                          <h2
                            id={id}
                            className="proposingSpecialIssues-content-body-section-subtitle-text"
                            {...props}
                          />
                          {pageSections.find(
                            pageSection => pageSection.id === id
                          )?.opened ? (
                            <img
                              className="proposingSpecialIssues-content-body-section-subtitle-caret"
                              src={caretUp}
                              alt="Caret up icon"
                            />
                          ) : (
                            <img
                              className="proposingSpecialIssues-content-body-section-subtitle-caret"
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
                </MarkdownRenderer>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
