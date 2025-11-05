import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import remarkGfm from 'remark-gfm';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { useAppSelector } from '../../../hooks/store';
import { useFetchForConferenceOrganisersPageQuery } from '../../../store/features/forConferenceOrganisers/forConferenceOrganisers.query';
import { generateIdFromText, unifiedProcessor, serializeMarkdown, getMarkdownImageURL, adjustNestedListsInMarkdownContent } from '../../../utils/markdown';
import AboutSidebar, { IAboutHeader } from '../../components/Sidebars/AboutSidebar/AboutSidebar';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Loader from '../../components/Loader/Loader';
import './ForConferenceOrganisers.scss';

interface IForConferenceOrganisersSection {
  id: string;
  value: string;
  opened: boolean;
}

export default function ForConferenceOrganisers(): JSX.Element {
  const { t } = useTranslation();

  const language = useAppSelector(state => state.i18nReducer.language);
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code);
  const journalName = useAppSelector(state => state.journalReducer.currentJournal?.name);

  const [pageSections, setPageSections] = useState<IForConferenceOrganisersSection[]>([]);
  const [sidebarHeaders, setSidebarHeaders] = useState<IAboutHeader[]>([]);

  const { data: forConferenceOrganisersPage, isFetching } = useFetchForConferenceOrganisersPageQuery(rvcode!, { skip: !rvcode });

  const parseContentSections = (toBeParsed: string | undefined): IForConferenceOrganisersSection[] => {
    const tree = unifiedProcessor.parse(toBeParsed);
    const sections: IForConferenceOrganisersSection[] = [];
    let currentSection: IForConferenceOrganisersSection | null = null;

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
    const content = forConferenceOrganisersPage?.content[language];
    const adjustedContent = adjustNestedListsInMarkdownContent(content);

    setPageSections(parseContentSections(adjustedContent));
    setSidebarHeaders(parseSidebarHeaders(adjustedContent));
  }, [forConferenceOrganisersPage, language]);

  return (
    <main className='forConferenceOrganisers'>
      <Helmet>
        <title>{t('pages.forConferenceOrganisers.title')} | {journalName ?? ''}</title>
      </Helmet>

      <Breadcrumb
        parents={[
          { path: 'home', label: `${t('pages.home.title')} >` },
          { path: 'publish', label: `${t('pages.publish.title')} >` }
        ]}
        crumbLabel={t('pages.forConferenceOrganisers.title')}
      />

      <h1 className='forConferenceOrganisers-title'>{t('pages.forConferenceOrganisers.title')}</h1>

      {isFetching ? (
        <Loader />
      ) : !forConferenceOrganisersPage ? (
        <div className='forConferenceOrganisers-content'>
          <p>{t('pages.forConferenceOrganisers.description')}</p>
        </div>
      ) : (
        <div className='forConferenceOrganisers-content'>
          <AboutSidebar headers={sidebarHeaders} toggleHeaderCallback={toggleSidebarHeader} />
          <div className='forConferenceOrganisers-content-body'>
            {pageSections.map(section => (
              <div
                key={section.id}
                className={`forConferenceOrganisers-content-body-section ${!section.opened && 'forConferenceOrganisers-content-body-section-hidden'}`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  urlTransform={uri => uri.includes('/public/') ? getMarkdownImageURL(uri, rvcode!) : uri}
                  components={{
                    a: ({ ...props }) => <Link to={props.href!} target='_blank' className='forConferenceOrganisers-content-body-section-link'>{props.children?.toString()}</Link>,
                    h2: ({ ...props }) => {
                      const id = generateIdFromText(props.children?.toString()!)

                      return (
                        <div className='forConferenceOrganisers-content-body-section-subtitle' onClick={(): void => toggleSectionHeader(id!)}>
                          <h2 id={id} className='forConferenceOrganisers-content-body-section-subtitle-text' {...props} />
                          {pageSections.find(pageSection => pageSection.id === id)?.opened ? (
                            <img className='forConferenceOrganisers-content-body-section-subtitle-caret' src={caretUp} alt='Caret up icon' />
                          ) : (
                            <img className='forConferenceOrganisers-content-body-section-subtitle-caret' src={caretDown} alt='Caret down icon' />
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