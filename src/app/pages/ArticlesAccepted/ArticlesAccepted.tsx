import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

import filter from '/icons/filter.svg';
import { useAppSelector } from "../../../hooks/store";
import { useFetchArticlesQuery } from '../../../store/features/article/article.query';
import { FetchedArticle, articleTypes } from '../../../utils/article';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import ArticleAcceptedCard, { IArticleAcceptedCard } from "../../components/Cards/ArticleAcceptedCard/ArticleAcceptedCard";
import ArticlesAcceptedMobileModal from '../../components/Modals/ArticlesAcceptedMobileModal/ArticlesAcceptedMobileModal';
import ArticlesAcceptedSidebar, { IArticleTypeSelection } from "../../components/Sidebars/ArticlesAcceptedSidebar/ArticlesAcceptedSidebar";
import Pagination from "../../components/Pagination/Pagination";
import Tag from "../../components/Tag/Tag";
import './ArticlesAccepted.scss';

interface IArticleAcceptedFilter {
  value: string | number;
  label?: number;
  labelPath?: string;
}

type EnhancedArticleAccepted = FetchedArticle & {
  openedAbstract: boolean;
}

export default function ArticlesAccepted(): JSX.Element {
  const { t } = useTranslation();

  const ARTICLES_ACCEPTED_PER_PAGE = 10;

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [currentPage, setCurrentPage] = useState(1);
  const [enhancedArticlesAccepted, setEnhancedArticlesAccepted] = useState<EnhancedArticleAccepted[]>([])
  const [types, setTypes] = useState<IArticleTypeSelection[]>([])
  const [taggedFilters, setTaggedFilters] = useState<IArticleAcceptedFilter[]>([]);
  const [showAllAbstracts, setShowAllAbstracts] = useState(false)
  const [openedFiltersMobileModal, setOpenedFiltersMobileModal] = useState(false)

  const getSelectedTypes = (): string[] => types.filter(t => t.isChecked).map(t => t.value);

  const { data: articlesAccepted, isFetching: isFetchingArticlesAccepted } = useFetchArticlesQuery({ rvcode: rvcode!, page: currentPage, itemsPerPage: ARTICLES_ACCEPTED_PER_PAGE, onlyAccepted: true, types: getSelectedTypes() }, { skip: !rvcode, refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (articlesAccepted?.range && articlesAccepted.range.types && types.length === 0) {
      const initTypes = articlesAccepted.range.types
        .filter((t) => articleTypes.find((at) => at.value === t))
        .map((t) => {
        const matchingType = articleTypes.find((at) => at.value === t)

        return {
          labelPath: matchingType!.labelPath,
          value: matchingType!.value,
          isChecked: false
        }
      })

      setTypes(initTypes)
    }
  }, [articlesAccepted?.range, articlesAccepted?.range?.types, types])

  const handlePageClick = (selectedItem: { selected: number }): void => {
    setEnhancedArticlesAccepted([]);
    setCurrentPage(selectedItem.selected + 1);
  };

  const onCheckType = (value: string): void => {
    const updatedTypes = types.map((t) => {
      if (t.value === value) {
        return { ...t, isChecked: !t.isChecked };
      }

      return { ...t };
    });

    setTypes(updatedTypes);
  }

  const setAllTaggedFilters = (): void => {
    const initFilters: IArticleAcceptedFilter[] = []

    types.filter((t) => t.isChecked).forEach((t) => {
      initFilters.push({
        value: t.value,
        labelPath: t.labelPath
      })
    })

    setTaggedFilters(initFilters)
  }

  const onCloseTaggedFilter = (value: string | number) => {
    const updatedTypes = types.map((t) => {
      if (t.value === value) {
        return { ...t, isChecked: false };
      }

      return t;
    });

    setTypes(updatedTypes);
  }

  const clearTaggedFilters = (): void => {
    const updatedTypes = types.map((t) => {
      return { ...t, isChecked: false };
    });

    setTypes(updatedTypes);
    setTaggedFilters([]);
  }

  useEffect(() => {
    setAllTaggedFilters()
  }, [types])

  useEffect(() => {
    if (articlesAccepted) {
      const displayedArticlesAccepted = articlesAccepted?.data.filter((article) => article?.title).map((article) => {
        return { ...article, openedAbstract: false };
      });

      setEnhancedArticlesAccepted(displayedArticlesAccepted as EnhancedArticleAccepted[])
    }

  }, [articlesAccepted, articlesAccepted?.data])

  const toggleAbstract = (articleId?: number): void => {
    if (!articleId) return

    const updatedArticlesAccepted = enhancedArticlesAccepted.map((article) => {
      if (article?.id === articleId) {
        return {
          ...article,
          openedAbstract: !article.openedAbstract
        }
      }

      return { ...article };
    });

    setEnhancedArticlesAccepted(updatedArticlesAccepted)
  }

  const toggleAllAbstracts = (): void => {
    const isShown = !showAllAbstracts

    const updatedArticlesAccepted = enhancedArticlesAccepted.map((article) => ({
      ...article,
      openedAbstract: isShown
    }));

    setEnhancedArticlesAccepted(updatedArticlesAccepted)
    setShowAllAbstracts(isShown)
  }

  return (
    <main className='articlesAccepted'>
      <Breadcrumb parents={[
        { path: 'home', label: `${t('pages.home.title')} > ${t('common.content')} >` }
      ]} crumbLabel={t('pages.articlesAccepted.title')} />
      <div className='articlesAccepted-title'>
        <h1 className='articlesAccepted-title-text'>{t('pages.articlesAccepted.title')}</h1>
        <div className='articlesAccepted-title-count'>
          {articlesAccepted && articlesAccepted.totalItems > 1 ? (
            <div className='articlesAccepted-title-count-text'>{articlesAccepted.totalItems} {t('common.documents')}</div>
          ) : (
            <div className='articlesAccepted-title-count-text'>{articlesAccepted?.totalItems ?? 0} {t('common.document')}</div>
          )}
          <div className="articlesAccepted-title-count-filtersMobile">
            <div className="articlesAccepted-title-count-filtersMobile-tile" onClick={(): void => setOpenedFiltersMobileModal(!openedFiltersMobileModal)}>
              <img className="articlesAccepted-title-count-filtersMobile-tile-icon" src={filter} alt='List icon' />
              <div className="articlesAccepted-title-count-filtersMobile-tile-text">{taggedFilters.length > 0 ? `${t('common.filters.editFilters')} (${taggedFilters.length})` : `${t('common.filters.filter')}`}</div>
            </div>
            {openedFiltersMobileModal && <ArticlesAcceptedMobileModal t={t} initialTypes={types} onUpdateTypesCallback={setTypes} onCloseCallback={(): void => setOpenedFiltersMobileModal(false)}/>}
          </div>
        </div>
      </div>
      <div className="articlesAccepted-filters">
        {taggedFilters.length > 0 && (
          <div className="articlesAccepted-filters-tags">
            {taggedFilters.map((filter, index) => (
              <Tag key={index} text={filter.labelPath ? t(filter.labelPath) : filter.label!.toString()} onCloseCallback={(): void => onCloseTaggedFilter(filter.value)}/>
            ))}
            <div className="articlesAccepted-filters-tags-clear" onClick={clearTaggedFilters}>{t('common.filters.clearAll')}</div>
          </div>
        )}
        <div className="articlesAccepted-filters-abstracts" onClick={toggleAllAbstracts}>
          {`${showAllAbstracts ? t('common.toggleAbstracts.hideAll') : t('common.toggleAbstracts.showAll')}`}
        </div>
      </div>
      <div className="articlesAccepted-filters-abstracts articlesAccepted-filters-abstracts-mobile" onClick={toggleAllAbstracts}>
        {`${showAllAbstracts ? t('common.toggleAbstracts.hideAll') : t('common.toggleAbstracts.showAll')}`}
      </div>
      <div className='articlesAccepted-content'>
        <div className='articlesAccepted-content-results'>
          <ArticlesAcceptedSidebar t={t} types={types} onCheckTypeCallback={onCheckType} />
          {isFetchingArticlesAccepted ? (
            <Loader />
          ) : (
            <div className='articlesAccepted-content-results-cards'>
              {enhancedArticlesAccepted.map((article, index) => (
                <ArticleAcceptedCard
                  key={index}
                  language={language}
                  t={t}
                  article={article as IArticleAcceptedCard}
                  toggleAbstractCallback={(): void => toggleAbstract(article?.id)}
                />
              ))}
            </div>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          itemsPerPage={ARTICLES_ACCEPTED_PER_PAGE}
          totalItems={articlesAccepted?.totalItems}
          onPageChange={handlePageClick}
        />
      </div>
    </main>
  )
}